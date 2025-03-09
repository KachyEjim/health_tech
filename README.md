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
   git clone https://github.com/your-username/diagnostic-test-manager.git
   cd diagnostic-test-manager
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
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
   ```

4. **Run Prisma Migrations:**

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

   The production build optimizes your application and serves it with server-side rendering and caching as configured.

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
/diagnostic-test-manager
├── prisma
│   └── schema.prisma         # Prisma schema file
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── tests
│   │   │   │   └── route.ts  # API endpoints for tests (list/create)
│   │   │   └── tests
│   │   │       └── [id]
│   │   │           └── route.ts  # API endpoints for individual test operations
│   │   ├── tests
│   │   │   ├── page.tsx      # Page listing tests
│   │   │   └── components
│   │   │       ├── TestForm.tsx   # Form for adding/updating tests
│   │   │       └── TestsTable.tsx  # Table displaying tests
│   └── lib
│       └── prisma.ts         # Prisma client setup
├── utils
│   ├── file_operation.ts     # File upload helper functions
│   ├── logger.ts             # Logger configuration
│   └── validation.ts         # Zod schemas for request validation
├── package.json
├── tsconfig.json
└── README.md                 # This file!
```

## Contact 📧

For questions or suggestions, please contact:

Onyedikachi Ejim
Email: Ejimovc@gmail.com
