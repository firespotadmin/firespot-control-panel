import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft2, ArrowRight2, Copy, SearchNormal1 } from "iconsax-reactjs";
import CustomerFilterChip from "@/components/common/customers/filter-chip";
import NoCustomersState from "./no-customers-state";
import { useGetCustomers } from "@/hooks/stats-hook.hook";
import type { CustomerRecord } from "@/types/customer";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

type CustomerTableRow = {
  id: string;
  customerName: string;
  logo: string;
  email: string;
  phone: string;
  status: string;
  roles: string;
  joinedOn: string;
  businessId: string;
  storeId: string;
};

const TabsSection = () => {
  const PAGE_SIZE = 10;
  const [customers, setCustomers] = useState<CustomerTableRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetCustomers({
          search,
          page,
          size: PAGE_SIZE,
        });

        const payload = response;
        const nestedData = payload?.data;
        const listCandidates = [
          nestedData,
          nestedData?.content,
          nestedData?.data,
          payload?.content,
          payload?.data,
          payload,
        ];
        const data =
          ((listCandidates.find((candidate) => Array.isArray(candidate)) ||
            []) as CustomerRecord[]);

        const mapped = data.map((item) => {
          const fullName =
            `${item.firstName || ""} ${item.lastName || ""}`.trim() || "Anonymous";

          const phone = item.phoneNumber
            ? `${item.phoneNumber.countryCode || ""}${item.phoneNumber.number || ""}`
            : "N/A";

          return {
            id: item.id,
            customerName: fullName,
            logo: item.profilePictureUrl || "/main-logo.png",
            email: item.emailAddress || "N/A",
            phone,
            status: item.accountStatus || "N/A",
            roles: Array.isArray(item.role) ? item.role.join(", ") : "N/A",
            joinedOn: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
            businessId: item.businessId || "N/A",
            storeId: item.storeId || "N/A",
          };
        });

        const backendTotalPages =
          nestedData?.totalPages ||
          nestedData?.numberOfPages ||
          payload?.totalPages ||
          payload?.numberOfPages;

        const backendTotalItems =
          nestedData?.totalElements ||
          nestedData?.numberOfItems ||
          payload?.totalElements ||
          payload?.numberOfItems;

        const hasBackendPagination =
          typeof backendTotalPages === "number" ||
          typeof backendTotalItems === "number";

        if (hasBackendPagination) {
          setCustomers(mapped);
          setTotalPages(backendTotalPages || 1);
        } else {
          const calculatedTotalItems = mapped.length;
          const calculatedTotalPages = Math.max(
            1,
            Math.ceil(calculatedTotalItems / PAGE_SIZE),
          );
          const start = page * PAGE_SIZE;

          setCustomers(mapped.slice(start, start + PAGE_SIZE));
          setTotalPages(calculatedTotalPages);
        }
      } catch (err: any) {
        setCustomers([]);
        setTotalPages(1);
        setError(
          err?.response?.data?.message || err?.message || "Failed to fetch customers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [search, page]);

  useEffect(() => {
    setPage(0);
  }, [search]);

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
    <div className="w-full pt-7">
      <div className="pt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <CustomerFilterChip label="ALL TIME" />
          <CustomerFilterChip label="ANY STATUS" />
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search business names or FSiD"
            className="pl-9 h-9 rounded-full bg-[#F9FAFB] border-[#E5E7EB]"
          />
        </div>
      </div>

      <div
        className={`${
          customers.length > 0 ? "border-[1px] border-gray-200" : "mt-4"
        } mt-4 rounded-2xl bg-white overflow-hidden`}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
            <p className="mt-2 text-gray-600">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : customers.length === 0 ? (
          <NoCustomersState />
        ) : (
          <>
            <Table className="[&_th]:h-[52px] [&_th]:px-4 [&_td]:px-4 [&_td]:py-3">
              <TableHeader>
                <TableRow className="">
                  <TableHead className="h-[52px]"></TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined on</TableHead>
                  <TableHead>Business ID</TableHead>
                  <TableHead>Store ID</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((item) => (
                  <TableRow key={item.id} className="bg-white font-medium">
                    <TableCell>
                      <img src="/verified.png" alt="verified" className="px-2" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.logo}
                          alt={item.customerName}
                          className="w-[36px] h-[36px] rounded-full object-cover"
                        />
                        <span className="text-[14px] capitalize">{item.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.roles}</TableCell>
                    <TableCell>{item.joinedOn}</TableCell>
                    <TableCell>{item.businessId}</TableCell>
                    <TableCell>{item.storeId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Copy size={16} color="#9CA3AF" className="shrink-0" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 bg-white rounded-b-2xl text-[14px] text-[#6B7280]">
              <button
                type="button"
                className="flex items-center gap-2 disabled:opacity-40"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                <ArrowLeft2 size={16} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {pageItems.map((item, index) => {
                  if (item === "...") {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-[#9CA3AF]">
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
                      className={`h-8 w-8 rounded-full text-[13px] transition-colors ${
                        isActive
                          ? "bg-[#E5E7EB] text-[#111827] font-[600]"
                          : "text-[#6B7280] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="flex items-center gap-2 disabled:opacity-40"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, Math.max(totalPages - 1, 0)))
                }
                disabled={page >= totalPages - 1}
              >
                Next
                <ArrowRight2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TabsSection;
