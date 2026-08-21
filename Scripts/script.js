import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI;

if (!uri) {
  throw new Error("DATABASE_URI is not defined");
}

async function migrate() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    console.log("Connected to MongoDB");

    const db = client.db();

    const orders = db.collection("orders");

    const result = await orders.updateMany(
      {
        "payment.method": "visa",
      },
      {
        $set: {
          "payment.method": "stripe",
        },
      },
    );

    console.log("Migration completed");
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrate();
