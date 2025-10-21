import ColorBox from "@/components/common/dashboard/color-box";
import type { FeedbackStats } from "@/types/stats";

interface DashboardContent7Props {
  data: FeedbackStats;
}

const DashboardContent7 = ({ data }: DashboardContent7Props) => {
    console.log(data)
  return (
    <div>
      <div>
        <h1 className="font-bold text-[24px] py-5">Feedback</h1>

        <div className="grid grid-cols-3 gap-5 pb-8">
          <ColorBox
            count={data?.feedbackSentToBusinesses.toString() || "0"}
            label="Feedback Sent (To Businesses)"
            color="#000"
          />
          <ColorBox
            count={data?.businessesRated.toString() || "0"}
            label="Businesses Rated"
            color="#24C166"
          />
          <ColorBox
            count="0"
            label=""
            color=""
          />
        </div>

        <hr />
      </div>
    </div>
  );
};

export default DashboardContent7;
