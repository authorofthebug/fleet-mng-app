"use client";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import {
    CalendarDaysIcon,
    MapPinIcon,
    PlayCircleIcon,
    UserIcon,
    ArrowUturnLeftIcon,
    TruckIcon,
    Cog6ToothIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import ProgramacionTab from "./ProgramacionTab";
import { Company } from '@/lib/api/agency';

export default function SchedulePage() {
    // Estados para los inputs
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [fechaIda, setFechaIda] = useState("");
    const [fechaVuelta, setFechaVuelta] = useState("");
    const [dias, setDias] = useState(0);
    const [cliente, setCliente] = useState("");
    const [tipoServicio, setTipoServicio] = useState("");
    const [condicion, setCondicion] = useState("");

    // Simulación de datos del dashboard
    const vehiculosDisponibles = 10;
    const vehiculosServicio = 5;
    const vehiculosMantenimiento = 2;
    const vehiculosSiniestrados = 1;

    const dashboard = [
        {
            label: "Vehículos Disponibles",
            icon: TruckIcon,
            value: vehiculosDisponibles,
            color: "text-blue-700",
        },
        {
            label: "En Servicio",
            icon: Cog6ToothIcon,
            value: vehiculosServicio,
            color: "text-green-600",
        },
        {
            label: "En Mantenimiento",
            icon: WrenchScrewdriverIcon,
            value: vehiculosMantenimiento,
            color: "text-yellow-500",
        },
        {
            label: "Siniestrados",
            icon: ExclamationTriangleIcon,
            value: vehiculosSiniestrados,
            color: "text-red-600",
        },
    ];

    // Calcular días automáticamente
    const calcularDias = (desde, hasta) => {
        if (desde && hasta) {
            const fecha1 = new Date(desde);
            const fecha2 = new Date(hasta);
            const diferencia = Math.floor((fecha2 - fecha1) / (1000 * 3600 * 24) + 1);
            setDias(diferencia >= 0 ? diferencia : 0);
        }
    };

    // Efecto para recalcular días cuando cambian las fechas
    const handleFechaIda = (e) => {
        setFechaIda(e.target.value);
        calcularDias(e.target.value, fechaVuelta);
    };
    const handleFechaVuelta = (e) => {
        setFechaVuelta(e.target.value);
        calcularDias(fechaIda, e.target.value);
    };

    // Simulación de guardar programación
    const guardarProgramacion = () => {
        alert("¡Programación generada!");
    };

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
        <Layout>
            <ProgramacionTab />
        </Layout>
    );
}