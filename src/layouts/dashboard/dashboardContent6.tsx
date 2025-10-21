import ColorBox from '@/components/common/dashboard/color-box'

const DashboardContent6 = () => {
    return (
        <div>
            <div className="">
                <h1 className="font-bold text-[24px] py-5">
                    QR Kits
                </h1>
                <div className="grid grid-cols-3 gap-5 pb-8">
                    <ColorBox count="0" label="QR Kits Generated" color="#000" />
                    <ColorBox count="0" label="Static QR Scans" color="" />
                    <ColorBox count="0" label="Dynamic QR Scans" text='fs_Collect' color="#F9A000" />
                </div>
                <hr />
            </div>
        </div>
    )
}

export default DashboardContent6
