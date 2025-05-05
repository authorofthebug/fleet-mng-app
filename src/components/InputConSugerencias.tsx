"use client";

import React, { useState, useEffect, useRef } from "react";

export interface Suggestion {
    label: string;
}

interface Props {
    value: string;
    onChange: (val: string) => void;
    label: string;
}

interface PhotonFeature {
    properties: {
        name: string;
        city?: string;
        country?: string;
    };
}

const InputConSugerencias: React.FC<Props> = ({ value, onChange, label }) => {
    const [sugerencias, setSugerencias] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchSugerencias = async (query: string) => {
        if (query.trim().length < 5) return;

        try {
            console.log(">>>>>>>>>>>"+query);
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();

            const results: Suggestion[] = (data.features as PhotonFeature[] || []).map((f) => ({
                label:
                    f.properties.name +
                    (f.properties.city ? `, ${f.properties.city}` : "") +
                    (f.properties.country ? `, ${f.properties.country}` : ""),
            }));

            setSugerencias(results);
        } catch (error) {
            console.error("Error buscando sugerencias:", error);
        }
    };

    useEffect(() => {
        const trimmed = value.trim();
        if (trimmed.length < 5) {
            setSugerencias([]); // 🧼 Limpia si no hay suficiente texto
            return;
        }

        const timeout = setTimeout(() => {
            fetchSugerencias(trimmed);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [value]);




    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col w-full relative" ref={inputRef}>
            <label className="text-xs font-semibold text-blue-700">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setShowSuggestions(true);
                }}
                className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && sugerencias.length > 0 && (
                <ul className="absolute z-10 top-full left-0  bg-white border border-gray-300 rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
                    {sugerencias.map((sug, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                onChange(sug.label);
                                setShowSuggestions(false);
                            }}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                        >
                            {sug.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InputConSugerencias;
