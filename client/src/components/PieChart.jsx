import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#3A86FF", "#0088FE", "#6B7280", "#B91C1C","#9B5DE5", "#3A86FF", "#00C49F"];

export default function PieChartComponent({ data, dataKey, nameKey }) {
  return (
    <ResponsiveContainer width="50%" height={300}>
      <PieChart>
        <Tooltip />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

