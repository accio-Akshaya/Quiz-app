import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import QuizAttemptPage from "./pages/QuizAttemptPage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";

import { useAuth } from "./context/AuthContext";

function App() {
  // ✅ FIX: include user also
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="page-shell">
        <Routes>

          {/* Redirect root */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignupPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Create Quiz (Admin only) */}
          <Route
            path="/quizzes/create"
            element={
              <ProtectedRoute roles={["admin"]}>
                <CreateQuizPage />
              </ProtectedRoute>
            }
          />

          {/* Edit Quiz (Admin only) */}
          <Route
            path="/quizzes/edit/:id"
            element={
              <ProtectedRoute roles={["admin"]}>
                <EditQuizPage />
              </ProtectedRoute>
            }
          />

          {/* Attempt Quiz */}
          <Route
            path="/quizzes/attempt/:id"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <QuizAttemptPage />
              </ProtectedRoute>
            }
          />

          {/* Result */}
          <Route
            path="/result"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ ADMIN ROUTE (BEST WAY) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </main>
    </>
  );
}

export default App;
