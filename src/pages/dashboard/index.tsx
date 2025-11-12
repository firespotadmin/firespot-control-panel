import { useGetStats } from "@/hooks/stats-hook.hook";
import DashboadContent from "@/layouts/dashboard/dashboadContent";
import DashboardContent2 from "@/layouts/dashboard/dashboardContent2";
import DashboardContent3 from "@/layouts/dashboard/dashboardContent3";
import DashboardContent4 from "@/layouts/dashboard/dashboardContent4";
import DashboardContent5 from "@/layouts/dashboard/dashboardContent5";
import DashboardContent6 from "@/layouts/dashboard/dashboardContent6";
import DashboardContent7 from "@/layouts/dashboard/dashboardContent7";
import DashboardContent8 from "@/layouts/dashboard/dashboardContent8";
import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import type { StatsResponse } from "@/types/stats";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState<StatsResponse>(null!);

  const fetchStats = async () => {
    const response = await useGetStats({
      fromDate: "",
      toDate: ""
    }) as StatsResponse;
    console.log(response)
    if (response?.success) {
      setData(response);
    }
  }

  useEffect(() => {
    fetchStats();
  }, [])
  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (scrollable) */}
        <SideBar />

        {/* Main Section (scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8]">
          {/* Your main dashboard content goes here */}
          <DashboadContent data={data?.data?.data?.users} />
          <DashboardContent2 data={data?.data?.data?.transactions} />
          <DashboardContent3 data={data?.data?.data?.businesses} />
          <DashboardContent4 data={data?.data?.data?.customers} />
          <DashboardContent5 />
          <DashboardContent6 />
          <DashboardContent7 data={data?.data?.data?.feedback} />
          <DashboardContent8 />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
