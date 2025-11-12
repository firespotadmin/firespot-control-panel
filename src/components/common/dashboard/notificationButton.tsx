import { Notification } from "iconsax-reactjs";

const NotificationButton = () => {
  return (
    <div className="bg-[#F1F1F1] cursor-pointer h-[36px] relative w-[36px] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition-all">
      <Notification size={16} color="#000" variant="Outline" />
        <div className="absolute top-[2px] right-[1px] w-[8px] h-[8px] rounded-full bg-red-500"></div>
    </div>
  );
};

export default NotificationButton;
