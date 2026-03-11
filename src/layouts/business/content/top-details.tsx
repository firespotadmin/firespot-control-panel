import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { updateBusinessProfileById } from "@/services/business-profile.service";
import type {
  Business,
  BusinessPhoneNumber,
  UpdateBusinessProfilePayload,
} from "@/types/business";
import { ArrowDown2, Call } from "iconsax-reactjs";
import { Mail, MapPin, Share } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type LocationItem = {
  id: string;
  title: string;
  address: string;
  isMain?: boolean;
};

type EditBusinessFormState = {
  businessName: string;
  firespotId: string;
  businessDescription: string;
  registrationNumber: string;
  state: string;
  city: string;
  address: string;
  websiteUrl: string;
  supportEmail: string;
  supportCountryCode: string;
  supportPhoneNumber: string;
  industry: string;
  numberOfBranches: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
  customUrl: string;
  businessImageUrl: string;
  businessBannerImageUrl: string;
};

function readPhoneNumber(value?: BusinessPhoneNumber | string) {
  if (!value) {
    return { countryCode: "", number: "" };
  }

  if (typeof value === "string") {
    return { countryCode: "", number: value };
  }

  return {
    countryCode: value.countryCode || "",
    number: value.number || "",
  };
}

function buildEditFormState(data?: Business): EditBusinessFormState {
  const support = data?.contactInformation?.customerSupport;
  const supportPhone = readPhoneNumber(support?.phoneNumber);
  const social = (data?.socialMediaProfile || {}) as Record<string, string | null | undefined>;

  return {
    businessName: data?.businessName || "",
    firespotId: data?.firespotId || "",
    businessDescription: data?.businessDescription || "",
    registrationNumber: data?.registrationNumber || "",
    state: data?.businessMainAddress?.state || "",
    city: data?.businessMainAddress?.city || "",
    address:
      data?.businessMainAddress?.address || data?.businessMainAddress?.street || "",
    websiteUrl: data?.websiteUrl || "",
    supportEmail: support?.emailAddress || "",
    supportCountryCode: supportPhone.countryCode,
    supportPhoneNumber: supportPhone.number,
    industry: data?.industry || "",
    numberOfBranches: data?.numberOfBranches || "",
    facebookUrl: social.faceBookUrl || social.facebook || "",
    instagramUrl: social.instagramUrl || social.instagram || "",
    twitterUrl: social.twitterUrl || social.twitter || "",
    tiktokUrl: social.tiktokUrl || social.tiktok || "",
    whatsappUrl: social.whatsappUrl || "",
    customUrl: social.customUrl || social.website || "",
    businessImageUrl: data?.businessImageUrl || "",
    businessBannerImageUrl: data?.businessBannerImageUrl || "",
  };
}

function formatAddress(address: unknown) {
  if (!address) return "";

  if (typeof address === "string") {
    return address;
  }

  const value = address as {
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };

  return [value.address, value.street, value.city, value.state, value.country]
    .filter(Boolean)
    .join(", ");
}

function normalizeLocationEntry(entry: unknown, index: number): LocationItem {
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
}

function extractLocations(business?: Business | null): LocationItem[] {
  const payload = (business || {}) as Record<string, unknown>;
  const branchCandidates: unknown[] = [
    payload.locations,
    payload.businessLocations,
    payload.branches,
    payload.branchLocations,
    payload.businessBranches,
  ];

  const firstArray = branchCandidates.find((candidate) => Array.isArray(candidate));
  const branches = (firstArray || []) as unknown[];
  const mainAddress = formatAddress(business?.businessMainAddress) || "N/A";

  return [
    {
      id: "main-address",
      title: "Main address",
      address: mainAddress,
      isMain: true,
    },
    ...branches.map((entry, index) => normalizeLocationEntry(entry, index)),
  ];
}

function getPhoneAction(business?: Business) {
  const supportPhone = readPhoneNumber(dataOrUndefined(business)?.contactInformation?.customerSupport?.phoneNumber);
  const contactPhone = readPhoneNumber(dataOrUndefined(business)?.contactInformation?.phoneNumber);
  const countryCode = supportPhone.countryCode || contactPhone.countryCode;
  const number = supportPhone.number || contactPhone.number;

  if (!number) {
    return { label: "", href: "" };
  }

  const normalizedNumber = `${countryCode}${number}`.replace(/\s+/g, "");
  return {
    label: `${countryCode}${number}`.trim(),
    href: `tel:${normalizedNumber}`,
  };
}

function getEmailAction(business?: Business) {
  const email =
    business?.contactInformation?.customerSupport?.emailAddress ||
    business?.contactInformation?.email ||
    "";

  return {
    label: email,
    href: email ? `mailto:${email}` : "",
  };
}

function dataOrUndefined(value?: Business | null) {
  return value || undefined;
}

const TopDetails = ({
  data,
  isLoading,
  onBusinessUpdated,
}: {
  data: Business;
  isLoading?: boolean;
  onBusinessUpdated?: () => Promise<void> | void;
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditBusinessFormState>(buildEditFormState(data));
  const locations = extractLocations(data);
  const phoneAction = getPhoneAction(data);
  const emailAction = getEmailAction(data);

  const vendorStats = [
    {
      icon: "🍔",
      label: "",
      value: "Fast Food",
      labelColor: "#000000",
      valueColor: "#000000",
    },
    {
      icon: "👤",
      label: "Monthly Visits",
      value: data?.numberOfVisits || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "❤️",
      label: "Faved",
      value: data?.customerIdThatLikeBusiness?.size || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "💸",
      label: "Avg Spend",
      value: data?.totalAmountReceived 
        ? `₦${(data.totalAmountReceived / Math.max(data.customerUserIdThatBoughtFromBusiness?.size || 1, 1)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
        : "₦0",
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "⭐",
      label: "Rating",
      value: (data?.averageFeedbackRating || 0).toFixed(1),
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "🕒",
      label: "Operating Hours",
      value: data?.opening_hours || "N/A",
      labelColor: "#000000",
      valueColor: "#28a745",
    },
    {
      icon: "🛍️",
      label: "Orders",
      value: data?.customerUserIdThatBoughtFromBusiness?.size || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
    {
      icon: "💬",
      label: "Feedbacks",
      value: data?.numberOfFeedbacks || 0,
      labelColor: "#6c757d",
      valueColor: "#000000",
    },
  ];

  const handleOpenEdit = () => {
    setForm(buildEditFormState(data));
    setEditOpen(true);
  };

  const updateField = (field: keyof EditBusinessFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleShareLink = async () => {
    const shareUrl = window.location.href;
    const shareTitle = data?.businessName || "Business profile";

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: `View ${shareTitle}`,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Business link copied.");
    } catch {
      toast.error("Failed to share business link.");
    }
  };

  const handleSave = async () => {
    const businessId = data?.id;
    if (!businessId) {
      toast.error("Business ID is missing.");
      return;
    }

    if (!form.businessName.trim()) {
      toast.error("Business name is required.");
      return;
    }

    const payload: UpdateBusinessProfilePayload = {
      businessName: form.businessName.trim(),
      firespotId: form.firespotId.trim(),
      businessDescription: form.businessDescription.trim(),
      registrationNumber: form.registrationNumber.trim(),
      businessAddress: {
        state: form.state.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
      },
      websiteUrl: form.websiteUrl.trim(),
      customerSupport: {
        emailAddress: form.supportEmail.trim(),
        phoneNumber: {
          countryCode: form.supportCountryCode.trim(),
          number: form.supportPhoneNumber.trim(),
        },
      },
      industry: form.industry.trim(),
      numberOfBranches: form.numberOfBranches.trim(),
      socialMediaProfile: {
        twitterUrl: form.twitterUrl.trim(),
        faceBookUrl: form.facebookUrl.trim(),
        instagramUrl: form.instagramUrl.trim(),
        tiktokUrl: form.tiktokUrl.trim(),
        whatsappUrl: form.whatsappUrl.trim(),
        customUrl: form.customUrl.trim(),
      },
      businessImageUrl: form.businessImageUrl.trim(),
      businessBannerImageUrl: form.businessBannerImageUrl.trim(),
    };

    try {
      setSaving(true);
      await updateBusinessProfileById(businessId, payload);
      await onBusinessUpdated?.();
      setEditOpen(false);
      toast.success("Business updated successfully.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update business.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <hr className="my-5" />
      <div className="">
        {isLoading ? (
          <Skeleton className="w-[96px] h-[96px] rounded-full" />
        ) : (
          <img
            src={data?.businessImageUrl}
            className="w-[96px] h-[96px] object-cover border-2 border-white rounded-full"
            alt=""
          />
        )}
        <div className="flex gap-1 items-center">
          {isLoading ? (
            <Skeleton className="h-6 w-40 mt-2" />
          ) : (
            <>
              <h1 className="text-[23px] capitalize font-[700]">
                {data.businessName}
              </h1>
              <img src="/Vector.png" className="w-5" alt="Verified" />
            </>
          )}
        </div>

        <div className="flex items-center">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <>
              <p>
                {data?.businessMainAddress?.city},{" "}
                {data?.businessMainAddress?.state}
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="font-bold" variant="ghost" type="button">
                    <span>See all locations</span>
                    <ArrowDown2 color="#000" size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[360px] p-2">
                  <div className="space-y-1">
                    <p className="px-2 pt-1 text-[12px] font-[700] uppercase tracking-[1px] text-[#9CA3AF]">
                      {locations.length} locations
                    </p>
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-[#F9FAFB]"
                      >
                        <div
                          className={`mt-0.5 rounded-full p-2 ${
                            location.isMain ? "bg-[#FF6B2C]" : "bg-[#E5E7EB]"
                          }`}
                        >
                          <MapPin
                            size={14}
                            className={location.isMain ? "text-white" : "text-[#111827]"}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-[700] text-[#111827]">
                            {location.title}
                          </p>
                          <p className="text-[12px] text-[#6B7280] break-words">
                            {location.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>

        {/* buttons and links */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Skeleton className="w-[100px] h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </>
          ) : (
            <>
              <Button
                className="w-fit px-[16px] py-[10px] rounded-full cursor-pointer"
                onClick={handleOpenEdit}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full shadow-md"
                asChild={Boolean(phoneAction.href)}
                disabled={!phoneAction.href}
              >
                {phoneAction.href ? (
                  <a href={phoneAction.href} aria-label={`Call ${phoneAction.label || data?.businessName}`}>
                    <Call />
                  </a>
                ) : (
                  <span aria-label="No phone number available">
                    <Call />
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full shadow-md"
                asChild={Boolean(emailAction.href)}
                disabled={!emailAction.href}
              >
                {emailAction.href ? (
                  <a
                    href={emailAction.href}
                    aria-label={`Email ${emailAction.label || data?.businessName}`}
                  >
                    <Mail />
                  </a>
                ) : (
                  <span aria-label="No email available">
                    <Mail />
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full shadow-md"
                onClick={handleShareLink}
              >
                <Share />
              </Button>
            </>
          )}
        </div>

        {/* design it here */}
        {isLoading ? (
          <div className="flex gap-2 mt-4 flex-wrap">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 mt-4 flex-wrap">
            {vendorStats.map((stat, index) => (
              <div
                className="flex gap-2 border-[1.5px] border-[#0000001A] p-2 rounded-md items-center"
                key={index}
              >
                <p className="text-[13px] font-bold">{stat.icon}</p>
                <p
                  className="text-[13px] font-bold"
                  style={{ color: stat.valueColor }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: stat.labelColor }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit business</DialogTitle>
            <DialogDescription>
              Update the business details shown on this profile.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Business name"
              value={form.businessName}
              onChange={(event) => updateField("businessName", event.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Firespot ID"
              value={form.firespotId}
              onChange={(event) => updateField("firespotId", event.target.value)}
            />
            <Input
              placeholder="Registration number"
              value={form.registrationNumber}
              onChange={(event) => updateField("registrationNumber", event.target.value)}
            />
            <Input
              placeholder="Industry"
              value={form.industry}
              onChange={(event) => updateField("industry", event.target.value)}
            />
            <Input
              placeholder="Number of branches"
              value={form.numberOfBranches}
              onChange={(event) => updateField("numberOfBranches", event.target.value)}
            />
            <Input
              placeholder="State"
              value={form.state}
              onChange={(event) => updateField("state", event.target.value)}
            />
            <Input
              placeholder="City"
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
            />
            <Input
              placeholder="Main address"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Website URL"
              value={form.websiteUrl}
              onChange={(event) => updateField("websiteUrl", event.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Support email"
              value={form.supportEmail}
              onChange={(event) => updateField("supportEmail", event.target.value)}
            />
            <Input
              placeholder="Support country code"
              value={form.supportCountryCode}
              onChange={(event) => updateField("supportCountryCode", event.target.value)}
            />
            <Input
              placeholder="Support phone number"
              value={form.supportPhoneNumber}
              onChange={(event) => updateField("supportPhoneNumber", event.target.value)}
            />
            <div className="hidden sm:block" />
            <Input
              placeholder="Business image URL"
              value={form.businessImageUrl}
              onChange={(event) => updateField("businessImageUrl", event.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Business banner image URL"
              value={form.businessBannerImageUrl}
              onChange={(event) =>
                updateField("businessBannerImageUrl", event.target.value)
              }
              className="sm:col-span-2"
            />
            <textarea
              placeholder="Business description"
              value={form.businessDescription}
              onChange={(event) => updateField("businessDescription", event.target.value)}
              className="sm:col-span-2 min-h-[110px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <Input
              placeholder="Facebook URL"
              value={form.facebookUrl}
              onChange={(event) => updateField("facebookUrl", event.target.value)}
            />
            <Input
              placeholder="Instagram URL"
              value={form.instagramUrl}
              onChange={(event) => updateField("instagramUrl", event.target.value)}
            />
            <Input
              placeholder="Twitter/X URL"
              value={form.twitterUrl}
              onChange={(event) => updateField("twitterUrl", event.target.value)}
            />
            <Input
              placeholder="TikTok URL"
              value={form.tiktokUrl}
              onChange={(event) => updateField("tiktokUrl", event.target.value)}
            />
            <Input
              placeholder="WhatsApp URL"
              value={form.whatsappUrl}
              onChange={(event) => updateField("whatsappUrl", event.target.value)}
            />
            <Input
              placeholder="Custom URL"
              value={form.customUrl}
              onChange={(event) => updateField("customUrl", event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setEditOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-full bg-[#111827] hover:bg-[#1F2937]"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopDetails;
