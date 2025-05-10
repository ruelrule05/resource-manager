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
import CreateProject from "./components/Resources/Projects/CreateProject.tsx";

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

          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Route>

          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardView />} />

            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/create" element={<CreateProject />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
