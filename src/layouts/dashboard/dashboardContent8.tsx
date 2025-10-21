import ColorBox from '@/components/common/dashboard/color-box'

const DashboardContent8 = () => {
    return (
        <div>
            <div className="">
                <h1 className="font-bold text-[24px] py-5">
                    Referrals
                </h1>
                <div className="grid grid-cols-3 gap-5 pb-8">
                    <ColorBox count="0" label="Total Referrals" color="#000" />
                    <ColorBox count="" label="" color="" />
                    <ColorBox count="" label="" text='' color="" />
                </div>
                <hr />
            </div>
        </div>
    )
}

export default DashboardContent8
