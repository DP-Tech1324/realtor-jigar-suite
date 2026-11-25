import { Building2, Facebook, Home, Instagram, type LucideIcon } from "lucide-react";

// Jigar's public profiles, shown in the footer and the About section
export const SOCIAL_LINKS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "https://www.facebook.com/p/Jigar-Patel-Realtor-100090956177328/", icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/jigarpatelrealtor/", icon: Instagram, label: "Instagram" },
  { href: "https://www.realtor.ca/agent/2160765/jigar-patel-2345-argentia-road-unit-201b-mississauga-ontario-l5n8k4", icon: Home, label: "REALTOR.ca profile" },
  { href: "https://www.royallepage.ca/en/agent/ontario/mississauga/jigar-patel/79073/", icon: Building2, label: "Royal LePage profile" },
];
