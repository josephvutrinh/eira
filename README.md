# eira
A web app to support users through perimenopause/menopause (symptom tracking + supportive chat).

## Getting started (frontend)
### Prerequisites
- Node.js **20.19+** or **22.12+** (Vite requires this)

### Install
```sh
npm --prefix frontend install
```

### Configure environment variables
1. Copy the example env file:
```sh
cp frontend/.env.example frontend/.env.local
```
2. Edit `frontend/.env.local` and set:
- `VITE_SUPABASE_URL=https://hqfoarvjxrfonngdirgp.supabase.co`
- `VITE_SUPABASE_ANON_KEY=...` (Supabase Dashboard → Project Settings → API → anon public key)

Note: `frontend/.env.local` is gitignored (do not commit secrets).

### Run dev server
```sh
npm --prefix frontend run dev
```

### Useful scripts
```sh
npm --prefix frontend run lint
npm --prefix frontend run build
```
