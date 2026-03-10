import ColorBox from "@/components/common/dashboard/color-box";
import type { UserStats } from "@/types/stats";

interface DashboardContentProps {
  data?: UserStats | null;
}

const DashboardContent = ({ data }: DashboardContentProps) => {
  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Users</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Registered, active, and unverified users.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        <ColorBox
          count={(data?.newUsersLastPeriod ?? data?.newUsersLast30Days)?.toString() || "0"}
          label="Total New Users"
          color="#24C166"
        />
        <ColorBox
          count={data?.registeredUsers?.toString() || "0"}
          label="Registered Users"
          color="#000"
        />
        <ColorBox
          count={data?.guestUsers?.toString() || "0"}
          label="Guest Users"
          color="#000"
        />
        <ColorBox
          count={data?.activeUsers?.toString() || "0"}
          label="Active Users"
          color="#000"
        />
        <ColorBox
          count={data?.inactiveUsers?.toString() || "0"}
          label="Inactive Users"
          color="#D1D5DB"
        />
        <ColorBox
          count={data?.unverifiedUsers?.toString() || "0"}
          label="Unverified Users"
          color="#F9A000"
        />
      </div>
    </div>
  );
};

export default DashboardContent;
