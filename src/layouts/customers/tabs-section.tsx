import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, SearchNormal1 } from "iconsax-reactjs";
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
  const [customers, setCustomers] = useState<CustomerTableRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetCustomers({
          from: "2024-01-01",
          to: "2024-12-31",
          status: "",
          search,
          page: 0,
          size: 10,
        });

        const payload = response?.data?.data || response?.data || response;
        const data = (Array.isArray(payload) ? payload : []) as CustomerRecord[];

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

        setCustomers(mapped);
      } catch (err: any) {
        setCustomers([]);
        setError(
          err?.response?.data?.message || err?.message || "Failed to fetch customers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [search]);

  return (
    <div className="w-full pt-7">
      <div className="w-full border-b border-gray-200 pb-3">
        <div className="flex items-center gap-8 text-[14px]">
          <button className="border-b-2 border-black pb-2 font-[500]">Overview</button>
          <button className="text-[#00000080] pb-2">Cashflow</button>
          <button className="text-[#00000080] pb-2">KYC</button>
        </div>
      </div>

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

      <div className="mt-4 bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
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
                <TableRow key={item.id}>
                  <TableCell>
                    <img src="/verified.png" alt="verified" className="w-4 h-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.logo}
                        alt={item.customerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-[14px]">{item.customerName}</span>
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

export default TabsSection;
