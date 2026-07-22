import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Printer, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, Phone, MapPin } from 'lucide-react'

import { Button, Input, Label } from '@/components';
import { registerUser } from '@/services/authService'
import loginIllustration from '@/assets/login-illustration.png'

// ─── Zod Schema ──────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
  phone: z.union([z.string(), z.number()], { required_error: 'Nomor HP tidak boleh kosong' })
    .transform(String)
    .refine((val) => val.trim().length > 0, { message: 'Nomor HP tidak boleh kosong' }),
  province: z.string({ required_error: 'Provinsi tidak boleh kosong' }).min(1, 'Provinsi tidak boleh kosong'),
  city: z.string({ required_error: 'Kota/Kabupaten tidak boleh kosong' }).min(1, 'Kota/Kabupaten tidak boleh kosong'),
  district: z.string({ required_error: 'Kecamatan tidak boleh kosong' }).min(1, 'Kecamatan tidak boleh kosong'),
  postalCode: z.union([z.string(), z.number()], { required_error: 'Kode pos tidak boleh kosong' })
    .transform(String)
    .refine((val) => val.trim().length > 0, { message: 'Kode pos tidak boleh kosong' }),
  detailAddress: z.string({ required_error: 'Alamat lengkap tidak boleh kosong' }).min(1, 'Alamat lengkap tidak boleh kosong'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

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
export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, user } = useSelector((state) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const nameValue = watch('name', '')
  const emailValue = watch('email', '')
  const passwordValue = watch('password', '')
  const confirmPasswordValue = watch('confirmPassword', '')
  const phoneValue = watch('phone', '')
  const provinceValue = watch('province', '')
  const cityValue = watch('city', '')
  const districtValue = watch('district', '')
  const postalCodeValue = watch('postalCode', '')
  const detailAddressValue = watch('detailAddress', '')

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

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setGlobalError(null)
      
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
        detailAddress: data.detailAddress,
      })
      
      setRegisterSuccess(true)
      setTimeout(() => {
        navigate('/login', { replace: true, state: location.state })
      }, 1500)
    } catch (err) {
      const responseData = err.response?.data
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((errObj) => {
          if (errObj.field) {
            setError(errObj.field, { type: 'server', message: errObj.message })
          }
        })
      } else {
        setGlobalError(responseData?.message || 'Registrasi gagal. Silakan coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
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
              Bergabung dengan
              <br />
              <span className="text-orange-400">Benua Kertas</span>
            </h1>
            <p className="text-white/60 text-base max-w-sm mx-auto leading-relaxed">
              Daftarkan diri Anda untuk mulai mengelola pesanan percetakan kustom terbaik.
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
          RIGHT PANEL — Register Form
      ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md py-8">

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
              Buat Akun Baru ✨
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Lengkapi data di bawah ini untuk mendaftar ke dalam sistem.
            </p>
          </div>

          {/* ─── Error Alert ─── */}
          {globalError && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-fade-in-up">
              <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
              <span>{globalError}</span>
            </div>
          )}

          {/* ─── Success State ─── */}
          {registerSuccess && (
            <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm animate-fade-in-up">
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              <span>Registrasi berhasil! Mengalihkan ke halaman Login...</span>
            </div>
          )}

          {/* ─── Form ─── */}
          <form
            id="register-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 animate-fade-in-up delay-100"
            noValidate
          >
            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nama Lengkap
              </Label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.name
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : nameValue && !errors.name
                      ? 'border-green-400'
                      : ''
                  }`}
                  {...register('name')}
                />
                {/* valid checkmark */}
                {nameValue && !errors.name && (
                  <CheckCircle2
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.name.message}
                </p>
              )}
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Field */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Nomor HP / WhatsApp
                </Label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0812..."
                    className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      errors.phone
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : phoneValue && !errors.phone
                        ? 'border-green-400'
                        : ''
                    }`}
                    {...register('phone')}
                  />
                  {phoneValue && !errors.phone && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Province Field */}
              <div className="space-y-1.5">
                <Label htmlFor="province" className="text-sm font-medium text-foreground">
                  Provinsi
                </Label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="province"
                    type="text"
                    placeholder="Provinsi"
                    className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      errors.province
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : provinceValue && !errors.province
                        ? 'border-green-400'
                        : ''
                    }`}
                    {...register('province')}
                  />
                  {provinceValue && !errors.province && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
                {errors.province && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.province.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City Field */}
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-sm font-medium text-foreground">
                  Kota / Kabupaten
                </Label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="city"
                    type="text"
                    placeholder="Kota / Kabupaten"
                    className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      errors.city
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : cityValue && !errors.city
                        ? 'border-green-400'
                        : ''
                    }`}
                    {...register('city')}
                  />
                  {cityValue && !errors.city && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.city.message}
                  </p>
                )}
              </div>

              {/* District Field */}
              <div className="space-y-1.5">
                <Label htmlFor="district" className="text-sm font-medium text-foreground">
                  Kecamatan
                </Label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="district"
                    type="text"
                    placeholder="Kecamatan"
                    className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      errors.district
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : districtValue && !errors.district
                        ? 'border-green-400'
                        : ''
                    }`}
                    {...register('district')}
                  />
                  {districtValue && !errors.district && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
                {errors.district && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.district.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Postal Code Field */}
              <div className="space-y-1.5">
                <Label htmlFor="postalCode" className="text-sm font-medium text-foreground">
                  Kode Pos
                </Label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="Kode Pos"
                    className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      errors.postalCode
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : postalCodeValue && !errors.postalCode
                        ? 'border-green-400'
                        : ''
                    }`}
                    {...register('postalCode')}
                  />
                  {postalCodeValue && !errors.postalCode && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
                {errors.postalCode && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.postalCode.message}
                  </p>
                )}
              </div>

              {/* Detail Address Field */}
              <div className="space-y-1.5">
                <Label htmlFor="detailAddress" className="text-sm font-medium text-foreground">
                  Alamat Lengkap (Jalan, RT/RW)
                </Label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="detailAddress"
                    type="text"
                    placeholder="Jalan..."
                    className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      errors.detailAddress
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : detailAddressValue && !errors.detailAddress
                        ? 'border-green-400'
                        : ''
                    }`}
                    {...register('detailAddress')}
                  />
                  {detailAddressValue && !errors.detailAddress && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
                {errors.detailAddress && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.detailAddress.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password baru"
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  className={`pl-10 pr-11 h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    errors.confirmPassword
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : confirmPasswordValue && !errors.confirmPassword
                      ? 'border-green-400'
                      : ''
                  }`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              id="register-submit-btn"
              type="submit"
              disabled={loading || registerSuccess || !isValid}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Mendaftarkan...
                </>
              ) : registerSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  Pendaftaran Berhasil
                </>
              ) : (
                <>
                  Buat Akun
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
                Sudah punya akun?
              </span>
            </div>
          </div>

          {/* Navigate to Login */}
          <div className="text-center animate-fade-in-up delay-300">
            <Link
              to="/login"
              state={location.state}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              Masuk ke akun Anda di sini
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
