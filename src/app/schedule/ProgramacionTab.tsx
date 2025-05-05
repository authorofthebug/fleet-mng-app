"use client";
import { useState, ChangeEvent } from "react";
import InputConSugerencias from "./../../components/InputConSugerencias";
import {
    ArrowUturnLeftIcon, CalendarDaysIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon, MapPinIcon, PlayCircleIcon,
    TruckIcon,
    UserIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";

export default function ProgramacionTab() {
    const [activeTab, setActiveTab] = useState("programacion");

    // Estados del formulario
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [fechaIda, setFechaIda] = useState("");
    const [fechaVuelta, setFechaVuelta] = useState("");
    const [dias, setDias] = useState(0);
    const [cliente, setCliente] = useState("");
    const [tipoServicio, setTipoServicio] = useState("");
    const [condicion, setCondicion] = useState("");

        // Calcular días automáticamente
    const calcularDias = (desde: string, hasta: string) => {
        if (desde && hasta) {
            const fecha1 = new Date(desde);
            const fecha2 = new Date(hasta);
            const diferencia = Math.floor((fecha2.getTime() - fecha1.getTime()) / (1000 * 3600 * 24) + 1);
            setDias(diferencia >= 0 ? diferencia : 0);
        }
    };

    const handleFechaIda = (e: ChangeEvent<HTMLInputElement>) => {
        setFechaIda(e.target.value);
        calcularDias(e.target.value, fechaVuelta);
    };
    const handleFechaVuelta = (e: ChangeEvent<HTMLInputElement>) => {
        setFechaVuelta(e.target.value);
        calcularDias(fechaIda, e.target.value);
    };

    const guardarProgramacion = () => {
        alert("¡Programación generada!");
    };

    const dashboard = [
        {
            label: "Vehículos Disponibles",
            icon: TruckIcon,
            value: 10,
            color: "text-blue-700",
        },
        {
            label: "En Servicio",
            icon: Cog6ToothIcon,
            value: 5,
            color: "text-green-600",
        },
        {
            label: "En Mantenimiento",
            icon: WrenchScrewdriverIcon,
            value: 3,
            color: "text-yellow-500",
        },
        {
            label: "Siniestrados",
            icon: ExclamationTriangleIcon,
            value: 7,
            color: "text-red-600",
        },
    ];
    const seguimiento = [
        {
            label: "Programado",
            icon: CalendarDaysIcon,
            value: 12,
            color: "text-blue-700",
        },
        {
            label: "Llegada al Punto",
            icon: MapPinIcon,
            value: 9,
            color: "text-emerald-700",
        },
        {
            label: "Inicio del Servicio",
            icon: PlayCircleIcon,
            value: 7,
            color: "text-yellow-600",
        },
        {
            label: "Llegada al Cliente",
            icon: UserIcon,
            value: 6,
            color: "text-purple-700",
        },
        {
            label: "Retorno del Cliente",
            icon: ArrowUturnLeftIcon,
            value: 4,
            color: "text-red-700",
        },
    ];
    return (
        <div className="w-full bg-white/90 rounded-xl shadow p-6 mt-8">
            {/* Tabs */}
            <div className="border-b mb-6">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                        className={`relative py-3 px-4 rounded-t-md text-sm font-semibold transition-all duration-300
      ${activeTab === "resumen"
                            ? "bg-gradient-to-t from-blue-100 to-white text-blue-800 shadow-md"
                            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100"}`}
                        onClick={() => setActiveTab("resumen")}
                        type="button"
                    >
                        Resumen
                    </button>
                    <button
                        className={`relative py-3 px-4 rounded-t-md text-sm font-semibold transition-all duration-300
          ${activeTab === "programacion"
                            ? "bg-gradient-to-t from-blue-100 to-white text-blue-800 shadow-md"
                            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100"}`}
                        onClick={() => setActiveTab("programacion")}
                        type="button"
                    >
                        Programación
                        {activeTab === "programacion" && (
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t"></span>
                        )}
                    </button>
                    {/* Puedes agregar más tabs aquí con el mismo estilo */}
                    <button
                        className={`relative py-3 px-4 rounded-t-md text-sm font-semibold transition-all duration-300
      ${activeTab === "clientes"
                            ? "bg-gradient-to-t from-blue-100 to-white text-blue-800 shadow-md"
                            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100"}`}
                        onClick={() => setActiveTab("clientes")}
                        type="button"
                    >
                        Clientes
                    </button>
                    <button
                        className={`relative py-3 px-4 rounded-t-md text-sm font-semibold transition-all duration-300
      ${activeTab === "vehiculos"
                            ? "bg-gradient-to-t from-blue-100 to-white text-blue-800 shadow-md"
                            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100"}`}
                        onClick={() => setActiveTab("vehiculos")}
                        type="button"
                    >
                        Vehículos
                    </button>
                    <button
                        className={`relative py-3 px-4 rounded-t-md text-sm font-semibold transition-all duration-300
      ${activeTab === "reportes"
                            ? "bg-gradient-to-t from-blue-100 to-white text-blue-800 shadow-md"
                            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100"}`}
                        onClick={() => setActiveTab("reportes")}
                        type="button"
                    >
                        Reportes
                    </button>
                </nav>
            </div>

            {activeTab === "resumen" && (

                <div className="bg-white/90 rounded-xl shadow p-6 w-full">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 border border-dashed border-gray-400 p-4">
                        <div className="relative">
                            <label className="absolute -left-6 top-1/2 -translate-y-1/2 transform -rotate-90 text-sm font-bold text-blue-600">
                                En Base
                            </label>

                        </div>
                        {dashboard.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-col items-center justify-center min-h-[120px] py-4 w-full"
                            >
                                <item.icon className="h-6 w-6 text-gray-400 mb-1" />
                                <span className={`text-3xl font-extrabold ${item.color}`}>
                                            {item.value}
                                        </span>
                                <span className="font-medium text-gray-700 text-center text-sm mt-1">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-7 gap-6 border border-dashed border-gray-400 p-4">
                        <div className="relative">
                            <label className="absolute -left-6 top-1/2 -translate-y-1/2 transform -rotate-90 text-sm font-bold text-blue-600">
                                En Ruta
                            </label>

                        </div>
                        {seguimiento.map((item) => (
                            <div key={item.label}
                                 className="flex flex-col items-center justify-center min-h-[120px] py-4 w-full">
                                <item.icon className="h-6 w-6 text-gray-400 mb-1" />
                                <span className={`text-3xl font-extrabold ${item.color}`}>
                                            {item.value}
                                        </span>
                                <span className="font-medium text-gray-700 text-center text-sm mt-1">{item.label}</span>
                            </div>
                        ))}
                    </div>

                </div>

            )}
            {activeTab === "programacion" && (
                <form className="space-y-6">
                    <InputConSugerencias
                        value={origen}
                        onChange={setOrigen}
                        label="Origen"
                    />
                    <InputConSugerencias
                        value={destino}
                        onChange={setDestino}
                        label="Destino"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-blue-700">Desde</label>
                            <input
                                type="date"
                                value={fechaIda}
                                onChange={handleFechaIda}
                                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-blue-700">Hasta</label>
                            <input
                                type="date"
                                value={fechaVuelta}
                                onChange={handleFechaVuelta}
                                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-blue-700">Días</label>
                            <input
                                type="number"
                                value={dias}
                                readOnly
                                className="border border-blue-200 rounded px-3 py-2 bg-gray-100 w-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-blue-700">Cliente</label>
                            <select
                                value={cliente}
                                onChange={e => setCliente(e.target.value)}
                                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Cliente</option>
                                <option>BRM CONSULTORES</option>
                                <option>XMETA2</option>
                                <option>Emilio</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-blue-700">Tipo de Servicio</label>
                            <select
                                value={tipoServicio}
                                onChange={e => setTipoServicio(e.target.value)}
                                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Tipo de Servicio</option>
                                <option>Servicio 1</option>
                                <option>Servicio 2</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-blue-700">Condición</label>
                            <select
                                value={condicion}
                                onChange={e => setCondicion(e.target.value)}
                                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Condición</option>
                                <option>Servicio con pasajeros</option>
                                <option>Servicio sin pasajeros</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-start pt-2">
                        <button
                            type="button"
                            onClick={guardarProgramacion}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
                        >
                            Generar Programación
                        </button>
                    </div>
                </form>

            )}
        </div>
    );
}