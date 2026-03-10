import TopContentOne from "@/components/common/dashboard/topContentOne";
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
import type { PlatformStats } from "@/types/stats";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

// ✅ Reusable skeleton component
const SkeletonBox = ({ height = "h-[150px]" }: { height?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl w-full ${height}`} />
);

const Dashboard = () => {
  const [data, setData] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { fromDate, toDate } = useSelector((state: RootState) => state.dateRange);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const stats = await useGetStats({ fromDate, toDate });
      if (stats) {
        setData(stats);
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
      <Toaster position="top-center" />
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (scrollable) */}
        <SideBar />

        {/* Main Section (scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <TopContentOne />
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
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboadContent data={data?.users} />
              </div>
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboardContent2 data={data?.transactions} />
              </div>
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboardContent3 data={data?.businesses} />
              </div>
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboardContent4 data={data?.customers} />
              </div>
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboardContent5 data={data?.support} />
              </div>
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboardContent6 data={data?.qrKits} />
              </div>
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboardContent7 data={data?.feedback} />
              </div>
              <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
                <DashboardContent8 data={data?.referrals} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
