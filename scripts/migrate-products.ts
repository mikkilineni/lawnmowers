import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const NEW_PRODUCTS = [
  // ── CRAFTSMAN ──────────────────────────────────────────────────────────
  {
    brand: "CRAFTSMAN", badge: "💰 Best Value Gas", badgeType: "sale",
    name: "M275 21\" FWD Self-Propelled Gas Mower",
    emoji: "🌿", rating: 4.2, reviewCount: 2841,
    price: "$349", originalPrice: "$399", savings: "Save $50",
    tags: ["Self-Propelled", "Gas", "21-inch Deck", "FWD", "3-in-1"],
    categories: ["gas", "under500"],
    description: "163cc OHV engine with front-wheel drive and 7-speed drive control. 3-in-1 capability handles mulching, bagging, and side discharge. 6 cutting height positions from 1.25 to 3.75 inches with single-lever adjustment.",
    image: "https://www.craftsman.com/content/dam/pfm/en_US/products/CMXGMAM2703842/hero.jpg",
  },
  {
    brand: "CRAFTSMAN", badge: "🚜 Reliable Rider", badgeType: "popular",
    name: "T150 46\" Hydrostatic Riding Mower",
    emoji: "🔧", rating: 4.3, reviewCount: 1654,
    price: "$2,299", originalPrice: "$2,499", savings: "Save $200",
    tags: ["Riding", "Gas", "46-inch Deck", "23 HP", "Hydrostatic", "Lawn Tractor"],
    categories: ["riding"],
    description: "23 HP Briggs & Stratton engine with automatic hydrostatic transmission for smooth, variable-speed control. 46-inch cutting deck with 6 height positions and a tight 18-inch turning radius. Cruise control and reverse caution system included.",
    image: "https://www.craftsman.com/content/dam/pfm/en_US/products/CMXGRAM1130036/hero.jpg",
  },

  // ── TROY-BILT ──────────────────────────────────────────────────────────
  {
    brand: "TROY-BILT", badge: "🌟 Great Starter Mower", badgeType: "popular",
    name: "TB330 21\" Variable-Speed Self-Propelled",
    emoji: "🌱", rating: 4.1, reviewCount: 1923,
    price: "$369", originalPrice: "$419", savings: "Save $50",
    tags: ["Self-Propelled", "Gas", "21-inch Deck", "Variable Speed", "3-in-1"],
    categories: ["gas", "under500"],
    description: "163cc Troy-Bilt engine with variable-speed front-wheel drive from 0–3.7 mph. TriAction cutting system bags, mulches, and side-discharges. 6 cutting heights from 1.25 to 3.75 inches; dual-lever height adjustment.",
    image: "https://www.troybilt.com/content/dam/troybilt-aem/en-us/products/walk-behind-mowers/tb330/tb330-detail.jpg",
  },
  {
    brand: "TROY-BILT", badge: "🏎️ Budget Zero-Turn", badgeType: "sale",
    name: "Mustang 54\" Zero-Turn Riding Mower",
    emoji: "🏎️", rating: 4.2, reviewCount: 987,
    price: "$3,299", originalPrice: "$3,599", savings: "Save $300",
    tags: ["Zero-Turn", "Gas", "54-inch Deck", "25 HP", "Briggs & Stratton"],
    categories: ["zero-turn", "riding"],
    description: "25 HP Briggs & Stratton engine powers a 54-inch fabricated steel deck for fast, efficient cutting. Dual hydrostatic transmissions deliver intuitive lap-bar zero-turn control. 15 cutting heights from 1.5 to 4.5 inches; 7 MPH top speed.",
    image: "https://www.troybilt.com/content/dam/troybilt-aem/en-us/products/zero-turn-mowers/mustang-54/mustang54-hero.jpg",
  },

  // ── EGO (Zero-Turn) ────────────────────────────────────────────────────
  {
    brand: "EGO", badge: "⚡ Best Electric Zero-Turn", badgeType: "best",
    name: "POWER+ Z6 ZT4214L 42\" Zero-Turn Rider",
    emoji: "🏎️", rating: 4.6, reviewCount: 1284,
    price: "$3,999", originalPrice: "$4,299", savings: "Save $300",
    tags: ["Zero-Turn", "Electric", "42-inch Deck", "Battery", "24 HP Equiv."],
    categories: ["zero-turn", "electric", "riding"],
    description: "24 HP equivalent power from six 56V batteries with Peak Power technology. Three driving modes, 8 MPH max speed, and a 42-inch steel deck. Charges in as little as 90 minutes; includes 6x 6.0Ah batteries and dual-port charger.",
    image: "https://egopowerplus.com/media/catalog/product/z/t/zt4214l_ego_42-inch_z6-mower_extreme-right_25-0529_main_1000.png",
  },

  // ── JOHN DEERE (Zero-Turn) ─────────────────────────────────────────────
  {
    brand: "JOHN DEERE", badge: "🟡 Classic Zero-Turn", badgeType: "popular",
    name: "Z335E 42\" EZtrak Zero-Turn Mower",
    emoji: "🏎️", rating: 4.5, reviewCount: 2147,
    price: "$3,499", originalPrice: "$3,799", savings: "Save $300",
    tags: ["Zero-Turn", "Gas", "42-inch Deck", "20 HP", "Dual Hydro"],
    categories: ["zero-turn", "riding"],
    description: "20 HP Briggs & Stratton engine with dual EZT hydrostatic transmissions for precise zero-turn control. 6.5 MPH top speed with 42-inch Accel Deep deck. High-back seat with armrests and 15 cutting heights from 1 to 4 inches.",
    image: "https://salesmanual.deere.com/customer/sales/salesmanual/images/NA/lawn_equipment/features_attachment/s100/r4k082332_s130_front_left_studio_large_e26d9fa3e8b2d17b333decad1f18e8211c95f97a.jpg",
  },

  // ── HUSQVARNA (Zero-Turn & Robotic) ────────────────────────────────────
  {
    brand: "HUSQVARNA", badge: "🏎️ Top Zero-Turn", badgeType: "best",
    name: "Z254F 54\" Zero-Turn Riding Mower",
    emoji: "🏎️", rating: 4.5, reviewCount: 1876,
    price: "$3,799", originalPrice: "$4,099", savings: "Save $300",
    tags: ["Zero-Turn", "Gas", "54-inch Deck", "26 HP", "Kawasaki", "Fabricated Deck"],
    categories: ["zero-turn", "riding"],
    description: "26 HP Kawasaki V-twin engine with dual hydrostatic transmissions. 54-inch fabricated steel deck with Smart Switch start and 15 cutting positions. High-back seat with armrests; 7 MPH forward speed for fast large-yard coverage.",
    image: "https://www-static-nw.husqvarna.com/-/images/aprimo/husqvarna/zero-turn-mowers/photos/studio/p/pk/pk-382241.webp",
  },
  {
    brand: "HUSQVARNA", badge: "🤖 Wire-Free GPS Robot", badgeType: "new",
    name: "Automower 450X Robotic Mower",
    emoji: "🤖", rating: 4.7, reviewCount: 1342,
    price: "$2,999", originalPrice: "$3,299", savings: "Save $300",
    tags: ["Robotic", "GPS", "4WD", "1.25 Acres", "App Control", "Wire-Free"],
    categories: ["robot"],
    description: "GPS-guided robotic mower with 4WD for slopes up to 45%. Handles up to 1.25 acres per charge with automatic scheduling, rain sensors, and theft alarm. Pairs with the Husqvarna Automower Connect app for remote monitoring and control.",
    image: "https://www-static-nw.husqvarna.com/-/images/aprimo/husqvarna/robotic-mowers/photos/studio/h/h310/11/h310-1176.webp",
  },
  {
    brand: "HUSQVARNA", badge: "🤖 Entry Robot Mower", badgeType: "popular",
    name: "Automower 310 Mark II Robotic Mower",
    emoji: "🤖", rating: 4.5, reviewCount: 876,
    price: "$1,299", originalPrice: "$1,499", savings: "Save $200",
    tags: ["Robotic", "GPS", "0.75 Acres", "App Control", "Collision Avoidance"],
    categories: ["robot"],
    description: "GPS-assisted navigation with collision avoidance for lawns up to 0.75 acres. Quiet 58 dB operation — runs morning, noon, or night without disturbing neighbors. Includes a weather timer that automatically adjusts schedules based on lawn growth.",
    image: "https://www-static-nw.husqvarna.com/-/images/aprimo/husqvarna/robotic-mowers/photos/studio/h/h310/11/h310-1176.webp",
  },

  // ── GREENWORKS (Riding) ────────────────────────────────────────────────
  {
    brand: "GREENWORKS", badge: "⚡ Electric Zero-Turn", badgeType: "new",
    name: "CrossoverZ 42\" 80V Zero-Turn Rider",
    emoji: "🏎️", rating: 4.3, reviewCount: 712,
    price: "$2,799", originalPrice: "$3,099", savings: "Save $300",
    tags: ["Zero-Turn", "Electric", "42-inch Deck", "80V", "Battery"],
    categories: ["zero-turn", "electric", "riding"],
    description: "80V lithium-ion zero-turn rider with dual brushless motors for responsive lap-bar control. Covers up to 2 acres per charge with included batteries. LED headlights, 15 cutting heights from 1.5 to 4 inches, and a 4-year tool warranty.",
    image: "https://www.greenworkstools.com/cdn/shop/files/imageService_4.webp?v=1684874384",
  },
  {
    brand: "GREENWORKS", badge: "⚡ Electric Lawn Tractor", badgeType: "new",
    name: "CrossoverT 42\" 80V Riding Lawn Tractor",
    emoji: "🚜", rating: 4.2, reviewCount: 534,
    price: "$2,499", originalPrice: "$2,799", savings: "Save $300",
    tags: ["Riding", "Electric", "42-inch Deck", "80V", "Lawn Tractor", "Battery"],
    categories: ["riding", "electric"],
    description: "80V battery-powered lawn tractor with automatic transmission for quiet, emission-free mowing. Covers up to 1.5 acres per charge. 7-position cutting height from 1.5 to 4 inches and a tight 18-inch turning radius.",
    image: "https://www.greenworkstools.com/cdn/shop/files/CrossoverTNew.jpg?v=1707507533",
  },

  // ── BAD BOY MOWERS ─────────────────────────────────────────────────────
  {
    brand: "BAD BOY", badge: "💪 Best Bang for Buck ZTR", badgeType: "sale",
    name: "ZT Elite 48\" Zero-Turn Mower",
    emoji: "🏎️", rating: 4.4, reviewCount: 1532,
    price: "$3,999", originalPrice: "$4,399", savings: "Save $400",
    tags: ["Zero-Turn", "Gas", "48-inch Deck", "22 HP", "Kawasaki", "Residential"],
    categories: ["zero-turn", "riding"],
    description: "22 HP Kawasaki FR691 engine paired with dual Hydro-Gear EZT transmissions. Heavy-duty welded steel frame and 48-inch fabricated deck with 9 cutting heights. Comfortable high-back seat with armrests and 7 MPH top speed.",
    image: "https://images.squarespace-cdn.com/content/v1/5c9bca34fd67936b240c2592/1616429312363-KOWQXYB997SLEYKQ700J/ZTElite_2021.png",
  },
  {
    brand: "BAD BOY", badge: "🔥 Wide Deck Power", badgeType: "popular",
    name: "ZT Elite 60\" Zero-Turn Mower",
    emoji: "🏎️", rating: 4.4, reviewCount: 876,
    price: "$4,499", originalPrice: "$4,899", savings: "Save $400",
    tags: ["Zero-Turn", "Gas", "60-inch Deck", "24 HP", "Kawasaki", "Large Yard"],
    categories: ["zero-turn", "riding"],
    description: "24 HP Kawasaki engine with a wide 60-inch fabricated cutting deck — ideal for 2+ acre properties. Dual Hydro-Gear EZT transmissions with lap-bar control. 9 cutting height positions and a padded high-back seat with full armrests.",
    image: "https://images.squarespace-cdn.com/content/v1/5c9bca34fd67936b240c2592/1616429312363-KOWQXYB997SLEYKQ700J/ZTElite_2021.png",
  },

  // ── ARIENS ─────────────────────────────────────────────────────────────
  {
    brand: "ARIENS", badge: "🏆 Premium Residential ZTR", badgeType: "best",
    name: "IKON XD 52\" Zero-Turn Mower",
    emoji: "🏎️", rating: 4.6, reviewCount: 1243,
    price: "$3,799", originalPrice: "$4,199", savings: "Save $400",
    tags: ["Zero-Turn", "Gas", "52-inch Deck", "23 HP", "Kawasaki", "Premium"],
    categories: ["zero-turn", "riding"],
    description: "23 HP Kawasaki FR691 engine with dual Hydro-Gear ZT-2800 transmissions for smooth, powerful zero-turn performance. 52-inch fabricated steel deck with 13 cutting positions from 1.5 to 4.5 inches. Heavy-duty frame and premium padded seat.",
    image: "https://www.ariens.com/getattachment/30d25af4-15ba-48c9-b11d-045eeb636fe8/918005_IKON_52_FL34.png",
  },

  // ── SCAG ───────────────────────────────────────────────────────────────
  {
    brand: "SCAG", badge: "🛠️ Pro-Grade Residential", badgeType: "best",
    name: "Freedom Z 48\" Zero-Turn Mower",
    emoji: "⚙️", rating: 4.7, reviewCount: 892,
    price: "$5,999", originalPrice: "$6,499", savings: "Save $500",
    tags: ["Zero-Turn", "Gas", "48-inch Deck", "22 HP", "Kawasaki", "Commercial-Grade"],
    categories: ["zero-turn", "riding"],
    description: "22 HP Kawasaki engine on a commercial-duty welded steel frame. Scag's exclusive 48-inch Advantage deck with ultra-high lift blades for a professional cut. Dual Hydro-Gear ZT-2800 transmissions; designed to outlast consumer-grade zero-turns.",
    image: "https://www.scag.com/wp-content/uploads/2020/01/freedom-2021-studio.png",
  },

  // ── FERRIS ─────────────────────────────────────────────────────────────
  {
    brand: "FERRIS", badge: "😌 Smoothest Ride ZTR", badgeType: "best",
    name: "IS 600Z 48\" Full Suspension Zero-Turn",
    emoji: "🏎️", rating: 4.8, reviewCount: 743,
    price: "$6,999", originalPrice: "$7,499", savings: "Save $500",
    tags: ["Zero-Turn", "Gas", "48-inch Deck", "22 HP", "Kawasaki", "Full Suspension"],
    categories: ["zero-turn", "riding"],
    description: "The industry's first independently suspended zero-turn mower. 22 HP Kawasaki engine with a patented suspension system that isolates the operator from bumps for a smooth, fatigue-free ride. 48-inch fabricated steel deck with 9 height settings.",
    image: "https://www.ferrismowers.com/content/dam/ferris/products/zero-turn/is600z/is600z-main.jpg",
  },

  // ── MAMMOTION ──────────────────────────────────────────────────────────
  {
    brand: "MAMMOTION", badge: "🤖 Best Wire-Free Robot", badgeType: "best",
    name: "LUBA 2 AWD 5000 Robotic Mower",
    emoji: "🤖", rating: 4.7, reviewCount: 934,
    price: "$2,499", originalPrice: "$2,799", savings: "Save $300",
    tags: ["Robotic", "Wire-Free", "RTK GPS", "4WD", "1.25 Acres", "75-Degree Slope"],
    categories: ["robot"],
    description: "Wire-free installation with RTK GPS positioning accurate to ±1 inch. All-wheel drive conquers slopes up to 75 degrees and handles complex yard layouts with multiple zones. AI obstacle detection, app control, and voice assistant compatibility. Covers 1.25 acres per charge.",
    image: "https://us.mammotion.com/cdn/shop/files/LUBA-X-H.webp?v=1741313360&width=1024",
  },
  {
    brand: "MAMMOTION", badge: "🤖 Compact AWD Robot", badgeType: "new",
    name: "LUBA Mini 2 AWD Robotic Mower",
    emoji: "🤖", rating: 4.6, reviewCount: 412,
    price: "$1,799", originalPrice: "$1,999", savings: "Save $200",
    tags: ["Robotic", "Wire-Free", "RTK GPS", "4WD", "0.5 Acres", "CES 2026"],
    categories: ["robot"],
    description: "Compact wire-free robotic mower with all-wheel drive and RTK GPS — no boundary wires needed. Handles slopes up to 45 degrees and manages up to 0.5 acres. Full app control with multi-zone scheduling; debuted at CES 2026.",
    image: "https://us.mammotion.com/cdn/shop/files/LUBA-X-H.webp?v=1741313360&width=1024",
  },
  {
    brand: "MAMMOTION", badge: "💰 Budget Wire-Free Robot", badgeType: "sale",
    name: "YUKA Robotic Mower",
    emoji: "🤖", rating: 4.4, reviewCount: 287,
    price: "$999", originalPrice: "$1,199", savings: "Save $200",
    tags: ["Robotic", "Wire-Free", "GPS", "0.5 Acres", "App Control"],
    categories: ["robot"],
    description: "Entry-level wire-free robotic mower with GPS navigation — no boundary wires needed. Covers up to 0.5 acres with automatic scheduling and rain sensor. Quiet operation, app-controlled, and ideal for flat to mildly sloped lawns.",
    image: "https://us.mammotion.com/cdn/shop/files/LUBA-X-H.webp?v=1741313360&width=1024",
  },

  // ── SEGWAY NAVIMOW ─────────────────────────────────────────────────────
  {
    brand: "SEGWAY", badge: "🤖 Vision + GPS Robot", badgeType: "new",
    name: "Navimow i108E Robotic Mower",
    emoji: "🤖", rating: 4.5, reviewCount: 621,
    price: "$999", originalPrice: "$1,199", savings: "Save $200",
    tags: ["Robotic", "Wire-Free", "RTK GPS", "0.2 Acres", "App Control", "EFLS"],
    categories: ["robot"],
    description: "Wire-free robotic mower with EFLS (Exact Fusion Locating System) combining dual RTK GPS and cameras for precise navigation. Covers 0.2 acres; handles slopes up to 35%. Quiet 60 dB operation with rain sensor and app-based zone management.",
    image: "https://navimow.segway.com/cdn/shop/files/110.png?v=1770228111&width=1200",
  },
  {
    brand: "SEGWAY", badge: "🤖 AWD Robot — CES 2026", badgeType: "new",
    name: "Navimow i2 AWD Robotic Mower",
    emoji: "🤖", rating: 4.6, reviewCount: 189,
    price: "$1,799", originalPrice: "$1,999", savings: "Save $200",
    tags: ["Robotic", "Wire-Free", "4WD", "RTK GPS", "0.5 Acres", "CES 2026"],
    categories: ["robot"],
    description: "All-wheel drive robotic mower debuted at CES 2026 with a three-motor drive system and 9.8-inch off-road wheels. Tackles slopes up to 45% with EFLS navigation — no boundary wires. Handles 0.5 acres and multiple mowing zones via app.",
    image: "https://navimow.segway.com/cdn/shop/files/110.png?v=1770228111&width=1200",
  },

  // ── STIHL ──────────────────────────────────────────────────────────────
  {
    brand: "STIHL", badge: "🔋 Pro Battery Mower", badgeType: "popular",
    name: "RMA 460 V 19\" Battery Self-Propelled Mower",
    emoji: "🔋", rating: 4.5, reviewCount: 874,
    price: "$449", originalPrice: "$499", savings: "Save $50",
    tags: ["Electric", "Cordless", "Self-Propelled", "19-inch Deck", "AP Battery", "Variable Speed"],
    categories: ["electric"],
    description: "Powered by STIHL's AP battery system with variable-speed self-propulsion. Brushless motor delivers consistent power through the full charge cycle. 7 cutting heights from 0.98 to 3.15 inches; foldable handles for compact storage. Compatible with all STIHL AP batteries.",
    image: "https://www.stihlusa.com/content/dam/stihl/en_US/products/walk-behind-mowers/rma-460-v/rma460v-main.jpg",
  },
  {
    brand: "STIHL", badge: "⛽ Dependable Gas Mower", badgeType: "popular",
    name: "RM 655 VS 22\" Variable-Speed Self-Propelled",
    emoji: "⚙️", rating: 4.4, reviewCount: 632,
    price: "$499", originalPrice: "$549", savings: "Save $50",
    tags: ["Self-Propelled", "Gas", "22-inch Deck", "163cc", "Variable Speed", "3-in-1"],
    categories: ["gas"],
    description: "163cc engine with variable-speed rear-wheel drive for precise control on slopes. 22-inch steel deck with 3-in-1 mulching, bagging, and side discharge. 7 cutting heights from 1.2 to 3.7 inches and a soft-grip bail for comfortable operation.",
    image: "https://www.stihlusa.com/content/dam/stihl/en_US/products/walk-behind-mowers/rm-655-vs/rm655vs-main.jpg",
  },

  // ── DEWALT ─────────────────────────────────────────────────────────────
  {
    brand: "DEWALT", badge: "🔋 60V Powerhouse", badgeType: "popular",
    name: "DCMW290X2 21\" FLEXVOLT Self-Propelled Mower",
    emoji: "🔋", rating: 4.4, reviewCount: 1123,
    price: "$599", originalPrice: "$649", savings: "Save $50",
    tags: ["Electric", "Cordless", "Self-Propelled", "21-inch Deck", "60V FLEXVOLT", "Brushless"],
    categories: ["electric"],
    description: "60V MAX FLEXVOLT brushless motor with variable-speed rear-wheel drive. Includes two 3.0Ah FLEXVOLT batteries providing up to 70 minutes of combined runtime. 3-in-1 capability with 6 cutting heights from 1.5 to 3.75 inches.",
    image: "https://images.thdstatic.com/productImages/8b74d866-1b62-4a83-b8cc-e4e432f39f9d/svn/dewalt-self-propelled-lawn-mowers-dcmw290x2-64_300.jpg",
  },

  // ── MAKITA ─────────────────────────────────────────────────────────────
  {
    brand: "MAKITA", badge: "🔋 18V×2 LXT Beast", badgeType: "popular",
    name: "XML06PT1 21\" LXT Brushless Self-Propelled",
    emoji: "🔋", rating: 4.5, reviewCount: 893,
    price: "$599", originalPrice: "$649", savings: "Save $50",
    tags: ["Electric", "Cordless", "Self-Propelled", "21-inch Deck", "18V x2 LXT", "Brushless"],
    categories: ["electric"],
    description: "Dual 18V LXT batteries (36V total) power a brushless motor delivering 3,600 RPM blade speed. Compatible with the entire Makita 18V LXT ecosystem. 3-in-1 mulching, bagging, and side discharge with 7 cutting heights from 1.25 to 4 inches; up to 40-minute runtime.",
    image: "https://www.makitatools.com/content/dam/makita/en_US/products/Outdoor-Power-Equipment/Lawn-Mowers/xml06pt1/xml06pt1-main.jpg",
  },

  // ── FISKARS ────────────────────────────────────────────────────────────
  {
    brand: "FISKARS", badge: "🌿 Best Eco Mower", badgeType: "best",
    name: "StaySharp Max 18\" Reel Push Mower",
    emoji: "🌿", rating: 4.3, reviewCount: 2841,
    price: "$169", originalPrice: "$199", savings: "Save $30",
    tags: ["Reel Mower", "Manual", "Push Mower", "Eco-Friendly", "No Fuel", "18-inch"],
    categories: ["push"],
    description: "5-blade reel with StaySharp cutting system stays sharp 2× longer than conventional reel mowers — no sharpening required. No gas, no batteries, no emissions. InertiaDrive reel generates twice the cutting force of standard reel mowers. Adjustable 1–4 inch cutting height.",
    image: "https://www.fiskars.com/content/dam/fiskars/products/garden/reel-mowers/6208/6208-main.jpg",
  },
];

const NEW_BRANDS = [
  "CRAFTSMAN", "TROY-BILT", "BAD BOY", "ARIENS", "SCAG",
  "FERRIS", "MAMMOTION", "SEGWAY", "STIHL", "DEWALT", "MAKITA", "FISKARS",
];

async function main() {
  console.log("Connecting to database...");

  // Insert only products that don't already exist (match by name)
  const existing = await prisma.product.findMany({ select: { name: true } });
  const existingNames = new Set(existing.map((p) => p.name));

  const toInsert = NEW_PRODUCTS.filter((p) => !existingNames.has(p.name));
  console.log(`Found ${existing.length} existing products. Inserting ${toInsert.length} new products...`);

  if (toInsert.length > 0) {
    await prisma.product.createMany({
      data: toInsert.map((p) => ({
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
    console.log(`✅ Inserted ${toInsert.length} new products.`);
  } else {
    console.log("No new products to insert.");
  }

  // Insert new brands that don't already exist
  const existingBrands = await prisma.brand.findMany({ select: { name: true } });
  const existingBrandNames = new Set(existingBrands.map((b) => b.name));
  const brandsToInsert = NEW_BRANDS.filter((b) => !existingBrandNames.has(b));

  if (brandsToInsert.length > 0) {
    await prisma.brand.createMany({ data: brandsToInsert.map((name) => ({ name })) });
    console.log(`✅ Inserted ${brandsToInsert.length} new brands: ${brandsToInsert.join(", ")}`);
  } else {
    console.log("No new brands to insert.");
  }

  const total = await prisma.product.count();
  console.log(`\nDatabase now has ${total} total products.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
