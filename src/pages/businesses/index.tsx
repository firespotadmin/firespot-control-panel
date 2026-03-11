import TopHeader from "@/layouts/business/top-header";
import Header from "../../layouts/dashboard/header";
import SideBar from "../../layouts/dashboard/sideBar";
import BusinessCount from "@/layouts/business/business-count";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/layouts/business/tabs/overview-tab";
import CashflowTab from "@/layouts/business/tabs/cashflow-tab";
import SubscriptionsTab from "@/layouts/business/tabs/subscriptions-tab";
import KYBTab from "@/layouts/business/tabs/kyb-tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { businessSignup } from "@/services/auth-service.service";
import type { BusinessSignupPayload } from "@/types/auth";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerCountryCode, setOwnerCountryCode] = useState("+234");
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportCountryCode, setSupportCountryCode] = useState("+234");
  const [supportPhoneNumber, setSupportPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [businessImageUrl, setBusinessImageUrl] = useState("");

  const resetForm = () => {
    setBusinessName("");
    setOwnerFirstName("");
    setOwnerLastName("");
    setOwnerCountryCode("+234");
    setOwnerPhoneNumber("");
    setSupportEmail("");
    setSupportCountryCode("+234");
    setSupportPhoneNumber("");
    setEmailAddress("");
    setPassword("");
    setBusinessImageUrl("");
  };

  const handleCreateBusiness = async () => {
    if (
      !businessName ||
      !ownerFirstName ||
      !ownerLastName ||
      !ownerPhoneNumber ||
      !supportEmail ||
      !supportPhoneNumber ||
      !emailAddress ||
      !password
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload: BusinessSignupPayload = {
        businessName,
        contactInformation: {
          firstName: ownerFirstName,
          lastName: ownerLastName,
          phoneNumber: {
            countryCode: ownerCountryCode,
            number: ownerPhoneNumber,
          },
          customerSupport: {
            emailAddress: supportEmail,
            phoneNumber: {
              countryCode: supportCountryCode,
              number: supportPhoneNumber,
            },
          },
        },
        emailAddress,
        password,
        businessImageUrl: businessImageUrl || undefined,
      };

      const response = await businessSignup({ data: payload });
      toast.success(response?.message || "Business created successfully.");
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create business.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      <Toaster position="top-center" />
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (scrollable) */}
        <SideBar />

        {/* Main Section (scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <TopHeader onActionClick={() => setOpen(true)} />
          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
            <BusinessCount />
          </div>

          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5 pt-5">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Create new business</DialogTitle>
            <DialogDescription>
              This creates the business, main store, merchant user, OTP record, and merchant token.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Business name"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Owner first name"
              value={ownerFirstName}
              onChange={(event) => setOwnerFirstName(event.target.value)}
            />
            <Input
              placeholder="Owner last name"
              value={ownerLastName}
              onChange={(event) => setOwnerLastName(event.target.value)}
            />
            <Input
              placeholder="Owner country code"
              value={ownerCountryCode}
              onChange={(event) => setOwnerCountryCode(event.target.value)}
            />
            <Input
              placeholder="Owner phone number"
              value={ownerPhoneNumber}
              onChange={(event) => setOwnerPhoneNumber(event.target.value)}
            />
            <Input
              placeholder="Support email"
              type="email"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
            />
            <Input
              placeholder="Support country code"
              value={supportCountryCode}
              onChange={(event) => setSupportCountryCode(event.target.value)}
            />
            <Input
              placeholder="Support phone number"
              value={supportPhoneNumber}
              onChange={(event) => setSupportPhoneNumber(event.target.value)}
            />
            <Input
              placeholder="Merchant login email"
              type="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Input
              placeholder="Business image URL (optional)"
              value={businessImageUrl}
              onChange={(event) => setBusinessImageUrl(event.target.value)}
              className="sm:col-span-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button
              onClick={handleCreateBusiness}
              disabled={submitting}
              className="rounded-full bg-[#111827] hover:bg-[#1F2937]"
            >
              {submitting ? "Creating..." : "Create business"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Businesses;
