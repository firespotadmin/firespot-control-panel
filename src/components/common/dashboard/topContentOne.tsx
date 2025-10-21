import { Button } from "@/components/ui/button"
import { ArrowDown2 } from "iconsax-reactjs"
import { File } from "lucide-react"

const TopContentOne = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 ">
                <div className="">
                    <div className="flex items-center gap-2">
                        <p className="text-[14px] text-[#00000066] font-medium">This week</p>
                        <ArrowDown2 size={12} color="#00000066" />
                    </div>
                    <h1 className="font-bold text-[24px]">Overview</h1>
                </div>
                <Button className="py-[12px] bg-[#E5E7EB] font-medium hover:bg-[#E5E7EB] text-[#000] gap-2 text-[12px] h-[40px] cursor-pointer rounded-full">
                    <File />DOWNLOAD REPORT
                </Button>
            </div>
        </div>
    )
}

export default TopContentOne