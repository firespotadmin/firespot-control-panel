import { useSupportUnreadCount } from "@/hooks/support-hook.hook";

const SupportTopHeader = () => {
  const { count: unreadCount } = useSupportUnreadCount();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">Support</h1>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#EF4444] text-white text-[12px] font-[600]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default SupportTopHeader;
