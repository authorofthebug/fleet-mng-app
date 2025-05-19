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
import InputConSugerencias from '@/components/InputConSugerencias';
import {Driver, driverService} from "@/lib/api/driver";

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

    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const [driverError, setDriverError] = useState<string | null>(null);

    // Fetch client, vehicle, and drivers when the modal is shown
    useEffect(() => {
        if (show) {
            fetchClients();
            fetchVehicles();
            fetchDrivers();
        }
    }, [show]);

    const fetchClients = async () => {
        try {
            setLoadingClients(true);
            setClientError(null);
            const data = await clientService.getAll();
            setClients(data);
        } catch (error) {
            console.error('Error loading client:', error);
            setClientError('Failed to load client');
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
            console.error('Error loading vehicle:', error);
            setVehicleError('Failed to load vehicle');
        } finally {
            setLoadingVehicles(false);
        }
    };

    const fetchDrivers = async () => {
        try {
            setLoadingDrivers(true);
            setDriverError(null);
            const response = await fetch('/api/drivers');
            if (!response.ok) {
                throw new Error('Failed to load drivers');
            }
            const data = await response.json();
            setDrivers(data);
        } catch (error) {
            console.error('Error loading drivers:', error);
            setDriverError('Failed to load drivers');
        } finally {
            setLoadingDrivers(false);
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
                                            <option value="PROGRAMED">Programado</option>
                                            <option value="ALMOST_ON_ARRIVAL">Llegada al punto</option>
                                            <option value="STARTED">Inicio del servicio</option>
                                            <option value="ON_CLIENT">Llegada al cliente</option>
                                            <option value="BACK_FROM_CLIENT">Retorno del cliente</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <InputConSugerencias
                                            value={formData.origin}
                                            onChange={(value) => setFormData({ ...formData, origin: value })}
                                            label="Origin"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <InputConSugerencias
                                            value={formData.destination}
                                            onChange={(value) => setFormData({ ...formData, destination: value })}
                                            label="Destination"
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

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                            onChange={(e) => {
                                                const selectedVehicleId = e.target.value;
                                                const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
                                                setFormData({
                                                    ...formData,
                                                    vehicleId: selectedVehicleId,
                                                    plate: selectedVehicle ? selectedVehicle.licensePlate : ''
                                                });
                                            }}
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
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</label>
                                        <select
                                            value={formData.driverId || ''}
                                            onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                                        >
                                            <option value="">Select Driver</option>
                                            {loadingDrivers ? (
                                                <option value="" disabled>Loading drivers...</option>
                                            ) : driverError ? (
                                                <option value="" disabled>Error loading drivers</option>
                                            ) : (
                                                drivers.map(driver => (
                                                    <option key={driver.id} value={driver.id}>
                                                        {driver.firstName} {driver.lastName}
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
                                            readOnly
                                            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 cursor-not-allowed bg-gray-100"
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
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
        driverId: "",
        origin: "",
        plate: "",
        zone: "",
        destination: "",
        startTime: "",
        endTime: ""
    });

    // Filter state management
    const [searchText] = useState<string>('');
    const [statusFilter] = useState<string>('');
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
    const [initialSortConfig] = useState({
        key: 'startTime',
        direction: 'desc' as 'asc' | 'desc'
    });

    const handleAdd = () => {
        setEditingSchedule(null);
        // Set default values with current date/time for start and end times
        const now = new Date();
        const later = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

        // Format for datetime-local input (YYYY-MM-DDThh:mm)
        const formatDateForInput = (date: Date) => {
            return date.toISOString().slice(0, 16);
        };

        setFormData({
            id: "",
            description: "",
            status: "PROGRAMED", // Valid status from the enum
            createdAt: formatDateForInput(now),
            updatedAt: formatDateForInput(now),
            clientId: "",
            vehicleId: "",
            driverId: "",
            origin: "",
            plate: "",
            zone: "",
            destination: "",
            startTime: formatDateForInput(now),
            endTime: formatDateForInput(later)
        });
        setShowForm(true);
    };

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter schedule based on search text and status
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
                    (schedule.driverId && schedule.driverId.toLowerCase().includes(searchLower)) ||
                    (schedule.description && schedule.description.toLowerCase().includes(searchLower)) ||
                    (schedule.status && schedule.status.toLowerCase().includes(searchLower)) ||
                    (schedule.plate && schedule.plate.toLowerCase().includes(searchLower))
                );
            });
        }

        return filtered;
    };

    // Load schedule, vehicle, client, and drivers on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                await Promise.all([loadSchedules(), loadVehicles(), loadClients(), loadDrivers()]);
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Update filtered schedule when schedule, search text, or status filter changes
    useEffect(() => {
        setFilteredSchedules(filterSchedules(searchText, statusFilter));
    }, [schedules, searchText, statusFilter]);

    const loadSchedules = async () => {
        try {
            const data = await scheduleService.getAll();
            setSchedules(data);
            return data;
        } catch (error) {
            console.error('Error loading schedule:', error);
            setError('Failed to load schedule');
            return [];
        }
    };

    const loadVehicles = async () => {
        try {
            const data = await vehicleService.getAll();
            setVehicles(data);
            return data;
        } catch (error) {
            console.error('Error loading vehicle:', error);
            setError('Failed to load vehicle');
            return [];
        }
    };

    const loadClients = async () => {
        try {
            const data = await clientService.getAll();
            setClients(data);
            return data;
        } catch (error) {
            console.error('Error loading client:', error);
            setError('Failed to load client');
            return [];
        }
    };

    const loadDrivers = async () => {
        try {
            const response = await driverService.getAll();
            //const data = await response.json();
            setDrivers(response);
            return response;
        } catch (error) {
            console.error('Error loading drivers:', error);
            setError('Failed to load drivers');
            return [];
        }
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setError(null);

            // Validate required fields
            const requiredFields = ['description', 'status', 'clientId', 'vehicleId', 'origin', 'plate', 'zone', 'destination', 'startTime', 'endTime'];
            const missingFields = requiredFields.filter(field => !formData[field as keyof Schedule]);

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Get current date for updatedAt if creating new schedule
            const now = new Date();

            // Ensure dates are in ISO format
            const dataToSubmit = {
                ...formData,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString(),
                // Make sure createdAt is included and preserved when updating
                createdAt: formData.createdAt || now.toISOString(),
                // Always update the updatedAt field
                updatedAt: now.toISOString()
            };

            if (editingSchedule) {
                const id = editingSchedule.id!;
                console.log('Updating schedule with ID:', id, 'Data:', dataToSubmit);

                // For update, ensure we have all required fields from the API
                const updateData = {
                    description: dataToSubmit.description,
                    status: dataToSubmit.status,
                    createdAt: dataToSubmit.createdAt,
                    updatedAt: dataToSubmit.updatedAt,
                    clientId: dataToSubmit.clientId,
                    vehicleId: dataToSubmit.vehicleId,
                    driverId: dataToSubmit.driverId || "",
                    origin: dataToSubmit.origin,
                    plate: dataToSubmit.plate,
                    zone: dataToSubmit.zone,
                    destination: dataToSubmit.destination,
                    startTime: dataToSubmit.startTime,
                    endTime: dataToSubmit.endTime
                };

                const updatedSchedule = await scheduleService.update(id, updateData);
                console.log('Schedule updated successfully:', updatedSchedule);
                const updatedSchedules = schedules.map(schedule =>
                    schedule.id === id ? updatedSchedule : schedule
                );
                setSchedules(updatedSchedules);
            } else {
                console.log('Creating new schedule with data:', dataToSubmit);
                const newSchedule = await scheduleService.create(dataToSubmit);
                console.log('Schedule created successfully:', newSchedule);
                setSchedules([...schedules, newSchedule]);
            }
            // Refresh all data to update dashboard stats and tables
            await Promise.all([loadSchedules(), loadVehicles(), loadClients(), loadDrivers()]);
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

        // Format datetime strings for datetime-local input if needed
        const formatDateForInput = (dateStr: string) => {
            if (!dateStr) return '';
            // If the date is already in the right format for datetime-local, return it
            if (dateStr.length >= 16 && dateStr.includes('T')) {
                return dateStr.slice(0, 16);
            }
            // Otherwise, convert to ISO and then format
            try {
                return new Date(dateStr).toISOString().slice(0, 16);
            } catch (e) {
                console.error('Error formatting date:', e);
                return dateStr;
            }
        };

        setFormData({
            id: schedule.id || '',
            description: schedule.description || '',
            status: schedule.status || '',
            createdAt: schedule.createdAt || '',
            updatedAt: schedule.updatedAt || '',
            clientId: schedule.clientId || '',
            vehicleId: schedule.vehicleId || '',
            driverId: schedule.driverId || '',
            origin: schedule.origin || '',
            plate: schedule.plate || '',
            zone: schedule.zone || '',
            destination: schedule.destination || '',
            startTime: formatDateForInput(schedule.startTime) || '',
            endTime: formatDateForInput(schedule.endTime) || ''
        });
        setShowForm(true);
    };
    /*
        const handleDelete = async (id: string) => {
            if (window.confirm('Are you sure you want to delete this schedule?')) {
                try {
                    setError(null);
                    await scheduleService.delete(id);
                    setSchedules(schedule.filter(schedule => schedule.id !== id));
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

    // Calculate dashboard stats based on actual vehicle data
    const dashboard = [
        {
            label: "Vehículos Disponibles",
            icon: TruckIcon,
            value: vehicles.filter(v => v.status === 'AVAILABLE').length,
            color: "text-blue-700",
            bgColor: "bg-blue-100",
        },
        {
            label: "En Servicio",
            icon: Cog6ToothIcon,
            value: vehicles.filter(v => v.status === 'IN_SERVICE' || v.status === 'ON_SERVICE').length,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            label: "En Mantenimiento",
            icon: WrenchScrewdriverIcon,
            value: vehicles.filter(v => v.status === 'IN_MAINTENANCE' || v.status === 'ON_MAINTENANCE').length,
            color: "text-yellow-500",
            bgColor: "bg-yellow-100",
        },
        {
            label: "Siniestrados",
            icon: ExclamationTriangleIcon,
            value: vehicles.filter(v => v.status === 'WITH_ISSUE' || v.status === 'CRASHED').length,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
    ];

    // Calculate seguimiento stats based on actual schedule data
    const seguimiento = [
        {
            label: "Programado",
            icon: CalendarDaysIcon,
            value: schedules.filter(s => s.status === 'PROGRAMED').length,
            color: "text-blue-700",
            bgColor: "bg-blue-100",
        },
        {
            label: "Llegada al Punto",
            icon: MapPinIcon,
            value: schedules.filter(s => s.status === 'ALMOST_ON_ARRIVAL').length,
            color: "text-emerald-700",
            bgColor: "bg-emerald-100",
        },
        {
            label: "Inicio del Servicio",
            icon: PlayCircleIcon,
            value: schedules.filter(s => s.status === 'STARTED').length,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
        },
        {
            label: "Llegada al Cliente",
            icon: UserIcon,
            value: schedules.filter(s => s.status === 'ON_CLIENT').length,
            color: "text-purple-700",
            bgColor: "bg-purple-100",
        },
        {
            label: "Retorno del Cliente",
            icon: ArrowUturnLeftIcon,
            value: schedules.filter(s => s.status === 'BACK_FROM_CLIENT').length,
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
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                                <div className="text-3xl font-mono font-bold flex items-center">
                                    {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    <span className="ml-1 text-blue-300 animate-pulse">
                                        :{currentTime.getSeconds().toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="text-blue-200">
                                    {currentTime.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
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
                                {
                                    key: 'startTime',
                                    label: 'Departure',
                                    render: (schedule: Schedule) => (
                                        <span>{new Date(schedule.startTime).toLocaleDateString('en-GB')}</span>
                                    )
                                },
                                {
                                    key: 'clientId',
                                    label: 'Client',
                                    render: (schedule: Schedule) => {
                                        // Find the client by ID
                                        const client = clients.find(c => c.id === schedule.clientId);
                                        return <span>{client ? client.name : schedule.clientId}</span>;
                                    }
                                },
                                { key: 'destination', label: 'Destination' },
                                { key: 'plate', label: 'Plate' },
                                {
                                    key: 'driverId',
                                    label: 'Driver',
                                    render: (schedule: Schedule) => {
                                        // Find the driver by ID
                                        const driver = drivers.find(d => d.id === schedule.driverId);
                                        return <span>{driver ? `${driver.firstName} ${driver.lastName}` : (schedule.driverId || '-')}</span>;
                                    }
                                },
                                {
                                    key: 'endTime',
                                    label: 'End Time',
                                    render: (schedule: Schedule) => (
                                        <span>{new Date(schedule.endTime).toLocaleDateString('en-GB')}</span>
                                    )
                                },
                                { key: 'zone', label: 'Area' },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    render: (schedule: Schedule) => {
                                        let bgColor = 'bg-gray-100';
                                        let textColor = 'text-gray-600';
                                        let displayStatus = schedule.status;

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
                                            case 'PROGRAMED':
                                                bgColor = 'bg-blue-100';
                                                textColor = 'text-blue-600';
                                                displayStatus = 'Programado';
                                                break;
                                            case 'ALMOST_ON_ARRIVAL':
                                                bgColor = 'bg-emerald-100';
                                                textColor = 'text-emerald-600';
                                                displayStatus = 'Llegada al punto';
                                                break;
                                            case 'STARTED':
                                                bgColor = 'bg-yellow-100';
                                                textColor = 'text-yellow-600';
                                                displayStatus = 'Inicio del servicio';
                                                break;
                                            case 'ON_CLIENT':
                                                bgColor = 'bg-purple-100';
                                                textColor = 'text-purple-600';
                                                displayStatus = 'Llegada al cliente';
                                                break;
                                            case 'BACK_FROM_CLIENT':
                                                bgColor = 'bg-red-100';
                                                textColor = 'text-red-600';
                                                displayStatus = 'Retorno del cliente';
                                                break;
                                        }

                                        return (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                                                {displayStatus}
                                            </span>
                                        );
                                    }
                                }
                            ]}
                            onEdit={handleEdit}
                            onDelete={()=>{}}
                            loading={loading}
                            initialSortConfig={initialSortConfig}
                        />
                    )}
                </div>
            </div>
            
            {/* Floating Add Button */}
            <button
                onClick={handleAdd}
                className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 hover:scale-110 group"
            >
                {/* Animated background effect */}
                <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 group-hover:animate-gradient-x transition-opacity"></span>
                
                {/* Shine effect */}
                <span className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
                
                {/* Button content */}
                <PlusIcon className="h-6 w-6 text-white relative z-10" />
                
                {/* Tooltip on hover */}
                <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Add Schedule
                </span>
            </button>
        </Layout>
    );
}
