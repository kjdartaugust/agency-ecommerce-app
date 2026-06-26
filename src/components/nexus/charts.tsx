"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const NAVY = "#0F172A";
const CORAL = "#FF6B47";

const axis = { stroke: "#94a3b8", fontSize: 12 };
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  fontSize: 13,
  fontWeight: 600,
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

export function EarningsAreaChart({ data }: { data: { month: string; earnings: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CORAL} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CORAL} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...axis} />
        <YAxis tickLine={false} axisLine={false} {...axis} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Earnings"]} />
        <Area type="monotone" dataKey="earnings" stroke={CORAL} strokeWidth={3} fill="url(#earn)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrafficBarChart({ data }: { data: { day: string; views: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} {...axis} />
        <YAxis tickLine={false} axisLine={false} {...axis} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,107,71,0.06)" }} />
        <Bar dataKey="views" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === data.length - 2 ? CORAL : NAVY} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueLineChart({
  data,
}: {
  data: { month: string; services: number; products: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...axis} />
        <YAxis tickLine={false} axisLine={false} {...axis} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Line type="monotone" dataKey="services" stroke={CORAL} strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="products" stroke={NAVY} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
