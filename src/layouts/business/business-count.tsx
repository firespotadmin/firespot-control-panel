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
      const response = await getStatsBusiness();

      if (response?.success && response?.data) {
        setData(response.data);
      } else {
        setData(null);
        setError(response?.message || "Failed to load business statistics");
      }
    } catch (err: any) {
      console.error("Error fetching business stats:", err);
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
        <div className="grid grid-cols-6 gap-[12px] pt-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-[80px] w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="grid grid-cols-6 gap-[12px] pt-5">
          <div className="col-span-6 text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={getStatsData}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-6 gap-[12px] pt-5">
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
