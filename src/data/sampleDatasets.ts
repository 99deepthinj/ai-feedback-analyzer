export interface SampleDataset {
  label: string
  emoji: string
  description: string
  reviews: string[]
}

const genericReviews = [
  "The onboarding flow is incredibly confusing. I spent 30 minutes trying to connect my first integration. Needs a guided wizard.",
  "Love the analytics dashboard! The charts are stunning and actionable. Best tool I've used. Please add more export options though.",
  "Performance has been really inconsistent. Pages take 10 seconds to load sometimes, which is unacceptable for a paid product.",
  "Customer support resolved my issue in 2 hours and even followed up the next day. Excellent service!",
  "Mobile app is essentially unusable. Critical features hidden behind menus, layout breaks on smaller screens.",
  "The API is well-documented and a joy to work with. Webhooks are reliable. Would love GraphQL support.",
  "Pricing increased by 40% with no notice. Seriously considering switching to a competitor. The value just isn't there anymore.",
  "Love the integrations with Salesforce and HubSpot. Saved my team hours every week. Outstanding product.",
  "Search is terrible — it returns irrelevant results and doesn't support boolean queries. Fix this please.",
  "The bulk action feature I requested 6 months ago is still missing. I have to update records one by one.",
  "AI features are impressive and surprisingly accurate for our use case. The auto-categorisation is fantastic.",
  "Export options are too limited. I need custom CSV templates for my reporting workflow.",
  "The new UI redesign is beautiful and intuitive. Navigation feels fast and logical now.",
  "Frequent bugs and crashes during peak hours. Lost work twice this week. Very frustrating experience.",
  "Best analytics platform we've used. The insights have directly improved our conversion rate by 18%.",
]

const zeptoReviews = [
  "Zepto delivered my groceries in just 8 minutes! I was genuinely shocked. The freshness of vegetables is amazing.",
  "The app interface is clean and intuitive. Finding products is easy and the checkout flow is seamless.",
  "Love the 10-minute delivery promise. It actually works most of the time and has saved me countless trips.",
  "Fresh produce quality is consistently excellent. Fruits arrive perfectly ripe and well-packaged.",
  "The Zeptonow subscription is great value. Free delivery and exclusive discounts make it worth every rupee.",
  "Customer support resolved a missing item issue in under 5 minutes via chat. Excellent service!",
  "Zepto Plus membership perks are fantastic — free deliveries, early access to deals, and priority support.",
  "App navigation is smooth and fast. The search is accurate and product photos are high quality.",
  "My order arrived late by 45 minutes on a Sunday evening. The promised 10 minutes became 55 minutes.",
  "Several items were out of stock but the app still showed them as available. Very misleading inventory.",
  "Pricing for some items is 20-30% higher than my local kirana store. The convenience premium is too steep.",
  "Delivery partner was rude and refused to bring bags upstairs. Poor last-mile experience.",
  "The onboarding process for new users is confusing. I couldn't figure out how to add my address at first.",
  "Packaging is excessive for small orders. Too much plastic for just a few items — bad for environment.",
  "Substitutions were made without asking me. I ordered one brand and received a completely different one.",
  "The app crashes frequently on older Android phones. Performance is terrible on budget devices.",
  "Return process is a nightmare. Took 3 days and 4 support calls to get a refund for a damaged product.",
  "Zepto's dark store model means product variety is limited compared to a full supermarket. Disappointing selection.",
  "Slot unavailability during peak hours is frustrating. The app shows no orders can be placed for 2 hours.",
  "Search results are irrelevant sometimes. Searching for 'organic milk' shows junk food at the top.",
]

const swiggyReviews = [
  "Swiggy's restaurant variety is unmatched. I can find cuisine from over 500 restaurants in my area. Incredible selection!",
  "Instamart is a game-changer. Groceries delivered in 15 minutes while I'm still cooking. Absolutely love it.",
  "The live tracking feature is excellent. Watching my delivery partner on the map is reassuring and well-designed.",
  "Swiggy One membership is fantastic value. Free deliveries, discounts, and priority support make it worthwhile.",
  "Customer support via chat resolved my wrong order in 3 minutes. Best support experience I've had from any food app.",
  "The app's UI is polished and intuitive. Searching, filtering, and checking out feels effortless.",
  "Food arrives well-packaged and at the right temperature. Tamper-proof seals give me confidence in hygiene.",
  "The recommendation algorithm is surprisingly good. It surfaces restaurants I love without me searching.",
  "My food arrived cold and the container was leaking. The restaurant quality control is clearly inconsistent.",
  "Order was cancelled 30 minutes after placing it because the restaurant was busy. Very poor communication.",
  "Surge pricing during rain is outrageous. Delivery charges tripled in one hour. This feels exploitative.",
  "Support said they'd refund within 3 days. It's been 2 weeks and I'm still following up. Terrible resolution process.",
  "The onboarding for new accounts is clunky. Address addition flow has too many steps and keeps failing.",
  "Performance is slow during peak dinner hours. The app lags and sometimes shows outdated ETAs.",
  "Delivery partners have been seen sharing login credentials and delivering wrong orders frequently.",
  "Cancellation policy is unfair. I cancelled within 1 minute of ordering and was still charged full price.",
  "Swiggy Genie is amazing for sending packages across the city. Very convenient and reliable.",
  "Menu items shown in the app often differ from what's actually available. Out-of-stock items waste my time.",
  "The notification system is too aggressive. I get 15 promotional push notifications per day. Please add controls.",
  "Bulk ordering for office lunches is still not supported. We have to place individual orders for 20 people.",
]

const zomatoReviews = [
  "Zomato Gold membership is exceptional value. BOGO offers at premium restaurants save me ₹2000+ every month.",
  "Restaurant discovery feature is superb. The curated collections help me find hidden gems in my neighbourhood.",
  "The review system is detailed and trustworthy. User photos and ratings help me make confident food decisions.",
  "Zomato Pro Plus benefits are outstanding. Priority delivery, exclusive restaurant deals, and zero surge charges.",
  "Live order tracking with real-time restaurant updates is transparent and reassuring. Excellent feature.",
  "The food safety rating badges for restaurants are a brilliant addition. More transparency is always good.",
  "Zomato's customer support chat resolved a missing item instantly and credited my account on the spot.",
  "The new search filters by cuisine, dietary preference, and rating make finding food incredibly fast.",
  "Excessive advertisements in the app are very annoying. I count 6-8 ads before reaching my first restaurant.",
  "Pro subscription auto-renewed without clear notification. I was charged ₹1200 I hadn't planned for.",
  "Customer support response times have become unacceptable. I waited 4 hours for a resolution on a simple issue.",
  "Cancellation before restaurant acceptance still attracts a charge. The policy needs to be more user-friendly.",
  "Food arrived 55 minutes late on a rainy day with no proactive update from the app. Communication is poor.",
  "Wrong item delivered twice in a row from the same restaurant. Zomato takes no accountability for this.",
  "The onboarding experience for first-time users lacks guidance. I couldn't figure out the Gold benefits easily.",
  "Search performance is inconsistent. Sometimes dishes from irrelevant restaurants appear at the top.",
  "Pricing on Zomato is significantly higher than eating at the restaurant directly. Markup is too high.",
  "Delivery partner asked me to cancel and reorder through a phone call. This circumvents the app completely.",
  "The bulk order feature for corporate accounts is missing. Office orders for large teams are very difficult.",
  "Restaurant ratings seem inflated. Highly-rated places have consistently disappointed in terms of food quality.",
]

const blinkitReviews = [
  "Blinkit delivered in 9 minutes flat! I ordered mangoes and they arrived fresh before my water boiled. Incredible speed.",
  "The app is beautifully designed. Product search is fast, accurate, and the filters work exactly as expected.",
  "Blinkit's dark stores are stocked with a surprising variety. Found niche brands I couldn't find elsewhere.",
  "10-minute promise is consistently met in my area. This has fundamentally changed how I shop for groceries.",
  "The interface is clean and the checkout process takes under 30 seconds. Best-in-class app experience.",
  "Freshness of dairy and produce is consistently excellent. Clearly they maintain cold chain properly.",
  "Blinkit Pass subscription gives excellent value — free delivery on all orders and exclusive member prices.",
  "The product discovery feature surfaces great deals. I regularly find items 15-20% cheaper than retail.",
  "My delivery partner left the order at the gate without ringing the bell. The package sat in the rain.",
  "Slot unavailability is a recurring problem during evenings. Shows no delivery possible for 3+ hours.",
  "Product catalog is limited for specialty and organic items. Very few options for health-conscious buyers.",
  "Packaging for fragile items like eggs is inadequate. Received 4 broken eggs out of a dozen twice.",
  "The mobile app crashes on low-memory devices. I have to restart it every 10 minutes on my older phone.",
  "Substitutions made without consent are frustrating. I ordered a specific brand and received a different one.",
  "Return process requires too many steps. Had to take 3 photos and fill a form for a simple wrong item.",
  "Pricing for imported products is very high. The markup on foreign snacks and beverages is excessive.",
  "Support chat is mostly automated and unhelpful for complex issues. Getting a human agent takes 20 minutes.",
  "Search returns inconsistent results. Searching for 'whole wheat bread' shows white bread at the top.",
  "The loyalty points program is confusing and the points expire too quickly before I can redeem them.",
  "No scheduled delivery option available. Everything is on-demand only, which doesn't suit planned shopping.",
]

export const SAMPLE_DATASETS: Record<string, SampleDataset> = {
  generic: {
    label: 'Generic SaaS',
    emoji: '🛠️',
    description: '15 reviews for a generic B2B SaaS product',
    reviews: genericReviews,
  },
  zepto: {
    label: 'Zepto',
    emoji: '⚡',
    description: '20 reviews for Zepto (10-min delivery)',
    reviews: zeptoReviews,
  },
  swiggy: {
    label: 'Swiggy',
    emoji: '🛵',
    description: '20 reviews for Swiggy (food delivery)',
    reviews: swiggyReviews,
  },
  zomato: {
    label: 'Zomato',
    emoji: '🍽️',
    description: '20 reviews for Zomato (restaurant discovery)',
    reviews: zomatoReviews,
  },
  blinkit: {
    label: 'Blinkit',
    emoji: '🟡',
    description: '20 reviews for Blinkit (quick commerce)',
    reviews: blinkitReviews,
  },
}
