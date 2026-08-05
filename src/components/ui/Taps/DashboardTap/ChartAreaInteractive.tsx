"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ChartPoint = {
  date: string;
  spent: number;
  orders: number;
};

interface ChartAreaInteractiveProps {
  chartData: ChartPoint[];
  lines: ChartLine[];
  title?: string;
  description?: string;
  NotFound?: String;
}
export type ChartLine = {
  dataKey: string;
  label: string;
  color: string;
  fill: string;
  stroke: string;
  strokeWidth?: number;
};
export function ChartAreaInteractive({
  chartData,
  lines,
  title,
  description,
  NotFound,
}: ChartAreaInteractiveProps) {
  const t = useTranslations("UserDashboard");
  const [timeRange, setTimeRange] = React.useState("all");
  const chartConfig = {
    spent: {
      label: t("spent"),
      color: "#D8A46B",
    },
    orders: {
      label: t("orders"),
      color: "#965015",
    },
    users: {
      label: "Users",
      color: "#D8A46B",
    },
    products: {
      label: "Products",
      color: "#D8A46B",
    },
  } satisfies ChartConfig;

  const filteredData = React.useMemo(() => {
    if (!Array.isArray(chartData) || chartData.length === 0) return [];

    if (timeRange === "all") {
      return [...chartData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }

    let daysToSubtract = 90;

    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);
    startDate.setHours(0, 0, 0, 0);

    return [...chartData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((item) => new Date(item.date) >= startDate);
  }, [chartData, timeRange]);
  return (
    <Card className="relative transition-all ease-in-out duration-300 overflow-hidden pt-0 w-full rounded-3xl border  border-white/10 bg-[#1A120D]/70 backdrop-blur-md shadow-2xl text-white">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C07A3B]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-[#965015]/10 blur-3xl pointer-events-none" />

      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-white text-xl font-semibold">
            {title ? title : t("ordersChartTitle")}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {description ? description : t("ordersChartDescription")}
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-xl border border-white/10 bg-[#2A1B12] text-white hover:bg-[#382418] sm:ml-auto sm:flex focus:ring-0 focus:ring-offset-0"
            aria-label="Select time range"
          >
            <SelectValue placeholder={t("last3Months")} />
          </SelectTrigger>

          <SelectContent className="rounded-xl border border-white/10 bg-[#1A120D] text-white shadow-xl">
            <SelectItem
              value="all"
              className="rounded-lg cursor-pointer focus:bg-[#382418] focus:!text-[#D8A46B]"
            >
              {t("All-Time")}
            </SelectItem>
            <SelectItem
              value="90d"
              className="rounded-lg cursor-pointer focus:bg-[#382418] focus:!text-[#D8A46B] data-[highlighted]:bg-[#382418] data-[highlighted]:!text-[#D8A46B]"
            >
              {t("last3Months")}
            </SelectItem>
            <SelectItem
              value="30d"
              className="rounded-lg cursor-pointer focus:bg-[#382418] focus:!text-[#D8A46B] data-[highlighted]:bg-[#382418] data-[highlighted]:!text-[#D8A46B]"
            >
              {t("last30Days")}
            </SelectItem>
            <SelectItem
              value="7d"
              className="rounded-lg cursor-pointer focus:bg-[#382418] focus:!text-[#D8A46B] data-[highlighted]:bg-[#382418] data-[highlighted]:!text-[#D8A46B]"
            >
              {t("last7Days")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex h-[280px] w-full items-center justify-center text-center text-gray-400">
            <p className="text-sm font-medium">
              {NotFound ? NotFound : t("noOrdersOrSpentYet")}
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D8A46B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D8A46B" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#965015" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#965015" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                padding={{ left: 16, right: 16 }}
                stroke="#A38F85"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />

              {lines.map((line) => (
                <YAxis key={line.dataKey} yAxisId={line.dataKey} hide />
              ))}

              <ChartTooltip
                cursor={{ stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    className="border border-white/10 bg-[#1A120D]/90 text-white backdrop-blur-md shadow-xl"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              {lines.map((line) => (
                <Area
                  key={line.dataKey}
                  yAxisId={line.dataKey}
                  dataKey={line.dataKey}
                  type="natural"
                  fill={line.fill}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth ?? 2}
                />
              ))}

              <ChartLegend
                className="mt-4 text-gray-300"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
