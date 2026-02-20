import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterCompo from "@/components/common/business/filter-compo";
import { Input } from "@/components/ui/input";
import { useGetBusinessTransactions } from "@/hooks/stats-hook.hook";
import type { BusinessTransaction } from "@/types/transaction";
import { Loader } from "lucide-react";
import { Copy, SearchNormal1, TickCircle, CloseCircle, Clock } from "iconsax-reactjs";
import { useEffect, useState } from "react";

const TransactionsTab = ({ businessId }: { businessId?: string }) => {
  const [transactions, setTransactions] = useState<BusinessTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetBusinessTransactions({
          businessId,
          from: "2024-01-01",
          to: "2026-12-31",
          status: "",
          location: "",
          search: "",
          page: 0,
          size: 10,
        });

        const candidates = [
          response?.data?.content,
          response?.data?.transactions,
          response?.data?.data?.content,
          response?.data?.data?.transactions,
          response?.content,
          response?.transactions,
          response?.data,
        ];

        const firstNonEmpty = candidates.find(
          (item) => Array.isArray(item) && item.length > 0
        );
        const firstArray = candidates.find((item) => Array.isArray(item));

        setTransactions((firstNonEmpty || firstArray || []) as BusinessTransaction[]);
      } catch (err: any) {
        setTransactions([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [businessId]);

  const formatCurrency = (value: number | null | undefined) => {
    const amount = Number(value ?? 0);
    if (Number.isNaN(amount)) return "NGN 0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (value: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    if (status === "SUCCESS") return <TickCircle size={18} color="#22C55E" variant="Bold" />;
    if (status === "FAILED") return <CloseCircle size={18} color="#EF4444" variant="Bold" />;
    return <Clock size={18} color="#9CA3AF" variant="Bold" />;
  };

  const getCustomerDisplayName = (transaction: BusinessTransaction) => {
    return (
      transaction.customerId ||
      transaction.customerUserId ||
      transaction.businessId ||
      "Guest"
    );
  };

  const getPaidOnDate = (transaction: BusinessTransaction) => {
    return (
      transaction.paidAt ||
      transaction.activatedAt ||
      transaction.createdAt ||
      transaction.initiatedAt ||
      null
    );
  };

  const getPaidAt = (transaction: BusinessTransaction) => {
    return transaction.storeId || "N/A";
  };

  const getDescription = (transaction: BusinessTransaction) => {
    return transaction.description || transaction.paymentMethod || "N/A";
  };

  return (
    <div className="w-full py-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterCompo data="ANY STATUS" />
            <FilterCompo data="ALL TIME" />
            <FilterCompo data="LOCATION" />
            <FilterCompo data="ALL TRANSACTIONS" />
          </div>
          <div className="relative w-[260px]">
            <SearchNormal1
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <Input
              placeholder=""
              className="pl-9 pr-3 rounded-full h-9 bg-[#F9FAFB] border-[#E5E7EB]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
            <p className="mt-2 text-gray-600">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-600">No transactions found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Amount paid</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Paid on</TableHead>
                <TableHead>Paid at</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="h-15">
                  <TableCell>
                    {getStatusIcon(transaction.transactionStatus)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {getDescription(transaction)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {getCustomerDisplayName(transaction)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(getPaidOnDate(transaction))}
                  </TableCell>
                  <TableCell className="text-sm">{getPaidAt(transaction)}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {transaction.transactionReference || transaction.id}
                  </TableCell>
                  <TableCell>
                    <Copy size={16} color="#9CA3AF" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TransactionsTab;
