import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Business } from "@/types/business";
import { ArrowDown2, Call } from "iconsax-reactjs";
import { MessageCircle, Share, Heart } from "lucide-react";

const TopDetails = ({ data, isLoading }: { data: Business; isLoading?: boolean }) => {
  const vendorStats = [
    {
      icon: "🍔",
      label: "",
      value: "Fast Food",
      labelColor: "#000000",
      valueColor: "#000000",
    },
    {
      icon: "👤",
      label: "Monthly Visits",
      value: data?.numberOfVisits || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "❤️",
      label: "Faved",
      value: data?.customerIdThatLikeBusiness?.size || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "💸",
      label: "Avg Spend",
      value: data?.totalAmountReceived 
        ? `₦${(data.totalAmountReceived / Math.max(data.customerUserIdThatBoughtFromBusiness?.size || 1, 1)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
        : "₦0",
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "⭐",
      label: "Rating",
      value: (data?.averageFeedbackRating || 0).toFixed(1),
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "🕒",
      label: "Operating Hours",
      value: data?.opening_hours || "N/A",
      labelColor: "#000000",
      valueColor: "#28a745",
    },
    {
      icon: "🛍️",
      label: "Orders",
      value: data?.customerUserIdThatBoughtFromBusiness?.size || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "💬",
      label: "Feedbacks",
      value: data?.numberOfFeedbacks || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
  ];

  return (
    <div>
      <hr className="my-5" />
      <div className="">
        {isLoading ? (
          <Skeleton className="w-[96px] h-[96px] rounded-full" />
        ) : (
          <img
            src={data?.businessImageUrl}
            className="w-[96px] h-[96px] object-cover border-2 border-white rounded-full"
            alt=""
          />
        )}
        <div className="flex gap-1 items-center">
          {isLoading ? (
            <Skeleton className="h-6 w-40 mt-2" />
          ) : (
            <>
              <h1 className="text-[23px] capitalize font-[700]">
                {data.businessName}
              </h1>
              <img src="/Vector.png" className="w-5" alt="Verified" />
            </>
          )}
        </div>

        <div className="flex items-center">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <>
              <p>
                {data?.businessMainAddress?.city},{" "}
                {data?.businessMainAddress?.state}
              </p>
              <Button className="font-bold" variant={"ghost"}>
                <p>See all locations</p>
                <ArrowDown2 color="#000" size={20} />
              </Button>
            </>
          )}
        </div>

        {/* buttons and links */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Skeleton className="w-[100px] h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </>
          ) : (
            <>
              <Button className="w-fit px-[16px] py-[10px] rounded-full cursor-pointer">
                Edit
              </Button>
              <div className="bg-white shadow-md p-2 rounded-full cursor-pointer flex items-center justify-center">
                <Heart />
              </div>
              <div className="bg-white shadow-md p-2 rounded-full cursor-pointer flex items-center justify-center">
                <Call />
              </div>
              <div className="bg-white shadow-md p-2 rounded-full cursor-pointer flex items-center justify-center">
                <MessageCircle />
              </div>
              <div className="bg-white shadow-md p-2 rounded-full cursor-pointer flex items-center justify-center">
                <Share />
              </div>
            </>
          )}
        </div>

        {/* design it here */}
        {isLoading ? (
          <div className="flex gap-2 mt-4 flex-wrap">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 mt-4 flex-wrap">
            {vendorStats.map((stat, index) => (
              <div
                className="flex gap-2 border-[1.5px] border-[#0000001A] p-2 rounded-md items-center"
                key={index}
              >
                <p className="text-[13px] font-bold">{stat.icon}</p>
                <p
                  className="text-[13px] font-bold"
                  style={{ color: stat.valueColor }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: stat.labelColor }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopDetails;
