import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterPillSelect from "@/components/common/filters/filter-pill-select";
import FilterSearchInput from "@/components/common/filters/filter-search-input";
import ColorBox from "@/components/common/dashboard/color-box";
import { ArrowLeft2, ArrowRight2, CloseCircle, Copy, TickCircle } from "iconsax-reactjs";
import { useGetAllTransactions, useGetTransactionStats } from "@/hooks/stats-hook.hook";
import type { AdminTransaction, TransactionStatsData } from "@/types/transaction";
import { useEffect, useState } from "react";

type TransactionRow = {
  id: string;
  amountPaid: string;
  businessId: string;
  paidOn: string;
  status: string;
  reference: string;
  transactionId: string;
};

const PAGE_SIZE = 10;
const TRANSACTION_STATUSES = [
  "",
  "PENDING",
  "SUCCESS",
  "FAILED",
  "EXPIRED",
  "PROCESSING",
  "SETTLED",
  "REFUNDED",
  "PAYMENT_IN_PROGRESS",
  "PAYMENT_INITIATED",
];
const PLACEHOLDER_FILTER_OPTIONS = [{ value: "", label: "All time" }];
const INDUSTRY_FILTER_OPTIONS = [{ value: "", label: "All industries" }];
const LOCATION_FILTER_OPTIONS = [{ value: "", label: "All locations" }];

const getStatusIcon = (status: string) => {
  if (status === "SUCCESS" || status === "SETTLED") {
    return <TickCircle size={18} color="#22C55E" variant="Bold" />;
  }

  if (status === "FAILED" || status === "EXPIRED") {
    return <CloseCircle size={18} color="#E11D48" variant="Bold" />;
  }

  if (
    status === "PROCESSING" ||
    status === "PAYMENT_IN_PROGRESS" ||
    status === "PAYMENT_INITIATED"
  ) {
    return <img src="/loading.png" alt="Processing" className="w-[18px] h-[18px]" />;
  }

  return <img src="/label.png" alt="Pending" className="w-[18px] h-[18px]" />;
};

const formatAmount = (value: number | string | null | undefined) => {
  const numericValue = Number(value || 0);

  if (Number.isNaN(numericValue)) {
    return "₦ 0.00";
  }

  return `₦ ${numericValue.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// K = thousands, M = millions, B = billions, T = trillions (for Gross Merchandise Volume etc.)
const formatLargeAmount = (value: number | string | null | undefined): string => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return "₦ 0";
  if (num >= 1e12) return `₦ ${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `₦ ${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `₦ ${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `₦ ${(num / 1e3).toFixed(1)}K`;
  return `₦ ${num.toLocaleString()}`;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "N/A";
  }

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return value;
  }

  return dateValue.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TransactionsSection = () => {
  const [transactionStats, setTransactionStats] = useState<TransactionStatsData>({
    totalTransactions: 0,
    gross: 0,
    totalSuccessful: 0,
    totalPending: 0,
    totalFailed: 0,
  });
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionStats = async () => {
      const response = await useGetTransactionStats();
      const payload = response?.data || response;

      setTransactionStats({
        totalTransactions: payload?.totalTransactions || 0,
        gross: payload?.gross || 0,
        totalSuccessful: payload?.totalSuccessful || 0,
        totalPending: payload?.totalPending || 0,
        totalFailed: payload?.totalFailed || 0,
      });
    };

    fetchTransactionStats();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await useGetAllTransactions({
          page,
          size: PAGE_SIZE,
          status: statusFilter,
          search,
        });

        if (response?.message === "No transactions") {
          setTransactions([]);
          setTotalPages(1);
          return;
        }

        const payload = response?.data || response;
        const nestedData = payload?.data;
        const listCandidates = [
          nestedData?.data?.content,
          nestedData?.data,
          payload?.data?.content,
          payload?.content,
        ];
        const list = (listCandidates.find((candidate) => Array.isArray(candidate)) ||
          []) as AdminTransaction[];

        setTransactions(
          list.map((item) => ({
            id: item.id,
            amountPaid: formatAmount(item.amount),
            businessId: item.businessId || "N/A",
            paidOn: formatDate(item.createdAt),
            status: item.transactionStatus || "PENDING",
            reference: item.transactionReference || "N/A",
            transactionId: item.id || "N/A",
          }))
        );
        setTotalPages(
          nestedData?.numberOfPages ||
            nestedData?.data?.totalPages ||
            payload?.numberOfPages ||
            payload?.totalPages ||
            1
        );
      } catch (err: any) {
        setTransactions([]);
        setTotalPages(1);
        setError(err?.message || "Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, statusFilter, search]);

  const getPageItems = () => {
    const total = Math.max(totalPages, 1);
    const current = page + 1;

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, "...", total - 2, total - 1, total];
    }

    if (current >= total - 3) {
      return [1, 2, 3, "...", total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const pageItems = getPageItems();

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
        <p className="text-[16px] font-[600] text-[#111827]">Summary</p>
        <p className="text-[13px] text-[#6B7280] mt-1">Gross volume and transaction counts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-4">
          <ColorBox
          color="#111827"
          count={formatLargeAmount(transactionStats.gross)}
          label="Gross Merchandise Volume"
          fontSize="42px"
        />
        <ColorBox
          color="#111827"
          count={String(transactionStats.totalTransactions || 0)}
          label="Total Transactions"
        />
        <ColorBox
          color="#111827"
          count={String(transactionStats.totalSuccessful || 0)}
          label="Successful Transactions"
        />
        <ColorBox
          color="#F59E0B"
          count={String(transactionStats.totalPending || 0)}
          label="Pending Transactions"
        />
        <ColorBox
          color="#F43F5E"
          count={String(transactionStats.totalFailed || 0)}
          label="Failed Transactions"
        />
        </div>
      </div>

      <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex gap-2 flex-wrap">
            <FilterPillSelect
              value=""
              onChange={() => undefined}
              options={PLACEHOLDER_FILTER_OPTIONS}
              className="min-w-[95px]"
            />
            <FilterPillSelect
              value={statusFilter}
              onChange={(value) => {
                setPage(0);
                setStatusFilter(value);
              }}
              options={TRANSACTION_STATUSES.map((status) => ({
                value: status,
                label: status || "Any status",
              }))}
              className="min-w-[115px]"
            />
            <FilterPillSelect
              value=""
              onChange={() => undefined}
              options={INDUSTRY_FILTER_OPTIONS}
              className="min-w-[135px]"
            />
            <FilterPillSelect
              value=""
              onChange={() => undefined}
              options={LOCATION_FILTER_OPTIONS}
              className="min-w-[135px]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <FilterSearchInput
              value={search}
              onChange={(value) => {
                setPage(0);
                setSearch(value);
              }}
              placeholder="Search business names or fsID"
              className="w-[320px]"
            />
          </div>
        </div>

        {isLoading ? (
        <div className="py-24 flex justify-center text-[#6B7280]">Loading transactions...</div>
      ) : error ? (
        <div className="py-24 flex justify-center text-[#E11D48]">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="py-24 flex flex-col items-center text-center">
          <img src="/money-fly.png" alt="No transaction" className="w-[56px] h-[56px]" />
          <h3 className="mt-4 text-[30px] leading-[1.2] font-[700] text-[#111827]">
            No transaction yet
          </h3>
          <p className="mt-2 text-[14px] text-[#6B7280] max-w-[460px] leading-[1.45]">
            You would see all transactions processed through Firespot here.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[14px] border border-[#ECEEF1] overflow-hidden mt-4">
            <Table className="[&_th]:h-[52px] [&_th]:px-4 [&_td]:px-4 [&_td]:py-3">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Amount paid</TableHead>
                  <TableHead>Business ID</TableHead>
                  <TableHead>Paid on</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{getStatusIcon(item.status)}</TableCell>
                    <TableCell>{item.amountPaid}</TableCell>
                    <TableCell>{item.businessId}</TableCell>
                    <TableCell>{item.paidOn}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.transactionId}</TableCell>
                    <TableCell>
                      <Copy size={16} color="#9CA3AF" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-5 px-1 text-[#6B7280] text-[12px]">
            <button
              className="flex items-center gap-2 font-[500] disabled:opacity-40"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              <ArrowLeft2 size={14} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {pageItems.map((item, index) => {
                if (item === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-[#9CA3AF] font-[500]">
                      ...
                    </span>
                  );
                }

                const pageNumber = item as number;
                const isActive = pageNumber === page + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber - 1)}
                    className={`h-8 w-8 rounded-full text-[12px] font-[500] transition-colors ${
                      isActive
                        ? "bg-[#E5E7EB] text-[#111827]"
                        : "text-[#6B7280] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              className="flex items-center gap-2 font-[500] disabled:opacity-40"
              onClick={() => setPage((prev) => Math.min(prev + 1, Math.max(totalPages - 1, 0)))}
              disabled={page >= totalPages - 1}
            >
              Next
              <ArrowRight2 size={14} />
            </button>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default TransactionsSection;