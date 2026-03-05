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

interface Props {
  products: ProductRow[];
  categories: { id: number; name: string; emoji: string; price: string; slug: string }[];
  reviews: { id: number; text: string; name: string; location: string; initial: string }[];
  guides: { id: number; emoji: string; tag: string; title: string; readTime: string; updated: string }[];
  brands: string[];
}

export function ClientPage({ products, categories, reviews, guides, brands }: Props) {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <Header onOpenQuiz={() => setQuizOpen(true)} />
      <Hero onOpenQuiz={() => setQuizOpen(true)} />
      <Brands brands={brands} />
      <Categories categories={categories} />
      <QuizBanner onOpenQuiz={() => setQuizOpen(true)} />
      <Products products={products} />
      <Reviews reviews={reviews} />
      <Guides guides={guides} />
      <Newsletter />
      <Footer />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}
