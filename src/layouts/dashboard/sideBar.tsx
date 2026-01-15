import LinkCompo from "@/components/common/dashboard/linkCompo";
import {
  Box1,
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="p-4 w-[240px] h-screen border-r border-gray-200 flex flex-col gap-4 overflow-y-auto">
      <LinkCompo
        icon={<ChartCircle />}
        text="Overview"
        link="/dashboard"
        active={isActive("/dashboard")}
      />
      <LinkCompo
        icon={<Chart1 />}
        text="Insights"
        link="/insights"
        active={isActive("/insights")}
      />
      <hr />
      <LinkCompo
        icon={<Shop />}
        text="Businesses"
        link="/businesses"
        active={isActive("/businesses")}
      />
      <LinkCompo
        icon={<Profile2User />}
        text="Customers"
        link="/customers"
        active={isActive("/customers")}
      />
      <hr />
      <LinkCompo
        icon={<Moneys />}
        text="Transactions"
        link="/transactions"
        active={isActive("/transactions")}
      />
      <LinkCompo
        icon={<Box1 />}
        text="Products"
        link="/products"
        active={isActive("/products")}
      />
      <LinkCompo
        icon={<I3DCubeScan />}
        text="QR Kits"
        link="/qr-kits"
        active={isActive("/qr-kits")}
      />
      <hr />
      <LinkCompo
        icon={<MessageNotif />}
        text="Support"
        link="/support"
        active={isActive("/support")}
      />
      <LinkCompo
        icon={<UserCirlceAdd />}
        text="Referrals"
        link="/referrals"
        active={isActive("/referrals")}
      />
      <LinkCompo
        icon={<Setting2 />}
        text="Settings"
        link="/settings"
        active={isActive("/settings")}
      />
    </div>
  );
};

export default SideBar;
