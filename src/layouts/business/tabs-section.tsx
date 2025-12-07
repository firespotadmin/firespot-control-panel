import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./tabs/overview-tab";
import CashflowTab from "./tabs/cashflow-tab";
import SubscriptionsTab from "./tabs/subscriptions-tab";
import KYBTab from "./tabs/kyb-tab";

const TabsSection = () => {
  return (
    <div className="w-full pt-7">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-8">
          <TabsTrigger
            value="overview"
            className="relative bg-transparent cursor-pointer rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 font-[500] text-[14px] text-[#00000080] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#000] data-[state=active]:border-black transition-all"
          >
            Overview
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
  );
};

export default TabsSection;
