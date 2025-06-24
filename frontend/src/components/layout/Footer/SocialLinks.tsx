"use client";

import socialLinks from "@/data/SocialLinks";
import Link from "next/link";

export default function SocialLinks() {
  return (
    <div className="flex space-x-4">
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-10 h-10 bg-red-700 rounded-full flex items-center justify-center
              text-red-300 transition-all duration-200
              hover:bg-red-600 hover:scale-110
            `}
            aria-label={social.name}
          >
            <IconComponent className="w-5 h-5" />
          </Link>
        );
      })}
    </div>
  );
}
