import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load pages
const Home = lazy(() => import("./pages/home/home"));

// User Pages
const UserHome = lazy(() => import("./pages/user/home"));
const UserWork = lazy(() => import("./pages/user/work"));
const UserWorkLoad = lazy(() => import("./pages/user/workload"));
const UserHistory = lazy(() => import("./pages/user/history"));
const EditUserWorkLoad = lazy(() => import("./pages/user/edit"));
const DetailUserWorkLoad = lazy(() => import("./pages/user/detail"));
const UserHistoryDetail = lazy(() => import("./pages/user/historyDetail"));
const UserChert = lazy(() => import("./pages/user/chart/user.chart"));

// Head Pages
const Head = lazy(() => import("./pages/head/head"));
const HeadWork = lazy(() => import("./pages/head/work"));
const HeadHistory = lazy(() => import("./pages/head/history"));
const DetailHeadWorkLoad = lazy(() => import("./pages/head/detail"));
const HeadWorkload = lazy(() => import("./pages/head/workload"));
const HeadWorkLoadAdd = lazy(() => import("./pages/head/workload.add"));
const HeadWorkLoadEdit = lazy(() => import("./pages/head/workload.edit"));
const HeadWorkLoadDetail = lazy(() => import("./pages/head/workload.detail"));
const HeadHistoryDetail = lazy(() => import("./pages/head/history.detail"));
const HeadWorkUser = lazy(() => import("./pages/head/work.user"));
const HeadWorkStatus = lazy(() => import("./pages/head/work.status"));
const HeadChart = lazy(() => import("./pages/head/chart/head.chart"));

// Admin Pages
const Admin = lazy(() => import("./pages/admin/admin"));
const AdminWorkLoad = lazy(() => import("./pages/admin/workload"));
const AdminEdit = lazy(() => import("./pages/admin/edit"));
const AdminWork = lazy(() => import("./pages/admin/work"));
const AdminWorkUser = lazy(() => import("./pages/admin/work.user"));
const AdminWorkStatus = lazy(() => import("./pages/admin/work.status"));
const AdminWorkStatusDetail = lazy(() => import("./pages/admin/work.detail"));
const AdminConfig = lazy(() => import("./pages/admin/config"));
const PriorityView = lazy(() => import("./pages/admin/setting/priority.view"));
const Priority = lazy(() => import("./pages/admin/setting/priority"));
const PriorityEdit = lazy(() => import("./pages/admin/setting/priority.edit"));
const AdminChart = lazy(() => import("./pages/admin/chart/admin.chart"));

// Dean Pages
const ChartDean = lazy(() => import("./pages/dean/chartdean"));
const GeneralAdministration = lazy(() => import("./pages/dean/generaladministration"));
const Academic = lazy(() => import("./pages/dean/academic"));
const Plan = lazy(() => import("./pages/dean/plan"));
const DevelopDigitalSkills = lazy(() => import("./pages/dean/developdigitalskills"));

// Loading Component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* User Routes */}
          <Route path="/user" element={<UserHome />} />
          <Route path="/user/work" element={<UserWork />} />
          <Route path="/user/work/new" element={<UserWorkLoad />} />
          <Route path="/user/work/edit/:id" element={<EditUserWorkLoad />} />
          <Route path="/user/work/detail/:id" element={<DetailUserWorkLoad />} />
          <Route path="/user/history" element={<UserHistory />} />
          <Route path="/user/history/detail/:id" element={<UserHistoryDetail />} />
          <Route path="/user/chart" element={<UserChert />} />

          {/* Head Routes */}
          <Route path="/head" element={<Head />} />
          <Route path="/head/work" element={<HeadWork />} />
          <Route path="/head/work/user/:id" element={<HeadWorkUser />} />
          <Route path="/head/work/user/status/:id" element={<HeadWorkStatus />} />
          <Route path="/head/work/detail/:id" element={<DetailHeadWorkLoad />} />
          <Route path="/head/_workload" element={<HeadWorkload />} />
          <Route path="/head/_workload/new" element={<HeadWorkLoadAdd />} />
          <Route path="/head/_workload/edit/:id" element={<HeadWorkLoadEdit />} />
          <Route path="/head/_workload/detail/:id" element={<HeadWorkLoadDetail />} />
          <Route path="/head/history" element={<HeadHistory />} />
          <Route path="/head/history/detail/:id" element={<HeadHistoryDetail />} />
          <Route path="/head/chart" element={<HeadChart />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/user/new" element={<AdminWorkLoad />} />
          <Route path="/admin/user/edit/:id" element={<AdminEdit />} />
          <Route path="/admin/work" element={<AdminWork />} />
          <Route path="/admin/work/user/:id" element={<AdminWorkUser />} />
          <Route path="/admin/work/user/status/:id" element={<AdminWorkStatus />} />
          <Route path="/admin/work/detail/:id" element={<AdminWorkStatusDetail />} />
          <Route path="/admin/config" element={<AdminConfig />} />
          <Route path="/admin/config/priority" element={<PriorityView />} />
          <Route path="/admin/config/priority/add" element={<Priority />} />
          <Route path="/admin/config/priority/edit/:id" element={<PriorityEdit />} />
          <Route path="/admin/chart" element={<AdminChart />} />

          {/* Dean Routes */}
          <Route path="/dean" element={<ChartDean />} />
          <Route path="/dean/generaladministration" element={<GeneralAdministration />} />
          <Route path="/dean/academic" element={<Academic />} />
          <Route path="/dean/plan" element={<Plan />} />
          <Route path="/dean/developdigitalskills" element={<DevelopDigitalSkills />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
