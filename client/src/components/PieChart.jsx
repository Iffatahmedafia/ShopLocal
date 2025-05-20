import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

export default function PieChartComponent({ data, dataKey, nameKey }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
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

