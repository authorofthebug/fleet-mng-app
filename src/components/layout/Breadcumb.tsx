import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';

export default function Breadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const friendlyNames: Record<string, string> = {
        schedule: "Programación",
        client: "Cliente",
        driver: "Conductor",
        vehicle: "Vehículo",
        "generic-types": "Catálogo",
        // Add more as needed
    };

    return (
        <nav className="flex pl-0" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                    <Link 
                        href="/" 
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                        <HomeIcon className="w-4 h-4 mr-2" />
                        Inicio
                    </Link>
                </li>
                
                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;
                    
                    return (
                        <li key={segment} className="flex items-center">
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            {isLast ? (
                                <span className="ml-1 text-sm font-medium text-blue-600 md:ml-2">
                                    {friendlyNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)}
                                </span>
                            ) : (
                                <Link 
                                    href={href}
                                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                                >
                                    {friendlyNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
