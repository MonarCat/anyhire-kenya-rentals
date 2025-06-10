
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Search from '@/pages/Search';
import ItemDetails from '@/pages/ItemDetails';
import ListItem from '@/pages/ListItem';
import ImprovedListItem from '@/pages/ImprovedListItem';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';
import Messages from '@/pages/Messages';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import CookiePolicy from '@/pages/CookiePolicy';
import SafetyTips from '@/pages/SafetyTips';
import RentalAgreement from '@/pages/RentalAgreement';
import ResetPassword from '@/pages/ResetPassword';
import PaymentCallback from '@/pages/PaymentCallback';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <SubscriptionProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/item/:id" element={<ItemDetails />} />
                  <Route path="/list-item" element={<ImprovedListItem />} />
                  <Route path="/list-item-basic" element={<ListItem />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="/safety" element={<SafetyTips />} />
                  <Route path="/rental-agreement" element={<RentalAgreement />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/payment/callback" element={<PaymentCallback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </SubscriptionProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
