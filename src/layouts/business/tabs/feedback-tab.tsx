import FilterCompo from "@/components/common/business/filter-compo";
import { Input } from "@/components/ui/input";
import { useGetBusinessFeedbacks } from "@/hooks/stats-hook.hook";
import type { BusinessFeedbackItem } from "@/types/feedback";
import { SearchNormal1 } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const FeedbackTab = ({ businessId }: { businessId?: string }) => {
  const [feedbacksByMonth, setFeedbacksByMonth] = useState<
    Record<string, BusinessFeedbackItem[]>
  >({});
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setFeedbacksByMonth({});
      setSelectedMonth("");
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetBusinessFeedbacks({
          businessId,
          from: "2024-01-01",
          to: "2024-12-31",
          search: "",
          rating: "",
          page: 0,
          size: 10,
        });

        const payload = response?.data?.data || response?.data || response;
        const grouped = payload?.feedbacks;

        if (grouped && typeof grouped === "object" && !Array.isArray(grouped)) {
          const mapped = grouped as Record<string, BusinessFeedbackItem[]>;
          setFeedbacksByMonth(mapped);

          const months = Object.keys(mapped);
          setSelectedMonth(months[0] || "");
        } else {
          setFeedbacksByMonth({});
          setSelectedMonth("");
        }

        setAverageRating(Number(payload?.averageFeedbackRating ?? 0));
      } catch (err: any) {
        setFeedbacksByMonth({});
        setSelectedMonth("");
        setAverageRating(0);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load feedbacks",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [businessId]);

  const monthList = useMemo(
    () => Object.keys(feedbacksByMonth),
    [feedbacksByMonth],
  );
  const visibleMonths = selectedMonth ? [selectedMonth] : monthList;

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return "★".repeat(Math.max(0, rounded));
  };

  return (
    <div className="w-full py-6">
      <div className="rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterCompo data="ALL TIME" />
            <FilterCompo data="ANY RATING" />
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
            <p className="mt-2 text-gray-600">Loading feedbacks...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <div className="flex gap-6">
            <aside className="w-[180px] shrink-0 border-r border-[#E5E7EB] pr-4">
              <p className="text-[11px] text-[#9CA3AF] mb-2">Feedback</p>
              <div className="space-y-1">
                {monthList.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`w-full text-left px-3 py-2 text-[12px] rounded-md ${
                      (selectedMonth || monthList[0]) === month
                        ? "bg-[#F3F4F6] text-[#111827]"
                        : "text-[#374151]"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex-1 space-y-8">
              {monthList.length === 0 ? (
                <p className="text-gray-600">No feedback found.</p>
              ) : (
                visibleMonths.map((month) => (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-[700]">{month}</h3>
                      <p className="text-[12px] text-[#6B7280]">
                        Avg. rating: {averageRating.toFixed(2)}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      {feedbacksByMonth[month]?.map((item) => (
                        <article
                          key={item.feedBackId}
                          className="border border-[#E5E7EB] rounded-xl p-4 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.profilePictureUrl || "/main-logo.png"}
                              alt={item.customerName || "Customer"}
                              className="w-15 h-15 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-[15px] font-[700] text-[#111827]">
                                {item.customerName || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="text-[#F59E0B] text-[20px] tracking-[1px]">
                                  {renderStars(item.rating)}
                                </div>
                                <p className="text-[11px] text-[#9CA3AF]">
                                  {item.dateTime || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-[15px] font-medium text-[#374151] leading-[20px] mt-3">
                            {item.comment || "No comment"}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackTab;
