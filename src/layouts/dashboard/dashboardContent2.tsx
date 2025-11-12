import ColorBox from "@/components/common/dashboard/color-box";
import type { TransactionStats } from "@/types/stats";

interface DashboardContent2Props {
  data: TransactionStats;
}

// Utility function to format large numbers (K, M, B)
const formatNumber = (num?: number): string => {
  if (!num || isNaN(num)) return "0";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}b`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}m`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
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
      <div>
        <h1 className="font-bold text-[24px] py-5">Transactions</h1>

        <div className="grid grid-cols-3 gap-5 pb-8">
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

        <hr />
      </div>
    </div>
  );
};

export default DashboardContent2;
