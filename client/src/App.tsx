import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/useAuthStore';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetail from './pages/JobDetail';
import CompanyDetail from './pages/CompanyDetail';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOTP from './pages/VerifyOTP';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';
import PostJob from './pages/PostJob';
import EmployerDashboard from './pages/EmployerDashboard';
import EditJob from './pages/EditJob';
import JobApplications from './pages/JobApplications';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/shared/LoadingSpinner';

function App() {
    const { checkAuth, loading } = useAuthStore();
    console.log('🔍 API URL hiện tại là:', import.meta.env.VITE_API_BASE_URL);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (loading)
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    return (
        
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Toaster position="top-right" richColors />

            <Routes>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/companies/:id" element={<CompanyDetail />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/saved-jobs" element={<SavedJobs />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
                        <Route path="/post-job" element={<PostJob />} />
                        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                        <Route path="/jobs/edit/:id" element={<EditJob />} />
                        <Route
                            path="/employer/jobs/:jobId/applications"
                            element={<JobApplications />}
                        />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
                        <Route path="/my-applications" element={<MyApplications />} />
                    </Route>


                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>


                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
