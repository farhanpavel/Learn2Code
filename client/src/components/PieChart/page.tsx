"use client";
import React from "react";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Watchtime",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Quiz",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Interview",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Docs",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Planning",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;
export default function PieData() {
  return (
    <div>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Pie data={chartData} dataKey="visitors" />
              <ChartLegend
                content={<ChartLegendContent nameKey="browser" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
