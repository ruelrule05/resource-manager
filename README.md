# Resource Manager - Frontend

## Overview

This is the React frontend for the Resource Management Dashboard, built using Vite and FlyonUI. It consumes the backend API to provide a user interface for managing resources (Projects), handling authentication, and displaying data.

## Public Repository

[Resource Manager - Frontend](https://github.com/ruelrule05/resource-manager)

## Setup Instructions

1.  **Clone the Frontend Repository:**
    ```bash
    git clone [https://github.com/ruelrule05/resource-manager.git](https://github.com/ruelrule05/resource-manager.git)
    cd resource-manager
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure API endpoint:**
    Open the `src/lib/constants.ts` file and update the API endpoint if necessary. You can see the endpoint URI from sail.


4.  **Start the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application will be accessible at `http://localhost:5173` (or the port Vite assigns). Ensure your backend API is running and accessible at the configured URL.

## Technologies Used

* React
* Vite
* React Router DOM
* FlyonUI
* TypeScript