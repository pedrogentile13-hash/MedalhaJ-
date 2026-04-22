# Dashboard Olímpico 2026

Sistema profissional de acompanhamento de desempenho em olimpíadas acadêmicas.

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## 🔥 Firebase (opcional)

1. Copie `.env.local.example` para `.env.local`
2. Preencha com suas credenciais Firebase
3. No Firebase Console, ative:
   - **Authentication** → Google Sign-In
   - **Firestore Database** (modo produção)

Sem Firebase, o app funciona 100% com localStorage.

## 📱 Instalar como App (PWA)

No navegador → menu → "Instalar aplicativo" ou "Adicionar à tela inicial"

## 📱 Gerar APK com Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Dashboard Olímpico" "com.olimpico.dashboard"
npm run build
npx cap add android
npx cap copy android
npx cap open android
```

No Android Studio: Build → Generate Signed Bundle / APK

## 🛠️ Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (gráficos)
- **Framer Motion** (animações)
- **Zustand** (estado global + localStorage)
- **Firebase** (auth + Firestore, opcional)
- **PWA** (instalável no celular)

## 📁 Estrutura

```
app/              # Páginas (Next.js App Router)
components/       # Componentes React
  Layout/         # Sidebar, Navbar, AppLayout
  Dashboard/      # Cards de stats, XP, previsão
  Olympiads/      # CRUD de olimpíadas
  Charts/         # Recharts (linha, barra, radar, pizza)
  Calendar/       # Calendário mensal
  Achievements/   # Sistema de conquistas
  ui/             # Botões, modais, inputs
hooks/            # useAuth, usePWA
services/         # Firebase (com fallback)
store/            # Zustand store
types/            # TypeScript interfaces
utils/            # Cálculos (medalhas, previsão, conquistas)
public/           # Manifest PWA, service worker, ícones
```
