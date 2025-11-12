import { ArrowDown2 } from "iconsax-reactjs"

const ProfileDropDown = () => {
    return (
        <div>
            <div className="flex items-center gap-2 cursor-pointer">
                <img className="w-[36px] h-[36px] object-cover rounded-full object-center" src="fac.jpg" alt="" />
                <div className="flex gap-5 items-center">
                    <div className="">

                        <p className="font-[700] text-[14px]">Tola Adewale</p>
                        <p className="text-[12px] font-[500] text-[#6B7280]">Super Admin</p>
                    </div>
                <ArrowDown2 size={15} />
                </div>
            </div>
        </div>
    )
}

export default ProfileDropDown