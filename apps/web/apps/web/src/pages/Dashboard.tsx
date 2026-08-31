import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/useAuth';
import { Calendar, Ticket as TicketIcon, RefreshCw, LogOut, Search, MapPin, Clock, User } from 'lucide-react';
import { CheckoutModal } from '../components/CheckoutModal';
import { BottomNav } from '../components/BottomNav';
import { EventBanner } from '../components/EventBanner';

interface EventItem {
  id: string;
  title: string;
  description: string;
  location?: string;
  eventDate?: string;
  date?: string;
  availableTickets?: number;
  price?: number;
  ticketTypes?: Array<{ price: number; quantity?: number }>;
  bannerUrl?: string;
}

export const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available'>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'tickets' | 'profile'>('events');
  const { user, logout } = useAuth();

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Utilizador');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/events');
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/events');
        if (!isMounted) return;
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === 'available') {
        return matchesSearch && (event.availableTickets ?? 1) > 0;
      }

      return matchesSearch;
    });
  }, [events, searchQuery, selectedFilter]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr || isNaN(Date.parse(dateStr))) return 'Data a anunciar';
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Extrai o preço correto de qualquer formato retornado pela API
  const getEventPrice = (event: EventItem): number => {
    if (typeof event.price === 'number') return event.price;
    if (event.ticketTypes && event.ticketTypes.length > 0) return event.ticketTypes[0].price;
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Event<span className="text-indigo-600">Pulse</span>
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <User size={14} className="text-indigo-600" />
            <span className="[max-w-[120px] truncate">{displayName}</span>
          </div>

          <button
            onClick={logout}
            className="hidden sm:flex p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 sm:max-w-4xl">
        {activeTab === 'events' && (
          <>
            {/* Pesquisa e Filtros */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar eventos, conferências..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setSelectedFilter('available')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedFilter === 'available'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Disponíveis
                  </button>
                </div>

                <button
                  onClick={fetchEvents}
                  className="p-1.5 text-slate-500 hover:text-slate-800 transition"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Lista de Eventos */}
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                A carregar eventos...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhum evento encontrado.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {filteredEvents.map((event) => {
                  const rawDate = event.eventDate || event.date;
                  const price = getEventPrice(event);

                  return (
                    <div
                      key={event.id}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition"
                    >
                      <div>
                        <EventBanner bannerUrl={event.bannerUrl} title={event.title} />

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 font-semibold text-indigo-600">
                              <Calendar size={13} />
                              {formatDate(rawDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={13} /> 19:00
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition">
                            {event.title}
                          </h3>

                          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>

                          <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin size={13} className="text-indigo-600 shrink-0" />
                            <span className="truncate">{event.location || 'Luanda'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Preço</span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {price > 0 ? `${price.toLocaleString('pt-AO')} Kz` : 'Grátis'}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedEvent(event)}
                          disabled={(event.availableTickets ?? 1) < 1}
                          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-40"
                        >
                          <TicketIcon size={14} />
                          {(event.availableTickets ?? 1) < 1 ? 'Esgotado' : 'Reservar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'tickets' && (
          <div className="py-12 text-center text-slate-400 text-xs">
            Serviço de bilhetes temporariamente indisponível.
          </div>
        )}
      </main>

      <CheckoutModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSuccess={fetchEvents}
      />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};