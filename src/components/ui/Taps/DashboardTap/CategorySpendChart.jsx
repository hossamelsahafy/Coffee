"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#D8A46B",
  "#965015",
  "#C07A3B",
  "#6B3A10",
  "#E8C8A3",
  "#B86B3A",
  "#7A5230",
  "#D4B08C",
  "#A85D32",
  "#54301A",
];

export function CategorySpendChart({ data = [], currency }) {
  const t = useTranslations("UserDashboard");

  const getEntryName = (entry) =>
    entry?.name || entry?.category?.title || "Unknown";
  const chartData = data.map((entry) => ({
    ...entry,
    name: entry?.name || entry?.category?.title || "Unknown",
  }));
  return (
    <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1A120D]/70 text-white backdrop-blur-md shadow-2xl">
      <CardHeader className="border-b border-white/10 py-5">
        <CardTitle className="text-xl font-semibold text-white">
          {t("topCategories")}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {!Array.isArray(data) || data.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-center text-sm text-gray-400">
            {t("noCategoryData")}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A120D",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                    }}
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)} ${currency}`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-300">
              {data.map((entry, index) => (
                <div
                  key={entry?.category?.id || entry?.name || index}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="max-w-[120px] truncate">
                    {getEntryName(entry)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
