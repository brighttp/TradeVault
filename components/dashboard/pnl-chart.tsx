"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartData = {
  date: string;
  pnl: number;
};

export function PnlChart({ data }: { data: ChartData[] }) {
  // Add a fallback if data is empty so the chart doesn't crash
  const chartData = data && data.length > 0 ? data : [{ date: "No Data", pnl: 0 }];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            stroke="#E5E5E5" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#E5E5E5" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#14213D", border: "1px solid rgba(252, 163, 17, 0.2)", borderRadius: "6px" }}
            itemStyle={{ color: "#FCA311" }}
          />
          <Line 
            type="monotone" 
            dataKey="pnl" 
            stroke="#FCA311" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#FCA311" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
