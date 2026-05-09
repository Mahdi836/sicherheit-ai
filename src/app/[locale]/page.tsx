import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Footer from '@/components/Footer';
import ScrollAnimator from '@/components/ScrollAnimator';
import { setRequestLocale } from 'next-intl/server';
import { getLatestPosts } from '@/lib/posts';

// Lazy-load all below-fold sections — reduces initial JS bundle
const StatsSection        = dynamic(() => import('@/components/StatsSection'));
const BentoThreats        = dynamic(() => import('@/components/BentoThreats'));
const RobotSection        = dynamic(() => import('@/components/RobotSection'));
const HorizontalToolScroll = dynamic(() => import('@/components/HorizontalToolScroll'));
const RadarSection        = dynamic(() => import('@/components/RadarSection'));
const NewsSection         = dynamic(() => import('@/components/NewsSection'));
const ScoreSection        = dynamic(() => import('@/components/ScoreSection'));
const ToolsSection        = dynamic(() => import('@/components/ToolsSection'));
const TerminalSection     = dynamic(() => import('@/components/TerminalSection'));
const NewsletterSection   = dynamic(() => import('@/components/NewsletterSection'));

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const latestPosts = await getLatestPosts(5);

  return (
    <>
      <ScrollAnimator />
      <Hero />
      <Ticker />
      <RobotSection />
      <StatsSection />
      <BentoThreats />
      <HorizontalToolScroll />
      <RadarSection />
      <NewsSection locale={locale} posts={latestPosts} />
      <ScoreSection />
      <ToolsSection locale={locale} />
      <TerminalSection locale={locale} />
      <NewsletterSection />
      <Footer locale={locale} />
    </>
  );
}
