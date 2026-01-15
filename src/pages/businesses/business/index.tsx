import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import { getStatsBusinessById } from "@/services/stats-service.service";
import type { Business } from "@/types/business";
import { ArrowRight2 } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BusinessView = () => {
  const { id } = useParams<{ id: string }>();

  const [business, setBusiness] = useState<Business>(null!);

  const fetchBusinessById = async (id: string) => {
    const response = await getStatsBusinessById({ id });
    setBusiness(response?.data || null);
    // return response;
  };

  useEffect(() => {
    if (id) {
      fetchBusinessById(id);
    }
  }, []);

  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (scrollable) */}
        <SideBar />

        {/* Main Section (scrollable) */}
        <div className="flex-1 gap-[24px] p-6 overflow-y-auto flex-col bg-[#F4F6F8]">
          <div className="flex items-center gap-5">
            <p>All Business</p>
            <ArrowRight2 size={15} />
            <p>{business?.businessName || "N/A"}</p>
          </div>
          {/* <TabsSection /> */}
        </div>
      </div>
    </div>
  );
};

export default BusinessView;
