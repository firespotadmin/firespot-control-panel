import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleUserRound, ShieldCheck, ClipboardList, Power } from "lucide-react";

const Settings = () => {
  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
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

                <button className="w-full h-[36px] rounded-[9px] text-[#EF4444] text-[13px] font-[500] flex items-center gap-2.5 px-3 hover:bg-[#FEF2F2]">
                  <Power size={15} />
                  Deactivate account
                </button>
              </aside>

              <section className="p-5">
                <h2 className="text-[24px] leading-[1.1] font-[700] text-[#111827]">Personal Information</h2>
                <p className="mt-4 text-[13px] text-[#6B7280]">Contact information</p>

                <div className="mt-3 border border-[#D1D5DB] rounded-[10px] overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-[#D1D5DB]">
                    <Input
                      defaultValue="Amarachi"
                      className="h-[42px] border-0 rounded-none shadow-none focus-visible:ring-0"
                    />
                    <Input
                      defaultValue="Johnson"
                      className="h-[42px] border-0 rounded-none shadow-none border-l border-[#D1D5DB] focus-visible:ring-0"
                    />
                  </div>

                  <div className="flex items-center h-[42px] px-3 gap-2">
                    <div className="w-[18px] h-[12px] rounded-[2px] bg-[#1E8E3E] relative overflow-hidden">
                      <div className="absolute left-1/2 top-0 h-full w-[6px] -translate-x-1/2 bg-white" />
                    </div>
                    <span className="text-[13px] text-[#111827]">+234</span>
                    <Input
                      defaultValue="122 334 5667"
                      className="h-[30px] border-0 shadow-none px-0 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <p className="mt-5 text-[13px] text-[#6B7280]">Email address</p>
                <div className="mt-3 border border-[#D1D5DB] rounded-[10px] overflow-hidden grid grid-cols-[1fr_140px]">
                  <Input
                    defaultValue="amarachijohnson@gmail.com"
                    className="h-[42px] border-0 rounded-none shadow-none focus-visible:ring-0"
                  />
                  <div className="h-[42px] flex items-center justify-center text-[12px] text-[#9CA3AF] border-l border-[#D1D5DB]">
                    Super Admin
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
