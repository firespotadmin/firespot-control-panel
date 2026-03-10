import type { LinkCompoProps } from "@/types/auth";
import { Link } from "react-router-dom";


const LinkCompo = ({ icon, text, link, active = false, badge }: LinkCompoProps) => {
  return (
    <Link
      to={link}
      className={`flex items-center bg-none h-[36px]  gap-3 px-4 py-3 rounded-[10px] cursor-pointer transition-all ${
        active ? "bg-[#E5E7EB] text-black" : "text-black hover:bg-gray-100"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-[13px] flex-1">{text}</span>
      {badge != null && badge > 0 && (
        <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-[#EF4444] text-white text-[11px] font-[600]">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
};

export default LinkCompo;
