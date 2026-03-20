# Quiz App

Nen tang hoc tap va on thi trac nghiem truc tuyen voi giao dien tieng Viet.

## Tech Stack

- **Framework:** Next.js 16 (React 19, TypeScript)
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Backend:** Firebase (Authentication + Firestore)
- **Charts:** Recharts
- **Deployment:** Vercel

## Yeu cau

- Node.js >= 18
- npm >= 9
- Tai khoan Firebase (Authentication + Firestore)

## Cai dat

### 1. Clone va cai dependencies

```bash
git clone <repo-url>
cd quiz-app
npm install
```

### 2. Cau hinh Firebase

Tao project Firebase tai [console.firebase.google.com](https://console.firebase.google.com), bat **Authentication** (Email/Password + Google) va **Cloud Firestore**.

Tao file `.env.local` trong thu muc `quiz-app/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Chay development server

```bash
npm run dev
```

Mo [http://localhost:3000](http://localhost:3000) tren trinh duyet.

### 4. Cac lenh khac

```bash
npm run build        # Build production
npm run start        # Chay production server
npm run lint         # Kiem tra lint
npm run test         # Chay unit tests (Vitest)
npx playwright test  # Chay E2E tests
```

## Deploy len Vercel

### Cach 1: Vercel CLI

```bash
npm i -g vercel
cd quiz-app
vercel
```

### Cach 2: Vercel Dashboard

1. Import repo tu GitHub tai [vercel.com](https://vercel.com)
2. Dat **Root Directory** = `quiz-app`
3. Them 6 bien moi truong Firebase (xem muc "Cau hinh Firebase")
4. Nhan **Deploy**

### Luu y sau khi deploy

Them domain Vercel vao **Firebase Console > Authentication > Settings > Authorized domains** de Google Auth hoat dong.

## Tai lieu du an

Xem [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) de biet chi tiet tinh nang va kien truc.
