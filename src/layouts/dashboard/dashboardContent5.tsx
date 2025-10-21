import ColorBox from '@/components/common/dashboard/color-box'

const DashboardContent5 = () => {
    return (
        <div>
            <div className="">
                <h1 className="font-bold text-[24px] py-5">
                    Support
                </h1>
                <div className="grid grid-cols-3 gap-5 pb-8">
                    <ColorBox count="0" label="Total Support Tickets" color="#000" />
                    <ColorBox count="0" label="Resolved Support Tickets" color="" />
                    <ColorBox count="0" label="Open Support Tickets" color="#F9A000" />
                </div>
                <hr />
            </div>
        </div>
    )
}

export default DashboardContent5
