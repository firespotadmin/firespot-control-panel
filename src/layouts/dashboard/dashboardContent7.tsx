import ColorBox from "@/components/common/dashboard/color-box";
import type { FeedbackStats } from "@/types/stats";

interface DashboardContent7Props {
  data?: FeedbackStats | null;
}

const DashboardContent7 = ({ data }: DashboardContent7Props) => {
  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Feedback</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Feedback sent to businesses and businesses rated.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ColorBox
          count={data?.feedbackSentToBusinesses?.toString() || "0"}
          label="Feedback Sent (To Businesses)"
          color="#000"
        />
        <ColorBox
          count={data?.businessesRated?.toString() || "0"}
          label="Businesses Rated"
          color="#000"
        />
      </div>
    </div>
  );
};

export default DashboardContent7;
