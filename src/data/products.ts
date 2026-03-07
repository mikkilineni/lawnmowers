export const CATEGORIES = [
  { name: "Push Mowers", emoji: "🌿", price: "From $180", slug: "push" },
  { name: "Self-Propelled", emoji: "💨", price: "From $280", slug: "self-propelled" },
  { name: "Riding Mowers", emoji: "🚜", price: "From $1,200", slug: "riding" },
  { name: "Zero-Turn", emoji: "🏎️", price: "From $2,500", slug: "zero-turn" },
  { name: "Robot Mowers", emoji: "🤖", price: "From $600", slug: "robot" },
  { name: "Electric", emoji: "⚡", price: "From $200", slug: "electric" },
];

export type BadgeType = "best" | "popular" | "new" | "sale";

export interface Product {
  id: number;
  badge: string;
  badgeType: BadgeType;
  brand: string;
  name: string;
  emoji: string;
  rating: number;
  reviews: number;
  tags: string[];
  price: string;
  originalPrice: string;
  savings: string;
  categories: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    badge: "⭐ Best Overall",
    badgeType: "best",
    brand: "EGO Power+",
    name: "LM2135SP Self-Propelled",
    emoji: "🌿",
    rating: 4.9,
    reviews: 2847,
    tags: ["21\" Cut", "Self-Propelled", "56V Battery"],
    price: "$549",
    originalPrice: "$649",
    savings: "Save $100",
    categories: ["electric", "under500"],
  },
  {
    id: 2,
    badge: "🔥 Most Popular",
    badgeType: "popular",
    brand: "Honda",
    name: "HRX217VKA Gas Mower",
    emoji: "🏡",
    rating: 4.8,
    reviews: 1923,
    tags: ["21\" Cut", "Variable Speed", "Honda GCV200"],
    price: "$679",
    originalPrice: "$749",
    savings: "Save $70",
    categories: ["gas"],
  },
  {
    id: 3,
    badge: "🆕 New 2025",
    badgeType: "new",
    brand: "Greenworks",
    name: "Pro 80V Brushless",
    emoji: "⚡",
    rating: 4.7,
    reviews: 834,
    tags: ["21\" Cut", "Brushless Motor", "Includes Battery"],
    price: "$449",
    originalPrice: "$499",
    savings: "Save $50",
    categories: ["electric", "under500"],
  },
  {
    id: 4,
    badge: "⭐ Best Robot",
    badgeType: "best",
    brand: "Husqvarna",
    name: "Automower 450XH",
    emoji: "🤖",
    rating: 4.8,
    reviews: 1204,
    tags: ["GPS Guided", "App Control", "1.25 Acres"],
    price: "$2,499",
    originalPrice: "$2,799",
    savings: "Save $300",
    categories: ["robot"],
  },
  {
    id: 5,
    badge: "⭐ Best Riding",
    badgeType: "best",
    brand: "John Deere",
    name: "S130 Riding Mower",
    emoji: "🚜",
    rating: 4.7,
    reviews: 987,
    tags: ["42\" Deck", "22HP Briggs", "6-Speed"],
    price: "$2,299",
    originalPrice: "$2,599",
    savings: "Save $300",
    categories: ["riding"],
  },
  {
    id: 6,
    badge: "💸 Best Value",
    badgeType: "sale",
    brand: "Ryobi",
    name: "40V HP Brushless 20\"",
    emoji: "🌱",
    rating: 4.5,
    reviews: 3241,
    tags: ["20\" Cut", "40V Battery", "Foldable"],
    price: "$279",
    originalPrice: "$329",
    savings: "Save $50",
    categories: ["electric", "under500"],
  },
];

export const REVIEWS = [
  {
    id: 1,
    text: "This site saved me hours of research. The EGO recommendation was spot on — runs perfectly on my half-acre and the battery lasts the whole job.",
    name: "Marcus T.",
    location: "Austin, TX",
    initial: "M",
  },
  {
    id: 2,
    text: "I used the comparison tool to narrow down between 6 riding mowers. Bought the John Deere S130 and couldn't be happier. Worth every penny.",
    name: "Sarah K.",
    location: "Nashville, TN",
    initial: "S",
  },
  {
    id: 3,
    text: "Finally got a robot mower after using the quiz. The Husqvarna handles my sloped yard like a champ. The buying guide here is the best I found.",
    name: "David R.",
    location: "Portland, OR",
    initial: "D",
  },
];

export const GUIDES = [
  {
    id: 1,
    emoji: "📏",
    tag: "Buying Guide",
    title: "How to Choose the Right Mower for Your Lawn Size",
    readTime: "8 min read",
    updated: "Updated Jan 2025",
  },
  {
    id: 2,
    emoji: "⚡",
    tag: "Comparison",
    title: "Electric vs Gas Mowers: Which Is Better in 2025?",
    readTime: "6 min read",
    updated: "Updated Feb 2025",
  },
  {
    id: 3,
    emoji: "🤖",
    tag: "Review",
    title: "Best Robot Mowers of 2025: Tested and Ranked",
    readTime: "12 min read",
    updated: "Updated Feb 2025",
  },
  {
    id: 4,
    emoji: "🔧",
    tag: "Maintenance",
    title: "Lawnmower Maintenance Checklist: Spring Tune-Up Guide",
    readTime: "5 min read",
    updated: "Updated Mar 2025",
  },
];

export const BRANDS = ["EGO", "HUSQVARNA", "JOHN DEERE", "TORO", "GREENWORKS", "RYOBI", "CUB CADET", "HONDA", "CRAFTSMAN", "TROY-BILT", "BAD BOY", "ARIENS", "SCAG", "FERRIS", "MAMMOTION", "SEGWAY", "STIHL", "DEWALT", "MAKITA", "FISKARS"];

export const QUIZ_RESULTS: Record<string, { emoji: string; name: string; price: string }> = {
  electric: { emoji: "⚡", name: "EGO Power+ LM2135SP", price: "$549" },
  gas:      { emoji: "⛽", name: "Honda HRX217VKA",      price: "$679" },
  robot:    { emoji: "🤖", name: "Husqvarna Automower 450XH", price: "$2,499" },
  any:      { emoji: "🌿", name: "Greenworks Pro 80V",   price: "$449" },
};
