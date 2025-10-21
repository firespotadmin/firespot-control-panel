import LinkCompo from "@/components/common/dashboard/linkCompo";
import { Chart, Chart1, ChartCircle } from "iconsax-reactjs";

const SideBar = () => {
    return (
        <div className="p-4 w-[13vw] h-screen border-r border-gray-200 flex flex-col gap-4 overflow-y-auto">
            <LinkCompo icon={<ChartCircle />} text="Overview" link="/dashboard" active />
            <LinkCompo icon={<Chart1 />} text="Insights" link="/insights" />
        </div>
    );
};

export default SideBar;
