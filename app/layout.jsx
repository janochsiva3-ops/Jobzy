import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export const metadata = {
  title: 'Jobzy | Sri Lanka Skilled Professional Service Marketplace',
  description: 'Find verified electricians, plumbers, carpenters, tutors, technicians and service specialists in Sri Lanka. Compare reviews, request bookings, and hire trusted pros with transparent LKR pricing.',
  keywords: 'Sri Lanka services, electricians Colombo, plumbers Kandy, tutors Galle, carpenter Negombo, AC repair Sri Lanka, Jobzy',
  authors: [{ name: 'Jobzy Sri Lanka' }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
            <AuthModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
