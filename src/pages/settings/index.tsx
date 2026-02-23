import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleUserRound, ShieldCheck, ClipboardList, Power } from "lucide-react";
import { getStoredAuthUser, saveAuthSession } from "@/lib/auth-storage";
import { useState } from "react";
import axiosInstance from "@/security/api-secured";
import toast, { Toaster } from "react-hot-toast";

const Settings = () => {
  const storedUser = getStoredAuthUser();
  const [user, setUser] = useState(storedUser);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const phone = user?.phone ?? "";
  const emailAddress = user?.emailAddress ?? "";
  const isActive = user?.isActive ?? false;
  const role = user?.role
    ? user.role
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "N/A";

  const handleToggleAccountStatus = async () => {
    if (!emailAddress || isUpdatingStatus) {
      return;
    }

    const nextStatus = !isActive;

    try {
      setIsUpdatingStatus(true);

      await axiosInstance.patch("/api/v1/admin/activate", null, {
        params: {
          email: emailAddress,
          isActive: nextStatus,
        },
      });

      const updatedUser = user ? { ...user, isActive: nextStatus } : user;
      if (updatedUser) {
        saveAuthSession({ user: updatedUser });
        setUser(updatedUser);
      }

      toast.success(
        nextStatus ? "Account activated successfully" : "Account deactivated successfully"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Unable to update account status. Please try again."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8]">
          <div className="w-full max-w-[900px] mx-auto">
            <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">Settings</h1>

            <div className="mt-4 bg-white rounded-[14px] border border-[#ECEEF1] overflow-hidden">
            <div className="grid grid-cols-[250px_1fr]">
              <aside className="border-r border-[#ECEEF1] p-3">
                <div className="space-y-1">
                  <button className="w-full h-[36px] rounded-[9px] bg-[#F3F4F6] text-[#111827] text-[13px] font-[500] flex items-center gap-2.5 px-3">
                    <CircleUserRound size={15} />
                    Personal Information
                  </button>

                  <button className="w-full h-[36px] rounded-[9px] text-[#111827] text-[13px] font-[500] flex items-center gap-2.5 px-3 hover:bg-[#F9FAFB]">
                    <ShieldCheck size={15} />
                    User roles and permissions
                  </button>

                  <button className="w-full h-[36px] rounded-[9px] text-[#111827] text-[13px] font-[500] flex items-center gap-2.5 px-3 hover:bg-[#F9FAFB]">
                    <ClipboardList size={15} />
                    Audit logs
                  </button>
                </div>

                <hr className="my-4 border-[#ECEEF1]" />

                <button
                  className={`w-full h-[36px] rounded-[9px] text-[13px] font-[500] flex items-center gap-2.5 px-3 ${
                    isActive
                      ? "text-[#EF4444] hover:bg-[#FEF2F2]"
                      : "text-[#16A34A] hover:bg-[#F0FDF4]"
                  }`}
                  onClick={handleToggleAccountStatus}
                  disabled={isUpdatingStatus || !emailAddress}
                >
                  <Power size={15} />
                  {isUpdatingStatus
                    ? "Processing..."
                    : isActive
                      ? "Deactivate account"
                      : "Activate account"}
                </button>
              </aside>

              <section className="p-5">
                <h2 className="text-[24px] leading-[1.1] font-[700] text-[#111827]">Personal Information</h2>
                <p className="mt-4 text-[13px] text-[#6B7280]">Contact information</p>

                <div className="mt-3 border border-[#D1D5DB] rounded-[10px] overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-[#D1D5DB]">
                    <Input
                      defaultValue={firstName}
                      className="h-[42px] border-0 rounded-none shadow-none focus-visible:ring-0"
                    />
                    <Input
                      defaultValue={lastName}
                      className="h-[42px] border-0 rounded-none shadow-none border-l border-[#D1D5DB] focus-visible:ring-0"
                    />
                  </div>

                  <div className="flex items-center h-[42px] px-3 gap-2">
                    <div className="w-[18px] h-[12px] rounded-[2px] bg-[#1E8E3E] relative overflow-hidden">
                      <div className="absolute left-1/2 top-0 h-full w-[6px] -translate-x-1/2 bg-white" />
                    </div>
                    <span className="text-[13px] text-[#111827]">+234</span>
                    <Input
                      defaultValue={phone}
                      className="h-[30px] border-0 shadow-none px-0 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <p className="mt-5 text-[13px] text-[#6B7280]">Email address</p>
                <div className="mt-3 border border-[#D1D5DB] rounded-[10px] overflow-hidden grid grid-cols-[1fr_140px]">
                  <Input
                    defaultValue={emailAddress}
                    className="h-[42px] border-0 rounded-none shadow-none focus-visible:ring-0"
                  />
                  <div className="h-[42px] flex items-center justify-center text-[12px] text-[#9CA3AF] border-l border-[#D1D5DB]">
                    {role}
                  </div>
                </div>

                <div className="pt-5 flex justify-end">
                  <Button className="h-[36px] px-6 rounded-full bg-black hover:bg-[#111827] text-white text-[13px] font-[600]">
                    Save changes
                  </Button>
                </div>
              </section>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
