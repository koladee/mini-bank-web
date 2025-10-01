# Mini Bank Web (Frontend)

This is the **React + Vite + TailwindCSS** frontend for the Mini Bank
platform.\
It provides a simple, functional interface for users to register, log
in, view balances, and perform transactions.

------------------------------------------------------------------------

## Features

-   User Registration & Login (with validation)
-   Dashboard with balance display
-   Transfer funds between users
-   Currency Exchange with live FX preview
-   Transaction history with debit/credit distinction
-   Error and loading states (ErrorBanner, Loading components)
-   Receipt modal for transaction details
-   Fully styled with **TailwindCSS** (primary color `#4287f5`)
-   State managed via React Context API

------------------------------------------------------------------------

## Prerequisites

Ensure you have the following installed on your system:

-   [Node.js 18+](https://nodejs.org/)
-   [npm](https://docs.npmjs.com/cli/v8/configuring-npm/install)
-   A running backend API (`mini-bank-api`) accessible from the frontend

------------------------------------------------------------------------

## Getting Started

1.  **Clone the repository**

    ``` bash
    git clone https://github.com/koladee/mini-bank-web.git
    cd mini-bank-web
    ```

2.  **Install dependencies**

    ``` bash
    npm install
    ```

3.  **Environment setup**

    Copy `.env.example` to `.env.local` and set the required variables:

    ``` env
    VITE_API_BASE_URL=http://localhost:3000
    VITE_API_KEY=your_api_key_here
    ```

4.  **Run the development server**

    ``` bash
    npm run dev
    ```

    The app will be available at <http://localhost:5173>.

------------------------------------------------------------------------

## Docker Setup (Optional)

You can also run the frontend inside Docker.

1.  Ensure you have **Docker Desktop** installed and running.

2.  Build and run the container:

    ``` bash
    docker compose up --build
    ```

3.  The frontend will be available at <http://localhost:5173>.

------------------------------------------------------------------------

## Project Structure

    src/
     ├── api/               # API client & endpoints
     ├── components/        # UI components (Navbar, Forms, Tables, etc.)
     ├── context/           # Context providers (Auth, Accounts, Transactions, Meta)
     ├── pages/             # Page components (Login, Register, Dashboard, etc.)
     ├── router.tsx         # Routing setup
     ├── types.ts           # Shared TypeScript types
     └── main.tsx           # App entry point

------------------------------------------------------------------------

## Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview the production build locally

------------------------------------------------------------------------

## Known Issues / Improvements

-   Currently, only USD ↔ EUR exchange supported.
-   Real-time updates could be improved with WebSockets.
-   UI can be further polished with animations and better
    responsiveness.

------------------------------------------------------------------------

## License

MIT License.
