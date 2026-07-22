import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Printer, Mail, Lock, ArrowRight, Loader2, CheckCircle2, X } from 'lucide-react'

import { Button, Input, Label } from '@/components';
import { login, clearError } from '@/store/slices/authSlice'
import loginIllustration from '@/assets/login-illustration.png'

// ─── Zod Schema ──────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter'),
})

// ─── Floating Orb Decoration ─────────────────────────────────────────
const FloatingOrb = ({ className, delay = 0 }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-20 animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  />
)

// ─── Feature Badge ────────────────────────────────────────────────────
const FeatureBadge = ({ icon: Icon, text, delay }) => (
  <div
    className="flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 text-sm animate-fade-in-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon size={14} className="text-orange-400 shrink-0" />
    <span>{text}</span>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { loading, error, token, user } = useSelector((state) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [showPaymentAlert, setShowPaymentAlert] = useState(location.state?.requireLoginForPayment || false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const emailValue = watch('email', '')
  const passwordValue = watch('password', '')

  // Redirect jika sudah login
  useEffect(() => {
    if (token && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        const from = location.state?.from || '/home'
        navigate(from, { replace: true, state: location.state })
      }
    }
  }, [token, user, navigate, location.state])

  // Clear error saat unmount
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      setLoginSuccess(true)
      const loggedInUser = result.payload.user
      setTimeout(() => {
        if (loggedInUser.role === 'ADMIN') {
          navigate('/admin', { replace: true })
        } else {
          const from = location.state?.from || '/home'
          navigate(from, { replace: true, state: location.state })
        }
      }, 800)
    }
  }

  return (
    <div className="min-h-screen flex relative">
      {/* ─── Payment Alert Modal ─── */}
      {showPaymentAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Harap Login Dahulu</h3>
              <p className="text-gray-600 text-sm mb-6">
                Silakan login (atau daftar akun baru) untuk melanjutkan ke proses pembayaran pesanan Anda. Data pesanan Anda telah kami simpan dengan aman.
              </p>
              <Button 
                onClick={() => setShowPaymentAlert(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl h-11"
              >
                Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          LEFT PANEL — Branding & Illustration
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-animated-gradient flex-col justify-between p-12">

        {/* Decorative Orbs */}
        <FloatingOrb className="w-96 h-96 bg-blue-500 -top-20 -left-20" delay={0} />
        <FloatingOrb className="w-64 h-64 bg-orange-500 bottom-20 right-10" delay={1.5} />
        <FloatingOrb className="w-48 h-48 bg-cyan-400 top-1/2 left-1/3" delay={3} />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top — Logo */}
        <div className="relative z-10 animate-fade-in-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Printer size={20} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">Benua Kertas</span>
              <p className="text-white/50 text-xs">Printing Management System</p>
            </div>
          </div>
        </div>

        {/* Center — Illustration + Copy */}
        <div className="relative z-10 flex flex-col items-center text-center gap-8">
          {/* Illustration */}
          <div className="animate-float">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-110" />
              <img
                src={loginIllustration}
                alt="Printing illustration"
                className="relative w-80 h-80 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Headline */}
          <div className="animate-fade-in-up delay-200">
            <h1 className="text-4xl font-bold text-white leading-tight mb-3">
              Kelola Percetakan
              <br />
              <span className="text-orange-400">Lebih Efisien</span>
            </h1>
            <p className="text-white/60 text-base max-w-sm mx-auto leading-relaxed">
              Platform manajemen percetakan modern untuk mengatur pesanan, produksi, dan pengiriman dalam satu dasbor.
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            <FeatureBadge icon={CheckCircle2} text="Manajemen Pesanan" delay={0.3} />
            <FeatureBadge icon={CheckCircle2} text="Tracking Produksi" delay={0.4} />
            <FeatureBadge icon={CheckCircle2} text="Laporan Real-time" delay={0.5} />
          </div>
        </div>

        {/* Bottom — Stat Pills */}
        <div className="relative z-10 flex gap-6 animate-fade-in-up delay-500">
          {[
            { value: '2.4K+', label: 'Pesanan Selesai' },
            { value: '98%', label: 'Kepuasan Klien' },
            { value: '12+', label: 'Tahun Pengalaman' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT PANEL — Login Form
      ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <Printer size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">Benua Kertas</span>
          </div>

          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Selamat Datang Kembali 👋
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Masukkan kredensial Anda untuk mengakses sistem manajemen percetakan.
            </p>
          </div>

          {/* ─── Error Alert ─── */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-fade-in-up">
              <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ─── Success State ─── */}
          {loginSuccess && (
            <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm animate-fade-in-up">
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              <span>Login berhasil! Mengalihkan...</span>
            </div>
          )}

          {/* ─── Form ─── */}
          <form
            id="login-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 animate-fade-in-up delay-100"
            noValidate
          >
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Alamat Email
              </Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  autoComplete="email"
                  className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : emailValue && !errors.email
                      ? 'border-green-400'
                      : ''
                  }`}
                  {...register('email')}
                />
                {/* valid checkmark */}
                {emailValue && !errors.email && (
                  <CheckCircle2
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className={`pl-10 pr-11 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : passwordValue && !errors.password
                      ? 'border-green-400'
                      : ''
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              id="login-submit-btn"
              type="submit"
              disabled={loading || loginSuccess || !isValid}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memproses...
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  Berhasil Masuk
                </>
              ) : (
                <>
                  Masuk ke Sistem
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8 animate-fade-in-up delay-200">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-4 text-muted-foreground">
                Belum punya akun?
              </span>
            </div>
          </div>

          {/* Navigate to Register */}
          <div className="text-center animate-fade-in-up delay-300">
            <Link
              to="/register"
              state={location.state}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              Daftar akun baru di sini
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-12 text-center text-xs text-muted-foreground animate-fade-in-up delay-400">
            © {new Date().getFullYear()} Benua Kertas · Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </div>
  )
}
