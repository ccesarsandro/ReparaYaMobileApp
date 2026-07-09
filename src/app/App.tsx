import { useState, useRef, useEffect } from "react";
import {
  MapPin, Search, Star, Bell, Home, Briefcase, MessageSquare, User,
  Wrench, Zap, Droplets, Wind, Hammer, Lock, ChevronRight, ArrowLeft,
  Filter, CheckCircle, Clock, DollarSign, ChevronDown, ChevronUp,
  Wifi, Battery, Shield, TrendingUp, Eye, EyeOff, Mail, KeyRound,
  UserRound, AlertCircle, SlidersHorizontal, X, Paintbrush, Tv,
  ChevronLeft, Calendar, FileText, BadgeCheck, Sparkles,
  Phone, Send, MoreVertical, CreditCard, Smartphone, Receipt,
  Camera, ImagePlus, Pencil, BarChart2, AlertTriangle, BellOff,
  Moon, Globe, Trash2, HelpCircle, ThumbsUp, Info, Settings,
  Image, Package, Sun,
} from "lucide-react";

type Screen =
  | "welcome"
  | "roles"
  | "register"
  | "login"
  | "cliente-home"
  | "busqueda"
  | "agendar"
  | "perfil"
  | "pagos"
  | "panel-tecnico"
  | "chat"
  | "garantia"
  | "configuracion"
  | "tecnico-home";
type ClienteTab = "home" | "requests" | "messages" | "profile";
type TecnicoTab = "home" | "jobs" | "messages" | "profile";

const DISTRICTS = ["Todos", "Miraflores", "San Isidro", "Surco", "La Molina", "Barranco", "San Borja", "Chorrillos", "Lince"];

const SERVICES = [
  { id: 1, name: "Gasfitería", icon: Droplets, color: "#3B82F6" },
  { id: 2, name: "Electricidad", icon: Zap, color: "#EAB308" },
  { id: 3, name: "Electrodomésticos", icon: Wind, color: "#8B5CF6" },
  { id: 4, name: "Carpintería", icon: Hammer, color: "#F97316" },
  { id: 5, name: "Cerrajería", icon: Lock, color: "#00B896" },
  { id: 6, name: "Instalaciones", icon: Wrench, color: "#E8621A" },
];

const TECHNICIANS = [
  { id: 1, name: "Carlos Mendoza", specialty: "Gasfitero Certificado", district: "Miraflores", rating: 4.9, reviews: 127, price: "S/ 80", unit: "/hr", verified: true, response: "~15 min", img: "photo-1507003211169-0a1dd7228f2d" },
  { id: 2, name: "Miguel Torres", specialty: "Electricista", district: "San Isidro", rating: 4.8, reviews: 94, price: "S/ 70", unit: "/hr", verified: true, response: "~20 min", img: "photo-1560250097-0b93528c311a" },
  { id: 3, name: "Roberto Huanca", specialty: "Técnico Electrodomésticos", district: "Surco", rating: 4.7, reviews: 68, price: "S/ 60", unit: "/hr", verified: true, response: "~30 min", img: "photo-1472099645785-5658abf4ff4e" },
];

const TECNICO_JOBS = [
  { id: 1, service: "Fuga de agua en cocina", client: "Ana García", district: "Miraflores", time: "Hoy, 3:00 PM", status: "confirmado", price: "S/ 120" },
  { id: 2, service: "Instalación de tomacorriente", client: "Luis Pérez", district: "San Isidro", time: "Hoy, 5:30 PM", status: "pendiente", price: "S/ 80" },
];

const NEW_REQUESTS = [
  { id: 1, service: "Reparación de ducha eléctrica", district: "Barranco", distance: "2.3 km", urgency: "urgente", price: "S/ 90" },
  { id: 2, service: "Revisión de panel eléctrico", district: "Surco", distance: "4.1 km", urgency: "normal", price: "S/ 150" },
];

/* ─────────────────────── STATUS BAR ─────────────────────── */
function StatusBar() {
  return (
    <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-7 z-20 bg-background/80 backdrop-blur-sm pointer-events-none">
      <span className="text-foreground text-xs font-mono font-medium">9:41</span>
      <div className="w-24 h-6 bg-black rounded-full absolute left-1/2 -translate-x-1/2" />
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5 items-end h-3.5">
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} style={{ height: h }} className="w-[3px] bg-foreground rounded-sm" />
          ))}
        </div>
        <Wifi size={13} className="text-foreground" />
        <Battery size={13} className="text-foreground" />
      </div>
    </div>
  );
}

/* ─────────────────────── SHARED INPUT ─────────────────────── */
function FormInput({
  label,
  placeholder,
  type = "text",
  icon: Icon,
  value,
  onChange,
  error,
  rightSlot,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon: React.FC<{ size?: number; className?: string }>;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rightSlot?: React.ReactNode;
}) {
  const hasError = !!error;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-foreground text-xs font-semibold uppercase tracking-wider font-mono">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 bg-card border rounded-xl px-4 py-3.5 transition-colors ${
          hasError ? "border-destructive/60" : "border-border focus-within:border-primary/50"
        }`}
      >
        <Icon size={16} className={hasError ? "text-destructive/70" : "text-muted-foreground"} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/40 outline-none"
        />
        {rightSlot}
      </div>
      {hasError && (
        <div className="flex items-center gap-1.5">
          <AlertCircle size={11} className="text-destructive flex-shrink-0" />
          <p className="text-destructive text-[11px]">{error}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── PASSWORD INPUT ─────────────────────── */
function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <FormInput
      label={label}
      placeholder={placeholder}
      type={show ? "text" : "password"}
      icon={KeyRound}
      value={value}
      onChange={onChange}
      error={error}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  );
}

/* ─────────────────────── STRENGTH METER ─────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const score =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10 || !/[0-9]/.test(password)
      ? 2
      : /[^a-zA-Z0-9]/.test(password)
      ? 4
      : 3;

  const labels = ["", "Débil", "Regular", "Buena", "Fuerte"];
  const colors = ["", "bg-destructive", "bg-yellow-400", "bg-primary", "bg-accent"];
  const textColors = ["", "text-destructive", "text-yellow-400", "text-primary", "text-accent"];

  if (!password) return null;
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= score ? colors[score] : "bg-secondary"
            }`}
          />
        ))}
      </div>
      <span className={`text-[10px] font-mono font-medium ${textColors[score]}`}>
        {labels[score]}
      </span>
    </div>
  );
}

/* ─────────────────────── REGISTER SCREEN ─────────────────────── */
function RegisterScreen({
  role,
  onBack,
  onLogin,
  onSuccess,
}: {
  role: "cliente" | "tecnico";
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: submitted && name.trim().length < 3 ? "Ingresa tu nombre completo" : "",
    email: submitted && !email.includes("@") ? "Correo electrónico inválido" : "",
    password: submitted && password.length < 6 ? "Mínimo 6 caracteres" : "",
    confirm: submitted && confirm !== password ? "Las contraseñas no coinciden" : "",
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const valid =
      name.trim().length >= 3 &&
      email.includes("@") &&
      password.length >= 6 &&
      confirm === password &&
      agreed;
    if (valid) onSuccess();
  };

  const isCliente = role === "cliente";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Atrás</span>
        </button>

        {/* Role badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-4 ${
            isCliente
              ? "bg-primary/15 text-primary border border-primary/25"
              : "bg-accent/15 text-accent border border-accent/25"
          }`}
        >
          {isCliente ? <Home size={11} /> : <Briefcase size={11} />}
          {isCliente ? "Cuenta Cliente" : "Cuenta Técnico"}
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
          Crea tu cuenta
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Únete a miles de {isCliente ? "hogares" : "técnicos"} en Lima
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-4">
        <div className="flex flex-col gap-4">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-2">
            {["Datos personales", "Verificación"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    i === 0
                      ? isCliente
                        ? "bg-primary text-white"
                        : "bg-accent text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-[11px] ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s}
                </span>
                {i === 0 && <div className="w-6 h-px bg-border" />}
              </div>
            ))}
          </div>

          <FormInput
            label="Nombre completo"
            placeholder="Ej: María Fernández López"
            icon={UserRound}
            value={name}
            onChange={setName}
            error={errors.name}
          />

          <FormInput
            label="Correo electrónico"
            placeholder="tu@correo.com"
            type="email"
            icon={Mail}
            value={email}
            onChange={setEmail}
            error={errors.email}
          />

          <div className="flex flex-col gap-1.5">
            <PasswordInput
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={setPassword}
              error={errors.password}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordInput
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={confirm}
            onChange={setConfirm}
            error={errors.confirm}
          />

          {/* Terms */}
          <button
            type="button"
            onClick={() => setAgreed((a) => !a)}
            className="flex items-start gap-3 text-left"
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                agreed
                  ? isCliente
                    ? "bg-primary border-primary"
                    : "bg-accent border-accent"
                  : "border-border bg-card"
              }`}
            >
              {agreed && <CheckCircle size={11} className="text-white" />}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Acepto los{" "}
              <span className={isCliente ? "text-primary" : "text-accent"}>
                Términos y Condiciones
              </span>{" "}
              y la{" "}
              <span className={isCliente ? "text-primary" : "text-accent"}>
                Política de Privacidad
              </span>{" "}
              de ReparaYa
            </p>
          </button>

          {submitted && !agreed && (
            <div className="flex items-center gap-1.5">
              <AlertCircle size={11} className="text-destructive" />
              <p className="text-destructive text-[11px]">Debes aceptar los términos para continuar</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 pt-4 flex-shrink-0 border-t border-border bg-background">
        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-semibold text-base text-white shadow-lg transition-all active:scale-[0.98] mb-3 ${
            isCliente
              ? "bg-primary shadow-primary/30"
              : "bg-accent shadow-accent/30"
          }`}
        >
          Crear mi cuenta
        </button>
        <p className="text-center text-muted-foreground text-sm">
          ¿Ya tienes cuenta?{" "}
          <button onClick={onLogin} className={isCliente ? "text-primary font-semibold" : "text-accent font-semibold"}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── LOGIN SCREEN ─────────────────────── */
function LoginScreen({
  role,
  onBack,
  onRegister,
  onSuccess,
}: {
  role: "cliente" | "tecnico";
  onBack: () => void;
  onRegister: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const errors = {
    email: submitted && !email.includes("@") ? "Correo electrónico inválido" : "",
    password: submitted && password.length < 1 ? "Ingresa tu contraseña" : "",
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (email.includes("@") && password.length > 0) onSuccess();
  };

  const isCliente = role === "cliente";
  const accentCls = isCliente ? "text-primary" : "text-accent";
  const bgCls = isCliente ? "bg-primary shadow-primary/30" : "bg-accent shadow-accent/30";
  const badgeCls = isCliente
    ? "bg-primary/15 text-primary border-primary/25"
    : "bg-accent/15 text-accent border-accent/25";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Atrás</span>
        </button>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-4 border ${badgeCls}`}>
          {isCliente ? <Home size={11} /> : <Briefcase size={11} />}
          {isCliente ? "Acceso Cliente" : "Acceso Técnico"}
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
          Bienvenido de vuelta
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Ingresa tus datos para continuar
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5">
        <div className="flex flex-col gap-4">
          <FormInput
            label="Correo electrónico"
            placeholder="tu@correo.com"
            type="email"
            icon={Mail}
            value={email}
            onChange={setEmail}
            error={errors.email}
          />

          <div className="flex flex-col gap-1">
            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              value={password}
              onChange={setPassword}
              error={errors.password}
            />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className={`text-xs font-medium ${accentCls} hover:opacity-80 transition-opacity`}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {/* Forgot password confirmation */}
          {forgotSent && (
            <div className="flex items-start gap-3 bg-accent/10 border border-accent/25 rounded-xl p-3.5">
              <CheckCircle size={15} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground text-xs font-semibold mb-0.5">Correo enviado</p>
                <p className="text-muted-foreground text-xs">
                  Revisa tu bandeja de entrada para restablecer tu contraseña
                </p>
              </div>
            </div>
          )}

          {/* Demo credentials hint */}
          <div className="bg-secondary/60 border border-border rounded-xl p-3.5">
            <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1.5">
              Acceso de demostración
            </p>
            <div className="space-y-0.5">
              <p className="text-foreground text-xs font-mono">usuario@repara.ya</p>
              <p className="text-foreground text-xs font-mono">••••••••</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-[11px] font-mono">o continúa con</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google SSO */}
          <button className="flex items-center justify-center gap-3 bg-card border border-border rounded-xl py-3.5 hover:border-white/20 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-foreground text-sm font-medium">Google</span>
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 pt-4 flex-shrink-0 border-t border-border bg-background">
        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-semibold text-base text-white shadow-lg transition-all active:scale-[0.98] mb-3 ${bgCls}`}
        >
          Ingresar
        </button>
        <p className="text-center text-muted-foreground text-sm">
          ¿No tienes cuenta?{" "}
          <button onClick={onRegister} className={`font-semibold ${accentCls}`}>
            Regístrate gratis
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── WELCOME SCREEN ─────────────────────── */
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col h-full bg-background pt-12">
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=780&h=400&fit=crop&auto=format"
          alt="Técnico realizando una reparación"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      </div>

      <div className="flex-1 flex flex-col px-7 -mt-6 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
            <Wrench size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight leading-none">ReparaYa</h1>
            <p className="text-muted-foreground text-xs mt-0.5">Lima Metropolitana</p>
          </div>
        </div>

        <h2 className="font-display text-3xl font-bold text-foreground leading-tight mb-3">
          Tu hogar,<br />
          <span className="text-primary">en buenas manos.</span>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Conectamos hogares con técnicos certificados en gasfitería, electricidad, electrodomésticos y más.
        </p>

        <div className="flex gap-0 mb-auto">
          {[{ value: "2,400+", label: "Técnicos" }, { value: "4.9★", label: "Valoración" }, { value: "43", label: "Distritos" }].map((s, i) => (
            <div key={s.label} className={`flex-1 text-center ${i < 2 ? "border-r border-border" : ""}`}>
              <div className="text-primary font-bold text-lg font-mono">{s.value}</div>
              <div className="text-muted-foreground text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-7 pb-10 space-y-3 mt-8 flex-shrink-0">
        <button onClick={onStart} className="w-full bg-primary text-white py-4 rounded-2xl font-semibold text-base tracking-wide shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform">
          Comenzar ahora
        </button>
        <button className="w-full text-muted-foreground text-sm py-2">
          ¿Ya tienes cuenta? <span className="text-primary font-semibold">Inicia sesión</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── ROLE SCREEN ─────────────────────── */
function RoleScreen({ onSelect }: { onSelect: (r: "cliente" | "tecnico") => void }) {
  return (
    <div className="flex flex-col h-full bg-background px-6 pt-20 pb-10">
      <div className="mb-8">
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-2">Paso 1 de 3</p>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1.5">¿Cómo usarás ReparaYa?</h2>
        <p className="text-muted-foreground text-sm">Elige tu perfil para personalizar tu experiencia</p>
      </div>

      <div className="flex flex-col gap-4">
        <button onClick={() => onSelect("cliente")} className="group flex items-center gap-5 bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/50 transition-all">
          <div className="w-14 h-14 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
            <Home size={26} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-foreground text-lg mb-0.5">Soy Cliente</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Necesito un técnico para reparar algo en mi hogar</p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
        </button>

        <button onClick={() => onSelect("tecnico")} className="group flex items-center gap-5 bg-card border border-border rounded-2xl p-5 text-left hover:border-accent/50 transition-all">
          <div className="w-14 h-14 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-colors">
            <Briefcase size={26} className="text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-foreground text-lg mb-0.5">Soy Técnico</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Ofrezco servicios profesionales de reparación</p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-accent transition-colors flex-shrink-0" />
        </button>
      </div>

      <div className="mt-auto pt-8 space-y-2">
        {[{ icon: Shield, text: "Verificación de identidad obligatoria" }, { icon: CheckCircle, text: "Técnicos con certificaciones comprobadas" }].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5">
            <Icon size={14} className="text-accent flex-shrink-0" />
            <span className="text-muted-foreground text-xs">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── CLIENTE HOME ─────────────────────── */
function ClienteHome() {
  const [activeTab, setActiveTab] = useState<ClienteTab>("home");
  const [activeDistrict, setActiveDistrict] = useState("Todos");

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-14 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">Tu ubicación</p>
              <button className="flex items-center gap-1 mt-0.5">
                <MapPin size={13} className="text-primary" />
                <span className="text-foreground font-semibold text-base">Miraflores, Lima</span>
                <ChevronDown size={13} className="text-muted-foreground mt-0.5" />
              </button>
            </div>
            <button className="relative w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center">
              <Bell size={17} className="text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>

        <div className="px-5 mb-4">
          <p className="text-foreground font-display font-semibold text-xl">Buenos días, María 👋</p>
          <p className="text-muted-foreground text-sm">¿Qué necesitas reparar hoy?</p>
        </div>

        <div className="px-5 mb-4">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <input className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/50 outline-none" placeholder="Ej: fuga de agua, luz que no enciende..." />
            <button className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Filter size={13} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide pb-1">
            {DISTRICTS.map((d) => (
              <button key={d} onClick={() => setActiveDistrict(d)} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all ${activeDistrict === d ? "bg-primary text-white shadow-sm shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:border-white/20"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">Servicios</h3>
            <button className="text-primary text-xs font-medium">Ver todos</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SERVICES.map((s) => (
              <button key={s.id} className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-white/15 active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "22" }}>
                  <s.icon size={19} style={{ color: s.color }} />
                </div>
                <span className="text-foreground text-[11px] font-medium text-center leading-tight">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">Técnicos Destacados</h3>
            <button className="text-primary text-xs font-medium">Ver más</button>
          </div>
          <div className="space-y-3">
            {TECHNICIANS.map((t) => (
              <button key={t.id} className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left hover:border-white/15 transition-all">
                <div className="relative flex-shrink-0">
                  <img src={`https://images.unsplash.com/${t.img}?w=96&h=96&fit=crop&auto=format`} alt={t.name} className="w-12 h-12 rounded-xl object-cover bg-secondary" />
                  {t.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-card">
                      <CheckCircle size={9} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{t.name}</p>
                  <p className="text-muted-foreground text-xs mb-1.5">{t.specialty}</p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-foreground text-xs font-mono font-medium">{t.rating}</span>
                      <span className="text-muted-foreground text-[10px]">({t.reviews})</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <MapPin size={9} className="text-muted-foreground" />
                      <span className="text-muted-foreground text-[10px]">{t.district}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-foreground font-bold text-sm font-mono">{t.price}</div>
                  <div className="text-muted-foreground text-[10px] font-mono">{t.unit}</div>
                  <div className="flex items-center gap-1 mt-1.5 justify-end">
                    <Clock size={9} className="text-muted-foreground" />
                    <span className="text-muted-foreground text-[10px]">{t.response}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav tabs={[{ id: "home", label: "Inicio", Icon: Home }, { id: "requests", label: "Solicitudes", Icon: Briefcase }, { id: "messages", label: "Mensajes", Icon: MessageSquare }, { id: "profile", label: "Perfil", Icon: User }]} active={activeTab} onSelect={(id) => setActiveTab(id as ClienteTab)} accentColor="primary" />
    </div>
  );
}

/* ─────────────────────── TÉCNICO HOME ─────────────────────── */
function TecnicoHome() {
  const [activeTab, setActiveTab] = useState<TecnicoTab>("home");

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-14 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">Buenos días</p>
              <h2 className="font-display text-xl font-bold text-foreground">Carlos Mendoza</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-accent/12 border border-accent/30 rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-accent text-[11px] font-semibold">Disponible</span>
              </button>
              <button className="relative w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center">
                <Bell size={17} className="text-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Ganado hoy", value: "S/ 200", Icon: DollarSign, color: "text-accent", bg: "bg-accent/12" }, { label: "Completados", value: "127", Icon: Briefcase, color: "text-primary", bg: "bg-primary/12" }, { label: "Valoración", value: "4.9", Icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/12" }].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-3.5 flex flex-col">
                <div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
                  <s.Icon size={14} className={s.color} />
                </div>
                <div className="font-bold text-foreground text-base font-mono leading-none mb-0.5">{s.value}</div>
                <div className="text-muted-foreground text-[10px] leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 mb-6">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-foreground text-sm">Ingresos esta semana</h3>
              <div className="flex items-center gap-1">
                <TrendingUp size={13} className="text-accent" />
                <span className="text-accent text-xs font-mono font-semibold">+18%</span>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-14">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t-md ${i === 5 ? "bg-accent" : "bg-secondary"}`} style={{ height: `${h}%` }} />
                  <span className="text-muted-foreground text-[9px] font-mono">{["L","M","X","J","V","S","D"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 mb-6">
          <h3 className="font-display font-semibold text-foreground mb-3">Trabajos de Hoy</h3>
          <div className="space-y-3">
            {TECNICO_JOBS.map((j) => (
              <div key={j.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-foreground font-semibold text-sm">{j.service}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{j.client} · {j.district}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${j.status === "confirmado" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                    {j.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={11} />
                    <span className="text-xs">{j.time}</span>
                  </div>
                  <span className="text-foreground font-bold text-sm font-mono">{j.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">Nuevas Solicitudes</h3>
            <span className="bg-primary text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center">{NEW_REQUESTS.length}</span>
          </div>
          <div className="space-y-3">
            {NEW_REQUESTS.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-foreground font-semibold text-sm">{r.service}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={10} className="text-muted-foreground" />
                      <span className="text-muted-foreground text-xs">{r.district}</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">{r.distance}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-foreground font-bold text-sm font-mono">{r.price}</span>
                    {r.urgency === "urgente" && <p className="text-primary text-[10px] font-semibold mt-0.5">⚡ Urgente</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-medium">Rechazar</button>
                  <button className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/30">Aceptar trabajo</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav tabs={[{ id: "home", label: "Inicio", Icon: Home }, { id: "jobs", label: "Trabajos", Icon: Briefcase }, { id: "messages", label: "Mensajes", Icon: MessageSquare }, { id: "profile", label: "Perfil", Icon: User }]} active={activeTab} onSelect={(id) => setActiveTab(id as TecnicoTab)} accentColor="accent" />
    </div>
  );
}

/* ─────────────────────── BOTTOM NAV ─────────────────────── */
function BottomNav({ tabs, active, onSelect, accentColor }: {
  tabs: { id: string; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[];
  active: string;
  onSelect: (id: string) => void;
  accentColor: "primary" | "accent";
}) {
  const activeClass = accentColor === "primary" ? "text-primary" : "text-accent";
  return (
    <div className="flex-shrink-0 border-t border-border bg-card px-2 pb-8 pt-2">
      <div className="flex items-center justify-around">
        {tabs.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => onSelect(id)} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${active === id ? activeClass : "text-muted-foreground"}`}>
            <Icon size={20} strokeWidth={active === id ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── SEARCH SCREEN DATA ─────────────────────── */

const ALL_DISTRICTS = [
  "Todos los distritos",
  "Ate", "Barranco", "Breña", "Carabayllo", "Chorrillos",
  "Comas", "El Agustino", "Independencia", "Jesús María",
  "La Molina", "La Victoria", "Lima (Cercado)", "Lince",
  "Los Olivos", "Lurigancho", "Magdalena del Mar", "Miraflores",
  "Pueblo Libre", "Puente Piedra", "Rímac", "San Borja",
  "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores",
  "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita",
  "Santiago de Surco", "Surquillo", "Villa El Salvador",
  "Villa María del Triunfo",
];

const ALL_SERVICES = [
  { id: 1,  name: "Gasfitería",        icon: Droplets,    color: "#3B82F6", count: 234 },
  { id: 2,  name: "Electricidad",      icon: Zap,         color: "#EAB308", count: 189 },
  { id: 3,  name: "Electrodomésticos", icon: Tv,          color: "#8B5CF6", count: 147 },
  { id: 4,  name: "Carpintería",       icon: Hammer,      color: "#F97316", count: 98  },
  { id: 5,  name: "Cerrajería",        icon: Lock,        color: "#00B896", count: 76  },
  { id: 6,  name: "Instalaciones",     icon: Wrench,      color: "#E8621A", count: 312 },
  { id: 7,  name: "Pintura",           icon: Paintbrush,  color: "#EC4899", count: 64  },
  { id: 8,  name: "Climatización",     icon: Wind,        color: "#06B6D4", count: 53  },
];

type Availability = "disponible" | "en camino" | "ocupado";

const SEARCH_TECHNICIANS: {
  id: number; name: string; specialty: string; district: string;
  rating: number; reviews: number; price: string; availability: Availability;
  img: string; yearsExp: number; jobsDone: number;
}[] = [
  { id: 1, name: "Carlos Mendoza",   specialty: "Gasfitero",            district: "Miraflores",        rating: 4.9, reviews: 127, price: "S/ 80/hr",  availability: "disponible", img: "photo-1507003211169-0a1dd7228f2d", yearsExp: 8,  jobsDone: 312 },
  { id: 2, name: "Miguel Torres",    specialty: "Electricista",          district: "San Isidro",        rating: 4.8, reviews: 94,  price: "S/ 70/hr",  availability: "en camino",  img: "photo-1560250097-0b93528c311a",   yearsExp: 6,  jobsDone: 218 },
  { id: 3, name: "Roberto Huanca",   specialty: "Téc. Electrodomésticos",district: "Surco",             rating: 4.7, reviews: 68,  price: "S/ 60/hr",  availability: "disponible", img: "photo-1472099645785-5658abf4ff4e", yearsExp: 5,  jobsDone: 174 },
  { id: 4, name: "Jorge Castillo",   specialty: "Carpintero",            district: "La Molina",         rating: 4.6, reviews: 52,  price: "S/ 65/hr",  availability: "ocupado",    img: "photo-1500648767791-00dcc994a43e", yearsExp: 10, jobsDone: 401 },
  { id: 5, name: "Luis Quispe",      specialty: "Cerrajero",             district: "San Borja",         rating: 4.8, reviews: 41,  price: "S/ 55/hr",  availability: "disponible", img: "photo-1535713875002-d1d0cf377fde", yearsExp: 4,  jobsDone: 132 },
  { id: 6, name: "Ángel Flores",     specialty: "Electricista",          district: "Barranco",          rating: 4.5, reviews: 37,  price: "S/ 68/hr",  availability: "disponible", img: "photo-1570295999919-56ceb5ecca61", yearsExp: 7,  jobsDone: 256 },
  { id: 7, name: "Raúl Condori",     specialty: "Gasfitero",             district: "Jesús María",       rating: 4.7, reviews: 29,  price: "S/ 75/hr",  availability: "en camino",  img: "photo-1599566150163-29194dcaad36", yearsExp: 9,  jobsDone: 189 },
];

const SORT_OPTIONS = ["Mejor valoración", "Más cercano", "Menor precio", "Más rápido"];

const availabilityConfig: Record<Availability, { label: string; dot: string; text: string; bg: string }> = {
  "disponible": { label: "Disponible",  dot: "bg-accent",        text: "text-accent",        bg: "bg-accent/12 border-accent/25" },
  "en camino":  { label: "En camino",   dot: "bg-yellow-400",    text: "text-yellow-400",    bg: "bg-yellow-400/12 border-yellow-400/25" },
  "ocupado":    { label: "Ocupado",     dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-secondary border-border" },
};

/* ─────────────────────── DISTRICT BOTTOM SHEET ─────────────────────── */
function DistrictSheet({
  selected,
  onSelect,
  onClose,
}: {
  selected: string;
  onSelect: (d: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = ALL_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-30"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl z-40 flex flex-col"
           style={{ maxHeight: "72%" }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between flex-shrink-0">
          <h3 className="font-display font-bold text-foreground text-lg">Selecciona un distrito</h3>
          <button onClick={onClose} className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search within districts */}
        <div className="px-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2.5">
            <Search size={13} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar distrito..."
              className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/50 outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto scrollbar-hide flex-1 px-5 pb-6">
          <div className="space-y-0.5">
            {filtered.map((d) => {
              const isActive = d === selected;
              return (
                <button
                  key={d}
                  onClick={() => { onSelect(d); onClose(); }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-colors ${
                    isActive ? "bg-primary/15" : "hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={13} className={isActive ? "text-primary" : "text-muted-foreground"} />
                    <span className={`text-sm ${isActive ? "text-primary font-semibold" : "text-foreground"}`}>{d}</span>
                  </div>
                  {isActive && <CheckCircle size={14} className="text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────── SEARCH SCREEN ─────────────────────── */
function SearchScreen() {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("Todos los distritos");
  const [activeService, setActiveService] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("Mejor valoración");
  const [showDistrict, setShowDistrict] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeTab, setActiveTab] = useState<ClienteTab>("home");

  const isFiltered = district !== "Todos los distritos" || activeService !== null || query.length > 0;

  const filtered = SEARCH_TECHNICIANS.filter((t) => {
    const matchQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.specialty.toLowerCase().includes(query.toLowerCase());
    const matchDistrict = district === "Todos los distritos" || t.district === district;
    const matchService = activeService === null || (() => {
      const svc = ALL_SERVICES.find((s) => s.id === activeService);
      return svc ? t.specialty.toLowerCase().includes(svc.name.toLowerCase().slice(0, 5)) : true;
    })();
    return matchQuery && matchDistrict && matchService;
  });

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Overlay sheets */}
      {showDistrict && (
        <DistrictSheet
          selected={district}
          onSelect={setDistrict}
          onClose={() => setShowDistrict(false)}
        />
      )}

      {showSort && (
        <>
          <div className="absolute inset-0 bg-black/50 z-30" onClick={() => setShowSort(false)} />
          <div className="absolute bottom-20 left-4 right-4 bg-card border border-border rounded-2xl z-40 overflow-hidden">
            <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest px-4 pt-4 pb-2">Ordenar por</p>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSortBy(opt); setShowSort(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 border-t border-border transition-colors ${
                  sortBy === opt ? "bg-primary/10" : "hover:bg-secondary"
                }`}
              >
                <span className={`text-sm ${sortBy === opt ? "text-primary font-semibold" : "text-foreground"}`}>{opt}</span>
                {sortBy === opt && <CheckCircle size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="px-5 pt-14 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Buscar técnicos</h2>
              <p className="text-muted-foreground text-xs mt-0.5">Lima Metropolitana · {SEARCH_TECHNICIANS.length} disponibles</p>
            </div>
            <button className="relative w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center">
              <Bell size={17} className="text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>

          {/* ── Search bar ── */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3.5 mb-3 focus-within:border-primary/40 transition-colors">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre, especialidad, servicio..."
              className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/40 outline-none"
            />
            {query.length > 0 && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* ── District dropdown ── */}
          <button
            onClick={() => setShowDistrict(true)}
            className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary/15 rounded-lg flex items-center justify-center">
                <MapPin size={13} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider leading-none mb-0.5">Distrito</p>
                <p className={`text-sm font-semibold leading-tight ${district === "Todos los distritos" ? "text-muted-foreground" : "text-foreground"}`}>
                  {district}
                </p>
              </div>
            </div>
            <ChevronDown size={15} className="text-muted-foreground" />
          </button>
        </div>

        {/* ── Service categories ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between px-5 mb-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Categorías</h3>
            <span className="text-muted-foreground text-[10px] font-mono">{ALL_SERVICES.length} servicios</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5 px-5">
            {ALL_SERVICES.map((s) => {
              const isActive = activeService === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveService(isActive ? null : s.id)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all active:scale-95 ${
                    isActive
                      ? "border-2 bg-card"
                      : "border-border bg-card hover:border-white/15"
                  }`}
                  style={isActive ? { borderColor: s.color } : {}}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: s.color + (isActive ? "33" : "1A") }}
                  >
                    <s.icon size={17} style={{ color: s.color }} />
                  </div>
                  <span
                    className="text-[10px] font-medium text-center leading-tight"
                    style={{ color: isActive ? s.color : undefined }}
                  >
                    {s.name}
                  </span>
                  <span className="text-muted-foreground text-[9px] font-mono">{s.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Results header ── */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm">
              Técnicos verificados
              {isFiltered && (
                <span className="ml-2 text-primary font-mono text-xs">({filtered.length})</span>
              )}
            </h3>
            {isFiltered && (
              <button
                onClick={() => { setQuery(""); setDistrict("Todos los distritos"); setActiveService(null); }}
                className="flex items-center gap-1 mt-0.5"
              >
                <X size={9} className="text-muted-foreground" />
                <span className="text-muted-foreground text-[10px]">Limpiar filtros</span>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSort(true)}
            className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5 hover:border-white/20 transition-colors"
          >
            <SlidersHorizontal size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground text-[11px]">{sortBy.split(" ")[0]}</span>
            <ChevronDown size={11} className="text-muted-foreground" />
          </button>
        </div>

        {/* ── Legend ── */}
        <div className="px-5 mb-3 flex items-center gap-4">
          {(Object.entries(availabilityConfig) as [Availability, typeof availabilityConfig[Availability]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className="text-muted-foreground text-[10px]">{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* ── Technician list ── */}
        <div className="px-5 pb-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                <Search size={22} className="text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold text-sm mb-1">Sin resultados</p>
              <p className="text-muted-foreground text-xs">Prueba con otro término o distrito</p>
            </div>
          ) : (
            filtered.map((t, idx) => {
              const avail = availabilityConfig[t.availability];
              return (
                <div
                  key={t.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-white/15 transition-all"
                >
                  {/* Position badge */}
                  <div className="flex items-start gap-3.5 p-4">
                    {/* Rank */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="relative">
                        <img
                          src={`https://images.unsplash.com/${t.img}?w=100&h=100&fit=crop&auto=format`}
                          alt={t.name}
                          className="w-14 h-14 rounded-2xl object-cover bg-secondary"
                        />
                        {/* Verified badge */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-card">
                          <CheckCircle size={9} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-display font-bold text-foreground text-sm leading-tight">{t.name}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">{t.specialty}</p>
                        </div>
                        {/* Availability pill */}
                        <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-semibold ${avail.bg} ${avail.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
                          {avail.label}
                        </span>
                      </div>

                      {/* Rating + location */}
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="flex items-center gap-1">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-foreground text-xs font-mono font-bold">{t.rating}</span>
                          <span className="text-muted-foreground text-[10px]">({t.reviews})</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <MapPin size={9} className="text-muted-foreground" />
                          <span className="text-muted-foreground text-[10px]">{t.district}</span>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase size={9} className="text-muted-foreground" />
                          <span className="text-muted-foreground text-[10px] font-mono">{t.jobsDone} trabajos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={9} className="text-muted-foreground" />
                          <span className="text-muted-foreground text-[10px] font-mono">{t.yearsExp} años exp.</span>
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-foreground font-bold text-base font-mono">{t.price.split("/")[0]}</span>
                          <span className="text-muted-foreground text-[10px] font-mono">/{t.price.split("/")[1]}</span>
                        </div>
                        <button
                          disabled={t.availability === "ocupado"}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                            t.availability === "ocupado"
                              ? "bg-secondary text-muted-foreground cursor-not-allowed"
                              : "bg-primary text-white shadow-sm shadow-primary/30"
                          }`}
                        >
                          {t.availability === "ocupado" ? "No disponible" : "Solicitar"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom strip for first result */}
                  {idx === 0 && (
                    <div className="bg-primary/8 border-t border-primary/15 px-4 py-2 flex items-center gap-1.5">
                      <Star size={10} className="text-primary fill-primary" />
                      <span className="text-primary text-[10px] font-semibold">Técnico más solicitado en tu zona</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav
        tabs={[
          { id: "home",     label: "Inicio",     Icon: Home },
          { id: "requests", label: "Solicitudes", Icon: Briefcase },
          { id: "messages", label: "Mensajes",    Icon: MessageSquare },
          { id: "profile",  label: "Perfil",      Icon: User },
        ]}
        active={activeTab}
        onSelect={(id) => setActiveTab(id as ClienteTab)}
        accentColor="primary"
      />
    </div>
  );
}

/* ─────────────────────── BOOKING SCREEN ─────────────────────── */

const BOOKING_TECH = {
  name: "Carlos Mendoza",
  specialty: "Gasfitero Certificado",
  district: "Miraflores",
  rating: 4.9,
  reviews: 127,
  price: "S/ 80",
  unit: "/hr",
  img: "photo-1507003211169-0a1dd7228f2d",
  badges: ["Certificado SENATI", "Seguro activo", "ID verificado"],
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_SHORT = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

const TIME_SLOTS = [
  { id: 1,  label: "08:00",  period: "am" },
  { id: 2,  label: "09:00",  period: "am" },
  { id: 3,  label: "10:00",  period: "am" },
  { id: 4,  label: "11:00",  period: "am" },
  { id: 5,  label: "12:00",  period: "pm" },
  { id: 6,  label: "02:00",  period: "pm" },
  { id: 7,  label: "03:00",  period: "pm" },
  { id: 8,  label: "04:00",  period: "pm" },
  { id: 9,  label: "05:00",  period: "pm" },
  { id: 10, label: "06:00",  period: "pm" },
];

// Slots unavailable for demo (technician busy)
const UNAVAILABLE_SLOTS = new Set([3, 7, 9]);

function BookingCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date(2026, 6, 8); // July 2026 (current date)
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Build grid: 6 rows × 7 cols
  const cells: { day: number; month: "prev" | "cur" | "next"; date: Date }[] = [];
  for (let i = 0; i < firstDay; i++) {
    const day = daysInPrev - firstDay + 1 + i;
    cells.push({ day, month: "prev", date: new Date(viewYear, viewMonth - 1, day) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: "cur", date: new Date(viewYear, viewMonth, d) });
  }
  while (cells.length % 7 !== 0) {
    const day = cells.length - firstDay - daysInMonth + 1;
    cells.push({ day, month: "next", date: new Date(viewYear, viewMonth + 1, day) });
  }

  const isPast = (d: Date) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelected = (d: Date) =>
    selectedDate?.toDateString() === d.toDateString();
  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={prevMonth}
          className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft size={15} className="text-muted-foreground" />
        </button>
        <div className="text-center">
          <p className="font-display font-bold text-foreground text-sm">
            {MONTHS[viewMonth]}
          </p>
          <p className="text-muted-foreground text-[10px] font-mono">{viewYear}</p>
        </div>
        <button
          onClick={nextMonth}
          className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ChevronRight size={15} className="text-muted-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="py-2 text-center text-muted-foreground text-[10px] font-mono font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 p-2 gap-0.5">
        {cells.map(({ day, month, date }, idx) => {
          const past = isPast(date);
          const selected = isSelected(date);
          const todayCell = isToday(date);
          const otherMonth = month !== "cur";

          return (
            <button
              key={idx}
              disabled={past || otherMonth}
              onClick={() => onSelect(date)}
              className={`
                relative h-9 w-full rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5
                ${selected
                  ? "bg-primary text-white shadow-sm shadow-primary/40"
                  : past || otherMonth
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : todayCell
                  ? "bg-primary/15 text-primary font-bold hover:bg-primary/25"
                  : "text-foreground hover:bg-secondary"
                }
              `}
            >
              {day}
              {todayCell && !selected && (
                <div className="w-1 h-1 rounded-full bg-primary absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AgendarScreen({ onBack }: { onBack: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [activeTab] = useState<ClienteTab>("requests");

  const canConfirm = selectedDate !== null && selectedSlot !== null;
  const charLimit = 280;
  const amSlots = TIME_SLOTS.filter((s) => s.period === "am");
  const pmSlots = TIME_SLOTS.filter((s) => s.period === "pm");

  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });

  if (confirmed) {
    const slot = TIME_SLOTS.find((s) => s.id === selectedSlot);
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center px-8 text-center">
        {/* Success animation placeholder */}
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 border-2 border-accent/40">
          <CheckCircle size={36} className="text-accent" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">¡Cita confirmada!</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {BOOKING_TECH.name} estará en tu domicilio el{" "}
          <span className="text-foreground font-semibold">
            {selectedDate ? formatDate(selectedDate) : ""}
          </span>{" "}
          a las{" "}
          <span className="text-foreground font-semibold">{slot?.label} {slot?.period}</span>.
        </p>

        {/* Summary card */}
        <div className="w-full bg-card border border-border rounded-2xl p-4 text-left mb-6 space-y-3">
          {[
            { label: "Técnico",      value: BOOKING_TECH.name },
            { label: "Especialidad", value: BOOKING_TECH.specialty },
            { label: "Fecha",        value: selectedDate ? formatDate(selectedDate) : "" },
            { label: "Hora",         value: `${slot?.label} ${slot?.period}` },
            { label: "Tarifa est.",  value: `${BOOKING_TECH.price} ${BOOKING_TECH.unit}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">{label}</span>
              <span className="text-foreground text-xs font-semibold">{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          className="w-full bg-primary text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-primary/30"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-hide">

        {/* ── Header ── */}
        <div className="px-5 pt-14 pb-4 flex-shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={15} />
            <span className="text-sm">Atrás</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground leading-tight">Agendar cita</h2>
              <p className="text-muted-foreground text-xs mt-0.5">Elige fecha, hora y describe el problema</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-mono">
              <Calendar size={11} />
              <span>Jul 2026</span>
            </div>
          </div>
        </div>

        {/* ── Technician profile card ── */}
        <div className="px-5 mb-5">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3.5 mb-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={`https://images.unsplash.com/${BOOKING_TECH.img}?w=120&h=120&fit=crop&auto=format`}
                  alt={BOOKING_TECH.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-secondary"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-card">
                  <CheckCircle size={9} className="text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-display font-bold text-foreground text-base leading-tight">
                    {BOOKING_TECH.name}
                  </h3>
                </div>
                <p className="text-muted-foreground text-xs mb-2">{BOOKING_TECH.specialty}</p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-foreground text-xs font-mono font-bold">{BOOKING_TECH.rating}</span>
                    <span className="text-muted-foreground text-[10px]">({BOOKING_TECH.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={9} className="text-muted-foreground" />
                    <span className="text-muted-foreground text-[10px]">{BOOKING_TECH.district}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-foreground font-bold text-lg font-mono leading-none">{BOOKING_TECH.price}</p>
                <p className="text-muted-foreground text-[10px] font-mono">{BOOKING_TECH.unit}</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex gap-2 flex-wrap">
              {BOOKING_TECH.badges.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-1 bg-accent/10 border border-accent/20 rounded-full px-2.5 py-1"
                >
                  <BadgeCheck size={10} className="text-accent" />
                  <span className="text-accent text-[10px] font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Step 1: Calendar ── */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-mono font-bold">1</span>
            </div>
            <h3 className="font-display font-semibold text-foreground text-sm">Selecciona una fecha</h3>
            {selectedDate && (
              <span className="ml-auto text-primary text-[11px] font-medium">
                {selectedDate.toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>
          <BookingCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>

        {/* ── Step 2: Time slots ── */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedDate ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`text-[10px] font-mono font-bold transition-colors ${
                  selectedDate ? "text-white" : "text-muted-foreground"
                }`}
              >
                2
              </span>
            </div>
            <h3
              className={`font-display font-semibold text-sm transition-colors ${
                selectedDate ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Elige un horario
            </h3>
            {selectedSlot && (
              <span className="ml-auto text-primary text-[11px] font-medium">
                {TIME_SLOTS.find((s) => s.id === selectedSlot)?.label}{" "}
                {TIME_SLOTS.find((s) => s.id === selectedSlot)?.period}
              </span>
            )}
          </div>

          <div
            className={`transition-opacity duration-200 ${selectedDate ? "opacity-100" : "opacity-40 pointer-events-none"}`}
          >
            {/* AM slots */}
            <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest mb-2">Mañana</p>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {amSlots.map((slot) => {
                const unavail = UNAVAILABLE_SLOTS.has(slot.id);
                const active = selectedSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    disabled={unavail}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                      active
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : unavail
                        ? "bg-secondary text-muted-foreground/40 cursor-not-allowed line-through"
                        : "bg-card border border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            {/* PM slots */}
            <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest mb-2">Tarde</p>
            <div className="grid grid-cols-5 gap-2">
              {pmSlots.map((slot) => {
                const unavail = UNAVAILABLE_SLOTS.has(slot.id);
                const active = selectedSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    disabled={unavail}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                      active
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : unavail
                        ? "bg-secondary text-muted-foreground/40 cursor-not-allowed line-through"
                        : "bg-card border border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-primary rounded-sm" />
                <span className="text-muted-foreground text-[10px]">Seleccionado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-card border border-border rounded-sm" />
                <span className="text-muted-foreground text-[10px]">Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-secondary rounded-sm" />
                <span className="text-muted-foreground text-[10px]">Ocupado</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Step 3: Problem description ── */}
        <div className="px-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedSlot ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`text-[10px] font-mono font-bold transition-colors ${
                  selectedSlot ? "text-white" : "text-muted-foreground"
                }`}
              >
                3
              </span>
            </div>
            <h3
              className={`font-display font-semibold text-sm transition-colors ${
                selectedSlot ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Describe el problema
            </h3>
          </div>

          <div
            className={`transition-opacity duration-200 ${selectedSlot ? "opacity-100" : "opacity-40 pointer-events-none"}`}
          >
            <div className={`bg-card border rounded-2xl overflow-hidden transition-colors ${
              description.length > 0 ? "border-primary/40" : "border-border focus-within:border-primary/40"
            }`}>
              {/* Textarea header */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border">
                <FileText size={13} className="text-muted-foreground" />
                <span className="text-muted-foreground text-[11px]">Descripción del problema</span>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, charLimit))}
                placeholder="Ej: Tengo una fuga en el caño de la cocina, lleva 2 días goteando. El agua mancha el mueble de abajo. Departamento en 3er piso..."
                rows={4}
                className="w-full bg-transparent text-foreground text-sm placeholder:text-muted-foreground/40 outline-none resize-none px-4 py-3 leading-relaxed"
              />

              {/* Footer: char count + tip */}
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={10} className="text-accent" />
                  <span className="text-muted-foreground text-[10px]">Más detalle = mejor diagnóstico</span>
                </div>
                <span
                  className={`text-[10px] font-mono ${
                    description.length > charLimit * 0.85
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {description.length}/{charLimit}
                </span>
              </div>
            </div>

            {/* Quick-fill chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {["Fuga de agua", "Sin luz", "No enciende", "Ruido extraño", "Mal olor"].map((chip) => (
                <button
                  key={chip}
                  onClick={() =>
                    setDescription((prev) =>
                      prev ? `${prev} ${chip.toLowerCase()}` : chip
                    )
                  }
                  className="px-2.5 py-1 bg-secondary border border-border rounded-full text-muted-foreground text-[10px] hover:border-primary/30 hover:text-foreground transition-all"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Summary strip ── */}
        {canConfirm && (
          <div className="mx-5 mb-5 bg-primary/8 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={13} className="text-primary" />
              <p className="text-primary text-xs font-semibold">Resumen de tu cita</p>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Técnico",  value: BOOKING_TECH.name },
                { label: "Fecha",    value: selectedDate ? formatDate(selectedDate) : "" },
                { label: "Hora",     value: `${TIME_SLOTS.find((s) => s.id === selectedSlot)?.label} ${TIME_SLOTS.find((s) => s.id === selectedSlot)?.period}` },
                { label: "Tarifa",   value: `${BOOKING_TECH.price} ${BOOKING_TECH.unit}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">{label}</span>
                  <span className="text-foreground text-xs font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="flex-shrink-0 px-5 pb-10 pt-4 border-t border-border bg-background">
        <button
          onClick={() => canConfirm && setConfirmed(true)}
          disabled={!canConfirm}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
            canConfirm
              ? "bg-primary text-white shadow-lg shadow-primary/35 active:scale-[0.98]"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {!selectedDate
            ? "Selecciona una fecha"
            : !selectedSlot
            ? "Selecciona un horario"
            : "Confirmar Cita"}
        </button>

        {!canConfirm && (
          <p className="text-center text-muted-foreground text-xs mt-2.5">
            {!selectedDate ? "Paso 1 de 3 pendiente" : "Paso 2 de 3 pendiente"}
          </p>
        )}
      </div>
    </div>
  );
}

const formatDate = (d: Date) =>
  d.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });

/* ══════════════════════════════════════════════════════════════
   EP-003 · REPUTACIÓN Y FEEDBACK
   ══════════════════════════════════════════════════════════════ */

const REVIEWS = [
  { id: 1, author: "María García",    avatar: "photo-1544005313-94ddf0286df2", date: "hace 2 días",    service: "Gasfitería",    rating: 5, comment: "Carlos llegó puntual y resolvió la fuga en menos de una hora. Muy profesional y dejó todo limpio. ¡Completamente recomendado!", helpful: 12 },
  { id: 2, author: "Luis Fernández",  avatar: "photo-1500648767791-00dcc994a43e", date: "hace 5 días",  service: "Gasfitería",    rating: 5, comment: "Encontró el problema que otros técnicos no detectaron. Precio justo y el trabajo quedó con garantía de 30 días.", helpful: 8 },
  { id: 3, author: "Ana Ríos",        avatar: "photo-1438761681033-6461ffad8d80", date: "hace 1 sem.",  service: "Instalaciones", rating: 4, comment: "Buen técnico, llegó un poco tarde pero el trabajo quedó perfecto. Lo volvería a contratar sin dudar.", helpful: 5 },
  { id: 4, author: "Roberto Sánchez", avatar: "photo-1570295999919-56ceb5ecca61", date: "hace 2 sem.", service: "Gasfitería",    rating: 5, comment: "Resolvió un problema complicado de cañerías con mucha experiencia. Muy recomendable para problemas difíciles.", helpful: 3 },
];
const RATING_DIST = [{ s: 5, p: 78 }, { s: 4, p: 15 }, { s: 3, p: 5 }, { s: 2, p: 1 }, { s: 1, p: 1 }];
const SKILL_TAGS  = ["Puntual", "Limpio", "Profesional", "Comunicativo", "Garantía incluida", "Precio justo"];

function StarsRow({ filled }: { filled: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < filled ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/25"} />
      ))}
    </div>
  );
}

function PerfilScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-14 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <ArrowLeft size={15} /><span className="text-sm">Atrás</span>
          </button>
        </div>

        {/* Profile hero card */}
        <div className="px-5 mb-4">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="relative flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format" alt="Carlos" className="w-[72px] h-[72px] rounded-2xl object-cover bg-secondary" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-card">
                  <CheckCircle size={9} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-foreground text-lg leading-tight">Carlos Mendoza</h2>
                <p className="text-muted-foreground text-xs mb-1.5">Gasfitero Certificado · SENATI</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-muted-foreground" />
                    <span className="text-muted-foreground text-[11px]">Miraflores</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={10} className="text-muted-foreground" />
                    <span className="text-muted-foreground text-[11px]">8 años exp.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-1 bg-accent/12 border border-accent/25 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />Disponible
                  </span>
                  <span className="text-muted-foreground text-xs font-mono">S/ 80/hr</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-primary/30">Contratar</button>
              <button className="w-10 h-10 bg-secondary border border-border rounded-xl flex items-center justify-center"><MessageSquare size={15} className="text-muted-foreground" /></button>
              <button className="w-10 h-10 bg-secondary border border-border rounded-xl flex items-center justify-center"><Phone size={15} className="text-muted-foreground" /></button>
            </div>
          </div>
        </div>

        {/* Rating summary */}
        <div className="px-5 mb-4">
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-display font-semibold text-foreground text-sm mb-4">Valoración general</h3>
            <div className="flex items-center gap-5">
              <div className="text-center flex-shrink-0 w-20">
                <div className="font-mono font-bold text-foreground text-5xl leading-none mb-1">4.9</div>
                <StarsRow filled={5} />
                <p className="text-muted-foreground text-[10px] font-mono mt-1">127 reseñas</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {RATING_DIST.map((r) => (
                  <div key={r.s} className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 w-7 flex-shrink-0 justify-end">
                      <span className="text-foreground text-[10px] font-mono">{r.s}</span>
                      <Star size={8} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.p}%` }} />
                    </div>
                    <span className="text-muted-foreground text-[10px] font-mono w-6 text-right">{r.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skill tags */}
        <div className="px-5 mb-4">
          <h3 className="font-display font-semibold text-foreground text-sm mb-2.5">Puntos destacados por clientes</h3>
          <div className="flex flex-wrap gap-2">
            {SKILL_TAGS.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5">
                <CheckCircle size={9} className="text-accent" />
                <span className="text-foreground text-xs">{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Comentarios de clientes</h3>
            <button className="text-primary text-xs font-medium">Ver todos</button>
          </div>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <img src={`https://images.unsplash.com/${r.avatar}?w=60&h=60&fit=crop&auto=format`} alt={r.author} className="w-9 h-9 rounded-full object-cover bg-secondary flex-shrink-0" />
                    <div>
                      <p className="text-foreground font-semibold text-xs">{r.author}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarsRow filled={r.rating} />
                        <span className="text-muted-foreground text-[10px]">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex-shrink-0">{r.service}</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mb-2.5 italic">"{r.comment}"</p>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp size={11} /><span className="text-[11px]">Útil ({r.helpful})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EP-004 · PAGOS Y FACTURACIÓN
   ══════════════════════════════════════════════════════════════ */

type PayMethod = "yape" | "plin" | "card" | "efectivo";

const PRICE_LINES = [
  { label: "Tarifa por hora", value: "S/ 80.00" },
  { label: "Tiempo estimado (2 h)", value: "S/ 160.00" },
  { label: "Costo de desplazamiento", value: "S/ 10.00" },
  { label: "IGV (18%)", value: "S/ 30.60" },
];

const PAY_METHODS: { id: PayMethod; label: string; sub: string; color: string; bg: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: "yape",     label: "Yape",            sub: "BCP · Pago inmediato",            color: "text-purple-400",  bg: "bg-purple-500/15 border-purple-500/30",  icon: Smartphone },
  { id: "plin",     label: "Plin",            sub: "Interbank / BBVA · Pago inmediato", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30",    icon: Smartphone },
  { id: "card",     label: "Tarjeta",         sub: "Crédito o débito",                color: "text-blue-400",    bg: "bg-blue-500/15 border-blue-500/30",      icon: CreditCard },
  { id: "efectivo", label: "Efectivo",        sub: "Pago al finalizar el servicio",   color: "text-yellow-400",  bg: "bg-yellow-500/15 border-yellow-500/30",  icon: DollarSign },
];

function PagosScreen({ onBack }: { onBack: () => void }) {
  const [method, setMethod] = useState<PayMethod>("yape");
  const [invoice, setInvoice] = useState(false);
  const [ruc, setRuc] = useState("");
  const [razon, setRazon] = useState("");
  const [paid, setPaid] = useState(false);

  if (paid) return (
    <div className="flex flex-col h-full bg-background items-center justify-center px-8 text-center">
      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 border-2 border-accent/40">
        <CheckCircle size={36} className="text-accent" />
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">¡Pago exitoso!</h2>
      <p className="text-muted-foreground text-sm mb-2">S/ 200.60 procesado correctamente</p>
      <p className="text-muted-foreground text-xs mb-6">Se ha enviado el comprobante a tu correo registrado</p>
      <button onClick={onBack} className="w-full bg-primary text-white py-4 rounded-2xl font-semibold shadow-lg shadow-primary/30">Volver al inicio</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-14 pb-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <ArrowLeft size={15} /><span className="text-sm">Atrás</span>
          </button>
          <h2 className="font-display text-xl font-bold text-foreground">Pago del servicio</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Gasfitería · Carlos Mendoza</p>
        </div>

        {/* Service summary */}
        <div className="px-5 mb-4">
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="Carlos" className="w-12 h-12 rounded-xl object-cover bg-secondary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Carlos Mendoza</p>
              <p className="text-muted-foreground text-xs">Gasfitería · Miraflores</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={9} className="text-muted-foreground" />
                <span className="text-muted-foreground text-[10px]">Calle Los Álamos 234, Miraflores</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="px-5 mb-4">
          <h3 className="font-display font-semibold text-foreground text-sm mb-3">Detalle del precio</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {PRICE_LINES.map((l, i) => (
              <div key={l.label} className={`flex items-center justify-between px-4 py-3 ${i < PRICE_LINES.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-muted-foreground text-xs">{l.label}</span>
                <span className="text-foreground text-xs font-mono font-medium">{l.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3.5 bg-primary/8 border-t border-primary/20">
              <span className="text-foreground font-display font-bold text-sm">Total a pagar</span>
              <span className="text-primary font-mono font-bold text-lg">S/ 200.60</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="px-5 mb-4">
          <h3 className="font-display font-semibold text-foreground text-sm mb-3">Método de pago</h3>
          <div className="space-y-2.5">
            {PAY_METHODS.map((m) => {
              const active = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${active ? m.bg : "bg-card border-border"}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-primary bg-primary" : "border-border bg-transparent"}`}>
                    {active && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? m.bg : "bg-secondary"}`}>
                    <m.icon size={18} className={active ? m.color : "text-muted-foreground"} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-foreground"}`}>{m.label}</p>
                    <p className="text-muted-foreground text-[11px]">{m.sub}</p>
                  </div>
                  {active && <CheckCircle size={15} className="text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Card fields */}
          {method === "card" && (
            <div className="mt-3 bg-card border border-border rounded-2xl p-4 space-y-3">
              {[["Número de tarjeta", "0000 0000 0000 0000"], ["Titular", "Nombre como en la tarjeta"]].map(([label, ph]) => (
                <div key={label}>
                  <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1 block">{label}</label>
                  <input placeholder={ph} className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[["Vencimiento", "MM / AA"], ["CVV", "•••"]].map(([label, ph]) => (
                  <div key={label}>
                    <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1 block">{label}</label>
                    <input placeholder={ph} className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Invoice toggle */}
        <div className="px-5 mb-6">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-foreground text-sm font-semibold">Solicitar comprobante</p>
                  <p className="text-muted-foreground text-xs">Boleta o factura electrónica</p>
                </div>
              </div>
              <button onClick={() => setInvoice((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${invoice ? "bg-primary" : "bg-secondary border border-border"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${invoice ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
            {invoice && (
              <div className="mt-4 space-y-3 pt-4 border-t border-border">
                <div>
                  <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1 block">Tipo</label>
                  <div className="flex gap-2">
                    {["Boleta", "Factura"].map((t) => (
                      <button key={t} className="flex-1 py-2 rounded-xl border border-border text-foreground text-xs font-medium bg-secondary hover:border-primary/40 transition-colors">{t}</button>
                    ))}
                  </div>
                </div>
                {[["RUC / DNI", ruc, setRuc], ["Razón social / Nombre", razon, setRazon]].map(([label, val, setter]) => (
                  <div key={label as string}>
                    <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1 block">{label as string}</label>
                    <input value={val as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} placeholder={label as string} className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-5 pb-10 pt-4 border-t border-border bg-background">
        <button onClick={() => setPaid(true)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-primary/30 active:scale-[0.98]">
          Pagar S/ 200.60
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Shield size={11} className="text-muted-foreground" />
          <span className="text-muted-foreground text-[11px]">Pago seguro encriptado · SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EP-005 · GESTIÓN PROFESIONAL DEL TÉCNICO
   ══════════════════════════════════════════════════════════════ */

type PanelTab = "perfil" | "disponibilidad" | "portafolio";

const DAYS_WEEK  = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const TIME_BLOCKS = ["Mañana\n07–12h", "Tarde\n12–18h", "Noche\n18–22h"];

const PORTFOLIO_IMGS = [
  "photo-1558618666-fcd25c85cd64", "photo-1581578731548-c64695cc6952", "photo-1504307651254-35680f356dfd",
  "photo-1565591452590-1f96b735b3e6", "photo-1615811361523-6bd03d7748e7", "photo-1621905251918-48416bd8575a",
  "photo-1585771724684-38269d6639fd", "photo-1574269910231-bc508b4c3261", "photo-1484154218962-a197022b5858",
];

function PanelTecnicoScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<PanelTab>("perfil");
  const [avail, setAvail] = useState<boolean[][]>(
    DAYS_WEEK.map(() => [true, true, false])
  );
  const [specialty, setSpecialty] = useState("Gasfitero Certificado");
  const [bio, setBio] = useState("Técnico con 8 años de experiencia en Lima. Certificado por SENATI. Trabajo garantizado.");

  const toggleAvail = (d: number, t: number) => {
    setAvail((prev) => prev.map((row, i) => i === d ? row.map((v, j) => j === t ? !v : v) : row));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <ArrowLeft size={15} /><span className="text-sm">Atrás</span>
            </button>
            <h2 className="font-display text-xl font-bold text-foreground">Mi panel profesional</h2>
          </div>
          <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center">
            <Settings size={17} className="text-muted-foreground" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-4">
          {(["perfil", "disponibilidad", "portafolio"] as PanelTab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-[11px] font-semibold capitalize transition-all ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "disponibilidad" ? "Agenda" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">

        {/* ── PERFIL TAB ── */}
        {tab === "perfil" && (
          <div className="space-y-4">
            {/* Avatar edit */}
            <div className="flex flex-col items-center py-4">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format" alt="Carlos" className="w-24 h-24 rounded-2xl object-cover bg-secondary" />
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/30">
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              <p className="text-muted-foreground text-xs mt-3">Toca para cambiar foto</p>
            </div>

            {/* Fields */}
            {[["Nombre completo", "Carlos Mendoza"], ["Teléfono", "+51 987 654 321"], ["Correo", "carlos.mendoza@email.com"]].map(([label, val]) => (
              <div key={label}>
                <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1.5 block">{label}</label>
                <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                  <input defaultValue={val} className="flex-1 bg-transparent text-foreground text-sm outline-none" />
                  <Pencil size={13} className="text-muted-foreground flex-shrink-0" />
                </div>
              </div>
            ))}

            <div>
              <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1.5 block">Especialidad</label>
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="flex-1 bg-transparent text-foreground text-sm outline-none" />
                <Pencil size={13} className="text-muted-foreground flex-shrink-0" />
              </div>
            </div>

            <div>
              <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1.5 block">Descripción profesional</label>
              <div className="bg-card border border-border rounded-xl px-4 py-3">
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-transparent text-foreground text-sm outline-none resize-none leading-relaxed" />
              </div>
              <p className="text-muted-foreground text-[10px] text-right mt-1 font-mono">{bio.length}/200</p>
            </div>

            <div>
              <label className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1.5 block">Certificaciones</label>
              <div className="space-y-2">
                {["Certificado SENATI – Gasfitería Industrial", "Seguro de responsabilidad civil activo"].map((c) => (
                  <div key={c} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                    <BadgeCheck size={14} className="text-accent flex-shrink-0" />
                    <span className="text-foreground text-sm flex-1">{c}</span>
                    <CheckCircle size={13} className="text-accent" />
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-3 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                  <ImagePlus size={14} /><span className="text-sm">Agregar certificado</span>
                </button>
              </div>
            </div>

            <button className="w-full bg-primary text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-primary/30">
              Guardar cambios
            </button>
          </div>
        )}

        {/* ── DISPONIBILIDAD TAB ── */}
        {tab === "disponibilidad" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-display font-semibold text-foreground text-sm">Estado actual</p>
                <span className="flex items-center gap-1.5 bg-accent/12 border border-accent/25 text-accent text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />Disponible
                </span>
              </div>
              <p className="text-muted-foreground text-xs">Configura tus horarios disponibles por día y turno</p>
            </div>

            <div>
              <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest mb-3">Semana actual · Julio 2026</p>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 border-b border-border">
                  <div className="py-2.5 px-3 text-muted-foreground text-[10px] font-mono">Turno</div>
                  {["Mañana", "Tarde", "Noche"].map((t) => (
                    <div key={t} className="py-2.5 text-center text-muted-foreground text-[10px] font-mono">{t}</div>
                  ))}
                </div>
                {/* Rows */}
                {DAYS_WEEK.map((day, d) => (
                  <div key={day} className={`grid grid-cols-4 ${d < DAYS_WEEK.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="py-3 px-3 flex items-center">
                      <span className="text-foreground text-xs font-semibold">{day}</span>
                    </div>
                    {[0, 1, 2].map((t) => (
                      <div key={t} className="py-3 flex items-center justify-center">
                        <button
                          onClick={() => toggleAvail(d, t)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            avail[d][t] ? "bg-accent/20 border border-accent/40" : "bg-secondary border border-border"
                          }`}
                        >
                          {avail[d][t]
                            ? <CheckCircle size={13} className="text-accent" />
                            : <X size={11} className="text-muted-foreground/40" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-accent/20 border border-accent/40 flex items-center justify-center"><CheckCircle size={8} className="text-accent" /></div>
                  <span className="text-muted-foreground text-[11px]">Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-secondary border border-border flex items-center justify-center"><X size={8} className="text-muted-foreground/40" /></div>
                  <span className="text-muted-foreground text-[11px]">No disponible</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-accent text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-accent/25">
              Guardar disponibilidad
            </button>
          </div>
        )}

        {/* ── PORTAFOLIO TAB ── */}
        {tab === "portafolio" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">{PORTFOLIO_IMGS.length} trabajos publicados</p>
              <button className="flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/25 rounded-xl px-3 py-1.5 text-xs font-semibold">
                <ImagePlus size={12} />Agregar foto
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PORTFOLIO_IMGS.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-secondary group">
                  <img src={`https://images.unsplash.com/${img}?w=200&h=200&fit=crop&auto=format`} alt={`Trabajo ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Trash2 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              <button className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 transition-colors">
                <Camera size={18} className="text-muted-foreground" />
                <span className="text-muted-foreground text-[10px]">Agregar</span>
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-2">Consejos de portafolio</p>
              {["Sube fotos del antes y después de cada trabajo", "Imágenes nítidas generan 3× más solicitudes", "Incluye trabajos de distintas especialidades"].map((tip) => (
                <div key={tip} className="flex items-start gap-2 mb-1.5 last:mb-0">
                  <Sparkles size={10} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-[11px] leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EP-006 · NOTIFICACIONES Y COMUNICACIÓN
   ══════════════════════════════════════════════════════════════ */

type ChatView = "chat" | "notificaciones";

const CHAT_MSGS = [
  { id: 1,  from: "cliente",  text: "Hola Carlos, ¿puedes venir hoy a revisar una fuga?",          time: "10:21", read: true },
  { id: 2,  from: "tecnico",  text: "¡Hola! Sí, puedo estar a las 3:00 PM. ¿Le parece bien?",    time: "10:23", read: false },
  { id: 3,  from: "cliente",  text: "Perfecto, te espero. Calle Los Álamos 234, piso 3.",           time: "10:24", read: true },
  { id: 4,  from: "tecnico",  text: "Anotado. Llevaré los materiales necesarios. Hasta pronto 👍", time: "10:25", read: false },
  { id: 5,  from: "sistema",  text: "Carlos está en camino · ETA 8 minutos",                        time: "14:52", read: false },
  { id: 6,  from: "tecnico",  text: "Ya estoy llegando, 5 minutitos más 🚗",                        time: "14:55", read: false },
  { id: 7,  from: "cliente",  text: "Ok, ya bajo a abrir el portón.",                               time: "14:56", read: true },
  { id: 8,  from: "tecnico",  text: "Trabajo terminado ✅. El caño está reparado. ¿Conforme?",      time: "16:10", read: false },
  { id: 9,  from: "cliente",  text: "¡Excelente trabajo! Muchas gracias Carlos.",                    time: "16:12", read: true },
];

const NOTIFS = [
  { id: 1, icon: Briefcase,    color: "text-primary",    bg: "bg-primary/12",  title: "Nueva solicitud de trabajo",           sub: "Reparación de caño · Barranco · S/ 90",      time: "hace 5 min",   unread: true  },
  { id: 2, icon: DollarSign,   color: "text-accent",     bg: "bg-accent/12",   title: "Pago recibido",                        sub: "S/ 120.00 acreditados a tu cuenta",           time: "hace 2 h",     unread: true  },
  { id: 3, icon: Star,         color: "text-yellow-400", bg: "bg-yellow-400/12", title: "Nueva reseña de 5 estrellas ★",       sub: "María García: «Excelente servicio...»",      time: "hace 3 h",     unread: false },
  { id: 4, icon: Calendar,     color: "text-blue-400",   bg: "bg-blue-400/12", title: "Recordatorio de cita",                 sub: "Luis Pérez · San Isidro · Hoy 5:30 PM",      time: "hace 4 h",     unread: false },
  { id: 5, icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/12", title: "Garantía solicitada",              sub: "Roberto Sánchez abrió un reclamo",            time: "ayer",          unread: false },
  { id: 6, icon: Shield,       color: "text-accent",     bg: "bg-accent/12",   title: "Verificación completada",              sub: "Tu ID y certificaciones están confirmados",   time: "hace 2 días",   unread: false },
];

const QUICK_ACTIONS = ["Confirmar ✓", "En camino 🚗", "Completado ✅", "Reagendar 📅"];

function ChatScreen({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<ChatView>("chat");
  const [msg, setMsg]   = useState("");

  return (
    <div className="flex flex-col h-full bg-background">
      {/* ── Header ── */}
      <div className="px-5 pt-14 pb-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}><ArrowLeft size={17} className="text-muted-foreground" /></button>
          <div className="flex-1 flex items-center gap-2.5">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="Carlos" className="w-9 h-9 rounded-xl object-cover bg-secondary" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-background" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">Carlos Mendoza</p>
              <p className="text-accent text-[10px]">En línea</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 bg-secondary border border-border rounded-xl flex items-center justify-center"><Phone size={14} className="text-muted-foreground" /></button>
            <button className="w-8 h-8 bg-secondary border border-border rounded-xl flex items-center justify-center"><MoreVertical size={14} className="text-muted-foreground" /></button>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          {(["chat", "notificaciones"] as ChatView[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {v === "notificaciones" ? "Alertas" : "Chat"}
              {v === "notificaciones" && <span className="ml-1.5 bg-primary text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">2</span>}
            </button>
          ))}
        </div>
      </div>

      {view === "chat" ? (
        <>
          {/* Quick action chips */}
          <div className="flex gap-2 px-4 py-2.5 border-b border-border overflow-x-auto scrollbar-hide flex-shrink-0">
            {QUICK_ACTIONS.map((a) => (
              <button key={a} className="flex-shrink-0 px-3 py-1.5 bg-card border border-border rounded-full text-foreground text-[11px] font-medium hover:border-primary/40 transition-colors whitespace-nowrap">
                {a}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-3">
            {CHAT_MSGS.map((m) => {
              if (m.from === "sistema") return (
                <div key={m.id} className="flex justify-center">
                  <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-accent text-[11px] font-medium">{m.text}</span>
                  </div>
                </div>
              );
              const isClient = m.from === "cliente";
              return (
                <div key={m.id} className={`flex ${isClient ? "justify-end" : "justify-start"}`}>
                  {!isClient && (
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format" alt="C" className="w-7 h-7 rounded-full object-cover bg-secondary flex-shrink-0 mr-2 mt-auto" />
                  )}
                  <div className={`max-w-[76%] ${isClient ? "bg-primary" : "bg-card border border-border"} rounded-2xl px-3.5 py-2.5 ${isClient ? "rounded-tr-md" : "rounded-tl-md"}`}>
                    <p className={`text-sm leading-relaxed ${isClient ? "text-white" : "text-foreground"}`}>{m.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isClient ? "justify-end" : "justify-start"}`}>
                      <span className={`text-[9px] ${isClient ? "text-white/60" : "text-muted-foreground"}`}>{m.time}</span>
                      {isClient && <CheckCircle size={9} className="text-white/60" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 pb-10 pt-3 border-t border-border bg-background">
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-2xl px-3.5 py-2.5">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/40 outline-none" />
              <Camera size={16} className="text-muted-foreground flex-shrink-0" />
            </div>
            <button onClick={() => setMsg("")} className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/30">
              <Send size={16} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        /* ── Notifications panel ── */
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-3 pb-6 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">Hoy</p>
            <button className="text-primary text-[11px] font-medium">Marcar todo leído</button>
          </div>
          {NOTIFS.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 bg-card border rounded-2xl p-4 transition-colors ${n.unread ? "border-primary/25 bg-primary/4" : "border-border"}`}>
              <div className={`w-9 h-9 ${n.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <n.icon size={16} className={n.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold leading-tight ${n.unread ? "text-foreground" : "text-foreground/80"}`}>{n.title}</p>
                  {n.unread && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />}
                </div>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{n.sub}</p>
                <p className="text-muted-foreground text-[10px] font-mono mt-1.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EP-007 · GESTIÓN DE GARANTÍAS Y SOPORTE
   ══════════════════════════════════════════════════════════════ */

const PAST_SERVICES = [
  { id: 1, label: "Gasfitería – Carlos Mendoza",        date: "05 Jul 2026", price: "S/ 120" },
  { id: 2, label: "Electricidad – Miguel Torres",       date: "28 Jun 2026", price: "S/ 80"  },
  { id: 3, label: "Electrodomésticos – R. Huanca",      date: "15 Jun 2026", price: "S/ 60"  },
];

const ISSUE_TYPES = ["Trabajo incompleto", "El problema reapareció", "Daño a la propiedad", "No se presentó", "Otro"];

function GarantiaScreen({ onBack }: { onBack: () => void }) {
  const [service, setService]   = useState<number | null>(null);
  const [showDrop, setShowDrop] = useState(false);
  const [issueType, setIssueType] = useState<string | null>(null);
  const [desc, setDesc]         = useState("");
  const [sent, setSent]         = useState(false);

  if (sent) return (
    <div className="flex flex-col h-full bg-background items-center justify-center px-8 text-center">
      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 border-2 border-primary/40">
        <FileText size={32} className="text-primary" />
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Reclamo enviado</h2>
      <p className="text-muted-foreground text-sm mb-1">Nro. de caso: <span className="font-mono text-foreground">#RY-2026-0847</span></p>
      <p className="text-muted-foreground text-xs mb-6 leading-relaxed">Nuestro equipo revisará tu solicitud y se comunicará contigo en menos de 24 horas.</p>
      <button onClick={onBack} className="w-full bg-primary text-white py-4 rounded-2xl font-semibold shadow-lg shadow-primary/30">Volver al inicio</button>
    </div>
  );

  const sel = PAST_SERVICES.find((s) => s.id === service);
  const canSend = service !== null && issueType !== null && desc.trim().length > 10;

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Dropdown overlay */}
      {showDrop && (
        <>
          <div className="absolute inset-0 bg-black/50 z-30" onClick={() => setShowDrop(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl z-40 pb-8">
            <div className="flex justify-center pt-3 pb-4"><div className="w-10 h-1 bg-border rounded-full" /></div>
            <p className="font-display font-bold text-foreground text-base px-5 mb-3">Selecciona el servicio</p>
            {PAST_SERVICES.map((s) => (
              <button key={s.id} onClick={() => { setService(s.id); setShowDrop(false); }}
                className={`w-full flex items-center justify-between px-5 py-4 border-t border-border hover:bg-secondary transition-colors ${service === s.id ? "bg-primary/8" : ""}`}>
                <div>
                  <p className={`text-sm font-semibold ${service === s.id ? "text-primary" : "text-foreground"}`}>{s.label}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{s.date} · {s.price}</p>
                </div>
                {service === s.id && <CheckCircle size={15} className="text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-14 pb-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <ArrowLeft size={15} /><span className="text-sm">Atrás</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Solicitar garantía</h2>
          </div>
          <p className="text-muted-foreground text-xs">Todos los trabajos tienen garantía de 30 días</p>
        </div>

        {/* Info banner */}
        <div className="px-5 mb-5">
          <div className="flex items-start gap-3 bg-accent/10 border border-accent/25 rounded-2xl p-4">
            <Shield size={15} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground text-xs font-semibold mb-0.5">Garantía ReparaYa</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Si el problema reaparece en 30 días, el técnico lo soluciona gratis. Respuesta garantizada en menos de 24 h.</p>
            </div>
          </div>
        </div>

        {/* Step 1: Service select */}
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-mono font-bold">1</span></div>
            <h3 className="font-display font-semibold text-foreground text-sm">Selecciona el servicio</h3>
          </div>
          <button onClick={() => setShowDrop(true)}
            className={`w-full flex items-center justify-between bg-card border rounded-xl px-4 py-3.5 text-left transition-colors ${sel ? "border-primary/40" : "border-border hover:border-primary/30"}`}>
            <div>
              {sel ? (
                <>
                  <p className="text-foreground font-semibold text-sm">{sel.label}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{sel.date} · {sel.price}</p>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">Selecciona un servicio completado...</p>
              )}
            </div>
            <ChevronDown size={15} className="text-muted-foreground flex-shrink-0" />
          </button>
        </div>

        {/* Step 2: Issue type */}
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${service ? "bg-primary" : "bg-secondary"}`}>
              <span className={`text-[10px] font-mono font-bold ${service ? "text-white" : "text-muted-foreground"}`}>2</span>
            </div>
            <h3 className={`font-display font-semibold text-sm ${service ? "text-foreground" : "text-muted-foreground"}`}>Tipo de problema</h3>
          </div>
          <div className={`grid grid-cols-2 gap-2 transition-opacity ${service ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
            {ISSUE_TYPES.map((t) => (
              <button key={t} onClick={() => setIssueType(t)}
                className={`py-3 px-3 rounded-xl border text-xs font-medium text-left transition-all ${issueType === t ? "bg-primary/15 border-primary/40 text-primary" : "bg-card border-border text-foreground hover:border-primary/30"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Description */}
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${issueType ? "bg-primary" : "bg-secondary"}`}>
              <span className={`text-[10px] font-mono font-bold ${issueType ? "text-white" : "text-muted-foreground"}`}>3</span>
            </div>
            <h3 className={`font-display font-semibold text-sm ${issueType ? "text-foreground" : "text-muted-foreground"}`}>Describe el problema</h3>
          </div>
          <div className={`transition-opacity ${issueType ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden focus-within:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border">
                <FileText size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground text-[11px]">Descripción detallada</span>
              </div>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 500))} rows={4} placeholder="Ej: La fuga reapareció en el mismo caño a los 5 días del servicio. Ahora el agua gotea más fuerte que antes..." className="w-full bg-transparent text-foreground text-sm placeholder:text-muted-foreground/40 outline-none resize-none px-4 py-3 leading-relaxed" />
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-1.5">
                  <Info size={10} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-[10px]">Mínimo 10 caracteres</span>
                </div>
                <span className="text-muted-foreground text-[10px] font-mono">{desc.length}/500</span>
              </div>
            </div>

            {/* Photo upload */}
            <div className="mt-3">
              <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-2">Adjuntar evidencia (opcional)</p>
              <button className="w-full flex items-center justify-center gap-2 bg-card border-2 border-dashed border-border rounded-xl py-4 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                <Camera size={16} /><span className="text-sm">Agregar foto o video</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex-shrink-0 px-5 pb-10 pt-4 border-t border-border bg-background space-y-2.5">
        <button onClick={() => canSend && setSent(true)} disabled={!canSend}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${canSend ? "bg-primary text-white shadow-lg shadow-primary/30 active:scale-[0.98]" : "bg-secondary text-muted-foreground cursor-not-allowed"}`}>
          Enviar solicitud de garantía
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
          <Phone size={15} /><span className="text-sm font-medium">Contactar soporte directamente</span>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EP-008 · CONFIGURACIÓN Y ADMINISTRACIÓN
   ══════════════════════════════════════════════════════════════ */

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? "bg-primary" : "bg-secondary border border-border"}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

const METRICS = [
  { label: "Trabajos este mes",  value: "8",        icon: Briefcase,  color: "text-primary",    bg: "bg-primary/12"    },
  { label: "Ingresos totales",   value: "S/ 640",   icon: DollarSign, color: "text-accent",     bg: "bg-accent/12"     },
  { label: "Valoración media",   value: "4.9 ★",    icon: Star,       color: "text-yellow-400", bg: "bg-yellow-400/12" },
  { label: "Clientes nuevos",    value: "3",         icon: UserRound,  color: "text-blue-400",   bg: "bg-blue-400/12"   },
];

function ConfiguracionScreen({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState({
    pushNotifs:   true,
    sound:        true,
    location:     true,
    darkMode:     true,
    biometrics:   false,
    emailDigest:  true,
    dataSharing:  false,
  });

  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const PREF_ROWS: { key: keyof typeof prefs; label: string; sub: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { key: "pushNotifs",  label: "Notificaciones push",  sub: "Nuevos trabajos y actualizaciones",   icon: Bell       },
    { key: "sound",       label: "Sonidos de alerta",    sub: "Sonido al recibir mensajes",          icon: Bell       },
    { key: "location",    label: "Geolocalización GPS",  sub: "Para mostrar técnicos cercanos",      icon: MapPin     },
    { key: "darkMode",    label: "Modo oscuro",          sub: "Interfaz en tonos oscuros",           icon: Moon       },
    { key: "biometrics",  label: "Autenticación biométrica", sub: "Huella o Face ID para acceder",  icon: Shield     },
    { key: "emailDigest", label: "Resumen semanal",      sub: "Correo con tu actividad de la semana", icon: Mail     },
    { key: "dataSharing", label: "Compartir datos analíticos", sub: "Ayuda a mejorar la plataforma", icon: Globe    },
  ];

  const MENU_ITEMS = [
    { label: "Cambiar contraseña",        icon: Lock,        color: "text-muted-foreground" },
    { label: "Idioma: Español (Perú)",    icon: Globe,       color: "text-muted-foreground" },
    { label: "Términos y condiciones",    icon: FileText,    color: "text-muted-foreground" },
    { label: "Política de privacidad",    icon: Shield,      color: "text-muted-foreground" },
    { label: "Centro de ayuda",           icon: HelpCircle,  color: "text-muted-foreground" },
    { label: "Eliminar mi cuenta",        icon: Trash2,      color: "text-destructive"      },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-14 pb-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <ArrowLeft size={15} /><span className="text-sm">Atrás</span>
          </button>
          <h2 className="font-display text-xl font-bold text-foreground">Configuración</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Preferencias de cuenta y sistema</p>
        </div>

        {/* Account card */}
        <div className="px-5 mb-5">
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="Carlos" className="w-14 h-14 rounded-2xl object-cover bg-secondary" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-card">
                <CheckCircle size={9} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-foreground">Carlos Mendoza</p>
              <p className="text-muted-foreground text-xs">carlos.mendoza@email.com</p>
              <p className="text-muted-foreground text-[10px] font-mono mt-0.5">Técnico · ID #RY-1048</p>
            </div>
            <button className="w-8 h-8 bg-secondary border border-border rounded-xl flex items-center justify-center flex-shrink-0">
              <Pencil size={13} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Metrics summary */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={14} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground text-sm">Resumen de actividad</h3>
            <span className="text-muted-foreground text-[10px] font-mono ml-auto">Julio 2026</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-card border border-border rounded-2xl p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 ${m.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <m.icon size={16} className={m.color} />
                </div>
                <div>
                  <p className="font-mono font-bold text-foreground text-base leading-none">{m.value}</p>
                  <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">{m.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mini activity chart */}
          <div className="bg-card border border-border rounded-2xl p-4 mt-2.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-xs">Trabajos completados</span>
              <div className="flex items-center gap-1">
                <TrendingUp size={11} className="text-accent" />
                <span className="text-accent text-[10px] font-mono font-semibold">+23%</span>
              </div>
            </div>
            <div className="flex items-end gap-1 h-10">
              {[2, 4, 3, 6, 5, 8, 4, 7, 6, 8, 5, 8].map((v, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-all ${i === 11 ? "bg-primary" : "bg-secondary"}`} style={{ height: `${(v / 8) * 100}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {["Jun", "", "", "", "Jul"].map((l, i) => (
                <span key={i} className="text-muted-foreground text-[9px] font-mono">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="px-5 mb-5">
          <h3 className="font-display font-semibold text-foreground text-sm mb-3">Preferencias del sistema</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {PREF_ROWS.map((row, i) => (
              <div key={row.key} className={`flex items-center gap-3 px-4 py-3.5 ${i < PREF_ROWS.length - 1 ? "border-b border-border" : ""}`}>
                <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <row.icon size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium leading-tight">{row.label}</p>
                  <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">{row.sub}</p>
                </div>
                <ToggleSwitch on={prefs[row.key]} onToggle={() => toggle(row.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="px-5 mb-6">
          <h3 className="font-display font-semibold text-foreground text-sm mb-3">Cuenta y soporte</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {MENU_ITEMS.map((item, i) => (
              <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary transition-colors ${i < MENU_ITEMS.length - 1 ? "border-b border-border" : ""}`}>
                <item.icon size={16} className={`${item.color} flex-shrink-0`} />
                <span className={`flex-1 text-sm ${item.color === "text-destructive" ? "text-destructive" : "text-foreground"}`}>{item.label}</span>
                <ChevronRight size={14} className="text-muted-foreground/40" />
              </button>
            ))}
          </div>
        </div>

        {/* App version */}
        <div className="px-5 pb-8 text-center">
          <p className="text-muted-foreground text-[10px] font-mono">ReparaYa v2.4.1 · Lima, Perú</p>
          <p className="text-muted-foreground text-[10px] font-mono">© 2026 ReparaYa S.A.C.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── DEMO SWITCHER ─────────────────────── */
function DemoSwitcher({ screen, onSwitch }: { screen: Screen; onSwitch: (s: Screen) => void }) {
  const groups: { label: string; screens: { id: Screen; label: string }[] }[] = [
    { label: "Onboarding", screens: [
      { id: "welcome",      label: "Splash"   },
      { id: "roles",        label: "Roles"    },
      { id: "register",     label: "Registro" },
      { id: "login",        label: "Login"    },
    ]},
    { label: "Cliente", screens: [
      { id: "cliente-home", label: "Inicio"   },
      { id: "busqueda",     label: "Búsqueda" },
      { id: "agendar",      label: "Agendar"  },
      { id: "pagos",        label: "Pagos"    },
    ]},
    { label: "Técnico", screens: [
      { id: "tecnico-home",  label: "Dashboard" },
      { id: "panel-tecnico", label: "Panel"     },
    ]},
    { label: "Común", screens: [
      { id: "perfil",        label: "Perfil"   },
      { id: "chat",          label: "Chat"     },
      { id: "garantia",      label: "Garantía" },
      { id: "configuracion", label: "Config."  },
    ]},
  ];

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5">
      {groups.map((g) => (
        <div key={g.label} className="flex items-center gap-0.5 bg-black/65 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1.5">
          <span className="text-white/30 text-[10px] font-mono mr-1.5 border-r border-white/15 pr-1.5">{g.label}</span>
          {g.screens.map(({ id, label }, i, arr) => (
            <span key={id} className="flex items-center gap-0.5">
              <button onClick={() => onSwitch(id)} className={`text-[11px] font-medium transition-colors px-1.5 py-0.5 rounded-full ${screen === id ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"}`}>
                {label}
              </button>
              {i < arr.length - 1 && <span className="text-white/15 text-xs">·</span>}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────── APP ROOT ─────────────────────── */
export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [role, setRole] = useState<"cliente" | "tecnico">("cliente");

  const handleRoleSelect = (r: "cliente" | "tecnico") => {
    setRole(r);
    setScreen("register");
  };

  const goToHome = () => setScreen(role === "cliente" ? "cliente-home" : "tecnico-home");

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <DemoSwitcher screen={screen} onSwitch={setScreen} />

      <div
        className="relative w-[390px] h-[844px] rounded-[3rem] overflow-hidden border border-white/10 bg-background flex-shrink-0"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 50px 100px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.03)" }}
      >
        <StatusBar />

        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("roles")} />}
        {screen === "roles" && <RoleScreen onSelect={handleRoleSelect} />}
        {screen === "register" && (
          <RegisterScreen
            role={role}
            onBack={() => setScreen("roles")}
            onLogin={() => setScreen("login")}
            onSuccess={goToHome}
          />
        )}
        {screen === "login" && (
          <LoginScreen
            role={role}
            onBack={() => setScreen("roles")}
            onRegister={() => setScreen("register")}
            onSuccess={goToHome}
          />
        )}
        {screen === "cliente-home"  && <ClienteHome />}
        {screen === "busqueda"      && <SearchScreen />}
        {screen === "agendar"       && <AgendarScreen    onBack={() => setScreen("busqueda")} />}
        {screen === "perfil"        && <PerfilScreen      onBack={() => setScreen("busqueda")} />}
        {screen === "pagos"         && <PagosScreen       onBack={() => setScreen("agendar")} />}
        {screen === "panel-tecnico" && <PanelTecnicoScreen onBack={() => setScreen("tecnico-home")} />}
        {screen === "chat"          && <ChatScreen        onBack={() => setScreen("cliente-home")} />}
        {screen === "garantia"      && <GarantiaScreen    onBack={() => setScreen("cliente-home")} />}
        {screen === "configuracion" && <ConfiguracionScreen onBack={() => setScreen("tecnico-home")} />}
        {screen === "tecnico-home"  && <TecnicoHome />}
      </div>
    </div>
  );
}
