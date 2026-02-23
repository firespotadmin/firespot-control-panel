import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight2 } from "iconsax-reactjs";
import { useMemo, useState } from "react";

const QRKitsTab = ({ businessId }: { businessId?: string }) => {
  const [open, setOpen] = useState(false);

  const qrLink = useMemo(() => {
    if (!businessId) return "";
    return `https://pay.firespot.co/business?businessId=${businessId}`;
  }, [businessId]);

  const qrImageUrl = useMemo(() => {
    if (!qrLink) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(
      qrLink,
    )}`;
  }, [qrLink]);

  return (
    <div className="w-full py-6">
      <p className="text-[12px] font-[700] text-[#9CA3AF] uppercase tracking-[2px] mb-4">
        1 QR KIT CREATED
      </p>

      <div className="max-w-[680px] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-4 border-b border-[#E5E7EB] last:border-b-0 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="text-left">
            <p className="text-[16px] font-[700] text-[#111827] leading-tight">
              Main address
            </p>
            <p className="text-[13px] text-[#6B7280] mt-1">Active</p>
          </div>
          <ArrowRight2 size={16} color="#9CA3AF" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[470px] p-6">
          <DialogHeader>
            <DialogTitle>Business QR Kit</DialogTitle>
          </DialogHeader>

          {qrImageUrl ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={qrImageUrl}
                alt="Business QR Code"
                className="w-[380px] h-[380px] object-contain"
              />
              <p className="text-[12px] text-[#6B7280] break-all text-center">
                {qrLink}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">No business ID found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRKitsTab;
