import FilterCompo from "@/components/common/business/filter-compo";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Add, Copy } from "iconsax-reactjs";
import { getBusiness } from "@/services/stats-service.service";
import { useEffect, useState } from "react";
import type { Business } from "@/types/business";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const OverviewTab = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBusiness({});

        if (response?.success) {
          const businessData = response?.data || [];
          setBusinesses(Array.isArray(businessData) ? businessData : []);
        } else {
          setBusinesses([]);
          if (response?.message) {
            setError(response.message);
          }
        }
      } catch (err: any) {
        console.error("Error fetching businesses:", err);
        setBusinesses([]);
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
  }, []);

  return (
    <div className="">
      <div className="flex pt-3 gap-2">
        <FilterCompo data={"ALL TIME"} />
        <FilterCompo data={"ALL STATUS"} />
        <FilterCompo data={"ALL INDUSTRIES"} />
        <FilterCompo data={"ALL LOCATIONS"} />
      </div>

      <div
        className={`${
          businesses.length > 0 ? "border-[1px] border-gray-200" : "mt-30"
        } mt-5 rounded-2xl`}
      >
        {loading ? (
          <div className="p-8 text-center">
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
          <NotFound />
        ) : (
          <DataTable data={businesses} />
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
            className="cursor-pointer bg-white"
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
            <TableCell>
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
            <TableCell>
              <div className="flex items-center gap-5">
                {business?.firespotId || "N/A"}
                {business?.firespotId && <Copy size={20} />}
              </div>
            </TableCell>
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
