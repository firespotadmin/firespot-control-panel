import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowLeft2, ArrowRight2, CloseCircle, Copy, TickCircle } from "iconsax-reactjs";
import { SearchNormal1 } from "iconsax-reactjs";
import CustomerFilterChip from "@/components/common/customers/filter-chip";
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

const getStatusIcon = (status: string) => {
  if (status === "SUCCESS" || status === "SETTLED") {
    return <TickCircle size={18} color="#22C55E" variant="Bold" />;
  }

  if (status === "FAILED" || status === "EXPIRED") {
    return <CloseCircle size={18} color="#E11D48" variant="Bold" />;
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
  const [totalItems, setTotalItems] = useState(0);
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
          setTotalItems(0);
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
        setTotalItems(
          nestedData?.numberOfItems ||
            nestedData?.data?.totalElements ||
            payload?.numberOfItems ||
            payload?.totalElements ||
            0
        );
      } catch (err: any) {
        setTransactions([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(err?.message || "Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, statusFilter, search]);

  return (
    <div className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 pb-5 border-b border-[#E5E7EB]">
        <div className="xl:col-span-2 bg-[#fff] rounded-[12px] p-4">
          <p className="text-[12px] text-[#6B7280]">Gross Merchandise Volume</p>
          <h3 className="text-[42px] leading-[1.1] font-[700] text-[#111827]">
            {formatAmount(transactionStats.gross)}
          </h3>
        </div>

        <div className="bg-[#fff] rounded-[12px] p-4">
          <p className="text-[12px] text-[#6B7280]">Total Transactions</p>
          <h3 className="text-[48px] leading-[1.1] font-[700] text-[#111827]">
            {transactionStats.totalTransactions}
          </h3>
        </div>

        <div className="bg-[#fff] rounded-[12px] p-4">
          <p className="text-[12px] text-[#6B7280]">Successful Transactions</p>
          <h3 className="text-[48px] leading-[1.1] font-[700] text-[#111827]">
            {transactionStats.totalSuccessful}
          </h3>
        </div>

        <div className="bg-[#fff] rounded-[12px] p-4">
          <p className="text-[12px] text-[#6B7280]">Pending Transactions</p>
          <h3 className="text-[48px] leading-[1.1] font-[700] text-[#F59E0B]">
            {transactionStats.totalPending}
          </h3>
        </div>

        <div className="bg-[#fff] rounded-[12px] p-4">
          <p className="text-[12px] text-[#6B7280]">Failed Transactions</p>
          <h3 className="text-[48px] leading-[1.1] font-[700] text-[#F43F5E]">
            {transactionStats.totalFailed}
          </h3>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <CustomerFilterChip label="ALL TIME" />
          <div className="bg-[#E5E7EB] cursor-pointer p-[10px] rounded-[20px]">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(0);
              }}
              className="text-[10px] uppercase font-[700] bg-transparent outline-none"
            >
              {TRANSACTION_STATUSES.map((status) => (
                <option key={status || "ANY_STATUS"} value={status}>
                  {status || "ANY STATUS"}
                </option>
              ))}
            </select>
          </div>
          <CustomerFilterChip label="ALL INDUSTRIES" />
          <CustomerFilterChip label="ALL LOCATIONS" />
        </div>

        <div className="relative w-[320px]">
          <SearchNormal1
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search business names or fsID"
            className="pl-9 h-9 rounded-full bg-[#F9FAFB] border-[#E5E7EB]"
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
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
            <Table>
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

          <div className="flex items-center justify-between pt-5 text-[#6B7280] text-[14px]">
            <button
              className="flex items-center gap-2 disabled:opacity-40"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              <ArrowLeft2 size={16} />
              Previous
            </button>

            <div className="flex items-center gap-4">
              <span>
                Page {page + 1} of {Math.max(totalPages, 1)}
              </span>
              <span>•</span>
              <span>{totalItems} total</span>
            </div>

            <button
              className="flex items-center gap-2 disabled:opacity-40"
              onClick={() => setPage((prev) => Math.min(prev + 1, Math.max(totalPages - 1, 0)))}
              disabled={page >= totalPages - 1}
            >
              Next
              <ArrowRight2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsSection;