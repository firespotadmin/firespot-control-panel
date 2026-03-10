import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import SupportSection from "@/layouts/support/support-section";
import SupportTopHeader from "@/layouts/support/top-header";
import { Toaster } from "react-hot-toast";

const Support = () => {
  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <SupportTopHeader />
          <SupportSection />
        </div>
      </div>
    </div>
  );
};

export default Support;
