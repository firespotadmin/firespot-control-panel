import LinkCompo from "@/components/common/dashboard/linkCompo";
import { Chart1, ChartCircle, Shop } from "iconsax-reactjs";

const SideBar = () => {
    return (
        <div className="p-4 w-[240px] h-screen border-r border-gray-200 flex flex-col gap-4 overflow-y-auto">
            <LinkCompo icon={<ChartCircle />} text="Overview" link="/dashboard" active />
            <LinkCompo icon={<Chart1 />} text="Insights" link="/insights" />
            <LinkCompo icon={<Shop />} text="Businesses" link="/businesses" />
        </div>
    );
};

export default SideBar;
