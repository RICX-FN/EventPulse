import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Mensagem vinda do redirecionamento do Register (se houver)
    const successMessage = location.state?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Chama o API Gateway -> User Service
            const response = await api.post('/api/users/login', { email, password });

            // Ajuste para desestruturar os dados exatos vindos da API
            const { token, user } = response.data;

            if (!token) {
                throw new Error('Token não retornado pela API.');
            }

            // Salva no contexto e localStorage
            login(token, user || { email });

            // Redireciona para o Dashboard
            navigate('/', { replace: true });
        } catch (err: unknown) {
            console.error('Erro de login:', err);

            const message =
                typeof err === 'object' && err !== null && 'response' in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;

            setError(
                message ||
                'Falha ao autenticar. Verifique se as credenciais estão corretas.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center p-4">
            <div className="w-full max-w-sm mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-black text-white text-center mb-1">
                    Event<span className="text-indigo-500">Pulse</span>
                </h2>
                <p className="text-slate-400 text-xs text-center mb-6">Insira a sua conta para continuar</p>

                {successMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-3 text-slate-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Senha</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-3 text-slate-500" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 active:bg-indigo-700 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar'}
                    </button>
                </form>

                <p className="text-slate-400 text-xs text-center mt-6">
                    Ainda não tem conta?{' '}
                    <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
};