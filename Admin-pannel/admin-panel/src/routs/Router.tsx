import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminRoute from "../components/auth/ProtectedRouts";
import AdminLayout from "../components/Layout/AdminLayout";

const CommentsPage = lazy(() => import("../pages/CommentsPage"));
const Login = lazy(() => import("../pages/Login"));
const UsersPage = lazy(() => import("../pages/UsersPage"));
const CategoriesPage = lazy(() => import("../pages/CategoriesPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const PaintingsPage = lazy(() => import("../pages/PaintingsPage"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const EditProfilePage = lazy(() => import("../pages/EditProfilePage"));





export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<AdminLayout />}>
            <Route
              path="/"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />

            <Route
              path="/paintings"
              element={
                <AdminRoute>
                  <PaintingsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/categories"
              element={
                <AdminRoute>
                  <CategoriesPage />
                </AdminRoute>
              }
            />

            <Route
              path="/comments"
              element={
                <AdminRoute>
                  <CommentsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <AdminRoute>
                  <ProfilePage />
                </AdminRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <AdminRoute>
                  <EditProfilePage />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}