"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Brands } from "./Brands";
import { Categories } from "./Categories";
import { QuizBanner } from "./QuizBanner";
import { Products, type ProductRow } from "./Products";
import { Reviews } from "./Reviews";
import { Guides } from "./Guides";
import { Newsletter } from "./Newsletter";
import { Footer } from "./Footer";
import { QuizModal } from "./QuizModal";

interface HotPickProduct {
  id: number;
  name: string;
  brand: string;
  emoji: string;
  price: string;
  rating: number;
  affiliateLinks: { id: number; retailer: string; url: string; price: string }[];
}

interface Props {
  products: ProductRow[];
  categories: { id: number; name: string; emoji: string; price: string; slug: string }[];
  reviews: { id: number; text: string; name: string; location: string; initial: string }[];
  guides: { id: number; slug: string; emoji: string; tag: string; title: string; readTime: string; updated: string }[];
  brands: string[];
  adsEnabled?: boolean;
  adFrequency?: number;
  hotPickProduct?: HotPickProduct | null;
  heroAdEnabled?: boolean;
  heroAdSlot?: string;
}

export function ClientPage({ products, categories, reviews, guides, brands, adsEnabled, adFrequency, hotPickProduct, heroAdEnabled, heroAdSlot }: Props) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleBrandClick = (brand: string) => {
    setActiveBrand(brand);
    setActiveCategory(null);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setActiveBrand(null);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilter = () => {
    setActiveBrand(null);
    setActiveCategory(null);
  };

  return (
    <>
      <Header onOpenQuiz={() => setQuizOpen(true)} />
      <Hero onOpenQuiz={() => setQuizOpen(true)} hotPickProduct={hotPickProduct} heroAdEnabled={heroAdEnabled} heroAdSlot={heroAdSlot} />
      <Brands brands={brands} onBrandClick={handleBrandClick} />
      <Categories categories={categories} onCategoryClick={handleCategoryClick} />
      <QuizBanner onOpenQuiz={() => setQuizOpen(true)} />
      <Products
        products={products}
        activeBrand={activeBrand}
        activeCategory={activeCategory}
        onClearFilter={clearFilter}
        adsEnabled={adsEnabled}
        adFrequency={adFrequency}
      />
      <Reviews reviews={reviews} />
      <Guides guides={guides} />
      <Newsletter />
      <Footer />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}
