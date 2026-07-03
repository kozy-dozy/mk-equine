import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import PageTransition from '@/components/shared/PageTransition'
import Theme from '@/components/template/Theme'
import { ADMIN } from '@/constants/roles.constant'
import { useAppSelector } from '@/store'
import {
    useInitializeReduxState,
    useInitializeFeatureFlags,
} from '@/store/domainHooks'
import AdminLayout from '@/views/admin/components/AdminLayout'
import AuthLayout from '@/views/ecom/components/AuthLayout'
import EcomLayout from '@/views/ecom/components/EcomLayout/EcomLayout'
import MarketingLayout from '@/views/ecom/components/marketing/MarketingLayout'

import AuthorityGuard from './components/route/AuthorityGuard'
import PageContainer from './components/template/PageContainer'
import GoogleAnalytics from './views/ecom/components/GoogleAnalytics'

// Ecom pages
const Home = lazy(() => import('@/views/ecom/pages/Home/index'))
const About = lazy(() => import('@/views/ecom/pages/About'))
const Lessons = lazy(() => import('@/views/ecom/pages/Lessons'))
const Horses = lazy(() => import('@/views/ecom/pages/Horses'))
const Gallery = lazy(() => import('@/views/ecom/pages/Gallery'))
const BookLesson = lazy(() => import('@/views/ecom/pages/BookLesson'))
const Contact = lazy(() => import('@/views/ecom/pages/Contact'))
const Faq = lazy(() => import('@/views/ecom/pages/Faq'))
const Privacy = lazy(() => import('@/views/ecom/pages/Privacy'))
const Terms = lazy(() => import('@/views/ecom/pages/Terms'))
const Profile = lazy(() => import('@/views/ecom/pages/Profile'))

// Auth pages
const SignIn = lazy(() => import('@/views/ecom/auth/SignIn'))
const SignUp = lazy(() => import('@/views/ecom/auth/SignUp'))
const ForgotPassword = lazy(() => import('@/views/ecom/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/views/ecom/auth/ResetPassword'))
const EmailConfirmed = lazy(() => import('@/views/ecom/auth/EmailConfirmed'))

// Admin pages
const AdminDashboard = lazy(() => import('@/views/admin/pages/Dashboard'))
const AdminMembers = lazy(() => import('@/views/admin/pages/Members'))
const AdminHorses = lazy(() => import('@/views/admin/pages/Horses'))
const AdminAvailability = lazy(() => import('@/views/admin/pages/Availability'))
const AdminBookings = lazy(() => import('@/views/admin/pages/Bookings'))
const AdminMemberDetails = lazy(
    () => import('@/views/admin/pages/Members/MemberDetails/MemberDetails'),
)
const AdminSettings = lazy(() => import('@/views/admin/pages/Settings'))
const AdminFeatures = lazy(() => import('@/views/admin/pages/Features'))
const AdminSiteContent = lazy(() => import('@/views/admin/pages/SiteContent'))

function AppRoutes() {
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    return (
        <Suspense fallback={<PageTransition />}>
            <Routes>
                {/* Public marketing pages */}
                <Route element={<MarketingLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/lessons" element={<Lessons />} />
                    <Route path="/horses" element={<Horses />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/book-lesson" element={<BookLesson />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                </Route>

                {/* Account pages (existing chrome) */}
                <Route element={<EcomLayout />}>
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                    <Route
                        path="/sign-in"
                        element={
                            <PublicRoute>
                                <SignIn />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/sign-up"
                        element={
                            <PublicRoute>
                                <SignUp />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            <PublicRoute>
                                <ForgotPassword />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/reset-password"
                        element={
                            <PublicRoute>
                                <ResetPassword />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/email-confirmed"
                        element={
                            <PublicRoute>
                                <EmailConfirmed />
                            </PublicRoute>
                        }
                    />
                </Route>

                {/* Admin routes */}
                <Route element={<AdminLayout />}>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AuthorityGuard
                                    userAuthority={userAuthority}
                                    authority={[ADMIN]}
                                />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            index
                            element={<Navigate replace to="dashboard" />}
                        />
                        <Route
                            path="dashboard"
                            element={
                                <PageContainer footer={false}>
                                    <AdminDashboard />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="members"
                            element={
                                <PageContainer footer={false}>
                                    <AdminMembers />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="horses"
                            element={
                                <PageContainer footer={false}>
                                    <AdminHorses />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="bookings"
                            element={
                                <PageContainer footer={false}>
                                    <AdminBookings />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="availability"
                            element={
                                <PageContainer footer={false}>
                                    <AdminAvailability />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="members/:id"
                            element={
                                <PageContainer footer={false}>
                                    <AdminMemberDetails />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="settings"
                            element={
                                <PageContainer footer={false}>
                                    <AdminSettings />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="features"
                            element={
                                <PageContainer footer={false}>
                                    <AdminFeatures />
                                </PageContainer>
                            }
                        />
                        <Route
                            path="site-content"
                            element={
                                <PageContainer footer={false}>
                                    <AdminSiteContent />
                                </PageContainer>
                            }
                        />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </Suspense>
    )
}

function App() {
    useInitializeReduxState()
    useInitializeFeatureFlags()

    return (
        <BrowserRouter>
            <GoogleAnalytics />
            <Theme>
                <AppRoutes />
            </Theme>
        </BrowserRouter>
    )
}

export default App
