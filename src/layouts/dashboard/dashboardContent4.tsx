import ColorBox from "@/components/common/dashboard/color-box";
import type { CustomerStats } from "@/types/stats";

interface DashboardContent4Props {
  data?: CustomerStats | null;
}

const DashboardContent4 = ({ data }: DashboardContent4Props) => {
  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Customers</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Signed up, paid, and statements generated.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ColorBox
          count={(data?.customersSignedUp ?? 0).toString()}
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
    </div>
  );
};

export default DashboardContent4;
