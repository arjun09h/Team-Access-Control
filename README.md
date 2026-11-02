# Team Management

A role based team management demo built with Next.js, React, Prisma, and PostgreSQL. It includes account registration and login, dashboards for different roles, and basic team assignment features.

## Features

- Register and log in with an email and password
- Password hashing with bcrypt
- Session tokens stored in HTTP only cookies
- Role based dashboards for admins, managers, and users
- Admin view of users, teams, and team membership
- Admin controls for assigning users to teams and changing roles
- Optional team code during registration
- PostgreSQL database access through Prisma
- Database health endpoint at `/api/health`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- JSON Web Tokens
- bcryptjs

## Prerequisites

Install Node.js and npm, and have a PostgreSQL database available.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with these variables:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   JWT_SECRET="replace-with-a-long-random-secret"
   ```

   Replace the database URL values with your PostgreSQL connection details. Keep `.env` private and do not commit it.

3. Generate the Prisma client and create or update the database tables:

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Optionally add the sample teams and accounts:

   ```bash
   npm run db:seed
   ```

   The seed script creates sample teams and users. It is intended for an empty database; running it again may fail because team names and codes must be unique.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Sample Accounts

After running the seed script, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Manager | `john.doe@example.com` | `password123` |
| User | `john.dev@example.com` | `123456789` |
| Manager | `jane.des@example.com` | `00000000` |
| User | `bob.mar@example.com` | `12345678` |
| Manager | `alice.sls@example.com` | `11112222` |

These are demo credentials. Do not use them in a production environment.

The seed script does not create an admin account. In the current registration flow, the first account registered in an empty database is assigned the Admin role.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:push` | Sync the Prisma schema with the database |
| `npm run db:seed` | Add sample teams and users |

## Project Structure

```text
app/
  (auth)/             Login and registration pages
  (main)/             Home and dashboard pages
  api/                Authentication, user, and health endpoints
  components/         Layout and dashboard components
  lib/                Database, authentication, and API helpers
  provider/            Client side authentication context
  types/               Shared TypeScript types
prisma/
  schema.prisma       Database models and roles
  seed.ts             Sample teams and users
public/                Static assets
```

## Current Scope

This is a tutorial project and a work in progress. It demonstrates authentication, role based dashboards, and assigning users to existing teams. It does not yet provide a complete team administration workflow, such as creating and editing teams. Some API and access control behavior also needs further review before the project is used beyond a local demo.