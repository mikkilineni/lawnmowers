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
    emoji: "📏",
    tag: "Buying Guide",
    slug: "how-to-choose-the-right-mower",
    title: "How to Choose the Right Mower for Your Lawn Size",
    readTime: "8 min read",
    updated: "Updated Jan 2025",
    content: `Choosing the right lawn mower starts with one question: how big is your lawn? Get this right and everything else falls into place.

For lawns under a quarter acre, a push mower or a lightweight cordless electric mower is all you need. You won't be mowing long enough for fatigue to set in, and you don't need a self-propelled drive system. Budget picks from EGO, Ryobi, or Greenworks will handle this effortlessly.

Between a quarter and half an acre, a self-propelled walk-behind mower is the sweet spot. The drive system does the heavy lifting, especially on slopes. Gas mowers (Honda, Toro, Husqvarna) offer proven reliability, while 56V or 80V battery mowers now match them for runtime and power. Look for a deck width of 21–22 inches.

Half an acre to an acre and a half is where riding mowers start to make sense. A lawn tractor with a 42–46 inch deck can cover this range in 45–60 minutes. Brands like John Deere, Cub Cadet, and Craftsman all offer solid options in the $2,000–$3,000 range. If you have obstacles (trees, garden beds), a zero-turn mower will save you time on each pass.

Over an acre and a half, you'll want a zero-turn rider. The time savings are real — a zero-turn can mow nearly twice as fast as a lawn tractor of the same deck width thanks to its ability to cut tight turns without leaving uncut corners. Budget $3,000–$7,000 depending on engine power and deck size.

One more thing: consider your terrain. Flat lawns are forgiving. Slopes above 15 degrees demand rear-wheel drive or all-wheel drive. Steep properties (above 20 degrees) rule out zero-turns entirely — a self-propelled walk-behind with rear-wheel drive is safer and more practical.

The mower that fits your lawn size AND terrain will always outperform a more expensive machine that doesn't match your specific conditions.`,
  },
  {
    emoji: "⚡",
    tag: "Comparison",
    slug: "electric-vs-gas-mowers",
    title: "Electric vs Gas Mowers: Which Is Better in 2025?",
    readTime: "6 min read",
    updated: "Updated Feb 2025",
    content: `The gas vs. electric debate has been decided — at least for most homeowners. Here's the honest breakdown.

Gas mowers dominated the market for decades because nothing else had enough power or runtime to compete. That's no longer true. Modern 56V and 80V battery mowers deliver the same cutting performance as a 160–190cc gas engine. The EGO POWER+ LM2135SP and Greenworks 80V routinely out-perform entry-level gas mowers in head-to-head tests.

The case for electric in 2025: push-button start every time (no priming, no choke, no pull cord), no oil changes, no carburetor cleaning, quieter operation, and zero emissions. Battery platforms now span an entire ecosystem — buy EGO, for example, and your mower battery works in your blower, trimmer, and chainsaw. Runtime on a single charge typically covers a quarter to half an acre, and most top-tier models include a second battery.

The case for gas: if you mow over an acre on a single session, or if you're in a commercial/semi-commercial setting, gas still wins on total runtime. You can refuel in two minutes; recharging takes 30–90 minutes. Gas engines also tend to have longer service lives when properly maintained.

Where electric still has gaps: riding mowers. Electric zero-turns and tractors have arrived (EGO Z6, Greenworks CrossoverZ), but they cost significantly more than equivalent gas models and runtime per charge is a real limitation on larger properties.

Our recommendation: if your lawn is under three-quarters of an acre, go electric. You'll never look back. If you're mowing over an acre or have a riding mower, gas remains the pragmatic choice — though electric riding options are improving fast.`,
  },
  {
    emoji: "🤖",
    tag: "Review",
    slug: "best-robot-mowers-2025",
    title: "Best Robot Mowers of 2025: Tested and Ranked",
    readTime: "12 min read",
    updated: "Updated Feb 2025",
    content: `Robotic mowers have crossed the line from novelty to genuinely practical lawn tool. The 2025 generation — particularly the wire-free GPS models — have removed the biggest barrier to adoption: the tedious boundary wire installation.

The technology divide in robot mowers is between perimeter-wire systems and wire-free RTK GPS systems. Wire-based models (older Husqvarna Automower, Worx Landroid) require you to bury a guide wire around your lawn. Wire-free models (Mammotion LUBA 2, Segway Navimow, Husqvarna 450X EPOS) use centimeter-accurate GPS to navigate without any physical boundary. Setup takes 30 minutes instead of a full weekend.

Best overall: Mammotion LUBA 2 AWD 5000. All-wheel drive for slopes up to 75 degrees, RTK GPS, multi-zone scheduling, and AI obstacle detection. It handles complex yards that would defeat less capable robots. At $2,499 it's not cheap, but it covers 1.25 acres and replaces real labor.

Best value: Segway Navimow i108E at $999. Wire-free, handles 0.2 acres, and Segway's EFLS positioning system is genuinely accurate. Ideal for a standard suburban lawn with minimal obstacles.

Best for large properties: Husqvarna Automower 450X at $2,999. GPS-guided with 4WD, covering 1.25 acres. Husqvarna has the deepest dealer network and the most mature software — the app and scheduling system are excellent.

Budget wire-based option: Husqvarna Automower 310 Mark II at $1,299. Still requires perimeter wire but handles 0.75 acres reliably with 58 dB quiet operation.

What to know before buying: robot mowers cut a little every day rather than once a week. The clippings are microscopic and act as a natural fertilizer (no bag to empty). They won't give you the sharp striped look of a freshly mowed lawn — if appearance is your priority, a robot is a supplement, not a replacement.`,
  },
  {
    emoji: "🔧",
    tag: "Maintenance",
    slug: "lawnmower-maintenance-checklist",
    title: "Lawnmower Maintenance Checklist: Spring Tune-Up Guide",
    readTime: "5 min read",
    updated: "Updated Mar 2025",
    content: `Spring maintenance takes 30–60 minutes and adds years to your mower's life. Here's everything to do before the first cut of the season.

Blade: Inspect for nicks, cracks, or bending. A damaged blade causes vibration that wears bearings and ruins your cut quality. Sharpen with a file or bench grinder (a 45-degree bevel on the cutting edge), or replace if heavily damaged. Balance the blade on a nail before reinstalling — an unbalanced blade causes vibration. Cost to sharpen professionally: $10–$20.

Oil (gas mowers): Change the oil every season or every 50 hours, whichever comes first. Most walk-behind mowers use SAE 30 in warm weather or 10W-30 for variable temperatures. Drain the old oil warm, replace the drain plug, refill to the dipstick mark. Don't overfill. Toro's EXI engine is a notable exception — it's sealed and never needs an oil change.

Spark plug: Replace every season. A worn plug causes hard starting and poor performance. Cost: $3–$8. Use the gap specification in your owner's manual (usually 0.030 inches).

Air filter: Clean foam filters with warm soapy water, let dry completely, and re-oil lightly. Replace paper filters — don't try to clean them. Cost: $5–$15.

Fuel system: Old gasoline (over 30 days) can varnish the carburetor. If you didn't add fuel stabilizer at the end of last season, drain the tank and carburetor bowl, or run fresh fuel through. Add Sta-Bil or a similar stabilizer going forward.

Deck and wheels: Scrape dried grass from under the deck (a plastic scraper works well). Check wheel height-adjustment levers for smooth operation. Lubricate axle ports with a drop of oil.

Battery mowers: No oil, no spark plug, no fuel. Check blade, clean deck, inspect battery terminals for corrosion. Store batteries at 50% charge if putting the mower away for more than a month.

Do this every spring and your mower will start on the first pull and cut cleanly for a decade.`,
  },
];

export const BRANDS = ["EGO", "HUSQVARNA", "GREENWORKS", "RYOBI"];

export const QUIZ_RESULTS: Record<string, { emoji: string; name: string; price: string }> = {
  electric: { emoji: "⚡", name: "EGO Power+ LM2135SP", price: "$549" },
  gas:      { emoji: "⛽", name: "Honda HRX217VKA",      price: "$679" },
  robot:    { emoji: "🤖", name: "Husqvarna Automower 450XH", price: "$2,499" },
  any:      { emoji: "🌿", name: "Greenworks Pro 80V",   price: "$449" },
};
