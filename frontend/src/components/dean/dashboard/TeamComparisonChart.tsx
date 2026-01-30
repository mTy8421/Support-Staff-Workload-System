import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SectionHeader from "./SectionHeader";
import type { SupervisorData } from "./types";

interface TeamComparisonChartProps {
  data: SupervisorData[];
  onBarClick: (data: any) => void;
}

const COLORS = {
  critical: "#EF4444",
  normal: "#3B82F6",
};

const TeamComparisonChart: React.FC<TeamComparisonChartProps> = ({
  data,
  onBarClick,
}) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <SectionHeader
          title="การกระจายภาระงานตามแผนก"
          subtitle="เปรียบเทียบงานด่วนสูง vs งานทั่วไป (คลิกที่กราฟเพื่อดูรายละเอียด)"
        />
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div> งานด่วนสูง
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> งานทั่วไป
          </span>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            onClick={onBarClick}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              label={{
                value: "ชั่วโมง",
                angle: -90,
                position: "insideLeft",
                fill: "#94A3B8",
              }}
            />
            <Tooltip
              cursor={{ fill: "#F1F5F9" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar
              dataKey="critical"
              stackId="a"
              fill={COLORS.critical}
              radius={[0, 0, 4, 4]}
              barSize={50}
              name="งานด่วน (ชม.)"
            />
            <Bar
              dataKey="normal"
              stackId="a"
              fill={COLORS.normal}
              radius={[4, 4, 0, 0]}
              barSize={50}
              name="งานทั่วไป (ชม.)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-slate-400 text-center italic">
        * คลิกที่แท่งกราฟเพื่อดูรายการงานในแผนกนั้น
      </div>
    </div>
  );
};

export default TeamComparisonChart;
