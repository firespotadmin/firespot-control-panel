const ColorBox = ({
    label,
    count,
    color,
    fontSize,
    text
}: {
    label: string;
    count: string;
    color: string;
    fontSize?: string;
    text?: string;
}) => {
    return (
        <div className="cursor-pointer">
            {
                label ?
                <div className="p-[16px] flex flex-col gap-[8px] border-[#F4F6F8] border-[.4px] shadow-lg bg-white rounded-[12px] w-full">
                <div className="flex items-center justify-between">
                    <p className="text-[#00000066] font-medium text-[12px]">{label}</p>
                    <p className="text-[12px] font-semibold">{text}</p>
                </div>
                <p
                    className="text-[48px] font-bold"
                    style={{ color: color, fontSize: fontSize }}
                >
                    {count}
                </p>
            </div>
             : <div className="bg-[#00000005] w-full rounded-[12px] p-[16px] flex flex-col h-full">
                
             </div>
            }
        </div>
    );
};

export default ColorBox;
