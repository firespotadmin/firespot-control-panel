import { Pencil, Plus, Trash2 } from "lucide-react";
import { useGetBusinessCharges } from "@/hooks/stats-hook.hook";
import type { BusinessCharge } from "@/types/charge";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const ChargesAndTaxesTab = ({ businessId }: { businessId?: string }) => {
  const [charges, setCharges] = useState<BusinessCharge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setCharges([]);
      return;
    }

    const fetchCharges = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetBusinessCharges({ businessId });
        const payload = response?.data?.data || response?.data || response;

        setCharges(Array.isArray(payload) ? payload : []);
      } catch (err: any) {
        setCharges([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load charges"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, [businessId]);

  const formatChargeValue = (item: BusinessCharge) => {
    if (item.transactionChargeType === "PERCENTAGE") {
      return `${item.percentageRate}%`;
    }

    return `${item.percentageRate}`;
  };

  const getChargeNote = (item: BusinessCharge) => {
    if (item.title?.toLowerCase().includes("vat")) {
      return "Included in the price";
    }

    return "Added to the price";
  };

  return (
    <div className="w-full py-6">
      <p className="text-[12px] font-[700] text-[#9CA3AF] uppercase tracking-[2px] mb-4">
        {charges.length} Charges Added
      </p>

      <div className="max-w-[680px] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
            <p className="mt-2 text-gray-600">Loading charges...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : charges.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No charges added yet.</div>
        ) : (
          charges.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E5E7EB] last:border-b-0"
            >
              <div>
                <p className="text-[18px] font-[700] text-[#111827] leading-tight">{item.title}</p>
                <p className="text-[14px] text-[#6B7280] mt-1">
                  {formatChargeValue(item)} ({getChargeNote(item)})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="h-10 w-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <Pencil size={17} />
                </button>
                <button className="h-10 w-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}

        <button className="w-full flex items-center gap-2 px-5 py-4 text-[#2563EB] font-[700] text-[14px] border-t border-[#E5E7EB]">
          <Plus size={18} />
          Add a charge or tax
        </button>
      </div>
    </div>
  );
};

export default ChargesAndTaxesTab;
