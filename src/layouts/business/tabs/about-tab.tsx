import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Business } from "@/types/business";
import { getStatsBusinessById } from "@/services/stats-service.service";
import { MapPin, ChevronUp } from "lucide-react";
import { Facebook, MessageCircle, Instagram, Twitter } from "lucide-react";

const AboutTab = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business>(null!);
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    locations: true,
    hours: true,
    social: true,
  });

  useEffect(() => {
    if (id) {
      const fetchBusiness = async () => {
        try {
          const response = await getStatsBusinessById({ id });
          setBusiness(response?.data || null);
        } catch (error) {
          console.error("Error fetching business:", error);
        }
      };
      fetchBusiness();
    }
  }, [id]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: business?.socialMediaProfile?.facebook,
      color: "bg-blue-600",
      iconUrl: "/socials/facebook.png",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: business?.socialMediaProfile?.facebook,
      color: "bg-green-500",
      iconUrl: "/socials/whatsapp.png",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: business?.socialMediaProfile?.instagram,
      color: "bg-pink-600",
      iconUrl: "/socials/instagram.png",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: business?.socialMediaProfile?.twitter,
      iconUrl: "/socials/x.png",
      color: "bg-black",
    },
    {
      name: "TikTok",
      icon: () => (
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-2.4-2.4c.23 0 .46.04.68.08V8.56a8.08 8.08 0 0 0-1.38-.12A4.81 4.81 0 0 0 5.07 19a4.82 4.82 0 0 0 4.81 4.77 4.82 4.82 0 0 0 4.78-4.82V12.4a6.24 6.24 0 0 0 3.74 1.38V10.67a5.52 5.52 0 0 1-.59-.05z" />
        </svg>
      ),
      iconUrl: "/socials/tiktok.png",
      color: "bg-black",
    },
  ];

  return (
    <div className="w-full py-6 bg-white space-y-4 px-10 rounded-2xl my-5">
      {/* About Section */}
      <div className="bg-white rounded-lg py-2">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("about")}
        >
          <h3 className="text-lg font-semibold">
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
          <p className="text-gray-600 mt-3 leading-relaxed text-sm">
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
            <div className="border border-gray-200 rounded-lg p-4 flex items-start gap-3">
              <div className="bg-orange-500 rounded-full p-2 flex-shrink-0">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">
                  {business?.businessName} Yaba
                </h4>
                <p className="text-gray-500 text-xs mt-1 truncate">
                  {business?.businessMainAddress?.street ||
                    "32, Ajose Adeogun street, Victoria Is..."}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-start gap-3 opacity-50">
              <div className="bg-gray-300 rounded-full p-2 flex-shrink-0">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">
                  {business?.businessName} Maryland
                </h4>
                <p className="text-gray-500 text-xs mt-1 truncate">
                  32, Ajose Adeogun street, Victoria Is...
                </p>
              </div>
            </div>
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
            {business?.opening_hours || "10:00 am - 09:30 pm"}
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
          <div className="flex gap-3 mt-4">
            {socialLinks.map((social) => {
              return (
                <a
                  key={social.name}
                  href={social.url || "#"}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutTab;
