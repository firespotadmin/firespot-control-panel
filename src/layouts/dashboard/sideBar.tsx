import LinkCompo from "@/components/common/dashboard/linkCompo";
import { useSupportUnreadCount } from "@/hooks/support-hook.hook";
import { getStoredAuthUser } from "@/lib/auth-storage";
import { canAccessRoute } from "@/lib/permissions";
import {
  Chart1,
  ChartCircle,
  I3DCubeScan,
  MessageNotif,
  Moneys,
  Profile2User,
  Setting2,
  Shop,
  UserCirlceAdd,
} from "iconsax-reactjs";
import { useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const { count: supportUnreadCount } = useSupportUnreadCount();
  const user = getStoredAuthUser();
  const role = user?.role;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const can = (path: string) => canAccessRoute(role, path);

  return (
    <div className="p-4 w-[240px] h-screen border-r border-gray-200 flex flex-col gap-4 overflow-y-auto">
      {can("/dashboard") && (
        <LinkCompo
          icon={<ChartCircle />}
          text="Overview"
          link="/dashboard"
          active={isActive("/dashboard")}
        />
      )}
      {can("/insights") && (
        <LinkCompo
          icon={<Chart1 />}
          text="Insights"
          link="/insights"
          active={isActive("/insights")}
        />
      )}
      {(can("/dashboard") || can("/insights")) && <hr />}
      {can("/businesses") && (
        <LinkCompo
          icon={<Shop />}
          text="Businesses"
          link="/businesses"
          active={isActive("/businesses")}
        />
      )}
      {can("/customers") && (
        <LinkCompo
          icon={<Profile2User />}
          text="Customers"
          link="/customers"
          active={isActive("/customers")}
        />
      )}
      {can("/businesses") && <hr />}
      {can("/transactions") && (
        <LinkCompo
          icon={<Moneys />}
          text="Transactions"
          link="/transactions"
          active={isActive("/transactions")}
        />
      )}
      {can("/qr-kits") && (
        <LinkCompo
          icon={<I3DCubeScan />}
          text="QR Kits"
          link="/qr-kits"
          active={isActive("/qr-kits")}
        />
      )}
      {can("/transactions") && <hr />}
      {can("/support") && (
        <LinkCompo
          icon={<MessageNotif />}
          text="Support"
          link="/support"
          active={isActive("/support")}
          badge={supportUnreadCount}
        />
      )}
      {can("/referrals") && (
        <LinkCompo
          icon={<UserCirlceAdd />}
          text="Referrals"
          link="/referrals"
          active={isActive("/referrals")}
        />
      )}
      {can("/settings") && (
        <LinkCompo
          icon={<Setting2 />}
          text="Settings"
          link="/settings"
          active={isActive("/settings")}
        />
      )}
    </div>
  );
};

export default SideBar;
