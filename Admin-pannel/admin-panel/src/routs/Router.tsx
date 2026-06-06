// src/routes/Router.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../components/Layout/AdminLayout";
import CommentsPage from "../pages/CommentsPage";
import Login from "../pages/Login";
import UsersPage from "../pages/UsersPage";
import CategoriesPage from "../pages/CategoriesPage";
import Dashboard from "../pages/Dashboard";
import PaintingsPage from "../pages/PaintingsPage";

import UnauthorizedPage from "../pages/UnauthorizedPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import AdminRoute from "../components/auth/ProtectedRouts";


export default function Router() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="/paintings" element={<AdminRoute><PaintingsPage /></AdminRoute>} />
          <Route path="/categories" element={<AdminRoute><CategoriesPage /></AdminRoute>} />
          <Route path="/comments" element={<AdminRoute><CommentsPage /></AdminRoute>} />
          <Route path="/profile" element={<AdminRoute><ProfilePage /></AdminRoute>} />
          <Route path="/profile/edit" element={<AdminRoute><EditProfilePage /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}