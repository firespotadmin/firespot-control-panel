import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import { Button } from "@/components/ui/button";
import FilterSearchInput from "@/components/common/filters/filter-search-input";
import { getBusinessPayLink, getBusinessQrImageUrl } from "@/lib/qr-kit";
import { getBusiness } from "@/services/stats-service.service";
import type { Business } from "@/types/business";
import { ArrowLeft, ArrowRight, Copy, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const PAGE_SIZE = 9;

function formatAddress(business: Business) {
  const city = business.businessMainAddress?.city?.trim();
  const state = business.businessMainAddress?.state?.trim();
  const parts = [city, state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No location";
}

function getBusinessImage(business: Business) {
  return business.businessImageUrl || "/main-logo.png";
}

export default function QrKitsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBusiness({
          search: search || undefined,
          page,
          size: PAGE_SIZE,
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
        const list = (listCandidates.find((candidate) => Array.isArray(candidate)) ||
          []) as Business[];

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
      } catch (err: any) {
        setBusinesses([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load QR kits.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [page, search]);

  const pageItems = useMemo(() => {
    const total = Math.max(totalPages, 1);
    const current = page + 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, "...", total - 2, total - 1, total];
    if (current >= total - 3) return [1, 2, "...", total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  }, [page, totalPages]);

  const handleSearch = (value: string) => {
    setPage(0);
    setSearchInput(value);
    setSearch(value.trim());
  };

  const handleCopyLink = async (businessId: string) => {
    try {
      await navigator.clipboard.writeText(getBusinessPayLink(businessId));
      toast.success("QR payment link copied.");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">
                QR Kits
              </h1>
              <p className="text-[13px] text-[#6B7280] mt-1">
                Generate payment QR kits from business IDs using the Firespot pay link.
              </p>
            </div>

            <FilterSearchInput
              value={searchInput}
              onChange={handleSearch}
              placeholder="Search business names or fsID"
              className="w-[320px]"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[18px] border border-[#ECEEF1] h-[420px] animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-[18px] border border-[#ECEEF1] p-8 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="bg-white rounded-[18px] border border-[#ECEEF1] p-10 text-center">
              <p className="text-[16px] font-[600] text-[#111827]">No QR kits yet</p>
              <p className="mt-2 text-[13px] text-[#6B7280]">
                {search.trim()
                  ? "No businesses match your search."
                  : "Businesses will appear here as QR kit cards."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {businesses.map((business) => {
                  const businessId = business.id || "";
                  const payLink = businessId ? getBusinessPayLink(businessId) : "";
                  const qrImageUrl = businessId ? getBusinessQrImageUrl(businessId) : "";

                  return (
                    <div
                      key={business.id || business.firespotId}
                      className="bg-white rounded-[18px] border border-[#ECEEF1] p-5 flex flex-col"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getBusinessImage(business)}
                          alt={business.businessName}
                          className="w-[44px] h-[44px] rounded-full object-cover border border-[#ECEEF1]"
                          onError={(event) => {
                            (event.target as HTMLImageElement).src = "/main-logo.png";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-[15px] font-[700] text-[#111827] truncate">
                            {business.businessName || "Unnamed business"}
                          </p>
                          <p className="text-[12px] text-[#6B7280] truncate">
                            {formatAddress(business)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex justify-center">
                        <div className="rounded-[26px] bg-gradient-to-r from-[#FF5C33] to-[#D946EF] p-[3px]">
                          <div className="relative rounded-[23px] bg-white p-4">
                            {qrImageUrl ? (
                              <>
                                <img
                                  src={qrImageUrl}
                                  alt={`${business.businessName} QR code`}
                                  className="w-[240px] h-[240px] object-contain"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-[52px] h-[52px] rounded-full bg-white p-1.5 shadow-sm overflow-hidden">
                                    <img
                                      src={getBusinessImage(business)}
                                      alt={business.businessName}
                                      className="w-full h-full object-cover"
                                      onError={(event) => {
                                        (event.target as HTMLImageElement).src = "/main-logo.png";
                                      }}
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="w-[240px] h-[240px] flex items-center justify-center text-[13px] text-[#6B7280]">
                                No business ID
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1">
                        <p className="text-[11px] font-[700] uppercase tracking-[1px] text-[#9CA3AF]">
                          Business ID
                        </p>
                        <p className="text-[12px] text-[#111827] break-all">
                          {businessId || "Not available"}
                        </p>
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-[11px] font-[700] uppercase tracking-[1px] text-[#9CA3AF]">
                          Payment link
                        </p>
                        <p className="text-[12px] text-[#6B7280] break-all line-clamp-2">
                          {payLink || "No payment link available"}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 rounded-full border-[#E5E7EB]"
                          onClick={() => handleCopyLink(businessId)}
                          disabled={!businessId}
                        >
                          <Copy className="w-4 h-4" />
                          Copy link
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-[#E5E7EB]"
                          onClick={() => window.open(payLink, "_blank", "noopener,noreferrer")}
                          disabled={!businessId}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[13px] text-[#6B7280]">
                  Showing {totalItems === 0 ? 0 : page * PAGE_SIZE + 1}-
                  {Math.min((page + 1) * PAGE_SIZE, totalItems)} of {totalItems}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="h-8 w-8 rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  {pageItems.map((item, index) =>
                    item === "..." ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-[13px] text-[#9CA3AF]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPage((item as number) - 1)}
                        className={`h-8 min-w-[32px] px-2 rounded-full text-[12px] font-[600] border ${
                          page + 1 === item
                            ? "bg-[#111827] text-white border-[#111827]"
                            : "bg-white text-[#374151] border-[#E5E7EB]"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                    className="h-8 w-8 rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
