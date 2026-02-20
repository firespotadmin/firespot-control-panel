import type { Business } from "@/types/business";
import { Pencil, Plus, Trash2 } from "lucide-react";

type LocationItem = {
  id: string;
  title: string;
  address: string;
  isMain?: boolean;
};

const formatAddress = (address: unknown) => {
  if (!address) return "N/A";

  if (typeof address === "string") {
    return address;
  }

  const value = address as {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };

  return [value.street, value.city, value.state, value.country]
    .filter(Boolean)
    .join(", ");
};

const normalizeLocationEntry = (entry: unknown, index: number): LocationItem => {
  if (typeof entry === "string") {
    return {
      id: `branch-${index}`,
      title: `Branch ${index + 1}`,
      address: entry,
    };
  }

  const value = (entry || {}) as {
    id?: string;
    locationId?: string;
    title?: string;
    name?: string;
    branchName?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    address?: unknown;
    businessAddress?: unknown;
  };

  return {
    id: value.id || value.locationId || `branch-${index}`,
    title: value.title || value.name || value.branchName || `Branch ${index + 1}`,
    address:
      formatAddress(value.address) ||
      formatAddress(value.businessAddress) ||
      formatAddress(value),
  };
};

const extractBranchLocations = (business?: Business | null): LocationItem[] => {
  const payload = (business || {}) as any;

  const branchCandidates: unknown[] = [
    payload?.locations,
    payload?.businessLocations,
    payload?.branches,
    payload?.branchLocations,
    payload?.businessBranches,
  ];

  const firstArray = branchCandidates.find((candidate) => Array.isArray(candidate));
  const branches = (firstArray || []) as unknown[];

  return branches.map((entry, index) => normalizeLocationEntry(entry, index));
};

const LocationsTab = ({ business }: { business?: Business | null }) => {
  const mainAddress = formatAddress(business?.businessMainAddress) || "N/A";

  const locations: LocationItem[] = [
    {
      id: "main-address",
      title: "Main address",
      address: mainAddress,
      isMain: true,
    },
    ...extractBranchLocations(business),
  ];

  return (
    <div className="w-full py-6">
      <p className="text-[12px] font-[700] text-[#9CA3AF] uppercase tracking-[2px] mb-4">
        {locations.length} Locations Added
      </p>

      <div className="max-w-[680px] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        {locations.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 px-4 py-4 border-b border-[#E5E7EB] last:border-b-0"
          >
            <div>
              <p className="text-[18px] font-[700] text-[#111827] leading-tight">{item.title}</p>
              <p className="text-[14px] text-[#6B7280] mt-1">{item.address}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <Pencil size={17} />
              </button>
              <button
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  item.isMain
                    ? "bg-[#F3F4F6] text-[#D1D5DB]"
                    : "bg-[#F3F4F6] text-[#111827]"
                }`}
                disabled={item.isMain}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}

        <button className="w-full flex items-center gap-2 px-5 py-4 text-[#2563EB] font-[700] text-[14px] border-t border-[#E5E7EB]">
          <Plus size={18} />
          Add another store
        </button>
      </div>
    </div>
  );
};

export default LocationsTab;
