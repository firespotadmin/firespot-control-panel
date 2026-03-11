import TopHeader from "@/layouts/customers/top-header";
import Header from "../../layouts/dashboard/header";
import SideBar from "../../layouts/dashboard/sideBar";
import BusinessCount from "@/layouts/customers/business-count";
import TabsSection from "@/layouts/customers/tabs-section";
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
import { customerSignup } from "@/services/auth-service.service";
import type { CustomerSignupPayload } from "@/types/auth";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmailAddress("");
    setPassword("");
    setCountryCode("+234");
    setPhoneNumber("");
    setProfilePictureUrl("");
  };

  const handleCreateCustomer = async () => {
    if (!firstName || !lastName || !emailAddress || !password || !phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload: CustomerSignupPayload = {
        firstName,
        lastName,
        emailAddress,
        password,
        phoneNumber: {
          countryCode,
          number: phoneNumber,
        },
        profilePictureUrl: profilePictureUrl || undefined,
      };
      const response = await customerSignup({ data: payload });
      toast.success(response?.message || "Customer created successfully. OTP sent.");
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create customer.",
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
          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
            <TabsSection />
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Create new customer</DialogTitle>
            <DialogDescription>
              This creates a customer account and sends an OTP for verification.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <Input
              placeholder="Email address"
              type="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Country code"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
            />
            <Input
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            <Input
              placeholder="Profile picture URL (optional)"
              value={profilePictureUrl}
              onChange={(event) => setProfilePictureUrl(event.target.value)}
              className="sm:col-span-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={submitting}
              className="rounded-full bg-[#111827] hover:bg-[#1F2937]"
            >
              {submitting ? "Creating..." : "Create customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
