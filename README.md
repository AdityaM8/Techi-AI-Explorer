# AI Explorer – Auth + RBAC + pgvector + Admin

Production-ready baseline:
- **NextAuth** (Google + Email) with Prisma adapter
- **Role-based access** (admin/user); protect `/admin` and `/api/admin/*`
- **pgvector** recommender (cosine) with offline hash embeddings or OpenAI if key present
- **Admin UI** to curate free-tools catalog and recompute embeddings

## One-Command (Docker)
```bash
docker compose up --build
# App: http://localhost:3000
```
The app auto-migrates, ensures pgvector, seeds tools + embeddings.

## Manual
```bash
cp .env.example .env  # set DATABASE_URL, AUTH_SECRET, providers
npm i
npm run prisma:generate
npm run build
npx prisma migrate deploy
npm run vector:setup
npm run seed
npm start
```

## Sign-in
- Configure **Google OAuth** (Client ID/Secret) and/or **EMAIL_SERVER** SMTP to enable email magic links.
- Add your admin email(s) to `ADMIN_EMAILS` to receive **admin** role on first sign-in.

## Admin UI
- Visit `/admin` as an admin to add/edit/delete tools and recompute embeddings.

## Embeddings
- If `OPENAI_API_KEY` is set, true semantic embeddings are used (text-embedding-3-large).
- Without it, a deterministic hash-based vector is used so the system works offline. You can upgrade later without changing the UI.

## Notes
- Some external tools block iframes; such tools open externally and you can paste results back.
- pgvector requires Postgres; the compose file provisions it automatically.
