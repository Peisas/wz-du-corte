import { useState, useEffect } from "react";

const SERVICES = [
  { id: 1, title: "Corte degradê", price: 25 },
  { id: 2, title: "Corte social", price: 20 },
  { id: 3, title: "Barba", price: 10 },
  { id: 4, title: "Nevou", price: 90 },
  { id: 5, title: "Reflexo", price: 80 },
  { id: 6, title: "Sobrancelha", price: 5 },
];

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

  const [name, setName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [blockedTimes, setBlockedTimes] = useState([]);

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

  function isBlocked(t) {
    return blockedTimes.some(
      (b) => b.date === date && b.time === t
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
✂️ *Agendamento - WZ do Corte*
👤 Nome: ${name}
📅 Data: ${date}
⏰ Horário: ${time}
💈 Serviços: ${servicesText}
    `;

    window.open(
      `https://wa.me/5584987716386?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4 space-y-4">

        <h1 className="text-xl font-bold text-center">
          Agendamento Online
        </h1>

        {/* NOME */}
        <input
          required
          placeholder="Seu nome"
          className="w-full p-3 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* SERVIÇOS */}
        {name && (
          <>
            <h2 className="font-semibold">Escolha os serviços</h2>

            <div className="space-y-2">
              {SERVICES.map((s) => {
                const active = selectedServices.some(x => x.id === s.id);

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`w-full flex justify-between p-3 rounded border
                    ${active ? "bg-black text-white" : "bg-gray-50"}`}
                  >
                    <span>{s.title}</span>
                    <span>R$ {s.price}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* DATA */}
        {selectedServices.length > 0 && (
          <>
            <h2 className="font-semibold">Escolha a data</h2>
            <input
              type="date"
              required
              className="w-full p-3 border rounded"
              onChange={(e) => setDate(e.target.value)}
            />
          </>
        )}

        {/* HORÁRIOS */}
        {date && (
          <>
            <h2 className="font-semibold">Horário</h2>
            <div className="grid grid-cols-3 gap-2">
              {TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={isBlocked(t)}
                  onClick={() => setTime(t)}
                  className={`py-3 rounded font-bold text-sm
                    ${time === t ? "bg-black text-white" : "bg-gray-200"}
                    ${isBlocked(t) && "opacity-40"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {/* CONFIRMAR */}
        {time && (
          <button
            onClick={handleConfirm}
            className="w-full bg-green-600 text-white py-4 rounded font-bold"
          >
            Confirmar no WhatsApp
          </button>
        )}
      </div>
    </div>
  );
      }
