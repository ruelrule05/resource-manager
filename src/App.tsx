import { useEffect } from 'react'
import './App.css'
import {AuthProvider} from "./hooks/useAuth.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./components/HomePage.tsx";
import DashboardView from "./components/Dashboard/DashboardView.tsx";
import LoginForm from "./components/Auth/LoginForm.tsx";
import {RegistrationForm} from "./components/Auth/RegistrationForm.tsx";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout.tsx";
import RedirectIfAuthenticated from "./layouts/RedirectIfAuthenticated.tsx";
import {ProjectList} from "./components/Resources/Projects/ProjectList.tsx";
import ProjectForm from "./components/Resources/Projects/ProjectForm.tsx";
import AboutUs from "./components/AboutUs.tsx";
import ContactUs from "./components/ContactUs.tsx";
import TaskList from "./components/Resources/Tasks/TaskList.tsx";
import TaskForm from "./components/Resources/Tasks/TaskForm.tsx";
import InventoryItemList from "./components/Resources/InventoryItems/InventoryItemList.tsx";
import InventoryItemForm from "./components/Resources/InventoryItems/InventoryItemForm.tsx";

async function loadFlyonUI() {
  return import("flyonui/flyonui");
}

function App() {
  useEffect(() => {
    const initFlyonUI = async () => {
      await loadFlyonUI();
    }

    initFlyonUI();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Route>

          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardView />} />

            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/create" element={<ProjectForm />} />
            <Route path="/projects/:id/edit" element={<ProjectForm />} />

            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/create" element={<TaskForm />} />
            <Route path="/tasks/:id/edit" element={<TaskForm />} />

            <Route path="/inventory-items" element={<InventoryItemList />} />
            <Route path="/inventory-items/create" element={<InventoryItemForm />} />
            <Route path="/inventory-items/:id/edit" element={<InventoryItemForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
