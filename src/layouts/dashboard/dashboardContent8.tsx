import ColorBox from "@/components/common/dashboard/color-box";
import type { ReferralsStats } from "@/types/stats";

interface DashboardContent8Props {
  data?: ReferralsStats | null;
}

const DashboardContent8 = ({ data }: DashboardContent8Props) => {
  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Referrals</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Total referrals and related metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ColorBox
          count={data?.totalReferrals?.toString() ?? "0"}
          label="Total Referrals"
          color="#000"
        />
        {data?.successfulReferrals != null && (
          <ColorBox
            count={data.successfulReferrals.toString()}
            label="Successful Referrals"
            color="#24C166"
          />
        )}
        {data?.pendingReferrals != null && (
          <ColorBox
            count={data.pendingReferrals.toString()}
            label="Pending Referrals"
            color="#F9A000"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContent8;
