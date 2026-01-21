import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { Clock, Calendar, Banknote, X, Scissors } from 'lucide-react';

const SERVICES = [
  { id: 1, title: 'BARBA', time: '30min', price: 15.00 },
  { id: 2, title: 'CABELO', time: '45min', price: 25.00 },
  { id: 3, title: 'CABELO + BARBA', time: '55min', price: 40.00 },
];

const WHATSAPP_NUMBER = "5584987716386"; 

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "agendamentos"), {
        cliente: name, servico: selectedService.title, preco: selectedService.price,
        data: date, hora: time, criadoEm: new Date()
      });
      const msg = `Olá! Agendamento no *WZ Du Corte*.\n\n👤 *Cliente:* ${name}\n✂️ *Serviço:* ${selectedService.title}\n📅 *Data:* ${date.split('-').reverse().join('/')}\n⏰ *Horário:* ${time}\n💰 *Total:* R$ ${selectedService.price},00`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      setSelectedService(null);
    } catch (e) { alert("Erro ao agendar."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* HEADER ESTILO SALONSOFT */}
      <header className="p-4 border-b border-gray-100 flex justify-between items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full border border-gray-200 overflow-hidden shadow-sm">
            <img src="/logo-wz.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-gray-500 leading-tight">Seja bem vindo(a) ao</p>
            <h1 className="text-xl font-bold">WZ Du Corte</h1>
          </div>
        </div>
        <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium border border-gray-100 shadow-sm">
          Meus agendamentos
        </button>
      </header>

      {/* LISTA DE SERVIÇOS */}
      <main className="max-w-2xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-6 mt-2 text-gray-700">Serviços</h2>
        
        <div className="space-y-0 divide-y divide-gray-100">
          {SERVICES.map((service) => (
            <div key={service.id} className="py-6 flex justify-between items-center transition active:bg-gray-50 px-2">
              <div className="space-y-2">
                <h3 className="font-bold text-base tracking-tight">{service.title}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>{service.time}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Banknote size={16} className="mr-2 text-gray-400" />
                  <span>a partir de R$ {service.price},00</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedService(service)}
                className="bg-yellow-100/50 text-black border border-yellow-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-200 transition"
              >
                <Calendar size={18} />
                Reservar
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE AGENDAMENTO */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Finalizar Reserva</h3>
              <button onClick={() => setSelectedService(null)} className="p-2 bg-gray-100 rounded-full"><X size={18}/></button>
            </div>
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <input type="text" placeholder="Seu Nome" required className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" onChange={e => setName(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" required className="p-4 bg-gray-50 border rounded-2xl outline-none text-sm" onChange={e => setDate(e.target.value)} />
                <input type="time" required className="p-4 bg-gray-50 border rounded-2xl outline-none text-sm" onChange={e => setTime(e.target.value)} />
              </div>
              <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 flex justify-center items-center gap-2">
                {loading ? 'Processando...' : 'Confirmar no WhatsApp'}
                {!loading && <Scissors size={20} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

