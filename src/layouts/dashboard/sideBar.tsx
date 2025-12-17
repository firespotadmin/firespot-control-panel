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

const SideBar = () => {
  return (
    <div className="p-4 w-[240px] h-screen border-r border-gray-200 flex flex-col gap-4 overflow-y-auto">
      <LinkCompo
        icon={<ChartCircle />}
        text="Overview"
        link="/dashboard"
        active
      />
      <LinkCompo icon={<Chart1 />} text="Insights" link="/insights" />
      <hr />
      <LinkCompo icon={<Shop />} text="Businesses" link="/businesses" />
      <LinkCompo icon={<Profile2User />} text="Customers" link="/customers" />
      <hr />
      <LinkCompo icon={<Moneys />} text="Transactions" link="/transactions" />
      <LinkCompo icon={<Box1 />} text="Products" link="/products" />
      <LinkCompo icon={<I3DCubeScan />} text="QR Kits" link="/qr-kits" />
      <hr />
      <LinkCompo icon={<MessageNotif />} text="Support" link="/support" />
      <LinkCompo icon={<UserCirlceAdd />} text="Referrals" link="/referrals" />
      <LinkCompo icon={<Setting2 />} text="Settings" link="/settings" />
    </div>
  );
};

export default SideBar;
