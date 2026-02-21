import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutTab from "./tabs/about-tab";
import TransactionsTab from "./tabs/transactions-tab";
import FeedbackTab from "@/layouts/business/tabs/feedback-tab";
import KYBTab from "./tabs/kyb-tab";
import ProductsTab from "@/layouts/business/tabs/products-tab";
import ChargesAndTaxesTab from "@/layouts/business/tabs/charges-taxes-tab";
import LocationsTab from "./tabs/locations-tab";
import QRKitsTab from "./tabs/qr-kits-tab";
import SubscriptionsTab from "./tabs/subscriptions-tab";
import type { Business } from "@/types/business";

const TabsSection = ({
  businessId,
  business,
}: {
  businessId?: string;
  business?: Business | null;
}) => {
  const tabTriggerClass =
    "relative bg-transparent cursor-pointer rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 font-[500] text-[14px] text-[#00000080] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#000] data-[state=active]:border-black transition-all";

  return (
    <div className="w-full pt-7">
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-8 overflow-x-auto">
          <TabsTrigger value="about" className={tabTriggerClass}>
            About
          </TabsTrigger>
          <TabsTrigger value="transactions" className={tabTriggerClass}>
            Transactions
          </TabsTrigger>
          <TabsTrigger value="feedback" className={tabTriggerClass}>
            Feedback
          </TabsTrigger>
          <TabsTrigger value="kyb" className={tabTriggerClass}>
            KYB
          </TabsTrigger>
          <TabsTrigger value="products" className={tabTriggerClass}>
            Products
          </TabsTrigger>
          <TabsTrigger value="charges" className={tabTriggerClass}>
            Charges & Taxes
          </TabsTrigger>
          <TabsTrigger value="locations" className={tabTriggerClass}>
            Locations
          </TabsTrigger>
          <TabsTrigger value="qrkits" className={tabTriggerClass}>
            QR Kits
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className={tabTriggerClass}>
            Subscriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-0">
          <AboutTab business={business} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <TransactionsTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <FeedbackTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="kyb" className="mt-0">
          <KYBTab />
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <ProductsTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="charges" className="mt-0">
          <ChargesAndTaxesTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="locations" className="mt-0">
          <LocationsTab business={business} />
        </TabsContent>

        <TabsContent value="qrkits" className="mt-0">
          <QRKitsTab businessId={businessId} />
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-0">
          <SubscriptionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsSection;
