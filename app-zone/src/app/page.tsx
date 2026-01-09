"use client";

import { useState, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HomeBanner } from "~/components/home-banner/home-banner";
import { HomeButtons } from "~/components/home-buttons/home-buttons";

// Lazy loading de componentes abaixo da dobra para melhor performance inicial
const HomeStats = lazy(() => import("~/components/home-stats/home-stats").then(m => ({ default: m.HomeStats })));
const HomeInsights = lazy(() => import("~/components/home-insights/home-insights").then(m => ({ default: m.HomeInsights })));
const HomeHighlight = lazy(() => import("~/components/home-highlight/home-highlight").then(m => ({ default: m.HomeHighlight })));
const HomeCard = lazy(() => import("~/components/home-card/home-card").then(m => ({ default: m.HomeCard })));
const HomeSupport = lazy(() => import("~/components/home-support/home-support").then(m => ({ default: m.HomeSupport })));
const HomeGlobal = lazy(() => import("~/components/home-global/home-global").then(m => ({ default: m.HomeGlobal })));
const HomeFaqs = lazy(() => import("~/components/home-faqs/home-faqs").then(m => ({ default: m.HomeFaqs })));
const FooterHome = lazy(() => import("~/components/footer-home/footer-home").then(m => ({ default: m.FooterHome })));
const SignInModal = lazy(() => import("~/components/sign-in-modal/sign-in-modal").then(m => ({ default: m.SignInModal })));
const SignUpModal = lazy(() => import("~/components/sign-up-modal/sign-up-modal").then(m => ({ default: m.SignUpModal })));

export default function Home() {
  const router = useRouter();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleSignInClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4caf50] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-gray-900">ByteBank</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="#" className="hover:text-gray-900 transition-colors">EMPRESA</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">SOLUÇÕES</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">AJUDA</Link>
          </div>
          
          <button 
            onClick={handleSignUpClick}
            className="text-sm text-gray-900 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            BAIXAR APP
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <HomeBanner title="" />
        <HomeButtons
          onSignInButtonClick={handleSignInClick}
          onSignUpButtonClick={handleSignUpClick}
        />
      </div>

      {/* Quick & Easy + Transaction Preview */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
          <HomeStats />
        </Suspense>
      </div>

      {/* Insights Section */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
        <HomeInsights />
      </Suspense>

      {/* Features Section - Dark */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-800 rounded-lg" />}>
          <HomeHighlight />
        </Suspense>
      </div>

      {/* Card Section */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
        <HomeCard />
      </Suspense>

      {/* Support Section */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
        <HomeSupport />
      </Suspense>

      {/* Global Transfer Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
          <HomeGlobal onSignUpClick={handleSignUpClick} />
        </Suspense>
      </div>

      {/* FAQs Section */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
        <HomeFaqs />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-900 rounded-lg" />}>
        <FooterHome />
      </Suspense>

      {/* Modals */}
      {isSignInModalOpen && (
        <Suspense fallback={null}>
          <SignInModal
            open={isSignInModalOpen}
            onClose={() => setIsSignInModalOpen(false)}
          />
        </Suspense>
      )}
      {isSignUpModalOpen && (
        <Suspense fallback={null}>
          <SignUpModal
            open={isSignUpModalOpen}
            onClose={() => setIsSignUpModalOpen(false)}
          />
        </Suspense>
      )}
    </main>
  );
}
