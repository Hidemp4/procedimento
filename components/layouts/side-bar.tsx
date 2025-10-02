"use client";

import { SideBarCard } from "@/components/layouts/side-bar-card";
import Link from "next/link";

export function SideBar() {
    return (
        <ul className="fixed left-0 top-12 p-2 h-screen border-r bg-white w-[60px] hover:w-48 transition-all duration-300 ease-in-out z-10 overflow-hidden group">
            {SideBarCard.map((item, index) => (
                <Link
                    href={item.link}
                    key={index}
                    className="flex items-center p-2 gap-2 rounded-md hover:bg-gray-200 whitespace-nowrap"
                >
                    <div className="shrink-0">
                        {item.icon}
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {item.label}
                    </span>
                </Link>
            ))}
        </ul>
    );
}
