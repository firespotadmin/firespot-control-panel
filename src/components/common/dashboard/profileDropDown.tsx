import { ArrowDown2 } from "iconsax-reactjs"

const ProfileDropDown = () => {
    return (
        <div>
            <div className="flex items-center gap-2 cursor-pointer">
                <img className="w-12 h-12 object-cover rounded-full object-center" src="fac.jpg" alt="" />
                <div className="flex gap-5 items-center">
                    <div className="">

                        <p className="font-bold text-lg">Tola Adewale</p>
                        <p className="text-sm font-medium text-[#6B7280]">Super Admin</p>
                    </div>
                <ArrowDown2 size={15} />
                </div>
            </div>
        </div>
    )
}

export default ProfileDropDown