import TopHeader from "@/layouts/business/top-header";
import Header from "../../layouts/dashboard/header";
import SideBar from "../../layouts/dashboard/sideBar";
import BusinessCount from "@/layouts/business/business-count";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/layouts/business/tabs/overview-tab";
import CashflowTab from "@/layouts/business/tabs/cashflow-tab";
import SubscriptionsTab from "@/layouts/business/tabs/subscriptions-tab";
import KYBTab from "@/layouts/business/tabs/kyb-tab";

const ActivityTab = () => {
  return (
    <div className="py-6">
      <h2 className="text-[20px] font-[700] mb-4">Activity</h2>
      <p className="text-[14px] text-[#00000080]">
        Activity content will be displayed here.
      </p>
    </div>
  );
};

const Businesses = () => {
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

          <div className="pt-7">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-8">
                <TabsTrigger
                  value="overview"
                  className="relative bg-transparent cursor-pointer rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 font-[500] text-[14px] text-[#00000080] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#000] data-[state=active]:border-black transition-all"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="relative bg-transparent cursor-pointer rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 font-[500] text-[14px] text-[#00000080] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#000] data-[state=active]:border-black transition-all"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="cashflow"
                  className="relative bg-transparent cursor-pointer rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 font-[500] text-[14px] text-[#00000080] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#000] data-[state=active]:border-black transition-all"
                >
                  Cashflow
                </TabsTrigger>
                <TabsTrigger
                  value="subscriptions"
                  className="relative bg-transparent cursor-pointer rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 font-[500] text-[14px] text-[#00000080] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#000] data-[state=active]:border-black transition-all"
                >
                  Subscriptions
                </TabsTrigger>
                <TabsTrigger
                  value="kyb"
                  className="relative bg-transparent cursor-pointer rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 font-[500] text-[14px] text-[#00000080] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#000] data-[state=active]:border-black transition-all"
                >
                  KYB
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <ActivityTab />
              </TabsContent>

              <TabsContent value="cashflow" className="mt-0">
                <CashflowTab />
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-0">
                <SubscriptionsTab />
              </TabsContent>

              <TabsContent value="kyb" className="mt-0">
                <KYBTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Businesses;
