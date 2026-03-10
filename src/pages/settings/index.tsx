import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleUserRound, ShieldCheck, ClipboardList, Power, Camera, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { getStoredAuthUser, saveAuthSession } from "@/lib/auth-storage";
import { canAccessAuditLogs, canAccessUserRoles } from "@/lib/permissions";
import { uploadProfilePicture } from "@/services/profile-service.service";
import type { AuthUser } from "@/types/auth";
import { useRef, useState } from "react";
import axiosInstance from "@/security/api-secured";
import toast, { Toaster } from "react-hot-toast";

function getInitials(user: AuthUser | null): string {
  if (!user?.firstName && !user?.lastName) return "?";
  const first = user.firstName?.trim().charAt(0) ?? "";
  const last = user.lastName?.trim().charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

const Settings = () => {
  const storedUser = getStoredAuthUser();
  const [user, setUser] = useState(storedUser);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const phone = user?.phone ?? "";
  const emailAddress = user?.emailAddress ?? "";
  const isActive = user?.isActive ?? false;
  const userRole = user?.role;
  const roleDisplay = userRole
    ? userRole
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "N/A";
  const showUserRoles = canAccessUserRoles(userRole);
  const showAuditLogs = canAccessAuditLogs(userRole);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    uploadProfilePicture(file)
      .then((updatedUser) => {
        saveAuthSession({ user: updatedUser });
        setUser(updatedUser);
        toast.success("Profile picture updated.");
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to upload photo.");
      })
      .finally(() => {
        setIsUploadingPhoto(false);
        e.target.value = "";
      });
  };

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

        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <div className="w-full max-w-[900px] mx-auto space-y-5">
            <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">Settings</h1>

            <div className="mt-4 bg-white rounded-[14px] border border-[#ECEEF1] overflow-hidden">
            <div className="grid grid-cols-[250px_1fr]">
              <aside className="border-r border-[#ECEEF1] p-3">
                <div className="space-y-1">
                  <button className="w-full h-[36px] rounded-[9px] bg-[#F3F4F6] text-[#111827] text-[13px] font-[500] flex items-center gap-2.5 px-3">
                    <CircleUserRound size={15} />
                    Personal Information
                  </button>

                  {showUserRoles && (
                    <Link
                      to="/settings/user-roles"
                      className="w-full h-[36px] rounded-[9px] text-[#111827] text-[13px] font-[500] flex items-center gap-2.5 px-3 hover:bg-[#F9FAFB]"
                    >
                      <ShieldCheck size={15} />
                      User roles and permissions
                    </Link>
                  )}

                  {showAuditLogs && (
                    <Link
                      to="/settings/audit-logs"
                      className="w-full h-[36px] rounded-[9px] text-[#111827] text-[13px] font-[500] flex items-center gap-2.5 px-3 hover:bg-[#F9FAFB]"
                    >
                      <ClipboardList size={15} />
                      Audit logs
                    </Link>
                  )}
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

                {/* Profile picture */}
                <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-[96px] h-[96px] rounded-full overflow-hidden bg-[#E5E7EB] border-2 border-[#ECEEF1] flex items-center justify-center">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={`${firstName} ${lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[28px] font-[600] text-[#6B7280]">
                          {getInitials(user)}
                        </span>
                      )}
                    </div>
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <Loader className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-[500] text-[#111827]">Profile picture</p>
                    <p className="text-[13px] text-[#6B7280]">JPG, PNG or WebP. Max 5 MB.</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handlePhotoChange}
                      disabled={isUploadingPhoto}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit rounded-full gap-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                    >
                      <Camera size={16} />
                      {isUploadingPhoto ? "Uploading…" : "Change photo"}
                    </Button>
                  </div>
                </div>

                <p className="mt-6 text-[13px] text-[#6B7280]">Contact information</p>

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
                    {roleDisplay}
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
