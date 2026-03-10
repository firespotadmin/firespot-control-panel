import ColorBox from "@/components/common/dashboard/color-box";
import type { TransactionStats } from "@/types/stats";

interface DashboardContent2Props {
  data?: TransactionStats | null;
}

// K = thousands, M = millions, B = billions, T = trillions
const formatNumber = (num?: number): string => {
  if (num == null || isNaN(num)) return "0";
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
};

const DashboardContent2 = ({ data }: DashboardContent2Props) => {
  // Example: Calculate success rate as a percentage
  const successRate =
    data?.totalTransactions && data?.successfulTransactions
      ? ((data.successfulTransactions / data.totalTransactions) * 100).toFixed(1)
      : "0";

  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Transactions</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Gross volume, revenue, and transaction counts.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <ColorBox
            fontSize="48px"
            count={`₦ ${formatNumber(data?.grossMerchandiseVolume)}`}
            label="Gross Merchandise Volume"
            color="#000"
          />

          <ColorBox
            count={`₦ ${formatNumber(data?.walletFloat)}`}
            label="Wallet Float"
            color="#000"
          />

          <ColorBox
            count={`+ ₦ ${formatNumber(data?.grossRevenue)}`}
            label="Gross Revenue (from TXN fees)"
            color="#24C166"
          />

          <ColorBox
            count={formatNumber(data?.totalTransactions)}
            label="Total Transactions"
            color="#000"
          />

          <ColorBox
            count={`${successRate}%`}
            label="Successful Transactions"
            color="#000"
          />

          <ColorBox
            count={`${formatNumber(data?.failedTransactions)}%`}
            label="Failed Transactions"
            color="#FF002E"
          />

          <ColorBox
            count={formatNumber(data?.cardsProcessed)}
            label="Cards Processed"
            color="#000"
          />

          <ColorBox
            count={formatNumber(data?.transfersProcessed)}
            label="Transfers Processed"
            color="#000"
          />

          <ColorBox
            count={formatNumber(data?.pendingTransactions)}
            label="Pending Transactions"
            color="#F9A000"
          />
        </div>
    </div>
  );
};

export default DashboardContent2;
