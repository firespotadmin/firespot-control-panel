import { Notification } from "iconsax-reactjs";

const NotificationButton = () => {
  return (
    <div className="bg-[#F1F1F1] cursor-pointer h-[50px] relative w-[50px] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition-all">
      <Notification size={25} color="#000" variant="Outline" />
        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500"></div>
    </div>
  );
};

export default NotificationButton;
