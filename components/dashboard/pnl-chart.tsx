"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Jan 01", pnl: 0 },
  { date: "Jan 05", pnl: 120 },
  { date: "Jan 10", pnl: 80 },
  { date: "Jan 15", pnl: 350 },
  { date: "Jan 20", pnl: 310 },
  { date: "Jan 25", pnl: 550 },
  { date: "Jan 30", pnl: 890 },
];

export function PnlChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: "6px" }}
            itemStyle={{ color: "#22c55e" }}
          />
          <Line 
            type="monotone" 
            dataKey="pnl" 
            stroke="#22c55e" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#22c55e" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
