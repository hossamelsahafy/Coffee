"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useListQuery, useConfig, useAuth } from "@payloadcms/ui";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import UserCards from "./UserCards";
import Pagination from "@/components/shared/AdminUI/Pagination";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import { ChartAreaInteractive } from "@/components/ui/Taps/DashboardTap/ChartAreaInteractive";

export default function UserListView() {
  const {
    data,
    isLoading,
    handlePageChange,
    handleSortChange,
    handleWhereChange,
  } = useListQuery();
  const { config } = useConfig();
  const { user } = useAuth();

  const adminRoute = config.routes?.admin || "/admin";
  const apiRoute = config.routes?.api || "/api";

  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    admins: 0,
    verified: 0,
    loading: true,
  });
  const users = data?.docs || [];
  const page = data?.page || 1;
  const totalPages = data?.totalPages || 1;
  const hasPrevPage = data?.hasPrevPage || false;
  const hasNextPage = data?.hasNextPage || false;

  const [userActivity, setUserActivity] = useState([]);
  console.log("handleSortChange", handleSortChange.toString());
  useEffect(() => {
    async function fetchGlobalStats() {
      try {
        const res = await fetch(`${apiRoute}/user-stats`);

        if (!res.ok) {
          throw new Error("Failed to fetch users stats");
        }

        const data = await res.json();

        setGlobalStats({
          ...data.stats,
          loading: false,
        });

        setUserActivity(data.activity);
      } catch (error) {
        console.error(error);

        setGlobalStats((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    }

    fetchGlobalStats();
  }, [apiRoute]);

  const onPageChange = (newPage) => {
    if (typeof handlePageChange === "function") {
      handlePageChange(newPage);
    }
  };

  const userStatsCards = useMemo(() => {
    return [
      {
        title: "Total Users",
        titleAr: "إجمالي المستخدمين",
        value: globalStats.loading ? "..." : globalStats.totalUsers,
        icon: "users",
        description: "All registered users in database",
        descriptionAr: "جميع المستخدمين المسجلين",
      },
      {
        title: "New Users",
        titleAr: "مستخدمون جدد",
        value: globalStats.loading ? "..." : globalStats.newUsers,
        icon: "user-plus",
        description: "Joined in the last 7 days",
        descriptionAr: "انضموا خلال آخر 7 أيام",
      },
      {
        title: "Admin Accounts",
        titleAr: "حسابات المشرفين",
        value: globalStats.loading ? "..." : globalStats.admins,
        icon: "shield",
        description: "Users with admin privileges",
        descriptionAr: "المستخدمون بصلاحيات الإدارة",
      },
      {
        title: "Verified Users",
        titleAr: "المستخدمون الموثقون",
        value: globalStats.loading ? "..." : globalStats.verified,
        icon: "check-circle",
        description: "Total verified accounts",
        descriptionAr: "الحسابات التي تم التحقق منها",
      },
    ];
  }, [globalStats]);

  if (isLoading) {
    return (
      <ContentLayout
        locale="en"
        title="Users Directory"
        subtitle="Monitor your platform's user base, review administrator accounts, track new registrations, and manage user access from a single dashboard."
        MyThing="Users Overview"
      >
        <div className="flex items-center justify-center p-12 text-[#E8C6A7]">
          Loading users...
        </div>
      </ContentLayout>
    );
  }
  return (
    <div className="transition-all duration-300 ease-in-out">
      <ContentLayout
        locale="en"
        title="Users Directory"
        subtitle="Monitor your platform's user base, review administrator accounts, track new registrations, and manage user access from a single dashboard."
        MyThing="Users Overview"
        adminRoute={true}
        isdiff={true}
        adminFirstName={user}
      >
        <div className="flex flex-col gap-4 max-w-full">
          <TrackOrderData locale="en" cards={userStatsCards} order={users} />
          <div className="mt-4">
            <ChartAreaInteractive
              lines={[
                {
                  dataKey: "users",
                  label: "Users",
                  color: "#965015",
                  fill: "url(#fillOrders)",
                  stroke: "#965015",
                  strokeWidth: 2,
                },
              ]}
              chartData={userActivity}
              title="Account Creation Activity"
              description="Monitor how many new accounts are created each day to measure user acquisition."
              NotFound="No Users Account was Found Yet"
            />
          </div>
          <UserCards
            users={users}
            adminRoute={adminRoute}
            handleWhereChange={handleWhereChange}
            handleSortChange={handleSortChange}
          />
        </div>
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            onPageChange={onPageChange}
          />
        )}
      </ContentLayout>
    </div>
  );
}
