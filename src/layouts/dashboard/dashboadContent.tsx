import ColorBox from "@/components/common/dashboard/color-box";
import TopContentOne from "@/components/common/dashboard/topContentOne";
import type { UserStats } from "@/types/stats";

interface DashboardContentProps {
  data: UserStats;
}

const DashboardContent = ({ data }: DashboardContentProps) => {
  return (
    <div>
      <div>
        <TopContentOne />
        <div className="grid grid-cols-6 gap-5 pb-8">
          <ColorBox
            count={data?.newUsersLast30Days?.toString() || "0"} 
            label="Total New Users"
            color="#24C166"
          />
          <ColorBox
            count={data?.registeredUsers?.toString() || "0"}
            label="Registered Users"
            color="#2563EB"
          />
          <ColorBox
            count={data?.guestUsers?.toString() || "0"}
            label="Guest Users"
            color="#F59E0B"
          />
          <ColorBox
            count={data?.activeUsers?.toString() || "0"}
            label="Active Users"
            color="#10B981"
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
        <hr />
      </div>
    </div>
  );
};

export default DashboardContent;
