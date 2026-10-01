# Fully Dynamic Website — Next.js & Payload CMS

A full-stack, fully dynamic e-commerce website built with **Next.js and Payload CMS**.

The project is designed so that most of the website content and functionality can be managed through the Payload CMS admin panel without changing the source code.

---

## Demo

**Live Website:**
`[LIVE_WEBSITE_URL]`

> Replace `[LIVE_WEBSITE_URL]` with the live website URL when available.

---

## Setup & Installation

### Requirements

Before starting, make sure you have:

- Node.js 20+
- npm, pnpm, or yarn
- MongoDB database
- Git
- A code editor such as VS Code

### 1. Install dependencies

After extracting the project, open the project folder in your terminal and run:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root of the project.

Use the provided `.env.example` file as a reference:

```bash
cp .env.example .env
```

You will need to add the required values for services such as:

- MongoDB
- Payload CMS
- Authentication
- Stripe
- Cloudinary
- Email
- Other project-specific configuration

**Do not share your production secret keys publicly.**

---

## Environment Variables

A complete explanation of how to obtain and configure the required environment variables will be available in the setup video.

### Setup Video

**Environment Variables & Secret Keys:**
`[VIDEO_URL_ENV_SETUP]`

> Replace this placeholder with the YouTube video link when the video is published.

---

## Running the Project

After configuring your `.env` file:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

To create a production build:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

---

## Payload CMS

The project uses **Payload CMS** as the backend and admin panel.

From the admin panel, you can manage things such as:

- Products
- Categories
- Collections
- Reviews
- Homepage content
- Partners
- Notes / blog-style content
- Orders
- Users
- Shipping zones
- Currencies
- Site settings
- Media

### Admin Setup Video

**Payload CMS & Admin Panel Setup:**
`[VIDEO_URL_ADMIN_SETUP]`

> Replace this placeholder with the YouTube video link when the video is published.

---

## Main Features

### E-Commerce

- Product catalog
- Dynamic categories and collections
- Product filtering
- Shopping cart
- Checkout
- Favorites
- Product reviews
- Order management
- Order tracking

### Authentication

- User registration
- Email verification
- Login
- Password reset
- Protected pages
- Role-based access

### Payments

- Stripe payments
- Cash orders
- Payment status handling
- Payment retry for failed payments

### Real-Time Updates

The application uses **Server-Sent Events (SSE)** to deliver order and payment status updates to the user without requiring a page refresh.

### Multi-Currency

- Admin-configured base currency
- Multiple customer currencies
- Automatic exchange-rate conversion
- Historical order currency preservation

### Dashboards

Users can view:

- Orders
- Spending
- Activity
- Product views
- Category spending

Admins can manage and monitor:

- Orders
- Users
- Activity
- Product views
- Analytics
- Payment statuses
- Website content

---

## Full Setup Guide

The complete setup process will be explained through the following videos:

### 1. Project Installation

`[VIDEO_URL_INSTALLATION]`

### 2. Environment Variables & Secret Keys

`[VIDEO_URL_ENV_SETUP]`

### 3. Payload CMS Setup

`[VIDEO_URL_PAYLOAD_SETUP]`

### 4. Stripe Setup

`[VIDEO_URL_STRIPE_SETUP]`

### 5. Cloudinary Setup

`[VIDEO_URL_CLOUDINARY_SETUP]`

### 6. Email Configuration

`[VIDEO_URL_EMAIL_SETUP]`

### 7. Admin Panel & Website Configuration

`[VIDEO_URL_ADMIN_SETUP]`

> Video links will be added as they are published.

---

## Important

This project contains configuration for third-party services. You will need to create your own accounts and use your own API keys and credentials.

**Never commit your `.env` file or expose your private API keys.**

The included `.env.example` file contains the required variable names without your private credentials.

---

## Tech Stack

- Next.js
- Payload CMS
- TypeScript
- MongoDB
- Stripe
- Tailwind CSS
- Next-intl
- Server-Sent Events (SSE)

---

## Support

If you encounter an issue during installation, first check the setup videos and make sure all required environment variables are configured correctly.

For project-specific questions or issues, use the support method provided with your purchase.

---

## License

This source code is provided for personal and commercial use by the purchaser.

You may use and modify the code for your own projects.

Redistribution, resale, or repackaging of the source code as a standalone template or product is not permitted.
