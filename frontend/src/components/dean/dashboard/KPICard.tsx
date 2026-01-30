import React from "react";
import type { KPICardProps } from "./types";

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorClass,
  trend,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p
        className={`text-xs mt-2 font-medium ${trend === "negative" ? "text-red-500" : "text-emerald-600"}`}
      >
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
      <Icon size={24} className={colorClass.replace("bg-", "text-")} />
    </div>
  </div>
);

export default KPICard;
