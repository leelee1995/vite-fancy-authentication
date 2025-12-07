import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import FloatingShape from "./components/FloatingShape.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    if (
        new Date(user.verificationTokenExpiresAt).getTime() <=
        new Date().getTime()
    ) {
        return <Navigate to="/verify-email" replace />;
    }

    // We will be navigating the user to verify-email page after 24 hours
    // of no verification
    /*
    if (!user.isVerified) {
        return <Navigate to="/verify-email" replace />;
    }*/

    return children;
};

// redirect authenticated users to the dashboard page
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    //  We will check if the email is authenticated
    //  A verification notification will appear in user's dashboard
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const App = () => {
    const { isCheckingAuth, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-800 via-blue-800 to-indigo-800 flex items-center justify-center relative overflow-hidden">
            <FloatingShape
                color="bg-blue-500"
                size="w-64 h-64"
                top="-5%"
                left="10%"
                delay={0}
            />
            <FloatingShape
                color="bg-blue-500"
                size="w-48 h-48"
                top="70%"
                left="80%"
                delay={5}
            />
            <FloatingShape
                color="bg-blue-500"
                size="w-32 h-32"
                top="40%"
                left="10%"
                delay={2}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignUpPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/signin"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignInPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/verify-email"
                    element={<EmailVerificationPage />}
                />
                <Route
                    path="/forgot-password"
                    element={
                        <RedirectAuthenticatedUser>
                            <ForgotPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <RedirectAuthenticatedUser>
                            <ResetPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
