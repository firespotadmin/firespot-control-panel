import TopHeader from "@/layouts/products/top-header";
import Header from "../../layouts/dashboard/header";
import SideBar from "../../layouts/dashboard/sideBar";
import BusinessCount from "@/layouts/business/business-count";
import TabsSection from "@/layouts/business/tabs-section";

const Products = () => {
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
          <TopHeader />
          <BusinessCount />
          <TabsSection />
        </div>
      </div>
    </div>
  );
};

export default Products;
