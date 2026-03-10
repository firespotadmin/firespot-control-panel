import ColorBox from "@/components/common/dashboard/color-box";
import { getStatsBusiness } from "@/services/stats-service.service";
import { type DashboardStats } from "@/types/business";
import { useEffect, useState } from "react";

const BusinessCount = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStatsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await getStatsBusiness();
      if (stats) {
        setData(stats);
      } else {
        setData(null);
        setError("Failed to load business statistics");
      }
    } catch (err: any) {
      setData(null);
      setError(err?.response?.data?.message || err?.message || "Failed to load business statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStatsData();
  }, []);

  // Helper function to safely format numbers
  const formatCount = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return "0";
    }
    return value.toString();
  };

  // Default stats object for loading/error states
  const defaultStats: DashboardStats = {
    totalSignUps: 0,
    totalVerified: 0,
    totalUnverified: 0,
    totalActive: 0,
    totalStatementsGenerated: 0,
  };

  // Use actual data if available, otherwise use defaults
  const stats = data || defaultStats;

  if (loading) {
    return (
      <div>
        <p className="text-[16px] font-[600] text-[#111827]">Summary</p>
        <p className="text-[13px] text-[#6B7280] mt-1">Business sign ups and verification.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-[#F3F4F6] animate-pulse rounded-[14px] h-[100px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-[16px] font-[600] text-[#111827]">Summary</p>
        <div className="mt-4 text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={getStatsData}
            className="mt-2 px-4 py-2 rounded-[10px] text-sm bg-[#111827] text-white hover:bg-[#1F2937] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Summary</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Business sign ups, verified, and statements.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        <ColorBox
          color="#000"
          count={formatCount(stats.totalSignUps)}
          label="Total Sign Ups"
        />
        <ColorBox
          color="#000"
          count={formatCount(stats.totalVerified)}
          label="KYB Complete"
        />
        <ColorBox
          color="#000"
          count={formatCount(stats.totalVerified)}
          label="Verified"
        />
        <ColorBox
          color="#000"
          count={formatCount(stats.totalUnverified)}
          label="Unverified"
        />
        <ColorBox
          color="#000"
          count={formatCount(stats.totalActive)}
          label="Active"
        />
        <ColorBox
          color="#000"
          count={formatCount(stats.totalStatementsGenerated)}
          label="Statements Generated"
        />
      </div>
    </div>
  );
};

export default BusinessCount;
