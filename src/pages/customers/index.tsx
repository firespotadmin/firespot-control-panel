import TopHeader from "@/layouts/customers/top-header";
import Header from "../../layouts/dashboard/header";
import SideBar from "../../layouts/dashboard/sideBar";
import BusinessCount from "@/layouts/customers/business-count";
import TabsSection from "@/layouts/customers/tabs-section";

const Customers = () => {
  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (scrollable) */}
        <SideBar />

        {/* Main Section (scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <TopHeader />
          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
            <BusinessCount />
          </div>
          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
            <TabsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
