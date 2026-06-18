import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

// The Landing page loads eagerly since it's the most likely first paint.
import Landing from './pages/public/Landing';

// Everything else is route-split: a visitor browsing the public site never
// pays the bundle cost of recharts, the AI chat UI, or the ERP dashboards,
// which matters on the mid-range Android / patchy-data audience this
// product targets.
const Login = lazy(() => import('./pages/public/Login'));
const Signup = lazy(() => import('./pages/public/Signup'));
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const About = lazy(() => import('./pages/public/About'));
const Pricing = lazy(() => import('./pages/public/Pricing'));
const Contact = lazy(() => import('./pages/public/Contact'));
const FAQs = lazy(() => import('./pages/public/FAQs'));
const Careers = lazy(() => import('./pages/public/Careers'));
const Blog = lazy(() => import('./pages/public/Blog'));
const NotFound = lazy(() => import('./pages/public/NotFound'));
const Library = lazy(() => import('./pages/library/Library'));

const LearnerDashboard = lazy(() => import('./pages/learner/LearnerDashboard'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'));
const SchoolDashboard = lazy(() => import('./pages/school/SchoolDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

import { CBCResource } from './types';

/** Fades the page content in/out on route changes for a smoother feel. */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  // Resources teachers publish from the Teacher Hub flow into the public Library
  // for the duration of this session - a lightweight cross-page bridge that
  // matches Phase 1 scope (no shared content database yet).
  const [publishedResources, setPublishedResources] = useState<CBCResource[]>([]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF8]">
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/library" element={<Library extraResources={publishedResources} />} />

              {/* Role-protected dashboards */}
              <Route
                path="/learner"
                element={
                  <ProtectedRoute allow={['learner']}>
                    <LearnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allow={['teacher']}>
                    <TeacherDashboard onPublish={(r) => setPublishedResources((prev) => [r, ...prev])} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent"
                element={
                  <ProtectedRoute allow={['parent']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school"
                element={
                  <ProtectedRoute allow={['school']}>
                    <SchoolDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allow={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
