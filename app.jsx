import { useState, useEffect } from "react";

const SERVICES = [
  { id: 1, title: "Corte degradê", price: 25 },
  { id: 2, title: "Corte social", price: 20 },
  { id: 3, title: "Barba", price: 10 },
  { id: 4, title: "Nevou", price: 90 },
  { id: 5, title: "Reflexo", price: 80 },
  { id: 6, title: "Sobrancelha", price: 5 },
];

// gera horários de 30 em 30
function generateTimes() {
  const times = [];
  let h = 9;
  let m = 30;

  while (h < 20) {
    times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m === 60) {
      m = 0;
      h++;
    }
  }
  return times;
}

export default function App() {
  const TIMES = generateTimes();

  const [selectedServices, setSelectedServices] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [blockedTimes, setBlockedTimes] = useState([]);

  // carregar horários já ocupados
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookings")) || [];
    setBlockedTimes(saved);
  }, [date]);

  function toggleService(service) {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  }

  function handleConfirm(e) {
    e.preventDefault();

    const newBooking = { date, time };

    const saved = JSON.parse(localStorage.getItem("bookings")) || [];
    localStorage.setItem("bookings", JSON.stringify([...saved, newBooking]));

    const servicesText = selectedServices
      .map((s) => `${s.title} - R$${s.price}`)
      .join(", ");

    const msg = `
✂️ *Agendamento Barbearia*
👤 Nome: ${name}
📅 Data: ${date}
⏰ Horário: ${time}
💈 Serviços: ${servicesText}
    `;

    window.open(
      `https://wa.me/5584987716386?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setTime("");
  }

  function isBlocked(t) {
    return blockedTimes.some(
      (b) => b.date === date && b.time === t
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Agendamento</h1>

      {/* SERVIÇOS */}
      {SERVICES.map((s) => (
        <label key={s.id} className="flex justify-between py-2">
          <span>{s.title} - R$ {s.price}</span>
          <input
            type="checkbox"
            onChange={() => toggleService(s)}
            checked={selectedServices.some(x => x.id === s.id)}
          />
        </label>
      ))}

      {/* FORM */}
      <form onSubmit={handleConfirm} className="space-y-4 mt-4">
        <input
          required
          placeholder="Seu nome"
          className="w-full p-3 border rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          required
          type="date"
          className="w-full p-3 border rounded"
          onChange={(e) => setDate(e.target.value)}
        />

        {/* HORÁRIOS */}
        <div className="grid grid-cols-3 gap-2">
          {TIMES.map((t) => (
            <button
              type="button"
              key={t}
              disabled={isBlocked(t)}
              onClick={() => setTime(t)}
              className={`py-2 rounded font-bold text-sm
                ${time === t ? "bg-black text-white" : "bg-gray-100"}
                ${isBlocked(t) && "opacity-40 cursor-not-allowed"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          disabled={!time || selectedServices.length === 0}
          className="w-full bg-black text-white py-3 rounded font-bold"
        >
          Confirmar no WhatsApp
        </button>
      </form>
    </div>
  );
    }
