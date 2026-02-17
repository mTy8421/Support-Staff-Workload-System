import React, { useState } from "react";
import moment from "moment";
import { ArrowLeft, Users, SearchIcon } from "./Icons";

interface DrillDownViewProps {
  teamName: string | null;
  tasks: any[];
  onBack: () => void;
}

const DrillDownView: React.FC<DrillDownViewProps> = ({
  teamName,
  tasks,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.user_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-slide-in">
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .animate-slide-in { animation: none; }
        }
      `}</style>
      <button
        onClick={onBack}
        aria-label="กลับไปหน้าภาพรวม"
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors duration-200 font-medium cursor-pointer bg-transparent border-none min-h-[44px] px-3 py-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ArrowLeft size={20} className="mr-2" aria-hidden="true" /> กลับไปหน้าภาพรวม
      </button>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users size={24} className="text-blue-500" />
              {teamName} : รายละเอียดภาระงาน
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              รายการงานทั้งหมดในแผนก
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <label htmlFor="search-employee" className="sr-only">ค้นหาชื่อพนักงาน</label>
              <input
                id="search-employee"
                type="text"
                placeholder="ค้นหาชื่อพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 transition-colors duration-200"
                aria-label="ค้นหาชื่อพนักงาน"
              />
              <SearchIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 whitespace-nowrap">
              จำนวนภาระงาน: <strong>{filteredTasks.length}</strong>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-100">
                  ชื่อพนักงาน
                </th>
                <th className="p-4 font-semibold border-b border-slate-100">
                  หัวข้อ (Topic)
                </th>
                <th className="p-4 font-semibold border-b border-slate-100">
                  รายละเอียด
                </th>
                <th className="p-4 font-semibold border-b border-slate-100 text-right">
                  วันที่
                </th>
                <th className="p-4 font-semibold border-b border-slate-100 text-right">
                  เวลาที่ใช้ (ชม : นาที)
                </th>
                <th className="p-4 font-semibold border-b border-slate-100 text-center">
                  ระดับความเร่งด่วน
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => {
                let hrs = 0;
                let mins = 0;
                if (task.startTime) {
                  const parts = task.startTime.split(":").map(Number);
                  hrs = parts[0] || 0;
                  mins = parts[1] || 0;
                }

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 text-slate-800 font-medium">
                      {task.user_name || "-"}
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {task.options?.title || "-"}
                    </td>
                    <td className="p-4 text-slate-600 truncate max-w-xs">
                      {task.description}
                    </td>
                    <td className="p-4 text-slate-800 text-right">
                      {task.dateTimeNow
                        ? moment(task.dateTimeNow).format("DD/MM/YYYY")
                        : "-"}
                    </td>
                    <td className="p-4 text-slate-800 text-right font-bold font-mono">
                      {hrs} ชม. {mins.toString().padStart(2, "0")} น.
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.options?.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.options?.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.options?.priority === "high"
                          ? "สูง"
                          : task.options?.priority === "medium"
                            ? "ปานกลาง"
                            : "ปกติ"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {searchTerm
                      ? "ไม่พบข้อมูลที่ค้นหา"
                      : "ไม่พบข้อมูลงานในแผนกนี้"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrillDownView;
