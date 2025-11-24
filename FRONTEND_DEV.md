# 🚀 Project Setup Instructions

Follow these steps to run this React project locally.

---

## Requirements

Please install:

- **Node.js** (v16 or later recommended)  
  Download: https://nodejs.org
- **npm** (comes with Node)  
  *(or Yarn / pnpm if preferred)*

---
## 1. Install Dependencies
Navigate to the project folder
```bash
cd roam.io/frontend
```

Inside the project folder, run:

```bash
npm install
```

## 2. Setup .env file for API Keys
Navigate to the project folder
```bash
cd roam.io/frontend
```

Inside the project folder, make sure to create a .env file:

```bash
vi .env # In command line
```

Once creating this .env file in the backend folder, place the following variables with their keys following the '=' in the .env file:
```bash
AMADEUS_API_KEY=
AMADEUS_API_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPEN_CAGE_API_KEY=
OPEN_API_KEY=
```

## 3.  Run Development Server

```bash
npm run start
```
