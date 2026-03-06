# API Overview

## Public endpoints

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/public/services`
- `GET /api/public/projects`
- `GET /api/public/blog`
- `GET /api/public/careers`
- `POST /api/leads`
- `POST /api/applications`

## Protected endpoints

- `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/users`
- `GET|POST|PUT|DELETE /api/pages`
- `GET|POST|PUT|DELETE /api/services`
- `GET|POST|PUT|DELETE /api/projects`
- `GET|POST|PUT|DELETE /api/blog`
- `GET|PATCH /api/dashboard/leads/:id`
- `GET|POST|PUT|DELETE /api/careers/jobs`
- `PATCH /api/careers/applications/:id`
- `GET|POST /api/seo`
- `GET|PUT /api/settings`
- `GET /api/analytics`

## Default users after `npm run seed`

- `admin@codexwebz.com / ChangeMe123!`
- `manager@codexwebz.com / ChangeMe123!`
- `editor@codexwebz.com / ChangeMe123!`
