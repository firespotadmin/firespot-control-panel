import ColorBox from "@/components/common/dashboard/color-box";
import { useGetCustomerStats } from "@/hooks/stats-hook.hook";
import type { CustomerStatsData } from "@/types/customer";
import { useEffect, useState } from "react";

const BusinessCount = () => {
  const [stats, setStats] = useState<CustomerStatsData>({
    totalActive: 0,
    totalSignUps: 0,
    totalStatementsGenerated: 0,
    totalVerified: 0,
    totalUnverified: 0,
  });

  useEffect(() => {
    const fetchCustomerStats = async () => {
      const response = await useGetCustomerStats();
      const payload = response?.data || response;

      setStats({
        totalActive: payload?.totalActive || 0,
        totalSignUps: payload?.totalSignUps || 0,
        totalStatementsGenerated: payload?.totalStatementsGenerated || 0,
        totalVerified: payload?.totalVerified || 0,
        totalUnverified: payload?.totalUnverified || 0,
      });
    };

    fetchCustomerStats();
  }, []);

  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Summary</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Customer sign ups, verified, and statements.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-4">
        <ColorBox color="#000" count={stats.totalSignUps.toString()} label="Total Sign Ups" />
        <ColorBox color="#000" count={stats.totalVerified.toString()} label="Verified" />
        <ColorBox color="#000" count={stats.totalUnverified.toString()} label="Unverified" />
        <ColorBox color="#000" count={stats.totalActive.toString()} label="Active" />
        <ColorBox
          color="#000"
          count={stats.totalStatementsGenerated.toString()}
          label="Statements Generated"
        />
      </div>
    </div>
  );
};

export default BusinessCount;
