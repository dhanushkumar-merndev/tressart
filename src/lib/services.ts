export type Faq = { q: string; a: string };

export type ServiceItem = { name: string; description: string };

export type ServiceCategory = {
  slug: string;
  number: string;
  title: string;
  headline: string;
  summary: string;
  intro: string[];
  highlights: string[];
  items: ServiceItem[];
  faqs: Faq[];
  metaTitle: string;
  metaDescription: string;
  /** Seed for the generative strand artwork, so every page gets its own lock of hair. */
  artSeed: number;
};

export const services: ServiceCategory[] = [
  {
    slug: "haircuts-styling",
    number: "01",
    title: "Haircuts & styling",
    headline: "Precision cuts, shaped around you.",
    summary: "Considered cuts and finishes that suit your face, your texture and the way you live.",
    intro: [
      "Every cut at tressart starts with a conversation. We look at your hair's texture, the way it falls and how much time you want to spend on it each morning, then cut to suit.",
      "The result is shape that grows out gracefully — and a finish you can recreate at home.",
    ],
    highlights: ["Signature cuts", "Laser cuts", "Blow-dry & styling"],
    items: [
      { name: "Signature haircut", description: "Consultation, wash, precision cut and a finished blow-dry." },
      { name: "Laser cut", description: "Soft, feathered layers that build movement and lightness." },
      { name: "Fringe & trim refresh", description: "Keep a shape sharp between full cuts." },
      { name: "Blow-dry & styling", description: "Smooth, bouncy or textured — a finish built to last the day." },
      { name: "Ironing & tonging", description: "Sleek straight lengths or soft, polished waves." },
      { name: "Occasion styling & updos", description: "Braids, buns and pinned styles for events and celebrations." },
    ],
    faqs: [
      {
        q: "How long does a haircut appointment take?",
        a: "Allow 45–60 minutes for a signature cut with consultation, wash and blow-dry. Styling-only visits are usually shorter.",
      },
      {
        q: "What is a laser cut?",
        a: "A laser cut is a layering technique that creates soft, feathered ends and movement. Your stylist will tell you whether it suits your hair's density and texture.",
      },
    ],
    metaTitle: "Haircuts & Hair Styling on Harlur Road, Bengaluru",
    metaDescription:
      "Precision haircuts, laser cuts, blow-dries and occasion styling at tressart salon, Ambalipura, Harlur Road, Bengaluru. Book a consultation with our stylists.",
    artSeed: 11,
  },
  {
    slug: "hair-colour",
    number: "02",
    title: "Hair colour",
    headline: "Colour with depth, shine and restraint.",
    summary: "L'Oréal Professionnel colour — from seamless grey coverage to hand-painted balayage.",
    intro: [
      "As a L'Oréal Professionnel flagship salon, we colour with professional formulations chosen for your hair's condition and the tone you're after.",
      "We favour colour that looks natural in daylight and grows out softly, and we'll always tell you honestly what your hair can take.",
    ],
    highlights: ["Global colour", "Balayage", "Grey coverage"],
    items: [
      { name: "Global colour", description: "One rich, even shade from root to tip." },
      { name: "Root touch-up", description: "Refresh regrowth and keep colour seamless." },
      { name: "Highlights & lowlights", description: "Dimension that brightens and frames the face." },
      { name: "Balayage & ombré", description: "Hand-painted, sun-softened colour with a gentle grow-out." },
      { name: "Grey coverage", description: "Natural-looking coverage that respects your base tone." },
      { name: "Toning & gloss", description: "Neutralise brassiness and restore shine between colour services." },
    ],
    faqs: [
      {
        q: "Do I need a patch test before colouring?",
        a: "If you're new to us or trying a new colour service, we recommend a patch test 48 hours before your appointment. Call the salon and we'll arrange it.",
      },
      {
        q: "Which colour brand do you use?",
        a: "We're a L'Oréal Professionnel flagship salon, so our colour services use L'Oréal Professionnel products.",
      },
    ],
    metaTitle: "Hair Colour, Balayage & Highlights in Bengaluru",
    metaDescription:
      "L'Oréal Professionnel hair colour at tressart salon, Harlur Road — global colour, root touch-ups, highlights, balayage and grey coverage by expert colourists.",
    artSeed: 23,
  },
  {
    slug: "hair-treatments",
    number: "03",
    title: "Hair spa & treatments",
    headline: "Care that shows in every strand.",
    summary: "Hair spa rituals, keratin, smoothening and scalp care for healthier, calmer hair.",
    intro: [
      "Humidity, hard water and heat styling all take their toll. Our treatments restore softness, strength and shine, starting with a proper look at your hair and scalp.",
      "We'll recommend what your hair actually needs — nothing more.",
    ],
    highlights: ["Hair spa", "Keratin", "Smoothening"],
    items: [
      {
        name: "Hair spa rituals",
        description: "Deep conditioning and massage to nourish lengths and relax the scalp.",
      },
      { name: "Keratin treatment", description: "Tame frizz and cut blow-dry time while keeping natural movement." },
      { name: "Smoothening", description: "Softer, more manageable hair with a smooth, polished fall." },
      { name: "Rebonding", description: "Long-lasting straightness for hair that's easy to style." },
      { name: "Scalp treatments", description: "Targeted care for dryness, dandruff and a balanced scalp." },
      { name: "Hair extensions", description: "Added length or volume, colour-matched and blended by hand." },
    ],
    faqs: [
      {
        q: "What's the difference between keratin and smoothening?",
        a: "Keratin treatments reduce frizz while keeping natural body and wave. Smoothening gives a straighter, sleeker result. Your stylist will recommend one after looking at your hair.",
      },
      {
        q: "How often should I book a hair spa?",
        a: "Most guests benefit from a hair spa every three to four weeks, more often if you colour or heat-style regularly.",
      },
    ],
    metaTitle: "Hair Spa, Keratin & Smoothening Treatments in Bengaluru",
    metaDescription:
      "Hair spa, keratin, smoothening, rebonding, scalp treatments and hair extensions at tressart salon, Ambalipura, Harlur Road, Bengaluru.",
    artSeed: 37,
  },
  {
    slug: "skin-facials",
    number: "04",
    title: "Skin & facials",
    headline: "Rituals for calm, radiant skin.",
    summary: "Facials, clean-ups and brightening rituals with professional skincare.",
    intro: [
      "Our skin rituals combine professional products with unhurried, careful technique. We start by understanding your skin, then choose a facial that suits it — whether that's hydration, brightening or a deep clean.",
      "Expect a quiet room, clean hands and skin that feels genuinely rested.",
    ],
    highlights: ["Signature facials", "De-tan", "Waxing & threading"],
    items: [
      { name: "Signature facials", description: "Cleanse, exfoliate, massage and mask, tailored to your skin." },
      { name: "Clean-ups", description: "A quick refresh to decongest and brighten." },
      { name: "De-tan & brightening", description: "Even out tone and restore glow after sun exposure." },
      { name: "Hydrating rituals", description: "Replenish moisture for skin that feels plump and comfortable." },
      { name: "Waxing", description: "Smooth, careful hair removal with hygienic, single-use practice." },
      { name: "Threading", description: "Precise shaping for brows and face." },
    ],
    faqs: [
      {
        q: "Which facial is right for me?",
        a: "It depends on your skin type and what you'd like to improve. Our therapist will look at your skin before recommending a facial.",
      },
      {
        q: "Can I get a facial before an event?",
        a: "Yes — ideally two to three days before, so any redness has settled and your skin looks its best on the day.",
      },
    ],
    metaTitle: "Facials, Clean-ups & Skin Care on Harlur Road, Bengaluru",
    metaDescription:
      "Signature facials, clean-ups, de-tan, waxing and threading at tressart salon, Ambalipura, Harlur Road — professional skin care in a calm, hygienic setting.",
    artSeed: 41,
  },
  {
    slug: "bridal-makeup",
    number: "05",
    title: "Bridal & occasion",
    headline: "For the days you'll remember.",
    summary: "Complete bridal packages — pre-bridal rituals, makeup and hair for every celebration.",
    intro: [
      "Your wedding is a series of moments, each with its own look. We plan them with you: pre-bridal skin and hair care in the weeks before, then makeup and hair that feel like you on the day — only more so.",
      "We also style family and the bridal party, so everyone is photo-ready.",
    ],
    highlights: ["Bridal makeup", "Pre-bridal packages", "Party looks"],
    items: [
      { name: "Bridal makeup", description: "Long-wear, camera-ready makeup designed around your outfit and skin." },
      {
        name: "Bridal hair styling",
        description: "Updos, braids and soft waves, secured to last through the celebrations.",
      },
      {
        name: "Pre-bridal packages",
        description: "A planned series of facials, hair treatments and grooming before the big day.",
      },
      { name: "Engagement & reception looks", description: "Distinct looks for each event, from subtle to statement." },
      { name: "Party & occasion makeup", description: "Polished makeup for weddings, festivals and evenings out." },
      { name: "Family & bridal party", description: "Hair and makeup for the people standing beside you." },
    ],
    faqs: [
      {
        q: "How far ahead should I book bridal makeup?",
        a: "We recommend booking as soon as your dates are fixed — especially during wedding season — and starting pre-bridal care six to eight weeks before.",
      },
      {
        q: "Do you offer a bridal trial?",
        a: "Call the salon to discuss a trial when you book your bridal package, so we can refine your look well before the day.",
      },
    ],
    metaTitle: "Bridal Makeup & Pre-Bridal Packages in Bengaluru",
    metaDescription:
      "Bridal makeup, bridal hair styling, pre-bridal packages and party makeup at tressart salon, Harlur Road, Bengaluru. Plan your bridal look with us.",
    artSeed: 53,
  },
  {
    slug: "nails",
    number: "06",
    title: "Nails, hands & feet",
    headline: "Finishing touches, done properly.",
    summary: "Manicures, pedicures and gel polish with meticulous hygiene.",
    intro: [
      "Hands and feet deserve the same attention as hair. Our nail services are unhurried and meticulous, with sanitised tools and clean stations every time.",
    ],
    highlights: ["Manicure", "Spa pedicure", "Gel polish"],
    items: [
      { name: "Manicure", description: "Shape, cuticle care, massage and polish." },
      { name: "Pedicure", description: "Soak, exfoliation and care for soft, tidy feet." },
      { name: "Spa pedicure", description: "An extended ritual with scrub, mask and a longer massage." },
      { name: "Gel polish", description: "Glossy, chip-resistant colour that lasts." },
      { name: "Nail art", description: "Minimal details or statement designs, painted by hand." },
    ],
    faqs: [
      {
        q: "How long does gel polish last?",
        a: "Usually two to three weeks, depending on your nail growth and daily routine.",
      },
      {
        q: "How do you keep nail services hygienic?",
        a: "Tools are sanitised between guests and stations are cleaned after every service.",
      },
    ],
    metaTitle: "Manicure, Pedicure & Gel Nails on Harlur Road, Bengaluru",
    metaDescription:
      "Manicures, pedicures, spa pedicures, gel polish and nail art at tressart salon, Ambalipura, Harlur Road, Bengaluru.",
    artSeed: 67,
  },
  {
    slug: "mens-grooming",
    number: "07",
    title: "Men's grooming",
    headline: "Sharp, easy, well kept.",
    summary: "Cuts, beard design, colour and skin care for men.",
    intro: [
      "tressart is a unisex salon, and our grooming services are as considered as everything else we do — clean cuts, well-shaped beards and skin care that fits into a busy week.",
    ],
    highlights: ["Men's haircut", "Beard design", "Men's facials"],
    items: [
      { name: "Men's haircut", description: "Consultation, cut and style — classic, textured or skin-faded." },
      { name: "Beard design & trim", description: "Shape and line-up to suit your face." },
      { name: "Clean shave", description: "A close, comfortable shave with hot towel prep." },
      { name: "Men's hair colour", description: "Natural grey blending or full colour." },
      { name: "Facials & clean-ups", description: "De-tan, deep cleansing and hydration for men's skin." },
      { name: "Hair spa", description: "Nourish hair and relax the scalp." },
    ],
    faqs: [
      {
        q: "Is tressart a unisex salon?",
        a: "Yes. We offer hair, skin and grooming services for men alongside our full women's menu.",
      },
      {
        q: "Do you do grey blending for men?",
        a: "Yes — we can soften grey for a natural look or cover it completely.",
      },
    ],
    metaTitle: "Men's Haircuts, Beard Grooming & Facials in Bengaluru",
    metaDescription:
      "Men's haircuts, beard design, shaves, grey blending and facials at tressart salon, a unisex salon on Harlur Road, Bengaluru.",
    artSeed: 79,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const generalFaqs: Faq[] = [
  {
    q: "Where is tressart salon?",
    a: "We're at No. 13/23, Ambalipura, Harlur Road (off Sarjapur Road), above Axis Bank, Bengaluru 560102 — a short drive from HSR Layout, Bellandur and Kasavanahalli.",
  },
  {
    q: "What are your opening hours?",
    a: "We're open every day from 9:00 am to 9:00 pm.",
  },
  {
    q: "Is tressart a unisex salon?",
    a: "Yes. We offer hair, skin, nail and grooming services for women and men, as well as complete bridal packages.",
  },
  {
    q: "Do I need an appointment?",
    a: "We recommend booking ahead, especially for colour, treatments, bridal services and weekend visits. Call us on 080 4370 8833.",
  },
  {
    q: "Which products do you use?",
    a: "We're a L'Oréal Professionnel flagship salon, so hair colour and care use L'Oréal Professionnel products. Our skin rituals use professional ranges including Thalgo and Decléor.",
  },
  {
    q: "How much do services cost?",
    a: "Pricing depends on the service, your hair length and the stylist. Call the salon for our current rate card — we're always happy to advise before you book.",
  },
];
