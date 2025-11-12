import ColorBox from "@/components/common/dashboard/color-box";
import type { CustomerStats } from "@/types/stats";

interface DashboardContent4Props {
  data: CustomerStats;
}

const DashboardContent4 = ({ data }: DashboardContent4Props) => {
  return (
    <div>
      <div>
        <h1 className="font-bold text-[24px] py-5">Customers</h1>
        <div className="grid grid-cols-3 gap-5 pb-8">
          <ColorBox
            count={"+ " + data ? data?.customersSignedUp?.toString() || "0" : "+0"}
            label="Customers Signed Up"
            color="#24C166"
          />
          <ColorBox
            count={data?.customersPaid?.toString() || "0"}
            label="Customers Paid"
            color="#000"
          />
          <ColorBox
            count={data?.customerStatementsGenerated?.toString() || "0"}
            label="Customer Statements Generated"
            color="#000"
          />
        </div>
        <hr />
      </div>
    </div>
  );
};

export default DashboardContent4;
