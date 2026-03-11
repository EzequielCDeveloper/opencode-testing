# Gym Membership Web Application - Architecture Notes

Client: Teodoro Alejandro Magallanes (contractor request).

Goal: build a web application to manage employees, clients, memberships, and payments for the gym.

## Architecture Principles

- Clean Code
- Screaming Architecture

## Backend

**Stack**

- Language: Go
- Database: PostgreSQL
- Architecture: Hexagonal Architecture
- API style: REST APIs

**Initial domain tables**

- `clients`
- `users`
- `login_records`
- `payments`
- `memberships`

## Frontend

**Stack**

- Framework: Next.js
- Architecture: Clean Architecture + Server-Side Rendering

**Planned interfaces**

- Login
  - Register
  - Forgot password
- Home
  - Navbar
    - Memberships
    - About
    - Terms and conditions
- License

## DevOps

**Stack**

- VPS (Ubuntu)
- Docker
- Hosting: Cloudflare
- DNS: Cloudflare

## Core Business Needs

- Manage a full client list.
- Ensure every client has a membership.
- Assign and register payments for each client.
- Track membership expiration dates.
- Send reminders for upcoming membership expirations.
