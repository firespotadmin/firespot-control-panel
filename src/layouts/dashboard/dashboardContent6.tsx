import ColorBox from "@/components/common/dashboard/color-box";
import type { QrKitsStats } from "@/types/stats";

interface DashboardContent6Props {
  data?: QrKitsStats | null;
}

const DashboardContent6 = ({ data }: DashboardContent6Props) => {
  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">QR Kits</p>
      <p className="text-[13px] text-[#6B7280] mt-1">QR kits generated and scan counts.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ColorBox
          count={data?.qrKitsGenerated?.toString() ?? "0"}
          label="QR Kits Generated"
          color="#000"
        />
        <ColorBox
          count={data?.staticQrScans?.toString() ?? "0"}
          label="Static QR Scans"
          color="#000"
        />
        <ColorBox
          count={data?.dynamicQrScans?.toString() ?? "0"}
          label="Dynamic QR Scans"
          color="#000"
        />
      </div>
    </div>
  );
};

export default DashboardContent6;
