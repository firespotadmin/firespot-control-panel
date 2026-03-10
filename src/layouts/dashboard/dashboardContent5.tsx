import ColorBox from "@/components/common/dashboard/color-box";
import type { SupportStats } from "@/types/stats";

interface DashboardContent5Props {
  data?: SupportStats | null;
}

const DashboardContent5 = ({ data }: DashboardContent5Props) => {
  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Support</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Total, resolved, and open support tickets.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ColorBox
          count={data?.totalSupportTickets?.toString() ?? "0"}
          label="Total Support Tickets"
          color="#000"
        />
        <ColorBox
          count={data?.resolvedSupportTickets?.toString() ?? "0"}
          label="Resolved Support Tickets"
          color="#000"
        />
        <ColorBox
          count={data?.openSupportTickets?.toString() ?? "0"}
          label="Open Support Tickets"
          color="#F9A000"
        />
      </div>
    </div>
  );
};

export default DashboardContent5;
