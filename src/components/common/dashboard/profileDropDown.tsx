import { ArrowDown2, Logout, Setting2, MessageNotif, ChartCircle } from "iconsax-reactjs";
import { getStoredAuthUser } from "@/lib/auth-storage";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "@/lib/auth-storage";

const toReadableRole = (role?: string) => {
    if (!role) return "User";

    return role
        .toLowerCase()
        .split("_")
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(" ");
};

const getInitials = (user: ReturnType<typeof getStoredAuthUser>) => {
    const first = user?.firstName?.trim().charAt(0) ?? "";
    const last = user?.lastName?.trim().charAt(0) ?? "";
    return (first + last).toUpperCase() || "?";
};

const ProfileDropDown = () => {
    const user = getStoredAuthUser();
    const navigate = useNavigate();
    const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";
    const profileImageUrl = user?.profileImageUrl;

    const handleLogout = () => {
        clearAuthSession();
        navigate("/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer">
                    {profileImageUrl ? (
                        <img className="w-[36px] h-[36px] object-cover rounded-full object-center" src={profileImageUrl} alt={fullName} />
                    ) : (
                        <div className="w-[36px] h-[36px] rounded-full bg-[#E5E7EB] flex items-center justify-center text-[13px] font-[600] text-[#6B7280]">
                            {getInitials(user)}
                        </div>
                    )}
                    <div className="flex gap-5 items-center">
                        <div>
                            <p className="font-[700] text-[14px]">{fullName}</p>
                            <p className="text-[12px] text-right font-[500] text-[#6B7280]">{toReadableRole(user?.role)}</p>
                        </div>
                        <ArrowDown2 size={15} />
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>
                    <p className="font-[700] text-[13px] text-[#111827]">{fullName}</p>
                    <p className="text-[12px] font-[500] text-[#6B7280]">{user?.emailAddress || ""}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    <ChartCircle size={16} />
                    Overview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/support")} className="cursor-pointer">
                    <MessageNotif size={16} />
                    Support
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    <Setting2 size={16} />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#DC2626] focus:text-[#DC2626]">
                    <Logout size={16} color="#DC2626" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileDropDown;