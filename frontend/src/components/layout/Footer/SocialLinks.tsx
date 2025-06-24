"use client";

import socialLinks from "@/data/SocialLinks";
import Link from "next/link";

export default function SocialLinks() {
  return (
    <div className="flex space-x-3">
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-10 h-10 bg-zinc-800 hover:bg-amber-500/20 border border-zinc-700 hover:border-amber-500/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
            aria-label={social.name}
          >
            <IconComponent className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors duration-300" />
          </Link>
        );
      })}
    </div>
  );
}
