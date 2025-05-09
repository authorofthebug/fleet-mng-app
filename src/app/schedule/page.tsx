"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
    ArrowUturnLeftIcon, CalendarDaysIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon, MapPinIcon, PlayCircleIcon,
    TruckIcon,
    UserIcon,
    WrenchScrewdriverIcon,
    PlusIcon,
    PencilSquareIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

import { useSidebarWidth } from "@/hooks/useSidebarWidth";
import { scheduleService, Schedule } from "@/lib/api/schedule";
import { clientService, Client } from "@/lib/api/client";
import { vehicleService, Vehicle } from "@/lib/api/vehicle";
import Notification from "@/components/common/Notification";
import DataTable from "@/components/common/DataTable";
import Layout from '@/components/layout/Layout';

// Modal component for the schedule form
const ScheduleFormModal = ({
                               show,
                               onClose,
                               onSubmit,
                               formData,
                               setFormData,
                               editingSchedule
                           }: {
    show: boolean;
    onClose: () => void;
    onSubmit: (e: FormEvent) => Promise<void>;
    formData: Schedule;
    setFormData: React.Dispatch<React.SetStateAction<Schedule>>;
    editingSchedule: Schedule | null;
}) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [vehicleError, setVehicleError] = useState<string | null>(null);

    // Fetch clients and vehicles when the modal is shown
    useEffect(() => {
        if (show) {
            fetchClients();
            fetchVehicles();
        }
    }, [show]);

    const fetchClients = async () => {
        try {
            setLoadingClients(true);
            setClientError(null);
            const data = await clientService.getAll();
            setClients(data);
        } catch (error) {
            console.error('Error loading clients:', error);
            setClientError('Failed to load clients');
        } finally {
            setLoadingClients(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            setLoadingVehicles(true);
            setVehicleError(null);
            const data = await vehicleService.getAll();
            setVehicles(data);
        } catch (error) {
            console.error('Error loading vehicles:', error);
            setVehicleError('Failed to load vehicles');
        } finally {
            setLoadingVehicles(false);
        }
    };

    if (!show) return null;

    const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newStartTime = e.target.value;
        setFormData(prev => ({ ...prev, startTime: newStartTime }));
    };

    const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newEndTime = e.target.value;
        setFormData(prev => ({ ...prev, endTime: newEndTime }));
    };

    return (
        <>
            {/* Overlay that covers only the main content area */}
            <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
                onClick={onClose}
                style={{ left: 'var(--sidebar-width, 16rem)' }}
            ></div>

            {/* Modal container positioned in the main content area */}
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                style={{ left: 'var(--sidebar-width, 16rem)' }}
            >
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="CONFIRMED">Confirmed</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</label>
                                        <input
                                            type="text"
                                            value={formData.origin}
                                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</label>
                                        <input
                                            type="text"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.startTime}
                                            onChange={handleStartTimeChange}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.endTime}
                                            onChange={handleEndTimeChange}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client</label>
                                        <select
                                            value={formData.clientId}
                                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        >
                                            <option value="">Select Client</option>
                                            {loadingClients ? (
                                                <option value="" disabled>Loading clients...</option>
                                            ) : clientError ? (
                                                <option value="" disabled>Error loading clients</option>
                                            ) : (
                                                clients.map(client => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.name}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</label>
                                        <select
                                            value={formData.vehicleId}
                                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        >
                                            <option value="">Select Vehicle</option>
                                            {loadingVehicles ? (
                                                <option value="" disabled>Loading vehicles...</option>
                                            ) : vehicleError ? (
                                                <option value="" disabled>Error loading vehicles</option>
                                            ) : (
                                                vehicles.map(vehicle => (
                                                    <option key={vehicle.id} value={vehicle.id}>
                                                        {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plate</label>
                                        <input
                                            type="text"
                                            value={formData.plate}
                                            onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</label>
                                        <input
                                            type="text"
                                            value={formData.zone}
                                            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                    >
                                        {editingSchedule ? (
                                            <>
                                                <PencilSquareIcon className="h-5 w-5 mr-2" />
                                                Update
                                            </>
                                        ) : (
                                            <>
                                                <PlusIcon className="h-5 w-5 mr-2" />
                                                Create
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function ProgramacionTab() {
    // Use the sidebar width hook to set the CSS variable
    useSidebarWidth();

    // Form state management
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [formData, setFormData] = useState<Schedule>({
        id: "",
        description: "",
        status: "",
        createdAt: "",
        updatedAt: "",
        clientId: "",
        vehicleId: "",
        origin: "",
        plate: "",
        zone: "",
        destination: "",
        startTime: "",
        endTime: ""
    });

    // Filter state management
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

    const handleAdd = () => {
        setEditingSchedule(null);
        setFormData({
            id: "",
            description: "",
            status: "PENDING",
            createdAt: "",
            updatedAt: "",
            clientId: "",
            vehicleId: "",
            origin: "",
            plate: "",
            zone: "",
            destination: "",
            startTime: "",
            endTime: ""
        });
        setShowForm(true);
    };

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter schedules based on search text and status
    const filterSchedules = (text: string, status: string, schedulesToFilter = schedules) => {
        let filtered = [...schedulesToFilter];

        // Filter by status if selected
        if (status) {
            filtered = filtered.filter(schedule =>
                schedule.status === status
            );
        }

        // Filter by search text if provided
        if (text) {
            const searchLower = text.toLowerCase();
            filtered = filtered.filter(schedule => {
                // Search across all relevant fields
                return (
                    (schedule.origin && schedule.origin.toLowerCase().includes(searchLower)) ||
                    (schedule.destination && schedule.destination.toLowerCase().includes(searchLower)) ||
                    (schedule.clientId && schedule.clientId.toLowerCase().includes(searchLower)) ||
                    (schedule.description && schedule.description.toLowerCase().includes(searchLower)) ||
                    (schedule.status && schedule.status.toLowerCase().includes(searchLower)) ||
                    (schedule.plate && schedule.plate.toLowerCase().includes(searchLower))
                );
            });
        }

        return filtered;
    };

    // Load schedules on component mount
    useEffect(() => {
        loadSchedules();
    }, []);

    // Update filtered schedules when schedules, search text, or status filter changes
    useEffect(() => {
        setFilteredSchedules(filterSchedules(searchText, statusFilter));
    }, [schedules, searchText, statusFilter]);

    const loadSchedules = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await scheduleService.getAll();
            setSchedules(data);
        } catch (error) {
            console.error('Error loading schedules:', error);
            setError('Failed to load schedules');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            if (editingSchedule) {
                const id = editingSchedule.id!;
                console.log('Updating schedule with ID:', id, 'Data:', formData);
                const updatedSchedule = await scheduleService.update(id, formData);
                console.log('Schedule updated successfully:', updatedSchedule);
                const updatedSchedules = schedules.map(schedule =>
                    schedule.id === id ? updatedSchedule : schedule
                );
                setSchedules(updatedSchedules);
            } else {
                console.log('Creating new schedule with data:', formData);
                const newSchedule = await scheduleService.create(formData);
                console.log('Schedule created successfully:', newSchedule);
                setSchedules([...schedules, newSchedule]);
            }
            setShowForm(false);
        } catch (error) {
            console.error('Error saving schedule:', error);
            let errorMessage = 'Failed to save schedule';
            if (error instanceof Error) {
                errorMessage = `${error.name}: ${error.message}`;
            }
            setError(errorMessage);
        }
    };

    const handleEdit = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            id: schedule.id || '',
            description: schedule.description || '',
            status: schedule.status || '',
            createdAt: schedule.createdAt || '',
            updatedAt: schedule.updatedAt || '',
            clientId: schedule.clientId || '',
            vehicleId: schedule.vehicleId || '',
            origin: schedule.origin || '',
            plate: schedule.plate || '',
            zone: schedule.zone || '',
            destination: schedule.destination || '',
            startTime: schedule.startTime || '',
            endTime: schedule.endTime || ''
        });
        setShowForm(true);
    };
    /*
        const handleDelete = async (id: string) => {
            if (window.confirm('Are you sure you want to delete this schedule?')) {
                try {
                    setError(null);
                    await scheduleService.delete(id);
                    setSchedules(schedules.filter(schedule => schedule.id !== id));
                } catch (error) {
                    console.error('Error deleting schedule:', error);
                    let errorMessage = 'Failed to delete schedule';
                    if (error instanceof Error) {
                        errorMessage = `${error.name}: ${error.message}`;
                    }
                    setError(errorMessage);
                }
            }
        };
    */
    const handleFormCancel = () => {
        setShowForm(false);
        setEditingSchedule(null);
    };

    const dashboard = [
        {
            label: "Vehículos Disponibles",
            icon: TruckIcon,
            value: 10,
            color: "text-blue-700",
            bgColor: "bg-blue-100",
        },
        {
            label: "En Servicio",
            icon: Cog6ToothIcon,
            value: 5,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            label: "En Mantenimiento",
            icon: WrenchScrewdriverIcon,
            value: 3,
            color: "text-yellow-500",
            bgColor: "bg-yellow-100",
        },
        {
            label: "Siniestrados",
            icon: ExclamationTriangleIcon,
            value: 7,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
    ];
    const seguimiento = [
        {
            label: "Programado",
            icon: CalendarDaysIcon,
            value: 12,
            color: "text-blue-700",
            bgColor: "bg-blue-100",
        },
        {
            label: "Llegada al Punto",
            icon: MapPinIcon,
            value: 9,
            color: "text-emerald-700",
            bgColor: "bg-emerald-100",
        },
        {
            label: "Inicio del Servicio",
            icon: PlayCircleIcon,
            value: 7,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
        },
        {
            label: "Llegada al Cliente",
            icon: UserIcon,
            value: 6,
            color: "text-purple-700",
            bgColor: "bg-purple-100",
        },
        {
            label: "Retorno del Cliente",
            icon: ArrowUturnLeftIcon,
            value: 4,
            color: "text-red-700",
            bgColor: "bg-red-100",
        },
    ];
    return (
        <Layout>
            <div className="space-y-6">
                {/* Resumen Section - Always visible */}
                <div className="space-y-6 mb-8">


                    {/* Dashboard Stats - En Base */}
                    <div className="mb-6">

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <h4 className="text-md font-medium text-gray-700 mb-3">En Base</h4>
                            {dashboard.map((stat) => (
                                <div key={stat.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-full ${stat.bgColor} mr-4`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Stats - En Ruta */}
                    <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">En Ruta</h4>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {seguimiento.map((stat) => (
                                <div key={stat.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-full ${stat.bgColor} mr-4`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Schedule form modal */}
                <ScheduleFormModal
                    show={showForm}
                    onClose={handleFormCancel}
                    onSubmit={handleFormSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    editingSchedule={editingSchedule}
                />

                {/* Schedule header with add button */}
                <div className="border-b mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="Search schedules..."
                                    className="border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                    value={searchText}
                                    onChange={(e) => {
                                        const newSearchText = e.target.value;
                                        setSearchText(newSearchText);
                                    }}
                                />
                                <select
                                    className="border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={statusFilter}
                                    onChange={(e) => {
                                        const newStatusFilter = e.target.value;
                                        setStatusFilter(newStatusFilter);
                                    }}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Schedule
                        </button>
                    </div>
                </div>

                {/* Error notification */}
                {error && (
                    <Notification
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

                {/* DataTable Content */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <DataTable
                            data={filteredSchedules}
                            columns={[
                                { key: 'origin', label: 'Origin' },
                                { key: 'destination', label: 'Destination' },
                                { key: 'plate', label: 'Plate' },
                                { key: 'zone', label: 'Zone' },
                                {
                                    key: 'startTime',
                                    label: 'Start Time',
                                    render: (schedule: Schedule) => (
                                        <span>{new Date(schedule.startTime).toLocaleString()}</span>
                                    )
                                },
                                {
                                    key: 'endTime',
                                    label: 'End Time',
                                    render: (schedule: Schedule) => (
                                        <span>{new Date(schedule.endTime).toLocaleString()}</span>
                                    )
                                },
                                { key: 'clientId', label: 'Client ID' },
                                { key: 'description', label: 'Description' },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    render: (schedule: Schedule) => {
                                        let bgColor = 'bg-gray-100';
                                        let textColor = 'text-gray-600';

                                        switch(schedule.status) {
                                            case 'PENDING':
                                                bgColor = 'bg-yellow-100';
                                                textColor = 'text-yellow-600';
                                                break;
                                            case 'CONFIRMED':
                                                bgColor = 'bg-blue-100';
                                                textColor = 'text-blue-600';
                                                break;
                                            case 'IN_PROGRESS':
                                                bgColor = 'bg-purple-100';
                                                textColor = 'text-purple-600';
                                                break;
                                            case 'COMPLETED':
                                                bgColor = 'bg-green-100';
                                                textColor = 'text-green-600';
                                                break;
                                            case 'CANCELLED':
                                                bgColor = 'bg-red-100';
                                                textColor = 'text-red-600';
                                                break;
                                        }

                                        return (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                                                {schedule.status}
                                            </span>
                                        );
                                    }
                                }
                            ]}
                            onEdit={handleEdit}
                            onDelete={()=>{}}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </Layout>

    );
}