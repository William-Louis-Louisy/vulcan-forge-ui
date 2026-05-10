# Database

VulcanForgeUI uses PostgreSQL for local development.
The local development database uses `postgres:16-alpine`.

## Local database

Start the database:

```powershell
docker compose up -d postgres
```

Or use the npm script:

```powershell
npm run db:up
```

Stop the database:

```powershell
docker compose down
```

Or use:

```powershell
npm run db:down
```

Stop and remove the local database volume:

```powershell
docker compose down -v
```

Or use:

```powershell
npm run db:reset
```

Follow PostgreSQL logs:

```powershell
npm run db:logs
```

## Connection string

```env
DATABASE_URL="postgresql://vulcan:vulcan_dev_password@localhost:5432/vulcan_forge_ui?schema=public"
```

## Defaults

| Key      | Value                 |
| -------- | --------------------- |
| Host     | `localhost`           |
| Port     | `5432`                |
| Database | `vulcan_forge_ui`     |
| User     | `vulcan`              |
| Password | `vulcan_dev_password` |

## Notes

- The local password is for development only.
- Do not commit `.env.local`.
- Prisma setup is handled in DS-021.
- Docker Desktop must be running before using `docker compose`.
