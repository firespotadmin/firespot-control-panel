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
import type {
  BusinessTransaction,
  BusinessTransactionStore,
} from "@/types/transaction";
import { Loader } from "lucide-react";
import {
  Copy,
  SearchNormal1,
  TickCircle,
  CloseCircle,
  Clock,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";

type TransactionCustomer = {
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePictureUrl?: string;
};

type TransactionRow = {
  transaction: BusinessTransaction;
  store: BusinessTransactionStore | null;
  customer: TransactionCustomer | null;
};

const TransactionsTab = ({ businessId }: { businessId?: string }) => {
  const PAGE_SIZE = 10;
  const today = new Date().toISOString().split("T")[0];
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [copiedReference, setCopiedReference] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setTransactions([]);
      setPage(0);
      setTotalPages(1);
      setTotalItems(0);
      return;
    }

    setPage(0);
  }, [businessId]);

  useEffect(() => {
    if (!businessId) {
      setTransactions([]);
      setPage(0);
      setTotalPages(1);
      setTotalItems(0);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetBusinessTransactions({
          businessId,
          from: "2024-01-01",
          to: today,
          status: "",
          location: "",
          search,
          page,
          size: PAGE_SIZE,
        });

        console.log(response,"SJSJS")
        const payload = response?.data;
        const nestedData = payload?.data;
        const candidates = [
          nestedData?.content,
          nestedData?.transactions,
          payload?.content,
          payload?.transactions,
          nestedData,
        ];

        const firstArray = candidates.find((item) => Array.isArray(item));
        const normalizedRows = ((firstArray || []) as any[]).map((item) => {
          if (item?.transaction) {
            return {
              transaction: item.transaction as BusinessTransaction,
              customer: (item.customer || null) as TransactionCustomer | null,
              store: item.store as BusinessTransactionStore,
            };
          }

          return {
            transaction: item as BusinessTransaction,
            customer: null,
            store: item.store as BusinessTransactionStore,
          };
        });

        setTransactions(normalizedRows);
        setTotalPages(nestedData?.totalPages || payload?.totalPages || 1);
        setTotalItems(
          nestedData?.totalElements ||
            payload?.totalElements ||
            normalizedRows.length,
        );
      } catch (err: any) {
        setTransactions([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load transactions",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [businessId, today, page, search]);

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

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const meridiem = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    return `${month}/${day}/${year} . ${hour12}:${minutes}${meridiem}`;
  };

  const getStatusIcon = (status: string) => {
    if (status === "SUCCESS")
      return <TickCircle size={18} color="#22C55E" variant="Bold" />;
    if (status === "FAILED")
      return <CloseCircle size={18} color="#EF4444" variant="Bold" />;
    return <Clock size={18} color="#9CA3AF" variant="Bold" />;
  };

  const getCustomerDisplayName = (
    transaction: BusinessTransaction,
    customer: TransactionCustomer | null,
  ) => {
    const fullName =
      `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();

    return (
      fullName ||
      customer?.email ||
      transaction.customerId ||
      transaction.customerUserId ||
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

  const shortenReference = (reference: string) => {
    const MAX_LENGTH = 18;

    if (!reference || reference.length <= MAX_LENGTH) {
      return reference;
    }

    return `${reference.slice(0, MAX_LENGTH)}...`;
  };

  const handleCopyReference = async (reference: string) => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopiedReference(reference);

      setTimeout(() => {
        setCopiedReference((current) =>
          current === reference ? null : current,
        );
      }, 1500);
    } catch {
      setError("Unable to copy reference");
    }
  };

  return (
    <div className="w-full py-6">
      <div className="">
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
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search transactions"
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
          <div className="rounded-lg py-4 shadow-sm">
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
              <TableBody className="bg-white">
                {transactions.map((row) => (
                  <TableRow key={row.transaction.id} className="h-15">
                    <TableCell className="align-middle">
                      <div className="flex items-center justify-center">
                        {getStatusIcon(row.transaction.transactionStatus)}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(row.transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {row.transaction.description || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        <p>
                          {getCustomerDisplayName(
                            row.transaction,
                            row.customer,
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(getPaidOnDate(row.transaction))}
                    </TableCell>
                    <TableCell className="text-sm">
                      {row?.store?.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <span
                        className="inline-block w-[185px] truncate align-middle"
                        title={
                          row.transaction.transactionReference ||
                          row.transaction.id
                        }
                      >
                        {shortenReference(
                          row.transaction.transactionReference ||
                            row.transaction.id,
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="align-middle">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyReference(
                            row.transaction.transactionReference ||
                              row.transaction.id,
                          )
                        }
                        className="flex items-center justify-center cursor-pointer"
                        aria-label="Copy transaction reference"
                      >
                        {copiedReference ===
                        (row.transaction.transactionReference ||
                          row.transaction.id) ? (
                          <TickCircle
                            size={16}
                            color="#22C55E"
                            variant="Bold"
                          />
                        ) : (
                          <Copy size={16} color="#9CA3AF" />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex px-5 items-center justify-between pt-4 text-[#6B7280] text-[14px]">
              <button
                className="disabled:opacity-40"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
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
                className="disabled:opacity-40"
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, Math.max(totalPages - 1, 0)),
                  )
                }
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTab;
