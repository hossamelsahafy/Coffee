import { getPayload } from "@/lib/payloadClient";

export async function GET(req: Request) {
  try {
    const payload = await getPayload();

    const db = payload.db as any;

    const usersCollection = db.collections["users"];

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user || user.role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [totalUsers, newUsers, admins, verified, activity] =
      await Promise.all([
        payload.count({
          collection: "users",
        }),

        payload.count({
          collection: "users",
          where: {
            createdAt: {
              greater_than_equal: weekAgo.toISOString(),
            },
          },
        }),

        payload.count({
          collection: "users",
          where: {
            role: {
              equals: "admin",
            },
          },
        }),

        payload.count({
          collection: "users",
          where: {
            _verified: {
              equals: true,
            },
          },
        }),

        usersCollection.aggregate([
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
              users: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ]),
      ]);

    return Response.json({
      stats: {
        totalUsers: totalUsers.totalDocs,
        newUsers: newUsers.totalDocs,
        admins: admins.totalDocs,
        verified: verified.totalDocs,
      },
      activity: activity.map((item: any) => ({
        date: item._id,
        users: item.users,
      })),
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        message: "Failed to fetch dashboard stats",
      },
      {
        status: 500,
      },
    );
  }
}
