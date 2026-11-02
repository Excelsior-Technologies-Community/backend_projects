import React from 'react';
import Hero from '../components/Hero';
import BrandTicker from '../components/BrandTicker';
import Testimonials from '../components/Testimonials';
import Services from '../components/Services';
import InvestFund from '../components/InvestFund';
import TrendingProducts from '../components/TrendingProducts';
import FeatureSections from '../components/FeatureSections';
import OasisResidence from '../components/OasisResidence';
import BestPlaces from '../components/BestPlaces';
import LatestTechnologies from '../components/LatestTechnologies';
import LuxuriousMasterSuite from '../components/LuxuriousMasterSuite';
import ComfortLiving from '../components/ComfortLiving';
import BlogArticles from '../components/BlogArticles';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <BrandTicker />
      <Testimonials />
      <Services />
      <InvestFund />
      <TrendingProducts />
      <FeatureSections />
      <OasisResidence />
      <BestPlaces />
      <LatestTechnologies />
      <LuxuriousMasterSuite />
      <ComfortLiving />
      <BlogArticles />
      <Newsletter />
    </div>
  );
}
