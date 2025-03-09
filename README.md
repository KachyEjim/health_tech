# Diagnostic Test Results Manager 🚀

A simple CRUD application built with **Next.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL** to manage diagnostic test results for medical laboratories.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Directory Structure](#directory-structure)
- [License](#license)
- [Contact](#contact)

## Overview 📚

This project is a take-home assignment for the Software Developer/Engineer Intern position at Ngoane Health Tech. The application is designed to help medical laboratories manage and track diagnostic test results efficiently. The app focuses exclusively on test results management.

## Features ✨

- **CRUD for Diagnostic Test Results**  
  Create, read, update, and delete test records.
- **Validation**  
  Robust validation with [Zod](https://github.com/colinhacks/zod) to ensure data integrity.

- **Responsive UI**  
  Clean and responsive user interface built with Next and [Tailwind CSS](https://tailwindcss.com/).

- **File Uploads**  
  Support for file uploads (e.g., images, PDFs) related to test results.

## Tech Stack ⚙️

- **Next.js** – React framework for building server-side rendered applications.
- **TypeScript** – Typed JavaScript for better code maintainability and scalability.
- **Prisma ORM** – Modern database toolkit for TypeScript and Node.js.
- **PostgreSQL** – Relational database for data storage.
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development.
- **Zod** – Schema validation library.

## Architecture 💡

The application is structured around Next.js API routes and pages. Key components include:

- **API Routes:**  
  CRUD endpoints for managing diagnostic tests are implemented using Next.js API routes:

  - `/api/tests` – Handles creation and listing of test results.
  - `/api/tests/[id]` – Handles retrieval, updating, and deletion of individual test results.

- **Prisma ORM:**  
  Prisma is used to model and interact with the PostgreSQL database. The `DiagnosticTest` model includes:

  - `id`, `patientName`, `testType`, `result`, `testDate`, and `notes`.

- **Frontend:**  
  The frontend is built using React components with Tailwind CSS. Pages include:
  - **Tests Page:** Lists all diagnostic tests.
  - **Test Form:** Form for adding or updating test records.

## Setup Instructions 🛠

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/KachyEjim/health_tech
   cd health_tech
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or if you use yarn
   yarn install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   DB_USER=health_tech_user
   DB_NAME=health_tech_db
   DB_PASSWORD=health_tech_pwd
   PG_ADMIN=postgres

   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
   ```

4. **Setup your PostgreSQL database**

   ```bash
   npm run db-setup
   ```

5. **Run Prisma Migrations:**

   Generate and run the migrations to set up your PostgreSQL database:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## Running the Application ▶️

### Development

To start the development server with TurboPack enabled:

```bash
npm run dev
# or with yarn
yarn dev
```

Then open your browser and navigate to http://localhost:3000.

### Production

1. **Build the Application:**

   ```bash
   npm run build
   # or with yarn
   yarn build
   ```

2. **Start the Production Server:**

   ```bash
   npm run start
   # or with yarn
   yarn start
   ```

## API Endpoints 🌐

### Diagnostic Tests

- **GET `/api/tests`**  
  List all diagnostic test results.

- **POST `/api/tests`**  
  Create a new diagnostic test result.

- **GET `/api/tests/:id`**  
  Retrieve a diagnostic test result by its ID.

- **PUT `/api/tests/:id`**  
  Update a diagnostic test result.

- **DELETE `/api/tests/:id`**  
  Delete a diagnostic test result.

## Directory Structure 📂

```bash
.
├── eslint.config.mjs               # ESLint configuration file for project-wide linting rules.
├── LICENSE                         # License file (MIT License).
├── logs
│   └── app.log                     # Application log file.
├── next.config.ts                  # Next.js configuration file.
├── next-env.d.ts                   # Next.js TypeScript environment definitions.
├── package.json                    # Project metadata, scripts, and dependencies.
├── package-lock.json               # Auto-generated file for locking dependency versions.
├── postcss.config.mjs              # PostCSS configuration file for processing CSS.
├── prisma
│   ├── migrations                  # Folder containing Prisma migrations.
│   │   ├── 20250309135746_starting_new
│   │   │   └── migration.sql       # SQL file with migration instructions.
│   │   └── migration_lock.toml    # Prisma migration lock file.
│   └── schema.prisma               # Prisma schema file defining data models.
├── public                          # Public assets (served statically).
│   ├── file.svg                    # Example SVG file.
│   ├── globe.svg                   # Example SVG file.
│   ├── next.svg                    # Next.js logo in SVG format.
│   ├── uploads                     # Folder for uploaded files (e.g., images, documents).
│   ├── vercel.svg                  # Vercel logo in SVG format.
│   └── window.svg                  # Example SVG file.
├── README.md                       # This README file.
├── scripts
│   └── db-setup.js                 # Script to initialize or setup the database.
├── src
│   ├── app                         # Main application folder (Next.js App Router).
│   │   ├── api                     # API route handlers.
│   │   │   ├── lib
│   │   │   │   └── prisma.ts       # Prisma client setup for database access.
│   │   │   ├── tests
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts    # API routes for operations on a specific test (GET, PUT, DELETE).
│   │   │   │   └── route.ts        # API routes for listing and creating test results.
│   │   │   └── utils
│   │       ├── file_operation.ts   # Helper functions for file uploads.
│   │       ├── logger.ts           # Logger configuration and utility.
│   │       └── validation.ts       # Zod schemas for validating API request payloads.
│   │   ├── favicon.ico             # Favicon for the application.
│   │   ├── globals.css             # Global CSS file (Tailwind and custom styles).
│   │   ├── layout.tsx              # Application layout component (applies to all pages).
│   │   ├── page.tsx                # Home page of the application.
│   │   └── tests                   # Frontend pages for managing tests.
│   │       ├── components          # React components used in the tests pages.
│   │       │   ├── DeleteConfirmationModal.tsx   # Modal for confirming deletion of a test.
│   │       │   ├── FileList.tsx    # Component to display a list of uploaded files.
│   │       │   ├── TestDetailsModal.tsx  # Modal for displaying test details.
│   │       │   ├── TestForm.tsx    # Form for creating or updating a test result.
│   │       │   ├── TestsTable.tsx  # Table component to list all test results.
│   │       │   ├── ToastContainer.tsx  # Container for toast notifications.
│   │       │   └── Toast.tsx       # Individual toast message component.
│   │       ├── page.tsx            # Page listing all diagnostic test results.
│   │       └── utils
│   │           ├── dateUtils.ts    # Utility functions for date formatting and parsing.
│   │           └── fileUtils.ts    # Additional helper functions for file operations.
├── tailwind.config.js              # Tailwind CSS configuration file.
└── tsconfig.json                   # TypeScript configuration file.

```
## Contact 📧

For questions or suggestions, please contact:

**Name:** Onyedikachi Ejim


**Email:** Ejimovc@gmail.com

