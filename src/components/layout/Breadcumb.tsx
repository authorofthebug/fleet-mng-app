"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const friendlyNames: Record<string, string> = {
        schedule: "Programación",
        agency: "Agencias",
        // ...agrega más si quieres
    };

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:underline text-blue-700 font-semibold">
                Inicio
            </Link>
            {segments.map((seg, idx) => (
                <span key={idx} className="flex items-center">
          <span className="mx-1 text-gray-400">/</span>
                    {idx === segments.length - 1 ? (
                        <span className="text-gray-700 font-semibold">
              {friendlyNames[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)}
            </span>
                    ) : (
                        <Link
                            href={"/" + segments.slice(0, idx + 1).join("/")}
                            className="hover:underline text-blue-700"
                        >
                            {friendlyNames[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)}
                        </Link>
                    )}
        </span>
            ))}
        </nav>
    );
}