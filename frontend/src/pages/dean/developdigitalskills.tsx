import React, { useEffect, useState, useMemo } from "react";
import { Layout } from "antd";
import moment from "moment";
import DeanHeader from "../../components/dean/Header";
import DeanNavbar from "../../components/dean/Navbar";
import ReHeader from "../../components/dean/NavbarHeader";
import theme from "../../theme";
import axiosInstance from "../../utils/axios";

// New Components
import Overview from "../../components/dean/dashboard/Overview";
import DrillDownView from "../../components/dean/dashboard/DrillDownView";
import type {
  SupervisorData,
  TopicData,
  Workload,
} from "../../components/dean/dashboard/types";

const { Content } = Layout;

// --- Main Component ---
export default function DevelopDigitalSkills() {
  const [viewState, setViewState] = useState<"overview" | "drilldown">(
    "overview",
  );
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<
    "thisMonth" | "lastMonth" | "thisYear"
  >("thisMonth");
  // const [searchTerm, setSearchTerm] = useState(""); // searchTerm moved to DrillDownView

  const [workloads, setWorkloads] = useState<Workload[]>([]);

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/user/dean/developdigitalskills");
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  // --- Data Processing (useMemo) ---
  const {
    supervisorData,
    topicData,
    totalHoursFormatted,
    criticalPct,
    avgTimeFormatted,
    bottleneck,
    departmentTasks, // Map of department -> tasks
  } = useMemo(() => {
    // Flatten works from all users and attach user_name
    const allWorks = workloads.flatMap((user) =>
      (user.works || []).map((work: any) => ({
        ...work,
        user_name: user.user_name,
      })),
    );

    // Filter by Date
    const filteredByDate = allWorks.filter((w: any) => {
      if (!w.dateTimeNow) return false;
      const date = moment(w.dateTimeNow);
      const now = moment();

      if (dateFilter === "thisMonth") {
        return date.isSame(now, "month");
      }
      if (dateFilter === "lastMonth") {
        return date.isSame(now.clone().subtract(1, "months"), "month");
      }
      if (dateFilter === "thisYear") {
        return date.isSame(now, "year");
      }
      return true;
    });

    const completed = filteredByDate.filter(
      (w: any) => w.status === "completed",
    );

    // Group by Department
    const deptGroups = new Map<
      string,
      { critical: number; normal: number; total: number; tasks: any[] }
    >();

    // Group by Topic
    const topicGroups = new Map<string, number>();

    let totalMinutes = 0;
    let criticalCount = 0;

    const parseDurationToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [hrs, mins] = timeStr.split(":").map(Number);
      return (hrs || 0) * 60 + (mins || 0);
    };

    completed.forEach((w: any) => {
      // Parse duration
      const durationMins = parseDurationToMinutes(w.startTime);
      const durationHours = durationMins / 60;

      totalMinutes += durationMins;

      const isCritical = w.options?.priority === "high";
      if (isCritical) criticalCount++;

      // Topic
      const topic = w.options?.title || "ไม่ระบุหัวข้อ";
      topicGroups.set(topic, (topicGroups.get(topic) || 0) + durationHours);

      // Department
      const dept = w.department || "ไม่ระบุแผนก";
      if (!deptGroups.has(dept)) {
        deptGroups.set(dept, { critical: 0, normal: 0, total: 0, tasks: [] });
      }
      const g = deptGroups.get(dept)!;
      g.total += durationHours;
      if (isCritical) g.critical += durationHours;
      else g.normal += durationHours;
      g.tasks.push(w);
    });

    // Format for Supervisor Chart
    const supervisorData: SupervisorData[] = Array.from(
      deptGroups.entries(),
    ).map(([name, stats]) => ({
      name,
      critical: parseFloat(stats.critical.toFixed(2)),
      normal: parseFloat(stats.normal.toFixed(2)),
      totalHours: parseFloat(stats.total.toFixed(2)),
      efficiency:
        stats.total > 0 ? Math.round((stats.normal / stats.total) * 100) : 100,
    }));

    // Format for Topics
    const topicData: TopicData[] = Array.from(topicGroups.entries())
      .map(([topic, hours]) => ({
        topic,
        hours: parseFloat(hours.toFixed(1)),
        impact: hours > 20 ? "High" : hours > 5 ? "Medium" : "Low",
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);

    // KPIs
    const totalHours = Math.floor(totalMinutes / 60);
    const totalHoursFormatted = `${totalHours.toLocaleString()} ชม.`;

    const avgMinutes = completed.length
      ? Math.round(totalMinutes / completed.length)
      : 0;
    const avgTimeFormatted =
      avgMinutes > 60
        ? `${Math.floor(avgMinutes / 60)} ชม. ${avgMinutes % 60} น.`
        : `${avgMinutes} นาที`;

    const criticalPct = completed.length
      ? Math.round((criticalCount / completed.length) * 100)
      : 0;

    const bottleneck = topicData.length > 0 ? topicData[0] : null;

    // Create a simple map for drilldown lookup
    const departmentTasks = new Map<string, any[]>();
    deptGroups.forEach((val, key) => {
      departmentTasks.set(key, val.tasks);
    });

    return {
      supervisorData,
      topicData,
      totalHoursFormatted,
      criticalPct,
      avgTimeFormatted,
      bottleneck,
      departmentTasks,
    };
  }, [workloads, dateFilter]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload) {
      const teamName = data.activePayload[0].payload.name;
      setSelectedTeam(teamName);
      setViewState("drilldown");
    }
  };

  const handleBack = () => {
    setViewState("overview");
    setSelectedTeam(null);
  };

  const tasksForDrillDown = selectedTeam
    ? departmentTasks.get(selectedTeam) || []
    : [];

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
      <div
        style={{
          display: window.innerWidth >= 768 ? "block" : "none",
        }}
      >
        <DeanHeader />
      </div>

      <div style={{ display: window.innerWidth < 768 ? "block" : "none" }}>
        <ReHeader />
      </div>

      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <div
          style={{
            display: window.innerWidth >= 768 ? "block" : "none",
          }}
        >
          <DeanNavbar />
        </div>
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <Content
            style={{ maxWidth: "80dvw", margin: "0 auto", width: "100%" }}
          >
            {/* Embedded Dashboard Content */}
            <div className="bg-transparent font-sans text-slate-900 w-full">
              <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <header>
                    <h1 className="text-2xl font-bold text-slate-900">
                      ศูนย์ปฏิบัติการฝ่ายสนับสนุน (Support Ops Center)
                    </h1>
                    <p className="text-slate-500">
                      แดชบอร์ดผู้บริหารและการวางแผนทรัพยากรบุคคล
                    </p>
                  </header>
                  <div className="flex bg-white rounded-lg shadow-sm p-1 border border-slate-200">
                    <button
                      onClick={() => setDateFilter("thisMonth")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md border-none cursor-pointer transition-colors ${
                        dateFilter === "thisMonth"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-500 hover:text-slate-700 bg-transparent"
                      }`}
                    >
                      เดือนนี้
                    </button>
                    <button
                      onClick={() => setDateFilter("lastMonth")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md border-none cursor-pointer transition-colors ${
                        dateFilter === "lastMonth"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-500 hover:text-slate-700 bg-transparent"
                      }`}
                    >
                      เดือนที่แล้ว
                    </button>
                    <button
                      onClick={() => setDateFilter("thisYear")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md border-none cursor-pointer transition-colors ${
                        dateFilter === "thisYear"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-500 hover:text-slate-700 bg-transparent"
                      }`}
                    >
                      ปีนี้
                    </button>
                  </div>
                </div>
                {viewState === "overview" ? (
                  <Overview
                    totalHoursFormatted={totalHoursFormatted}
                    criticalPct={criticalPct}
                    avgTimeFormatted={avgTimeFormatted}
                    bottleneck={bottleneck}
                    supervisorData={supervisorData}
                    topicData={topicData}
                    onBarClick={handleBarClick}
                  />
                ) : (
                  <DrillDownView
                    teamName={selectedTeam}
                    tasks={tasksForDrillDown}
                    onBack={handleBack}
                  />
                )}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
