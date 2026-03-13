# Employee Search React App (React Data Grid)

This is a simple React application that displays an employee table using **react-data-grid** and allows users to search employees by **Emp ID**, **Emp Name**, and **Address** via a search form above the grid.

The table is populated from a **dummy API call** (simulated with a small delay).

## Scripts

- **Install dependencies**

  ```bash
  npm install
  ```

- **Run in development**

  ```bash
  npm run dev
  ```

  Then open the printed local URL in your browser (for example, `http://localhost:5173`).

- **Build for production**

  ```bash
  npm run build
  ```

## How it works

- `src/api.js` simulates an API request that returns employee data.
- `src/App.jsx`:
  - Fetches employees when the app loads.
  - Shows a search panel with three fields (Emp ID, Emp Name, Address) and a **Search** button.
  - Filters the grid rows based on the typed values when you click **Search**.
  - Provides a **Reset** button to clear filters and show all rows again.

