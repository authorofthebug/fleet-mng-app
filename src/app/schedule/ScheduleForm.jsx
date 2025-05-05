"use client";
import { useState } from "react";

export default function ScheduleForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    vehicleId: "",
    userId: "",
    status: "programado",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
      onSubmit={e => {
        e.preventDefault();
        onSubmit?.(form);
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Nueva Programación</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Título</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Inicio</label>
          <input
            type="datetime-local"
            name="startDateTime"
            value={form.startDateTime}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Fin</label>
          <input
            type="datetime-local"
            name="endDateTime"
            value={form.endDateTime}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Vehículo</label>
        <input
          name="vehicleId"
          value={form.vehicleId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="ID del vehículo"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Responsable</label>
        <input
          name="userId"
          value={form.userId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="ID del responsable"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Estado</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="programado">Programado</option>
          <option value="en_curso">En curso</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  );
}
