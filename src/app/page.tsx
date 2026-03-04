"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Brands } from "@/components/Brands";
import { Categories } from "@/components/Categories";
import { QuizBanner } from "@/components/QuizBanner";
import { Products } from "@/components/Products";
import { Reviews } from "@/components/Reviews";
import { Guides } from "@/components/Guides";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { QuizModal } from "@/components/QuizModal";

export default function HomePage() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <Header onOpenQuiz={() => setQuizOpen(true)} />
      <Hero onOpenQuiz={() => setQuizOpen(true)} />
      <Brands />
      <Categories />
      <QuizBanner onOpenQuiz={() => setQuizOpen(true)} />
      <Products />
      <Reviews />
      <Guides />
      <Newsletter />
      <Footer />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}
