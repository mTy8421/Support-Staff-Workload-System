import React from "react";
import SectionHeader from "./SectionHeader";
import { AlertTriangle } from "./Icons";
import type { TopicData } from "./types";

interface TopicAnalysisProps {
  data: TopicData[];
}

const TopicAnalysis: React.FC<TopicAnalysisProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <SectionHeader
        title="หัวข้อที่เสียเวลามากที่สุด"
        subtitle="จัดอันดับปัญหาที่กินเวลาทีมงาน"
      />
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{item.topic}</span>
              <span className="text-slate-500">{item.hours} ชม.</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full ${index === 0 ? "bg-red-500" : "bg-slate-400"}`}
                style={{
                  width: `${(item.hours / (data[0]?.hours || 1)) * 100}%`,
                }}
              ></div>
            </div>
            {index === 0 && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle size={10} /> ควรตรวจสอบและแก้ไข (High Impact)
              </p>
            )}
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-8">
            ไม่มีข้อมูลงานที่เสร็จสิ้น
          </div>
        )}
      </div>
      {data.length > 0 && (
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h4 className="text-indigo-900 font-semibold text-sm mb-2">
            ข้อเสนอแนะ (Recommendation)
          </h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            <strong>"{data[0]?.topic}"</strong> กินเวลามากที่สุด
            การปรับปรุงกระบวนการหรือแก้ไขที่ต้นเหตุอาจช่วยลดภาระงานลงได้
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicAnalysis;
