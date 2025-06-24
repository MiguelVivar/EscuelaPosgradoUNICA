"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdmissionResults from "./AdmissionResults";
import CampusVirtual from "./CampusVirtual";
import NavItems from "@/data/NavItems";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

function MobileMenu({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: MobileMenuProps) {
  const pathname = usePathname();
  return (
    <div
      className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden`}
    >
      <div className="py-4 border-t border-gray-200">
        {NavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href || "#"}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-3 font-medium transition-colors hover:bg-gray-50 hover:text-amber-600 ${
              pathname === item.href
                ? "text-amber-600 bg-amber-50 border-r-4 border-amber-600"
                : "text-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
        <div className="px-4 py-3 border-t border-gray-200 mt-4 flex flex-col gap-6">
          <AdmissionResults />
          <CampusVirtual />
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
