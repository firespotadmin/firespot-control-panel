const ColorBox = ({
  label,
  count,
  color,
  fontSize,
  text,
}: {
  label: string;
  count: string;
  color: string;
  fontSize?: string;
  text?: string;
}) => {
  if (!label) {
    return (
      <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-4 w-full min-h-[100px]" />
    );
  }
  return (
    <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-4 w-full">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#6B7280]">{label}</p>
        {text ? <p className="text-[13px] font-[600] text-[#111827]">{text}</p> : null}
      </div>
      <p
        className="text-[28px] font-[700] text-[#111827] mt-1"
        style={{ color, fontSize: fontSize ?? undefined }}
      >
        {count}
      </p>
    </div>
  );
};

export default ColorBox;
