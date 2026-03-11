import { Button } from "@/components/ui/button";
import FilterPillSearchInput from "@/components/common/filters/filter-search-input";
import FilterPillSelect from "@/components/common/filters/filter-pill-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Add, ArrowLeft2, ArrowRight2, Copy } from "iconsax-reactjs";
import { getBusiness } from "@/services/stats-service.service";
import { useEffect, useMemo, useState } from "react";
import type { Business } from "@/types/business";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

function toDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const OverviewTab = () => {
  const ITEMS_PER_PAGE = 10;
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allLoadedBusinesses, setAllLoadedBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [timeFilter, setTimeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(0);
  }, [search, timeFilter, statusFilter, industryFilter, locationFilter]);

  const industryOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        allLoadedBusinesses
          .map((business) => business.industry?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort();

    return [{ label: "All industries", value: "" }, ...values.map((value) => ({ label: value, value }))];
  }, [allLoadedBusinesses]);

  const locationOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        allLoadedBusinesses
          .map((business) => {
            const city = business.businessMainAddress?.city?.trim();
            const state = business.businessMainAddress?.state?.trim();
            return [city, state].filter(Boolean).join(", ");
          })
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort();

    return [{ label: "All locations", value: "" }, ...values.map((value) => ({ label: value, value }))];
  }, [allLoadedBusinesses]);

  const statusOptions = [
    { label: "All status", value: "" },
    { label: "Verified", value: "VERIFIED" },
    { label: "Unverified", value: "UNVERIFIED" },
  ];
  const timeOptions = [
    { label: "All time", value: "" },
    { label: "Today", value: "TODAY" },
    { label: "Last 7 days", value: "LAST_7_DAYS" },
    { label: "Last 30 days", value: "LAST_30_DAYS" },
    { label: "This month", value: "THIS_MONTH" },
  ];

  const range = useMemo(() => {
    if (!timeFilter) {
      return { from: undefined as string | undefined, to: undefined as string | undefined };
    }

    const today = new Date();
    const end = toDateOnly(today);

    if (timeFilter === "TODAY") {
      return { from: end, to: end };
    }

    if (timeFilter === "LAST_7_DAYS") {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      return { from: toDateOnly(start), to: end };
    }

    if (timeFilter === "LAST_30_DAYS") {
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      return { from: toDateOnly(start), to: end };
    }

    if (timeFilter === "THIS_MONTH") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toDateOnly(start), to: end };
    }

    return { from: undefined, to: undefined };
  }, [timeFilter]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        const useClientFilterPagination = Boolean(industryFilter || locationFilter);
        const response = await getBusiness({
          from: range.from,
          to: range.to,
          status: statusFilter || undefined,
          search,
          page: useClientFilterPagination ? 0 : page,
          size: useClientFilterPagination ? 500 : ITEMS_PER_PAGE,
        });

        if (response?.message === "No businesses") {
          setBusinesses([]);
          setAllLoadedBusinesses([]);
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
          payload?.data,
        ];
        const list = (listCandidates.find((candidate) =>
          Array.isArray(candidate),
        ) || []) as Business[];

        if (response?.success || Array.isArray(list)) {
          setAllLoadedBusinesses(list);

          const clientFiltered = list.filter((business) => {
            const industryMatches =
              !industryFilter || (business.industry || "").trim() === industryFilter;
            const businessLocation = [
              business.businessMainAddress?.city?.trim(),
              business.businessMainAddress?.state?.trim(),
            ]
              .filter(Boolean)
              .join(", ");
            const locationMatches =
              !locationFilter || businessLocation === locationFilter;
            return industryMatches && locationMatches;
          });

          if (useClientFilterPagination) {
            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            setBusinesses(clientFiltered.slice(start, end));
            setTotalPages(Math.max(1, Math.ceil(clientFiltered.length / ITEMS_PER_PAGE)));
          } else {
            setBusinesses(clientFiltered);
            setTotalPages(
              nestedData?.numberOfPages ||
                nestedData?.data?.totalPages ||
                payload?.numberOfPages ||
                payload?.totalPages ||
                1,
            );
          }
        } else {
          setBusinesses([]);
          setAllLoadedBusinesses([]);
          setTotalPages(1);
          if (response?.message) {
            setError(response.message);
          }
        }
      } catch (err: any) {
        console.error("Error fetching businesses:", err);
        setBusinesses([]);
        setAllLoadedBusinesses([]);
        setTotalPages(1);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load businesses. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [page, search, range.from, range.to, statusFilter, industryFilter, locationFilter]);

  const pageItems = useMemo(() => {
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
  }, [page, totalPages]);

  const handleClearFilters = () => {
    setTimeFilter("");
    setStatusFilter("");
    setIndustryFilter("");
    setLocationFilter("");
    setSearch("");
    setSearchInput("");
    setPage(0);
  };

  return (
    <div className="">
      <div className="flex pt-3 gap-2 flex-wrap items-center">
        <FilterPillSelect
          value={timeFilter}
          onChange={setTimeFilter}
          options={timeOptions}
          className="min-w-[110px]"
        />
        <FilterPillSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          className="min-w-[120px]"
        />
        <FilterPillSelect
          value={industryFilter}
          onChange={setIndustryFilter}
          options={industryOptions}
          className="min-w-[140px]"
        />
        <FilterPillSelect
          value={locationFilter}
          onChange={setLocationFilter}
          options={locationOptions}
          className="min-w-[140px]"
        />

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <FilterPillSearchInput
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value);
              setSearch(value);
            }}
            placeholder="Search business names or fsID"
            className="w-[320px]"
          />
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full border-[#E5E7EB]"
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      <div
        className={`${
          businesses.length > 0 ? "border-[1px] border-gray-200" : "mt-30"
        } mt-5 rounded-2xl`}
      >
        {loading ? (
          <div className="py-8 text-center">
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
            <p className="mt-2 text-gray-600">Loading businesses...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : businesses.length === 0 ? (
          search.trim() ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No businesses match your search.</p>
            </div>
          ) : (
            <NotFound />
          )
        ) : (
          <>
            <DataTable data={businesses} />
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

const DataTable = ({ data }: { data: Business[] }) => {
  const renderVerificationIcon = (verified: boolean | null | undefined) => {
    if (verified) {
      return <img src="/verified.png" alt="Verified" className="px-2" />;
    }

    if (verified === false) {
      return (
        <img src="/not-verified.png" alt="Not Verified" className="px-2" />
      );
    }

    return <img src="/cancel.png" alt="Cancelled" className="px-2" />;
  };

  const formatRating = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined || isNaN(rating)) {
      return "N/A";
    }
    return rating.toFixed(1);
  };

  const formatAddress = (address: any) => {
    if (!address) return "N/A";
    const city = address.city || "";
    const state = address.state || "";
    const parts = [city, state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const getBusinessImage = (business: Business) => {
    return business?.businessImageUrl || "/main-logo.png";
  };
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead className="h-[52px]"></TableHead>
          <TableHead></TableHead>
          <TableHead>Business Name</TableHead>
          <TableHead>Main Location</TableHead>
          <TableHead>Branches</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Joined on</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>FSiD</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((business: Business) => (
          <TableRow
            className="cursor-pointer bg-white font-medium"
            onClick={() => {
              navigate(`/business/${business.id}`);
            }}
            key={business?.id || business?.firespotId || Math.random()}
          >
            <TableCell>{renderVerificationIcon(business?.verified)}</TableCell>
            <TableCell>
              <img
                src={getBusinessImage(business)}
                className="w-[36px] h-[36px] rounded-full object-cover"
                alt="Business Logo"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/main-logo.png";
                }}
              />
            </TableCell>
            <TableCell className="capitalize">
              {business?.businessName || "N/A"}
            </TableCell>
            <TableCell>
              {formatAddress(business?.businessMainAddress)}
            </TableCell>
            <TableCell className="px-10">
              {business?.numberOfBranches
                ? parseInt(business.numberOfBranches) || 0
                : 0}
            </TableCell>
            <TableCell>{business?.numberOfFeedbacks || 0}</TableCell>
            <TableCell>{formatDate(business?.createdAt)}</TableCell>
            <TableCell>
              <div className="flex">
                <div className="flex items-center gap-[4px] bg-[#F9FAFB] p-2 rounded-2xl px-[12px] cursor-pointer">
                  <p className="font-[500]">
                    {formatRating(business?.averageFeedbackRating)}
                  </p>
                  {business?.averageFeedbackRating !== null &&
                    business?.averageFeedbackRating !== undefined && (
                      <img src="/star.png" alt="Rating" />
                    )}
                </div>
              </div>
            </TableCell>
            <TableCell>{business?.industry || "N/A"}</TableCell>
            <TableCell className="uppercase">
              <div className="flex items-center gap-3">
                <span
                  className="w-[120px] truncate font-mono"
                  title={business?.firespotId?.substring(5) || "Not Available"}
                >
                  {business?.firespotId?.substring(5) || "Not Available"}
                </span>
                {business?.firespotId && (
                  <Copy size={20} className="shrink-0" />
                )}
              </div>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const NotFound = () => {
  return (
    <div className="">
      <div className="flex justify-center">
        <img src="/business.png" alt="" />
      </div>
      <div className="flex justify-center">
        <div className="w-[50%] text-center">
          <h1 className="font-[700] text-[20px]">No businesses yet</h1>
          <p className="text-[14px]">
            You would see all businesses here when they start collecting
            payments with Firespot.
          </p>
          <div className="flex justify-center pt-4">
            <Button className="flex bg-[#E5E7EB] text-[#000] text-[10px] hover:bg-[#D1D5DB] font-[700] cursor-pointer p-[10px] gap-3 uppercase rounded-full">
              <Add size={40} color="#000" />
              ADD BUSINESS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
