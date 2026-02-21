import { ArrowDown2 } from "iconsax-reactjs"
import { getStoredAuthUser } from "@/lib/auth-storage";

const toReadableRole = (role?: string) => {
    if (!role) return "User";

    return role
        .toLowerCase()
        .split("_")
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(" ");
};

const ProfileDropDown = () => {
    const user = getStoredAuthUser();
    const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";
    const profileImage = user?.profileImageUrl || "fac.jpg";

    return (
        <div>
            <div className="flex items-center gap-2 cursor-pointer">
                <img className="w-[36px] h-[36px] object-cover rounded-full object-center" src={profileImage} alt={fullName} />
                <div className="flex gap-5 items-center">
                    <div className="">

                        <p className="font-[700] text-[14px]">{fullName}</p>
                        <p className="text-[12px] font-[500] text-[#6B7280]">{toReadableRole(user?.role)}</p>
                    </div>
                <ArrowDown2 size={15} />
                </div>
            </div>
        </div>
    )
}

export default ProfileDropDown