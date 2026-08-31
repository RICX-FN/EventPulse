import React, { useState } from 'react';
import { api } from '../api/client';
import { X, Ticket, AlertCircle, CheckCircle2, Loader2, Minus, Plus, MapPin, Calendar } from 'lucide-react';

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

interface CheckoutModalProps {
  event: EventItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ event, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'reserving' | 'purchasing'>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!event) return null;

  // Trata o preço vindo na raiz ou dentro de objetos/arrays de bilhetes
  const unitPrice =
    event.price ??
    (event.ticketTypes && event.ticketTypes.length > 0 ? event.ticketTypes[0].price : 0);

  const rawDate = event.eventDate || event.date;
  const formattedDate =
    rawDate && !isNaN(Date.parse(rawDate))
      ? new Date(rawDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Data a anunciar';

  const totalPrice = unitPrice * quantity;
  const available = event.availableTickets ?? 10;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < available) setQuantity(quantity + 1);
  };

  const handleFlow = async () => {
    setError('');
    setLoading(true);

    try {
      // Step 1: Reservar bilhete no Redis/DB
      setStep('reserving');
      const reserveRes = await api.post(`/api/events/${event.id}/reserve`, {
        quantity,
      });

      // Extrai o ticketId retornado da reserva (suporta retornos como { ticketId } ou { id } ou array)
      const ticketId =
        reserveRes.data?.ticketId ||
        reserveRes.data?.id ||
        (Array.isArray(reserveRes.data) ? reserveRes.data[0]?.id : null);

      if (!ticketId) {
        throw new Error('Não foi possível obter a chave do bilhete reservado.');
      }

      // Step 2: Efetivar compra do bilhete reservado
      setStep('purchasing');
      await api.post(`/api/events/tickets/${ticketId}/purchase`);

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: unknown) {
      console.error('Erro no fluxo de reserva/compra:', err);

      const message =
        err instanceof Error && 'response' in err
          ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      setError(
        message ||
          (err instanceof Error ? err.message : undefined) ||
          'Não foi possível concluir o processo de reserva e compra.'
      );
    } finally {
      setLoading(false);
      setStep('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="w-full sm:max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 text-slate-800">
        
        {/* Puxador Mobile */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Ticket className="text-indigo-600" size={20} />
            <h3 className="text-base font-bold text-slate-900 leading-tight">Confirmar Reserva</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mensagem de Sucesso */}
        {success ? (
          <div className="py-8 flex flex-col items-center text-center">
            <CheckCircle2 size={56} className="text-emerald-500 animate-bounce mb-3" />
            <h4 className="text-xl font-bold text-slate-900 mb-1">Compra Efetuada!</h4>
            <p className="text-slate-500 text-xs">
              Reserva efetuada e bilhete confirmado com sucesso no sistema.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Resumo do Evento */}
            <div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">{event.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-indigo-600" />
                  {event.location || 'Luanda'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-indigo-600" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Selector de Quantidade */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">Quantidade</span>
                <span className="text-[10px] text-slate-500">{available} bilhetes disponíveis</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || loading}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 disabled:opacity-40 transition shadow-sm"
                >
                  <Minus size={15} />
                </button>
                <span className="text-base font-bold text-slate-900 w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= available || loading}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 disabled:opacity-40 transition shadow-sm"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* Preço Total */}
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-slate-500">Valor Total:</span>
              <span className="text-lg font-extrabold text-indigo-600">
                {totalPrice > 0 ? `${totalPrice.toLocaleString('pt-AO')} Kz` : 'Gratuito'}
              </span>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Botão Principal */}
            <button
              onClick={handleFlow}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>
                    {step === 'reserving' ? 'A reservar bilhete...' : 'A processar pagamento...'}
                  </span>
                </>
              ) : (
                <span>Reservar e Comprar ({quantity})</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};