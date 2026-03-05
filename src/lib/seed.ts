import prisma from "./prisma";
import { CATEGORIES, REVIEWS, GUIDES, BRANDS } from "@/data/products";

const LAWNMOWERS = [
  // ── CUB CADET ──────────────────────────────────────────────────────────
  {
    brand: "CUB CADET", badge: "⭐ Best Gas Under $500", badgeType: "best",
    name: "SC300B 21\" Self-Propelled Gas Mower",
    emoji: "🌿", rating: 4.3, reviewCount: 1847,
    price: "$479", originalPrice: "$529", savings: "Save $50",
    tags: ["Self-Propelled", "Gas", "21-inch Deck", "3-in-1"],
    categories: ["gas", "under500"],
    description: "Powered by a 163cc Briggs & Stratton engine with front-wheel drive and a 21-inch deck. Three-in-one clip direction — mulch, bag, or side discharge — with 6 cutting height positions from 1.25 to 3.75 inches. Foldable handles make storage easy.",
    image: "https://www.cubcadet.com/dw/image/v2/BCSH_PRD/on/demandware.static/-/Sites-mtd-master-catalog/default/dw40690328/products/Equipment/Cub-Cadet_SC300B_4.jpg",
  },
  {
    brand: "CUB CADET", badge: "🏆 Top Riding Pick", badgeType: "popular",
    name: "XT1 LT42 IntelliPOWER Riding Mower",
    emoji: "🚜", rating: 4.4, reviewCount: 2314,
    price: "$2,399", originalPrice: "$2,699", savings: "Save $300",
    tags: ["Riding", "42-inch Deck", "Hydrostatic", "Lawn Tractor"],
    categories: ["riding"],
    description: "547cc IntelliPOWER engine with hydrostatic transmission handles up to 1.5 acres effortlessly. 12-position cutting height and 13-gauge stamped steel deck built for durability. Backed by a class-leading 3-year/no-hour-limit warranty.",
    image: "https://www.cubcadet.com/dw/image/v2/BCSH_PRD/on/demandware.static/-/Sites-mtd-master-catalog/default/dwfb91ae66/products/Equipment/Cub-Cadet_XT1LT42_IP_3.jpg",
  },

  // ── GREENWORKS ─────────────────────────────────────────────────────────
  {
    brand: "GREENWORKS", badge: "⚡ Best 80V Electric", badgeType: "best",
    name: "80V 21\" Brushless Push Mower",
    emoji: "🔋", rating: 4.5, reviewCount: 3182,
    price: "$599", originalPrice: "$649", savings: "Save $50",
    tags: ["Electric", "Cordless", "80V", "Brushless", "21-inch Deck"],
    categories: ["electric"],
    description: "DigiPro brushless motor delivers power equivalent to a 160cc gas engine. Included 4.0Ah battery with 60-minute rapid charger provides up to 40 minutes of runtime. Single-lever 7-position height adjustment and a 4-year tool and battery warranty.",
    image: "https://www.greenworkstools.com/cdn/shop/files/71wDqolWUUL._AC_SL1500_46e3c4c5-874c-4138-9cf8-37d2378cc935.jpg?v=1727336693",
  },
  {
    brand: "GREENWORKS", badge: "🔋 Dual-Battery Tech", badgeType: "new",
    name: "60V 21\" Self-Propelled Cordless Mower",
    emoji: "⚡", rating: 4.4, reviewCount: 2541,
    price: "$499", originalPrice: "$549", savings: "Save $50",
    tags: ["Electric", "Cordless", "Self-Propelled", "60V", "Dual Battery"],
    categories: ["electric"],
    description: "Dual-battery port technology automatically switches to the second battery when the first runs out — over 1 hour of combined runtime. Push-button start, LED headlights, and single-lever height adjustment from 1.38 to 4 inches.",
    image: "https://www.greenworkstools.com/cdn/shop/files/ATFGWTKit-1_4e728ec7-2c84-4e0e-973a-21d05a3802b8.jpg?v=1721725953",
  },

  // ── HONDA ──────────────────────────────────────────────────────────────
  {
    brand: "HONDA", badge: "✅ Most Reliable", badgeType: "best",
    name: "HRN216VKA 21\" Smart Drive Self-Propelled",
    emoji: "🍀", rating: 4.6, reviewCount: 4127,
    price: "$519", originalPrice: "$569", savings: "Save $50",
    tags: ["Self-Propelled", "Gas", "21-inch Deck", "Variable Speed", "3-in-1"],
    categories: ["gas"],
    description: "GCV170 engine with Auto Choke for easy no-prime starting. Smart Drive variable-speed transmission automatically matches your walking pace (0–4 mph). MicroCut twin blades produce ultra-fine clippings for superior mulching.",
    image: "https://powerequipment.honda.com/sites/default/files/products/hero/HRN216VKA_hero.jpg",
  },
  {
    brand: "HONDA", badge: "🥇 Best Overall Walk-Behind", badgeType: "best",
    name: "HRX217VKA 21\" Select Drive Self-Propelled",
    emoji: "🌱", rating: 4.7, reviewCount: 5893,
    price: "$879", originalPrice: "$949", savings: "Save $70",
    tags: ["Self-Propelled", "Gas", "21-inch Deck", "4-in-1", "NeXite Deck", "Premium"],
    categories: ["gas"],
    description: "Honda's premium mower with a GCV200 engine and NeXite deck (rust-proof, dent-proof). The 4-in-1 Versamow System handles mulch, bag, discharge, and leaf shredding without attachments. Includes a 5-year residential warranty.",
    image: "https://powerequipment.honda.com/sites/default/files/products/hero/HRX217VKA_hero.jpg",
  },

  // ── HUSQVARNA ──────────────────────────────────────────────────────────
  {
    brand: "HUSQVARNA", badge: "💪 Best for Hills", badgeType: "best",
    name: "LC221RH 21\" Rear-Wheel Drive Self-Propelled",
    emoji: "⚙️", rating: 4.4, reviewCount: 1932,
    price: "$399", originalPrice: "$449", savings: "Save $50",
    tags: ["Self-Propelled", "Gas", "21-inch Deck", "Rear Wheel Drive", "3-in-1"],
    categories: ["gas", "under500"],
    description: "Powered by a Honda GCV160 OHC engine for reliable, easy starting. Rear-wheel drive and large rear wheels provide excellent traction on slopes and uneven terrain. 9 cutting height positions from 1 to 3.75 inches.",
    image: "https://www.husqvarna.com/content/dam/husqvarnaab/b2c/products/lawnmowers/lc221rh/lc221rh-400x300px.jpg",
  },
  {
    brand: "HUSQVARNA", badge: "🚜 Editor's Choice Rider", badgeType: "popular",
    name: "YTH18542 42\" Riding Lawn Mower",
    emoji: "🔧", rating: 4.3, reviewCount: 2876,
    price: "$2,099", originalPrice: "$2,299", savings: "Save $200",
    tags: ["Riding", "Gas", "42-inch Deck", "18.5 HP", "Hydrostatic"],
    categories: ["riding"],
    description: "18.5 HP Briggs & Stratton Intek engine with pedal-operated hydrostatic transmission for smooth, stepless control. Tight 16-inch turning radius navigates around obstacles easily. Reverse operating system lets you mow in reverse with a simple switch.",
    image: "https://www.husqvarna.com/content/dam/husqvarnaab/b2c/products/ridingmowers/yth18542/yth18542-400x300px.jpg",
  },

  // ── JOHN DEERE ─────────────────────────────────────────────────────────
  {
    brand: "JOHN DEERE", badge: "🦌 American Made", badgeType: "popular",
    name: "S130 42\" Lawn Tractor",
    emoji: "🟡", rating: 4.5, reviewCount: 3841,
    price: "$2,399", originalPrice: "$2,699", savings: "Save $300",
    tags: ["Riding", "Gas", "42-inch Deck", "22 HP", "V-Twin", "Hydrostatic"],
    categories: ["riding"],
    description: "22 HP V-twin engine with a hydrostatic foot-pedal transmission for intuitive speed and direction control. Easy Change 30-second oil change system and cruise control. Built in Greeneville, Tennessee with a 2-year/120-hour warranty.",
    image: "https://salesmanual.deere.com/customer/sales/salesmanual/images/NA/lawn_equipment/features_attachment/s100/r4k082332_s130_front_left_studio_large_e26d9fa3e8b2d17b333decad1f18e8211c95f97a.jpg",
  },
  {
    brand: "JOHN DEERE", badge: "👑 Premium Select Series", badgeType: "best",
    name: "X350 48\" Select Series Lawn Tractor",
    emoji: "🌾", rating: 4.7, reviewCount: 2193,
    price: "$4,599", originalPrice: "$4,999", savings: "Save $400",
    tags: ["Riding", "Gas", "48-inch Deck", "21.5 HP", "V-Twin", "Premium"],
    categories: ["riding"],
    description: "21.5 HP iTorque V-twin engine with a 48-inch Accel Deep deck engineered for superior mulching and bagging. Twin Touch foot-pedal hydrostatic transmission for effortless control. Compatible with MulchControl one-touch kit; 4-year/300-hour warranty.",
    image: "https://salesmanual.deere.com/customer/sales/salesmanual/images/region-4/products/mowers/lawn-tractors/x300-select-series/x350_48in_r4x001616_rrd_1024x576_large_a0c9d5dc96568069a6ae5277569ecb99432330cb.jpg",
  },

  // ── EGO ────────────────────────────────────────────────────────────────
  {
    brand: "EGO", badge: "⚡ Best Battery Mower", badgeType: "best",
    name: "POWER+ LM2135SP 21\" Select Cut Self-Propelled",
    emoji: "🔋", rating: 4.7, reviewCount: 6821,
    price: "$649", originalPrice: "$699", savings: "Save $50",
    tags: ["Electric", "Cordless", "Self-Propelled", "56V", "21-inch Deck", "Select Cut"],
    categories: ["electric"],
    description: "56V brushless motor with interchangeable Select Cut blade system — swap between Mulching, High Lift Bagging, and Extended Runtime blades. Palm-activated Touch Drive self-propel with scroll-dial speed (0.9–3.1 mph). Up to 60 minutes on the included 7.5Ah battery.",
    image: "https://egopowerplus.com/media/catalog/product/l/m/lm2135sp_forbes_v4_shadow.png",
  },
  {
    brand: "EGO", badge: "💰 Best Value Electric", badgeType: "sale",
    name: "POWER+ LM2101 21\" Push Cordless Mower",
    emoji: "⚡", rating: 4.5, reviewCount: 4392,
    price: "$399", originalPrice: "$449", savings: "Save $50",
    tags: ["Electric", "Cordless", "Push Mower", "56V", "21-inch Deck", "Under $500"],
    categories: ["electric", "under500"],
    description: "56V lithium-ion push mower with 3-in-1 capability (mulch, bag, side discharge). Included 5.0Ah battery provides up to 45 minutes of runtime. Push-button start, weather-resistant construction, and foldable handles for compact storage.",
    image: "https://egopowerplus.com/media/catalog/product/l/m/lm2114_ego_lawnmower_push_3q_front_lights_lf_22-0428_onwhite_1000_1.png",
  },

  // ── RYOBI ──────────────────────────────────────────────────────────────
  {
    brand: "RYOBI", badge: "🏷️ Best Budget Electric", badgeType: "sale",
    name: "40V HP Brushless 20\" Push Lawn Mower",
    emoji: "🟢", rating: 4.3, reviewCount: 3674,
    price: "$299", originalPrice: "$349", savings: "Save $50",
    tags: ["Electric", "Cordless", "Push Mower", "40V", "20-inch Deck", "Under $500"],
    categories: ["electric", "under500"],
    description: "40V HP brushless motor outperforms a 150cc gas mower. Included 6.0Ah battery delivers up to 45 minutes of runtime — ideal for lawns up to half an acre. Push-button start, single-lever height adjustment, and vertical storage capability.",
    image: "https://images.thdstatic.com/productImages/40cbbb30-1bee-4e9e-a2c0-5ff25609b965/svn/ryobi-cordless-lawn-mowers-pcl550b1-64_300.jpg",
  },
  {
    brand: "RYOBI", badge: "🌀 Best Budget Self-Propelled", badgeType: "popular",
    name: "40V HP Brushless 20\" Self-Propelled Mower",
    emoji: "🟢", rating: 4.2, reviewCount: 5218,
    price: "$399", originalPrice: "$449", savings: "Save $50",
    tags: ["Electric", "Cordless", "Self-Propelled", "40V", "20-inch Deck", "Under $500"],
    categories: ["electric", "under500"],
    description: "40V HP brushless self-propelled mower with rear-wheel drive for easy handling on varied terrain. A single 6.0Ah battery powers through half an acre per charge. 3-in-1 mulching, bagging, and side discharge in a lightweight, easy-to-store design.",
    image: "https://images.thdstatic.com/productImages/0d3d9cc3-7a89-4baf-a8c8-49b94b2c87b3/svn/ryobi-self-propelled-lawn-mowers-ry401180-64_300.jpg",
  },

  // ── TORO ───────────────────────────────────────────────────────────────
  {
    brand: "TORO", badge: "🏅 America's Best-Seller", badgeType: "best",
    name: "Recycler 22\" Personal Pace SmartStow",
    emoji: "🌀", rating: 4.6, reviewCount: 7342,
    price: "$519", originalPrice: "$569", savings: "Save $50",
    tags: ["Self-Propelled", "Gas", "22-inch Deck", "Personal Pace", "SmartStow"],
    categories: ["gas"],
    description: "Personal Pace Auto-Drive automatically matches your walking speed for effortless mowing. SmartStow technology lets you fold and store vertically, saving 70% garage space. 150cc Briggs & Stratton EXI engine with no oil changes ever and a 3-year guaranteed-to-start warranty.",
    image: "https://www.toro.com/en/-/media/Product-Images/Walk-Power-Mowers/21465_21465_2022_main.ashx",
  },
  {
    brand: "TORO", badge: "⚡ Cuts 40% Faster", badgeType: "popular",
    name: "TimeMaster 30\" Personal Pace Gas Mower",
    emoji: "🕐", rating: 4.5, reviewCount: 2847,
    price: "$999", originalPrice: "$1,099", savings: "Save $100",
    tags: ["Self-Propelled", "Gas", "30-inch Deck", "Wide Area", "Personal Pace"],
    categories: ["gas"],
    description: "30-inch wide-area deck cuts up to 40% faster than a standard 21-inch mower. 223cc Briggs & Stratton OHV engine with Personal Pace self-propulsion and cast aluminum deck. Spin-Stop lets you walk away without shutting off the engine; 3-year guaranteed-to-start warranty.",
    image: "https://www.toro.com/en/-/media/Product-Images/Walk-Power-Mowers/21199_21199_2023_main.ashx",
  },
];

export async function seedIfEmpty() {
  const count = await prisma.product.count();
  // Reseed if empty or if products are missing image data
  const hasImages = count > 0 && (await prisma.product.findFirst({ where: { image: { not: "" } } }));
  if (hasImages) return;

  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: LAWNMOWERS.map((p) => ({
      badge: p.badge,
      badgeType: p.badgeType,
      brand: p.brand,
      name: p.name,
      emoji: p.emoji,
      rating: p.rating,
      reviewCount: p.reviewCount,
      price: p.price,
      originalPrice: p.originalPrice,
      savings: p.savings,
      tags: JSON.stringify(p.tags),
      categories: JSON.stringify(p.categories),
      description: p.description,
      image: p.image,
    })),
  });

  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) await prisma.category.createMany({ data: CATEGORIES });

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) await prisma.review.createMany({ data: REVIEWS });

  const guideCount = await prisma.guide.count();
  if (guideCount === 0) await prisma.guide.createMany({ data: GUIDES });

  const brandCount = await prisma.brand.count();
  if (brandCount === 0) await prisma.brand.createMany({ data: BRANDS.map((name) => ({ name })) });
}
