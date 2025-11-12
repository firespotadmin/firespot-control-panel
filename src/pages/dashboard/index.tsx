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
import type { RootState } from "@/stores/store/store";
import type { StatsResponse } from "@/types/stats";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// ✅ Reusable skeleton component
const SkeletonBox = ({ height = "h-[150px]" }: { height?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl w-full ${height}`} />
);

const Dashboard = () => {
  const [data, setData] = useState<StatsResponse>(null!);
  const [loading, setLoading] = useState(true);
  const { fromDate, toDate } = useSelector((state: RootState) => state.dateRange);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = (await useGetStats({ fromDate, toDate })) as StatsResponse;
      if (response?.success) {
        setData(response);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fromDate, toDate]);

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
          {loading ? (
            <div className="space-y-5">
              <SkeletonBox height="h-[120px]" />
              <SkeletonBox height="h-[120px]" />
              <SkeletonBox height="h-[200px]" />
              <SkeletonBox height="h-[200px]" />
              <SkeletonBox height="h-[150px]" />
              <SkeletonBox height="h-[150px]" />
              <SkeletonBox height="h-[200px]" />
              <SkeletonBox height="h-[180px]" />
            </div>
          ) : (
            <>
              <DashboadContent data={data?.data?.data?.users} />
              <DashboardContent2 data={data?.data?.data?.transactions} />
              <DashboardContent3 data={data?.data?.data?.businesses} />
              <DashboardContent4 data={data?.data?.data?.customers} />
              <DashboardContent5 />
              <DashboardContent6 />
              <DashboardContent7 data={data?.data?.data?.feedback} />
              <DashboardContent8 />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
