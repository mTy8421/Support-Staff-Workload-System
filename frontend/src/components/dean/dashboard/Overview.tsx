import React from "react";
import KPICard from "./KPICard";
import TeamComparisonChart from "./TeamComparisonChart";
import TopicAnalysis from "./TopicAnalysis";
import { Clock, AlertTriangle, Activity, Filter } from "./Icons";
import type { SupervisorData, TopicData } from "./types";

interface OverviewProps {
  totalHoursFormatted: string;
  criticalPct: number;
  avgTimeFormatted: string;
  bottleneck: TopicData | null;
  supervisorData: SupervisorData[];
  topicData: TopicData[];
  onBarClick: (data: any) => void;
}

const Overview: React.FC<OverviewProps> = ({
  totalHoursFormatted,
  criticalPct,
  avgTimeFormatted,
  bottleneck,
  supervisorData,
  topicData,
  onBarClick,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="ชั่วโมงทำงานโดยรวม"
          value={totalHoursFormatted}
          subtext="รวมภาระงานที่เสร็จสิ้นทั้งหมด"
          icon={Clock}
          colorClass="bg-blue-500 text-blue-600"
          trend="positive"
        />
        <KPICard
          title="% งานด่วนสูง (Critical)"
          value={`${criticalPct}%`}
          subtext={criticalPct > 30 ? "สูงกว่าเกณฑ์มาตรฐาน" : "อยู่ในเกณฑ์ปกติ"}
          icon={AlertTriangle}
          colorClass={
            criticalPct > 30
              ? "bg-red-500 text-red-600"
              : "bg-green-500 text-green-600"
          }
          trend={criticalPct > 30 ? "negative" : "positive"}
        />
        <KPICard
          title="เวลาทำงานเฉลี่ย"
          value={avgTimeFormatted}
          subtext="เวลาเฉลี่ยต่อหนึ่งงาน"
          icon={Activity}
          colorClass="bg-indigo-500 text-indigo-600"
          trend="positive"
        />
        <KPICard
          title="ปัญหาคอขวดสูงสุด"
          value={bottleneck ? bottleneck.topic : "-"}
          subtext={
            bottleneck ? `เสียเวลา ${bottleneck.hours} ชม.` : "ไม่มีข้อมูล"
          }
          icon={Filter}
          colorClass="bg-orange-500 text-orange-600"
          trend="negative"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Comparison Chart */}
        <TeamComparisonChart data={supervisorData} onBarClick={onBarClick} />

        {/* Problem Analysis */}
        <TopicAnalysis data={topicData} />
      </div>
    </div>
  );
};

export default Overview;
