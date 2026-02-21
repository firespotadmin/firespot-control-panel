import FilterCompo from "@/components/common/business/filter-compo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Add, Copy, SearchNormal1 } from "iconsax-reactjs";
import { getBusiness } from "@/services/stats-service.service";
import { useEffect, useState } from "react";
import type { Business } from "@/types/business";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const OverviewTab = () => {
  const ITEMS_PER_PAGE = 10;
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBusiness({
          search,
          page,
          size: ITEMS_PER_PAGE,
        });

        if (response?.message === "No businesses") {
          setBusinesses([]);
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
          payload?.data,
        ];
        const list = (listCandidates.find((candidate) =>
          Array.isArray(candidate),
        ) || []) as Business[];

        if (response?.success || Array.isArray(list)) {
          setBusinesses(list);
          setTotalPages(
            nestedData?.numberOfPages ||
              nestedData?.data?.totalPages ||
              payload?.numberOfPages ||
              payload?.totalPages ||
              1,
          );
          setTotalItems(
            nestedData?.numberOfItems ||
              nestedData?.data?.totalElements ||
              payload?.numberOfItems ||
              payload?.totalElements ||
              list.length,
          );
        } else {
          setBusinesses([]);
          setTotalPages(1);
          setTotalItems(0);
          if (response?.message) {
            setError(response.message);
          }
        }
      } catch (err: any) {
        console.error("Error fetching businesses:", err);
        setBusinesses([]);
        setTotalPages(1);
        setTotalItems(0);
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
  }, [page, search]);

  const startIndex = totalItems === 0 ? 0 : page * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min((page + 1) * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="">
      <div className="flex pt-3 gap-2">
        <FilterCompo data={"ALL TIME"} />
        <FilterCompo data={"ALL STATUS"} />
        <FilterCompo data={"ALL INDUSTRIES"} />
        <FilterCompo data={"ALL LOCATIONS"} />

        <div className="relative ml-auto w-[320px]">
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
            placeholder="Search business names or FSiD"
            className="pl-9 h-9 rounded-full bg-[#F9FAFB] border-[#E5E7EB]"
          />
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
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-white rounded-b-2xl">
              <p className="text-[12px] text-[#6B7280]">
                Showing {startIndex} - {endIndex} of {totalItems}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 px-3 text-[12px]"
                  disabled={page === 0}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>
                <p className="text-[12px] text-[#6B7280]">
                  Page {page + 1} of {Math.max(totalPages, 1)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 px-3 text-[12px]"
                  disabled={page >= totalPages - 1}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, Math.max(totalPages - 1, 0)),
                    )
                  }
                >
                  Next
                </Button>
              </div>
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
