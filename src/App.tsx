import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Signup from "./components/pages/signup";
import Signin from "./components/pages/login";
import Tasks from "./components/pages/taskspage";
import { PublicRoute } from "./components/publicroute";
import { ProtectedRoute } from "./components/protectedroute";
import { getToken } from "./lib/cookieutils";

function App() {
  const token = getToken();
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/tasks" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Signin />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Sonner Toast notifications */}
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;