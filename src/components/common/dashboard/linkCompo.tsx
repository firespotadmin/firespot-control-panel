import type { LinkCompoProps } from "@/types/auth";
import { Link } from "react-router-dom";


const LinkCompo = ({ icon, text, link, active = false }: LinkCompoProps) => {
  return (
    <Link
      to={link}
      className={`flex items-center bg-none h-[36px]  gap-3 px-4 py-3 rounded-[10px] cursor-pointer transition-all ${
        active ? "bg-[#E5E7EB] text-black" : "text-black hover:bg-gray-100"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-[13px]">{text}</span>
    </Link>
  );
};

export default LinkCompo;
