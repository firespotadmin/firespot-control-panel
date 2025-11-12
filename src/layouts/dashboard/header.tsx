import FCPLogo from '@/components/common/dashboard/fcpLogo'
import NotificationButton from '@/components/common/dashboard/notificationButton'
import ProfileDropDown from '@/components/common/dashboard/profileDropDown'

const Header = () => {
  return (
    <div className='flex bg-[#fff] items-center justify-between shadow-xs h-[70px] pl-5'>
        <FCPLogo />
        <div className="flex gap-3 pr-5 items-center">
            <NotificationButton />
            <div className="border-l border-[1px] border-[#f7f4f488] rounded-full"></div>
            <ProfileDropDown />
        </div>
    </div>
  )
}

export default Header