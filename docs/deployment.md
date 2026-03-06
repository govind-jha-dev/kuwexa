# Deployment Guide

## Prerequisites

- Node.js 20+
- MySQL 8+
- Nginx
- PM2

## Environment

1. Copy `.env.example` to `.env`.
2. Set production values for:
   - `JWT_SECRET`
   - `COOKIE_SECRET`
   - `CSRF_SECRET`
   - `DB_*`
   - `MAIL_*`
   - `APP_URL`

## Local or VPS setup

1. Install dependencies:
   `npm install`
2. Create and seed the database:
   `npm run seed`
3. Verify frontend rendering:
   `npm run verify:frontend`
4. Start the application:
   `npm start`

## PM2

1. Start with PM2:
   `pm2 start ecosystem.config.js`
2. Save the process list:
   `pm2 save`
3. Generate startup command:
   `pm2 startup`

## Nginx

1. Copy [`nginx/default.conf`](/d:/Porjects/codexwebz/nginx/default.conf) to your Nginx sites configuration.
2. Adjust `server_name`.
3. Reload Nginx:
   `sudo nginx -t && sudo systemctl reload nginx`

## Docker

1. Copy `.env.example` to `.env`.
2. Start services:
   `docker compose up --build`

The compose stack provisions:

- Node application on port `4000`
- MySQL on port `3306`

## Cloud targets

The project is ready for:

- AWS EC2 / Lightsail
- DigitalOcean Droplets / App Platform
- Any Ubuntu-based VPS with Node, MySQL, and Nginx
