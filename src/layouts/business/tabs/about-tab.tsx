import { useState } from "react";
import type { Business } from "@/types/business";
import { MapPin, ChevronUp } from "lucide-react";

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

const normalizeUrl = (url?: string | null) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const AboutTab = ({ business }: { business?: Business | null }) => {
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    locations: true,
    hours: true,
    social: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  const websiteLink = normalizeUrl(
    business?.websiteUrl || business?.socialMediaProfile?.website
  );

  const socialLinks = [
    {
      name: "Facebook",
      url: normalizeUrl(business?.socialMediaProfile?.facebook),
      iconUrl: "/socials/facebook.png",
    },
    {
      name: "Instagram",
      url: normalizeUrl(business?.socialMediaProfile?.instagram),
      iconUrl: "/socials/instagram.png",
    },
    {
      name: "Twitter",
      url: normalizeUrl(business?.socialMediaProfile?.twitter),
      iconUrl: "/socials/x.png",
    },
    {
      name: "TikTok",
      url: normalizeUrl(business?.socialMediaProfile?.tiktok),
      iconUrl: "/socials/tiktok.png",
    },
    {
      name: "LinkedIn",
      url: normalizeUrl(business?.socialMediaProfile?.linkedin),
      iconUrl: "/socials/linkedin.png",
    },
  ].filter((social) => Boolean(social.url));

  return (
    <div className="w-full py-4 bg-white space-y-4 px-6 rounded-2xl my-5">
      {/* About Section */}
      <div className="bg-white rounded-lg py-2">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("about")}
        >
          <h3 className="text-md font-semibold">
            About {business?.businessName}
          </h3>
          <ChevronUp
            size={20}
            className={`transition-transform ${
              expandedSections.about ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
        {expandedSections.about && (
          <p className="text-gray-600 font-medium leading-relaxed text-sm">
            {business?.businessDescription ||
              "No description available for this business."}
          </p>
        )}
      </div>

      <hr />

      {/* Locations Section */}
      <div className="bg-white rounded-lg py-2">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("locations")}
        >
          <h3 className="text-lg font-semibold">Locations</h3>
          <ChevronUp
            size={20}
            className={`transition-transform ${
              expandedSections.locations ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
        {expandedSections.locations && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="border border-gray-200 rounded-lg p-4 flex items-start gap-3"
              >
                <div
                  className={`${
                    location.isMain ? "bg-orange-500" : "bg-gray-300"
                  } rounded-full p-2 flex-shrink-0`}
                >
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{location.title}</h4>
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    {location.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Opening Hours Section */}
      <div className="bg-white rounded-lg py-2">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("hours")}
        >
          <h3 className="text-lg font-semibold">Opening hours</h3>
          <ChevronUp
            size={20}
            className={`transition-transform ${
              expandedSections.hours ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
        {expandedSections.hours && (
          <p className="text-gray-700 mt-3 font-medium text-sm">
            {business?.opening_hours || "N/A"}
          </p>
        )}
      </div>

      <hr />

      {/* Social Links Section */}
      <div className="bg-white rounded-lg py-2">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("social")}
        >
          <h3 className="text-lg font-semibold">Social links</h3>
          <ChevronUp
            size={20}
            className={`transition-transform ${
              expandedSections.social ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
        {expandedSections.social && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => {
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={social.iconUrl}
                        alt={social.name}
                        className="w-10 h-10"
                      />
                    </a>
                  );
                })
              ) : (
                <p className="text-gray-600 text-sm">No social links available.</p>
              )}
            </div>

            {websiteLink && (
              <a
                href={websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline break-all"
              >
                {websiteLink}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutTab;
