import React, { useState, useEffect, useMemo, useRef, useCallback, useId } from "react";
import {
  ShoppingBag, Heart, User, Search, Menu, X, Globe, Moon, Sun, Star,
  ChevronRight, ChevronLeft, MapPin, Phone, Clock, Upload, Trash2, Edit2,
  Plus, Check, Lock, Mail, Package, TrendingUp, Users, DollarSign,
  LayoutDashboard, LogOut, Gem, Sparkles, ShieldCheck, Truck, Minus,
  AlertCircle, ChevronDown, MessageCircle, Facebook, Instagram, Award,
  RefreshCw, Eye, EyeOff, Filter, ArrowLeft, CircleCheck, Banknote, QrCode, Gift, Tag
} from "lucide-react";
import emailjs from "@emailjs/browser";
import infoNepal from "info-nepal";
import { STR } from "./data/translations.js";

/* ============================================================
   EMAILJS CONFIG — real email verification codes
   ============================================================ */
const EMAILJS_SERVICE_ID = "service_7gh2l9a";
const EMAILJS_TEMPLATE_ID = "template_ne674u9";
const EMAILJS_PUBLIC_KEY = "LDniBRn4Y7M-opR0v";

/* ============================================================
   SHRINGAR SANSAR — brand tokens
   ============================================================ */
const C = {
  plum950: "#2A0F1D",
  plum900: "#3A1526",
  wine700: "#6B1F35",
  wine600: "#832847",
  rose500: "#C1546F",
  rose300: "#E3A6B6",
  gold400: "#D4AF37",
  gold300: "#E4C767",
  ivory50: "#FBF4EC",
  ivory100: "#F4E9DC",
  ink900: "#241318",
  ink600: "#5B4148",
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Mukta:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');";

/* ============================================================
   TRANSLATIONS — now in src/data/translations.js
   ============================================================ */

const PROVINCE_DISTRICTS = {
  "Koshi": ["Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"],
  "Madhesh": ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"],
  "Bagmati": ["Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"],
  "Gandaki": ["Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun"],
  "Lumbini": ["Arghakhanchi", "Banke", "Bardiya", "Dang", "Eastern Rukum", "Gulmi", "Kapilvastu", "Parasi", "Palpa", "Pyuthan", "Rolpa", "Rupandehi"],
  "Karnali": ["Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Salyan", "Surkhet", "Western Rukum"],
  "Sudurpashchim": ["Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur"],
};
const PROVINCES = Object.keys(PROVINCE_DISTRICTS);

/**
 * Real municipality / rural municipality names, sourced from the "info-nepal"
 * package (Province > District > Local Bodies). Since district name spelling
 * can vary slightly between sources (e.g. "Eastern Rukum" vs "Rukum East"),
 * this does a tolerant lookup: exact match first, then a loose match ignoring
 * case/spacing, falling back to an empty list if genuinely not found —
 * the UI then falls back to a manual text field so the form never breaks.
 */
function getLocalBodies(districtName) {
  if (!districtName) return [];
  try {
    const table = infoNepal?.localBodies || {};
    if (table[districtName]) return table[districtName];
    const target = districtName.toLowerCase().replace(/[^a-z]/g, "");
    const foundKey = Object.keys(table).find((k) => k.toLowerCase().replace(/[^a-z]/g, "") === target);
    return foundKey ? table[foundKey] : [];
  } catch (e) {
    return [];
  }
}

const NAME_REGEX = /^[A-Za-z\u0900-\u097F]+(?:\s+[A-Za-z\u0900-\u097F]+)+$/;
const PHONE_REGEX = /^9[78]\d{8}$/;

const CATEGORIES = [
  { id: "necklace", en: "Necklace Sets", np: "माला सेट", icon: "💎", gradient: ["#6B1F35", "#2A0F1D"] },
  { id: "earrings", en: "Earrings", np: "कान का बाला", icon: "✨", gradient: ["#D4AF37", "#8A6A15"] },
  { id: "bangles", en: "Bangles", np: "चुरा", icon: "⭕", gradient: ["#C1546F", "#6B1F35"] },
  { id: "tikka", en: "Tikka & Mang Tikka", np: "टीका", icon: "👑", gradient: ["#E4C767", "#B5862A"] },
  { id: "rings", en: "Rings", np: "औंठी", icon: "💍", gradient: ["#832847", "#2A0F1D"] },
  { id: "cosmetics", en: "Cosmetics", np: "सौन्दर्य सामान", icon: "💄", gradient: ["#E3A6B6", "#832847"] },
];

const SHOP = {
  name: "Shringar Sansar",
  address: "Narayanghat, Sahid Chowk, Indradev Marga, Bharatpur",
  postal: "00977",
  phone: "985-5015832",
  whatsapp: "9779855015832",
  landmark: "Near The Mobile Solution",
  plusCode: "MCVF+XH Bharatpur",
  hours: "Daily from 8:30 AM",
  mapQuery: "MCVF+XH Bharatpur Nepal",
};

function whatsappLink(message) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* ============================================================
   SEED DATA
   ============================================================ */
const SEED_PRODUCTS = [
  { id: "p1", nameEn: "Royal Kundan Necklace Set", nameNp: "रोयल कुन्दन माला सेट", category: "necklace", price: 4500, discount: 10, stock: 6, featured: true, rating: 4.8, reviews: 32, emoji: "💎", color: C.wine700 },
  { id: "p2", nameEn: "Gold Plated Jhumka Earrings", nameNp: "गोल्ड प्लेटेड झुम्का", category: "earrings", price: 1200, discount: 0, stock: 14, featured: true, rating: 4.7, reviews: 51, emoji: "✨", color: C.gold400 },
  { id: "p3", nameEn: "Traditional Glass Bangles (Set of 12)", nameNp: "परम्परागत चुरा (१२ को सेट)", category: "bangles", price: 650, discount: 5, stock: 25, featured: true, rating: 4.6, reviews: 88, emoji: "⭕", color: C.rose500, variants: ["2.4in", "2.6in", "2.8in"] },
  { id: "p4", nameEn: "Bridal Mang Tikka", nameNp: "दुलही मांग टीका", category: "tikka", price: 1800, discount: 15, stock: 3, featured: true, rating: 4.9, reviews: 19, emoji: "👑", color: C.gold300 },
  { id: "p5", nameEn: "Antique Finish Ring", nameNp: "एन्टिक फिनिस औंठी", category: "rings", price: 950, discount: 0, stock: 18, featured: false, rating: 4.5, reviews: 27, emoji: "💍", color: C.wine600, variants: ["6", "7", "8", "9"] },
  { id: "p6", nameEn: "Herbal Sindoor Box", nameNp: "हर्बल सिन्दूर बट्टा", category: "cosmetics", price: 250, discount: 0, stock: 40, featured: false, rating: 4.4, reviews: 63, emoji: "💄", color: C.rose300 },
  { id: "p7", nameEn: "Pearl Drop Earrings", nameNp: "पर्ल ड्रप कान का बाला", category: "earrings", price: 1450, discount: 8, stock: 9, featured: false, rating: 4.6, reviews: 22, emoji: "✨", color: C.plum900 },
  { id: "p8", nameEn: "Temple Design Necklace", nameNp: "टेम्पल डिजाइन माला", category: "necklace", price: 3800, discount: 0, stock: 5, featured: false, rating: 4.8, reviews: 15, emoji: "💎", color: C.wine700 },
  { id: "p9", nameEn: "Velvet Bindi Pack (Set of 6)", nameNp: "भेल्भेट बिन्दी प्याक", category: "cosmetics", price: 180, discount: 0, stock: 60, featured: false, rating: 4.3, reviews: 44, emoji: "💄", color: C.gold400 },
  { id: "p10", nameEn: "Kundan Statement Ring", nameNp: "कुन्दन स्टेटमेन्ट औंठी", category: "rings", price: 1100, discount: 12, stock: 2, featured: false, rating: 4.7, reviews: 9, emoji: "💍", color: C.rose500 },
  { id: "p11", nameEn: "Meenakari Bangles (Set of 6)", nameNp: "मीनाकारी चुरा", category: "bangles", price: 980, discount: 0, stock: 11, featured: false, rating: 4.6, reviews: 34, emoji: "⭕", color: C.gold300 },
  { id: "p12", nameEn: "Bridal Full Set (Necklace + Earrings + Tikka)", nameNp: "दुलही पूरा सेट", category: "necklace", price: 8500, discount: 20, stock: 4, featured: true, rating: 5.0, reviews: 12, emoji: "👑", color: C.wine700 },
];

const SEED_TESTIMONIALS = [
  { name: "Priya Sharma", en: "The bridal set I bought for my sister's wedding was stunning — better than the pictures! Delivery to Pokhara was quick too.", np: "मेरी बहिनीको बिहेको लागि किनेको दुलही सेट फोटोभन्दा राम्रो थियो! पोखरामा डेलिभरी पनि छिटो भयो।", rating: 5 },
  { name: "Anita Gurung", en: "Beautiful jewellery at honest prices. The staff helped me pick the right tikka over a phone call from Butwal.", np: "इमानदार मूल्यमा राम्रो गहना। बुटवलबाट फोनमै सही टीका छान्न स्टाफले मद्दत गर्नुभयो।", rating: 5 },
  { name: "Sunita Thapa", en: "COD worked perfectly and the packaging was so elegant. Will definitely order again for Teej.", np: "COD राम्ररी काम गर्यो र प्याकेजिङ धेरै सुन्दर थियो। तीजको लागि फेरि अर्डर गर्छु।", rating: 4 },
];

/* ============================================================
   CHAT ASSISTANT — simple keyword-matched FAQ bot
   No external AI API — answers come directly from real shop data,
   so there's nothing to pay for, no key to expose, and every answer
   is guaranteed accurate to how the store actually works.
   ============================================================ */
const CHAT_FAQS = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "namaste", "namaskar", "नमस्ते", "नमस्कार"],
    en: "Hello! 👋 I'm the Shringar Sansar assistant. Ask me about delivery, payment, opening hours, order tracking, or returns — or tap a question below.",
    np: "नमस्ते! 👋 म श्रृंगार संसार सहायक हुँ। डेलिभरी, भुक्तानी, खुल्ने समय, अर्डर ट्र्याकिङ, वा फिर्ताको बारेमा सोध्नुहोस् — वा तलको प्रश्नमा थिच्नुहोस्।",
  },
  {
    id: "delivery",
    keywords: ["delivery", "deliver", "ship", "shipping", "province", "district", "how long", "days", "डेलिभरी", "पठाउ", "दिन"],
    en: `We deliver to all 7 provinces of Nepal 🚚. Bagmati / Kathmandu Valley usually arrives in 1–2 days. Other provinces typically take 3–6 days. Delivery fee is Rs. 100 inside the valley and Rs. 250 outside.`,
    np: `हामी नेपालका सबै ७ प्रदेशमा डेलिभरी गर्छौं 🚚। बागमती/काठमाडौं उपत्यकामा सामान्यतया १-२ दिनमा पुग्छ। अन्य प्रदेशमा ३-६ दिन लाग्छ। डेलिभरी शुल्क उपत्यका भित्र रु. १०० र बाहिर रु. २५० हो।`,
  },
  {
    id: "payment",
    keywords: ["payment", "pay", "esewa", "bank", "transfer", "cod", "cash on delivery", "भुक्तानी", "पैसा", "इसेवा"],
    en: "We accept 3 payment methods: eSewa QR payment, Bank transfer (upload your proof at checkout), and Cash on Delivery (COD) — COD outside Kathmandu Valley has a small handling fee.",
    np: "हामी ३ भुक्तानी विधि स्वीकार गर्छौं: eSewa QR भुक्तानी, बैंक ट्रान्सफर (चेकआउटमा प्रमाण अपलोड गर्नुहोस्), र डेलिभरीमा नगद (COD) — उपत्यका बाहिर COD मा सामान्य ह्यान्डलिङ शुल्क लाग्छ।",
  },
  {
    id: "hours",
    keywords: ["hour", "open", "close", "time", "when", "समय", "खुल्ने", "बन्द"],
    en: `We're open daily from 8:30 AM at our Bharatpur shop — Narayanghat, Sahid Chowk, Indradev Marga, near The Mobile Solution.`,
    np: `हामी भरतपुर पसलमा हरेक दिन बिहान ८:३० बजेदेखि खुल्छौं — नारायणघाट, सहिद चोक, इन्द्रदेव मार्ग, द मोबाइल सोल्युसन नजिकै।`,
  },
  {
    id: "track",
    keywords: ["track", "my order", "order status", "where is my order", "ट्र्याक", "अर्डर", "स्थिति"],
    en: "You can track your order anytime under 'My Orders' after logging in — it shows real-time status (Pending, Processing, Shipped, Delivered).",
    np: "लगइन गरेपछि 'मेरो अर्डरहरू' मा गएर तपाईं जुनसुकै बेला आफ्नो अर्डर ट्र्याक गर्न सक्नुहुन्छ — त्यहाँ वास्तविक-समयको स्थिति (पेन्डिङ, प्रोसेसिङ, पठाइयो, डेलिभर भयो) देखिन्छ।",
  },
  {
    id: "return",
    keywords: ["return", "exchange", "refund", "damaged", "wrong item", "फिर्ता", "साट्ने"],
    en: "If an item arrives damaged or wrong, contact us within 3 days of delivery with a photo and we'll arrange an exchange. For hygiene reasons, cosmetics can't be returned once opened.",
    np: "यदि सामान बिग्रिएको वा गलत आएमा, डेलिभरी भएको ३ दिनभित्र फोटोसहित सम्पर्क गर्नुहोस्, हामी साट्ने व्यवस्था गर्छौं। सरसफाइका कारण खोलिसकेको सौन्दर्य सामान फिर्ता हुँदैन।",
  },
  {
    id: "login",
    keywords: ["login", "verify", "code", "email", "sign in", "लगइन", "प्रमाणित", "कोड"],
    en: "To checkout, click the account icon, enter your email, and we'll send a real verification code to your inbox. Enter that code to sign in — no password needed.",
    np: "चेकआउट गर्न, खाता आइकनमा क्लिक गर्नुहोस्, आफ्नो इमेल राख्नुहोस्, हामी तपाईंको इनबक्समा वास्तविक प्रमाणीकरण कोड पठाउँछौं। साइन इन गर्न त्यो कोड राख्नुहोस् — पासवर्ड चाहिँदैन।",
  },
  {
    id: "categories",
    keywords: ["categories", "products", "jewellery", "jewelry", "cosmetics", "what do you sell", "श्रेणी", "सामान", "गहना"],
    en: "We sell Necklace Sets, Earrings, Bangles, Tikka & Mang Tikka, Rings, and Cosmetics — browse them all under the 'Shop' page.",
    np: "हामी माला सेट, कान का बाला, चुरा, टीका, औंठी, र सौन्दर्य सामान बेच्छौं — 'पसल' पृष्ठमा सबै हेर्नुहोस्।",
  },
  {
    id: "contact",
    keywords: ["phone", "number", "call", "contact", "whatsapp", "फोन", "नम्बर", "सम्पर्क"],
    en: "You can call or message us at 985-5015832, or visit our shop in Bharatpur — Narayanghat, Sahid Chowk, Indradev Marga.",
    np: "तपाईं हामीलाई ९८५-५०१५८३२ मा फोन वा म्यासेज गर्न सक्नुहुन्छ, वा भरतपुरको पसलमा आउनुहोस् — नारायणघाट, सहिद चोक, इन्द्रदेव मार्ग।",
  },
];
const CHAT_QUICK_QUESTIONS = [
  { id: "delivery", en: "Delivery info", np: "डेलिभरी जानकारी" },
  { id: "payment", en: "Payment methods", np: "भुक्तानी विधि" },
  { id: "track", en: "Track my order", np: "अर्डर ट्र्याक" },
  { id: "return", en: "Return policy", np: "फिर्ता नीति" },
  { id: "hours", en: "Opening hours", np: "खुल्ने समय" },
];
function getChatReply(lang, rawMessage) {
  const msg = rawMessage.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const faq of CHAT_FAQS) {
    const score = faq.keywords.reduce((s, k) => (msg.includes(k.toLowerCase()) ? s + 1 : s), 0);
    if (score > bestScore) { bestScore = score; best = faq; }
  }
  if (best) return best[lang] || best.en;
  return lang === "en"
    ? "I'm not fully sure about that one — but you can call/message us directly at 985-5015832, or ask about delivery, payment, order tracking, returns, or hours."
    : "त्यो बारेमा म पक्का छैन — तर तपाईं सिधै ९८५-५०१५८३२ मा फोन/म्यासेज गर्न सक्नुहुन्छ, वा डेलिभरी, भुक्तानी, अर्डर ट्र्याकिङ, फिर्ता, वा खुल्ने समयको बारेमा सोध्न सक्नुहुन्छ।";
}

/* ============================================================
   UTILITIES
   ============================================================ */
const fmtNPR = (n) => "Rs. " + Number(n || 0).toLocaleString("en-IN");

function getProductReviews(reviews, productId) {
  return (reviews || []).filter((r) => r.productId === productId);
}
function getRatingStats(product, reviews) {
  const real = getProductReviews(reviews, product.id);
  if (real.length > 0) {
    const avg = real.reduce((s, r) => s + r.rating, 0) / real.length;
    return { rating: Math.round(avg * 10) / 10, count: real.length };
  }
  return { rating: product.rating || 0, count: product.reviews || 0 };
}

const genId = (prefix) =>
  prefix + "-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

// Local version: uses browser localStorage instead of Claude.ai's window.storage.
// "shared" has no real meaning outside Claude.ai (no multi-user backend here),
// so it's kept only as an unused parameter for compatibility with the rest of the app.
const LS_PREFIX = "shringar-sansar:";

async function storageGet(key, shared = false, fallback = null) {
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}
async function storageSet(key, value, shared = false) {
  try {
    window.localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

/* ============================================================
   JSONBIN — shared, permanent cloud storage
   Every visitor's browser reads/writes to this same online bin,
   so admin-added products and login history are visible to everyone.
   ============================================================ */
const JSONBIN_BIN_ID = "6a8b1b10da38895dfe074507";
const JSONBIN_MASTER_KEY = "$2a$10$C0fKN58Pf90OzKOXVsQKOegoMdlbVWBQgv8hVGYWGH10GK1rajlg.";
const JSONBIN_BASE_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

async function cloudFetch() {
  try {
    const res = await fetch(`${JSONBIN_BASE_URL}/latest`, {
      headers: { "X-Master-Key": JSONBIN_MASTER_KEY },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.record || null;
  } catch (e) {
    return null;
  }
}
async function cloudSave(record) {
  try {
    const res = await fetch(JSONBIN_BASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_MASTER_KEY },
      body: JSON.stringify(record),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

function resizeImageFile(file, maxDim = 480) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Badge({ children, tone = "gold" }) {
  const tones = {
    gold: { bg: C.gold400, fg: C.ink900 },
    wine: { bg: C.wine700, fg: C.ivory50 },
    rose: { bg: C.rose300, fg: C.ink900 },
    ghost: { bg: "transparent", fg: C.gold400 },
  };
  const s = tones[tone];
  return (
    <span
      style={{
        background: s.bg, color: s.fg, border: tone === "ghost" ? `1px solid ${C.gold400}` : "none",
        fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
        padding: "4px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4,
      }}
    >
      {children}
    </span>
  );
}

function ProductImage({ p, size = 64, square = false }) {
  if (p.image) {
    return (
      <div className="ss-img-zoom-wrap" style={{ width: square ? "100%" : size, height: size, overflow: "hidden", borderRadius: square ? 0 : 10 }}>
        <img src={p.image} alt={p.nameEn} className="ss-img-zoom" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }
  const base = p.color || C.wine700;
  const dim = square ? "100%" : size;
  return (
    <div
      className="ss-img-zoom-wrap ss-placeholder-shine"
      style={{
        width: dim, height: size, borderRadius: square ? 0 : 14, position: "relative", overflow: "hidden",
        background: `radial-gradient(120% 130% at 22% 18%, ${base}77, ${base}dd 55%, ${C.plum950} 130%)`,
      }}
    >
      <svg style={{ position: "absolute", inset: 0, opacity: 0.16 }} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`sparkle-${p.id}`} width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.2" fill="#fff" />
            <circle cx="20" cy="16" r="0.8" fill="#fff" />
            <circle cx="12" cy="26" r="1" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#sparkle-${p.id})`} />
      </svg>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: size * 0.72, height: size * 0.72, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 60%, transparent 75%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span className="ss-img-zoom" style={{ fontSize: size * 0.4, filter: "drop-shadow(0 4px 10px rgba(0,0,0,.35))", display: "block" }}>
          {p.emoji || "💠"}
        </span>
      </div>
      <div className="ss-shine-sweep" />
    </div>
  );
}

function PaisleyDivider({ dark }) {
  const stroke = dark ? C.gold400 : C.wine700;
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
      <svg width="140" height="20" viewBox="0 0 140 20" fill="none">
        <path d="M2 10 H55" stroke={stroke} strokeOpacity="0.5" strokeWidth="1" />
        <path
          d="M70 4c6 0 10 4 10 8s-4 8-10 8c-4 0-6-3-6-6 0-2 1-4 3-4"
          stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round"
        />
        <circle cx="70" cy="10" r="2" fill={stroke} />
        <path d="M85 10 H138" stroke={stroke} strokeOpacity="0.5" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
/* ============================================================
   ERROR BOUNDARY — so a bug never shows a blank white screen
   ============================================================ */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Shringar Sansar app error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          background: C.ivory50, color: C.ink900, fontFamily: "system-ui, sans-serif", textAlign: "center",
        }}>
          <div>
            <div style={{ fontSize: 44, marginBottom: 10 }}>😔</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: C.wine700 }}>Something went wrong</h1>
            <p style={{ fontSize: 14, color: C.ink600, marginBottom: 20, maxWidth: 340 }}>
              We're sorry — this page hit an unexpected error. Please try reloading, or contact us at {SHOP.phone} if it keeps happening.
            </p>
            <button onClick={() => window.location.reload()} style={{
              background: C.wine700, color: "#fff", border: "none", padding: "12px 24px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ShringarSansarAppRoot() {
  return (
    <ErrorBoundary>
      <ShringarSansarApp />
    </ErrorBoundary>
  );
}

function ShringarSansarApp() {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const [route, setRoute] = useState({ page: "home" });
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useState({ email: null, verified: false });
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [booted, setBooted] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCouponsState] = useState([]);
  const [posts, setPostsState] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [cloudReady, setCloudReady] = useState(false);

  const t = STR[lang];
  const dark = theme === "dark";

  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(showToast._h);
    showToast._h = window.setTimeout(() => setToast(null), 2600);
  }, []);

  /* ---------- PWA install prompt ---------- */
  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = window.localStorage.getItem(LS_PREFIX + "install-dismissed");
      if (!dismissed) setShowInstallBanner(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstallClick() {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setShowInstallBanner(false);
  }
  function dismissInstallBanner() {
    setShowInstallBanner(false);
    window.localStorage.setItem(LS_PREFIX + "install-dismissed", "1");
  }

  /* ---------- boot: load persisted state ---------- */
  useEffect(() => {
    (async () => {
      // Try the shared cloud bin first — this is what makes admin-added
      // products, offers, reviews, and now every customer's orders
      // visible from any device, not just the one that created them.
      const cloud = await cloudFetch();
      if (cloud && Array.isArray(cloud.products) && cloud.products.length) {
        setProducts(cloud.products);
        setLoginHistory(Array.isArray(cloud.loginHistory) ? cloud.loginHistory : []);
        setOffers(Array.isArray(cloud.offers) ? cloud.offers : []);
        setReviews(Array.isArray(cloud.reviews) ? cloud.reviews : []);
        setCouponsState(Array.isArray(cloud.coupons) ? cloud.coupons : []);
        setPostsState(Array.isArray(cloud.posts) ? cloud.posts : []);
        setOrders(Array.isArray(cloud.orders) ? cloud.orders : []);
        setCloudReady(true);
      } else {
        // Cloud unreachable or empty — fall back to local copy, and if this
        // is truly the first run ever, seed the cloud bin with defaults.
        const storedProducts = await storageGet("products", true, null);
        if (storedProducts && Array.isArray(storedProducts) && storedProducts.length) {
          setProducts(storedProducts);
        } else {
          setProducts(SEED_PRODUCTS);
        }
        const storedOrdersFallback = await storageGet("orders", false, []);
        setOrders(storedOrdersFallback || []);
        if (!cloud) {
          const seeded = await cloudSave({ products: SEED_PRODUCTS, loginHistory: [], offers: [], reviews: [], orders: storedOrdersFallback || [], coupons: [], posts: [] });
          if (seeded) setCloudReady(true);
        }
      }

      const storedCart = await storageGet("cart", false, []);
      setCart(storedCart || []);
      const storedWishlist = await storageGet("wishlist", false, []);
      setWishlist(storedWishlist || []);
      const storedRecentlyViewed = await storageGet("recently-viewed", false, []);
      setRecentlyViewed(storedRecentlyViewed || []);
      const storedLang = await storageGet("pref-lang", false, "en");
      setLang(storedLang || "en");
      const storedTheme = await storageGet("pref-theme", false, "light");
      setTheme(storedTheme || "light");
      const storedAuth = await storageGet("auth", false, null);
      if (storedAuth && storedAuth.verified && storedAuth.email) {
        setAuth(storedAuth);
      }

      let v = await storageGet("visitor-count", true, 0);
      v = (v || 0) + 1;
      await storageSet("visitor-count", v, true);
      setVisitorCount(v);

      setBooted(true);
    })();
  }, []);

  useEffect(() => { if (booted) storageSet("pref-lang", lang, false); }, [lang, booted]);
  useEffect(() => { if (booted) storageSet("pref-theme", theme, false); }, [theme, booted]);
  useEffect(() => { if (booted) storageSet("cart", cart, false); }, [cart, booted]);
  useEffect(() => { if (booted) storageSet("orders", orders, false); }, [orders, booted]);
  useEffect(() => { if (booted) storageSet("auth", auth, false); }, [auth, booted]);
  useEffect(() => { if (booted) storageSet("wishlist", wishlist, false); }, [wishlist, booted]);
  useEffect(() => { if (booted) storageSet("recently-viewed", recentlyViewed, false); }, [recentlyViewed, booted]);

  const persistProducts = useCallback(async (next) => {
    setProducts(next);
    await storageSet("products", next, true);
    await cloudSave({ products: next, loginHistory, offers, reviews, orders, coupons, posts });
  }, [loginHistory, offers, reviews, orders, coupons, posts]);

  const persistOffers = useCallback(async (next) => {
    setOffers(next);
    await cloudSave({ products, loginHistory, offers: next, reviews, orders, coupons, posts });
  }, [products, loginHistory, reviews, orders, coupons, posts]);

  const recordLogin = useCallback(async (email) => {
    setLoginHistory((prev) => {
      const entry = { email, date: new Date().toISOString() };
      const next = [entry, ...prev].slice(0, 500);
      cloudSave({ products, loginHistory: next, offers, reviews, orders, coupons, posts });
      return next;
    });
  }, [products, offers, reviews, orders, coupons, posts]);

  const addReview = useCallback((review) => {
    setReviews((prev) => {
      const next = [review, ...prev];
      cloudSave({ products, loginHistory, offers, reviews: next, orders, coupons, posts });
      return next;
    });
  }, [products, loginHistory, offers, orders, coupons, posts]);

  const deleteReview = useCallback((reviewId) => {
    setReviews((prev) => {
      const next = prev.filter((r) => r.id !== reviewId);
      cloudSave({ products, loginHistory, offers, reviews: next, orders, coupons, posts });
      return next;
    });
  }, [products, loginHistory, offers, orders, coupons, posts]);

  // Every order create/update/cancel goes through this so orders are
  // shared across every device — the admin panel and each customer's
  // own "My Orders" page always reflect the same real, current data.
  const persistOrders = useCallback(async (next) => {
    setOrders(next);
    await cloudSave({ products, loginHistory, offers, reviews, orders: next, coupons, posts });
  }, [products, loginHistory, offers, reviews, coupons, posts]);

  const persistCoupons = useCallback(async (next) => {
    setCouponsState(next);
    await cloudSave({ products, loginHistory, offers, reviews, orders, coupons: next, posts });
  }, [products, loginHistory, offers, reviews, orders, posts]);

  const persistPosts = useCallback(async (next) => {
    setPostsState(next);
    await cloudSave({ products, loginHistory, offers, reviews, orders, coupons, posts: next });
  }, [products, loginHistory, offers, reviews, orders, coupons]);

  // Adjusts real product stock when an order is placed (decrement) or
  // cancelled (restock). Combo/offer items ("combo:offerId") don't map to
  // a real product directly, so their qty is applied to every product
  // bundled inside that offer instead.
  function computeStockDeltas(items) {
    const deltas = {};
    for (const item of items) {
      if (typeof item.id === "string" && item.id.startsWith("combo:")) {
        const offerId = item.id.slice("combo:".length);
        const offer = offers.find((o) => o.id === offerId);
        (offer?.productIds || []).forEach((pid) => {
          deltas[pid] = (deltas[pid] || 0) + item.qty;
        });
      } else {
        deltas[item.id] = (deltas[item.id] || 0) + item.qty;
      }
    }
    return deltas;
  }
  const adjustStockForItems = useCallback((items, sign) => {
    const deltas = computeStockDeltas(items);
    if (Object.keys(deltas).length === 0) return;
    const next = products.map((p) => (deltas[p.id] ? { ...p, stock: Math.max(0, p.stock + sign * deltas[p.id]) } : p));
    persistProducts(next);
  }, [products, offers, persistProducts]);

  // Placing an order touches three things at once (orders, product stock,
  // and coupon usage count) — this writes all three in a single atomic
  // cloud save so nothing gets silently overwritten by a stale snapshot.
  const placeOrder = useCallback((order, usedCoupon) => {
    const deltas = computeStockDeltas(order.items);
    const nextProducts = Object.keys(deltas).length
      ? products.map((p) => (deltas[p.id] ? { ...p, stock: Math.max(0, p.stock - deltas[p.id]) } : p))
      : products;
    const nextOrders = [order, ...orders];
    const nextCoupons = usedCoupon
      ? coupons.map((c) => (c.id === usedCoupon.id ? { ...c, usedCount: (c.usedCount || 0) + 1 } : c))
      : coupons;
    setProducts(nextProducts);
    setOrders(nextOrders);
    setCouponsState(nextCoupons);
    storageSet("products", nextProducts, true);
    cloudSave({ products: nextProducts, loginHistory, offers, reviews, orders: nextOrders, coupons: nextCoupons, posts });
  }, [products, orders, coupons, offers, loginHistory, reviews, posts]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    if (newStatus === "cancelled" && target.status !== "cancelled") {
      adjustStockForItems(target.items, 1); // restock since the sale fell through
    }
    persistOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  }, [orders, persistOrders, adjustStockForItems]);

  function toggleWishlist(productId) {
    setWishlist((prev) => {
      const has = prev.includes(productId);
      showToast(has ? (lang === "en" ? "Removed from wishlist" : "मनपर्ने सूचीबाट हटाइयो") : (lang === "en" ? "Added to wishlist" : "मनपर्ने सूचीमा थपियो"));
      return has ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  }

  function recordRecentlyViewed(productId) {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 12));
  }

  /* ---------- cart helpers ---------- */
  const cartDetailed = useMemo(
    () => cart.map((c) => {
      if (typeof c.id === "string" && c.id.startsWith("combo:")) {
        const offerId = c.id.slice(6);
        const offer = offers.find((o) => o.id === offerId);
        if (!offer) return null;
        const includedProducts = (offer.productIds || []).map((pid) => products.find((p) => p.id === pid)).filter(Boolean);
        const syntheticProduct = {
          id: c.id, nameEn: offer.titleEn, nameNp: offer.titleNp || offer.titleEn,
          price: offer.comboPrice, discount: 0, stock: 99, image: offer.image || null,
          emoji: "🎁", color: offer.color || C.gold400,
          isCombo: true, includedProducts,
        };
        return { ...c, product: syntheticProduct };
      }
      return { ...c, product: products.find((p) => p.id === c.id) };
    }).filter((c) => c && c.product),
    [cart, products, offers]
  );
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartSubtotal = cartDetailed.reduce((s, c) => {
    const price = c.product.price * (1 - (c.product.discount || 0) / 100);
    return s + price * c.qty;
  }, 0);

  function addToCart(productId, qty = 1, variant = null) {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === productId && (c.variant || null) === variant);
      if (exists) return prev.map((c) => (c === exists ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { id: productId, qty, variant }];
    });
    showToast(lang === "en" ? "Added to cart" : "कार्टमा थपियो");
    setCartOpen(true);
  }
  function addComboToCart(offerId, qty = 1) {
    const cartId = "combo:" + offerId;
    setCart((prev) => {
      const exists = prev.find((c) => c.id === cartId);
      if (exists) return prev.map((c) => (c.id === cartId ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { id: cartId, qty, variant: null }];
    });
    showToast(t.comboAdded);
    setCartOpen(true);
  }
  function setCartQty(productId, variant, qty) {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((c) => !(c.id === productId && (c.variant || null) === (variant || null)))
        : prev.map((c) => (c.id === productId && (c.variant || null) === (variant || null) ? { ...c, qty } : c))
    );
  }
  function removeFromCart(productId, variant) {
    setCart((prev) => prev.filter((c) => !(c.id === productId && (c.variant || null) === (variant || null))));
  }

  /* ---------- routing helper ---------- */
  function go(page, params = {}) {
    setRoute({ page, ...params });
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }

  /* ---------- theming root ---------- */
  const bg = dark ? C.plum950 : C.ivory50;
  const fg = dark ? C.ivory100 : C.ink900;

  const css = `
    ${FONT_IMPORT}
    .ss-root { font-family: 'Mukta', sans-serif; background:${bg}; color:${fg}; min-height:100%; transition: background .3s, color .3s; }
    .ss-display { font-family: 'Cormorant Garamond', serif; }
    .ss-caption { font-family: 'Poppins', sans-serif; }
    .ss-btn { cursor:pointer; border:none; transition: transform .15s ease, filter .15s ease, box-shadow .15s ease; }
    .ss-btn:hover { transform: translateY(-1px); filter: brightness(1.06); }
    .ss-btn:active { transform: translateY(0px) scale(.98); }
    .ss-card { transition: transform .25s ease, box-shadow .25s ease; }
    .ss-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px -12px rgba(42,15,29,.35); }
    .ss-img-zoom-wrap { position: relative; }
    .ss-img-zoom { transition: transform .5s ease; }
    .ss-card:hover .ss-img-zoom { transform: scale(1.1) rotate(-1deg); }
    .ss-placeholder-shine { box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .ss-shine-sweep {
      position: absolute; top: 0; left: -60%; width: 40%; height: 100%; pointer-events: none;
      background: linear-gradient(100deg, transparent, rgba(255,255,255,.22) 45%, transparent 75%);
      transform: skewX(-18deg); animation: ssShineSweep 4.5s ease-in-out infinite;
    }
    @keyframes ssShineSweep { 0% { left: -60%; } 35% { left: 130%; } 100% { left: 130%; } }
    @media (prefers-reduced-motion: reduce) { .ss-shine-sweep { animation: none; display: none; } }
    .ss-fade-in { animation: ssFadeIn .5s ease both; }
    @keyframes ssFadeIn { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform:none;} }
    .ss-scroll::-webkit-scrollbar { width:6px; height:6px; }
    .ss-scroll::-webkit-scrollbar-thumb { background:${C.gold400}88; border-radius:99px; }
    input, select, textarea { font-family:'Mukta',sans-serif; }
    .ss-focus:focus-visible { outline:2px solid ${C.gold400}; outline-offset:2px; }
    @media (prefers-reduced-motion: reduce) { .ss-card, .ss-btn, .ss-fade-in { transition:none !important; animation:none !important; } }
  `;

  if (!booted) {
    return (
      <div className="ss-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <style>{css}</style>
        <div style={{ textAlign: "center" }}>
          <div className="ss-display" style={{ fontSize: 34, fontWeight: 700, color: C.wine700 }}>Shringar Sansar</div>
          <div className="ss-caption" style={{ fontSize: 13, color: C.ink600, marginTop: 6 }}>Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ss-root ss-scroll">
      <style>{css}</style>

      {toast && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200,
          background: C.wine700, color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 14,
          boxShadow: "0 10px 24px -8px rgba(0,0,0,.4)", display: "flex", alignItems: "center", gap: 8,
        }} className="ss-fade-in ss-caption">
          <Check size={16} /> {toast}
        </div>
      )}

      {showInstallBanner && !adminMode && (
        <div className="ss-fade-in" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 190, background: C.plum950, color: C.ivory50,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 -8px 24px -8px rgba(0,0,0,.4)",
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.gold400}` }}>
            <img src="/logo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }} className="ss-caption">
            <div style={{ fontSize: 13, fontWeight: 600 }}>{lang === "en" ? "Install Shringar Sansar" : "श्रृंगार संसार इन्स्टल गर्नुहोस्"}</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>{lang === "en" ? "Add to your home screen for quick access." : "छिटो पहुँचका लागि आफ्नो होम स्क्रिनमा थप्नुहोस्।"}</div>
          </div>
          <button className="ss-btn ss-caption" onClick={handleInstallClick} style={{ background: C.gold400, color: C.ink900, padding: "9px 16px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>
            {lang === "en" ? "Install" : "इन्स्टल"}
          </button>
          <button className="ss-btn" onClick={dismissInstallBanner} style={{ background: "none", color: C.ivory50, flexShrink: 0 }}><X size={16} /></button>
        </div>
      )}

      {adminMode ? (
        <AdminApp
          t={t} lang={lang} dark={dark}
          products={products} setProducts={persistProducts}
          orders={orders} updateOrderStatus={updateOrderStatus}
          visitorCount={visitorCount} loginHistory={loginHistory}
          offers={offers} setOffers={persistOffers}
          reviews={reviews} deleteReview={deleteReview}
          coupons={coupons} setCoupons={persistCoupons}
          posts={posts} setPosts={persistPosts}
          onExit={() => setAdminMode(false)}
        />
      ) : (
        <>
          <Header
            t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}
            cartCount={cartCount} onCartClick={() => setCartOpen(true)}
            onLoginClick={() => setLoginOpen(true)} auth={auth}
            onLogout={() => { setAuth({ email: null, verified: false }); showToast(lang === "en" ? "Signed out" : "साइन आउट भयो"); }}
            go={go} route={route} dark={dark}
            onAdminClick={() => setRoute({ page: "admin-gate" })}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} wishlistCount={wishlist.length}
          />

          <main id="main-content" tabIndex={-1}>
            {route.page === "home" && (
              <HomePage
                t={t} lang={lang} dark={dark} products={products} offers={offers} go={go} addToCart={addToCart} addComboToCart={addComboToCart}
                visitorCount={visitorCount} reviews={reviews} wishlist={wishlist} toggleWishlist={toggleWishlist}
                recentlyViewed={recentlyViewed} recordRecentlyViewed={recordRecentlyViewed} auth={auth}
                orders={orders} addReview={addReview} onRequestLogin={() => setLoginOpen(true)} posts={posts}
              />
            )}
            {route.page === "shop" && (
              <ShopPage
                t={t} lang={lang} dark={dark} products={products} addToCart={addToCart} initialQuery={searchQuery}
                reviews={reviews} wishlist={wishlist} toggleWishlist={toggleWishlist} recordRecentlyViewed={recordRecentlyViewed}
                auth={auth} orders={orders} addReview={addReview} onRequestLogin={() => setLoginOpen(true)}
              />
            )}
            {route.page === "wishlist" && (
              <WishlistPage
                t={t} lang={lang} dark={dark} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist}
                reviews={reviews} addToCart={addToCart} go={go}
              />
            )}
            {route.page === "cart" && (
              <CartPage
                t={t} lang={lang} dark={dark} cartDetailed={cartDetailed} setCartQty={setCartQty}
                removeFromCart={removeFromCart} subtotal={cartSubtotal} go={go}
              />
            )}
            {route.page === "checkout" && (
              <CheckoutFlow
                t={t} lang={lang} dark={dark} cartDetailed={cartDetailed} subtotal={cartSubtotal}
                auth={auth} setLoginOpen={setLoginOpen} go={go} coupons={coupons}
                onOrderPlaced={(order, usedCoupon) => {
                  placeOrder(order, usedCoupon);
                  setCart([]);
                }}
              />
            )}
            {route.page === "orders" && <OrdersPage t={t} lang={lang} dark={dark} orders={orders} updateOrderStatus={updateOrderStatus} auth={auth} go={go} showToast={showToast} />}
            {route.page === "admin-gate" && (
              <AdminGate t={t} dark={dark} lang={lang} onSuccess={() => setAdminMode(true)} onCancel={() => go("home")} />
            )}
            {route.page === "about" && <AboutPage t={t} lang={lang} dark={dark} />}
            {route.page === "blog" && <BlogPage t={t} lang={lang} dark={dark} posts={posts} initialPostId={route.postId} />}
            {route.page === "returns" && <ReturnPolicyPage t={t} lang={lang} dark={dark} />}
            {route.page === "contact" && <ContactPage t={t} lang={lang} dark={dark} onOpenChat={() => setChatOpen(true)} />}
            {!["home", "shop", "wishlist", "cart", "checkout", "orders", "admin-gate", "about", "contact", "blog", "returns"].includes(route.page) && (
              <NotFoundPage t={t} lang={lang} dark={dark} go={go} />
            )}
          </main>

          <Footer t={t} lang={lang} dark={dark} go={go} setRoute={setRoute} />

          <CartDrawer
            open={cartOpen} onClose={() => setCartOpen(false)} t={t} lang={lang} dark={dark}
            cartDetailed={cartDetailed} setCartQty={setCartQty} removeFromCart={removeFromCart}
            subtotal={cartSubtotal} go={go}
          />

          {loginOpen && (
            <LoginModal
              t={t} lang={lang} dark={dark}
              onClose={() => setLoginOpen(false)}
              onVerified={(email) => { setAuth({ email, verified: true }); setLoginOpen(false); showToast(lang === "en" ? "Email verified" : "इमेल प्रमाणित भयो"); recordLogin(email); }}
            />
          )}

          <a
            href={whatsappLink(lang === "en" ? "Hi Shringar Sansar, I'd like to ask about..." : "नमस्ते श्रृंगार संसार, म यसबारे सोध्न चाहन्छु...")}
            target="_blank" rel="noopener noreferrer" title={lang === "en" ? "Chat on WhatsApp" : "WhatsApp मा च्याट गर्नुहोस्"}
            style={{
              position: "fixed", bottom: 20, left: 20, zIndex: 200, width: 52, height: 52, borderRadius: "50%",
              background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 12px 30px -8px rgba(0,0,0,.45)", textDecoration: "none",
            }}
            className="ss-btn"
          >
            <WhatsappIcon size={26} color="#fff" />
          </a>

          <ChatWidget open={chatOpen} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} lang={lang} dark={dark} />
        </>
      )}
    </div>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function Header({ t, lang, setLang, theme, setTheme, cartCount, onCartClick, onLoginClick, auth, onLogout, go, route, dark, onAdminClick, searchQuery, setSearchQuery, wishlistCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navItems = [
    { key: "home", label: t.home },
    { key: "shop", label: t.shop },
    { key: "blog", label: t.blog },
    { key: "about", label: t.about },
    { key: "contact", label: t.contact },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100, background: dark ? C.plum950 + "F2" : C.ivory50 + "F2",
      backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.gold400}33`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 16 }}>
        <button className="ss-btn" onClick={() => go("home")} style={{ background: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: C.plum950,
            display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${C.gold400}`, overflow: "hidden", flexShrink: 0,
          }}>
            <img src="/logo.png" alt="Shringar Sansar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div className="ss-display" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, color: dark ? C.ivory50 : C.wine700 }}>{t.heroTitle}</div>
            <div className="ss-caption" style={{ fontSize: 9, letterSpacing: "0.14em", color: C.gold400, textTransform: "uppercase" }}>{t.tagline}</div>
          </div>
        </button>

        <nav style={{ display: "none", gap: 4, marginLeft: 12 }} className="ss-caption ss-nav-desktop">
          {navItems.map((n) => (
            <button key={n.key} className="ss-btn" onClick={() => go(n.key)}
              style={{
                background: route.page === n.key ? (dark ? C.wine700 + "55" : C.rose300 + "55") : "transparent",
                color: dark ? C.ivory50 : C.ink900, padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
              }}>{n.label}</button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ display: "none", alignItems: "center", position: "relative" }} className="ss-search-desktop">
          <Search size={15} style={{ position: "absolute", left: 10, color: C.ink600 }} />
          <input
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") go("shop"); }}
            placeholder={t.searchPlaceholder} className="ss-focus"
            style={{
              width: 200, padding: "8px 10px 8px 30px", borderRadius: 999, border: `1px solid ${C.gold400}55`,
              background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 13,
            }}
          />
        </div>

        <button className="ss-btn" title={lang === "en" ? "नेपाली" : "English"} aria-label={lang === "en" ? "Switch to Nepali" : "Switch to English"} onClick={() => setLang(lang === "en" ? "np" : "en")}
          style={{ background: "none", display: "flex", alignItems: "center", gap: 4, color: dark ? C.ivory50 : C.ink900, fontSize: 12 }} className="ss-caption">
          <Globe size={17} /> <span style={{ fontWeight: 600 }}>{lang === "en" ? "EN" : "ने"}</span>
        </button>

        <button className="ss-btn" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={{ background: "none", color: dark ? C.gold300 : C.ink900 }}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="ss-btn" onClick={() => auth.verified ? setAccountOpen((o) => !o) : onLoginClick()} title={t.login} aria-label={auth.verified ? "Account menu" : t.login} style={{ background: "none", color: dark ? C.ivory50 : C.ink900, position: "relative" }}>
          <User size={19} />
          {auth.verified && <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "#2E9E5B", border: `1.5px solid ${dark ? C.plum950 : C.ivory50}` }} />}
        </button>
        {accountOpen && auth.verified && (
          <div className="ss-fade-in ss-caption" style={{
            position: "absolute", top: 56, right: 60, zIndex: 150, background: dark ? C.plum900 : "#fff",
            border: `1px solid ${C.gold400}44`, borderRadius: 12, padding: 14, minWidth: 200, boxShadow: "0 14px 30px -10px rgba(0,0,0,.4)",
          }}>
            <div style={{ fontSize: 11, color: C.ink600, marginBottom: 2 }}>{lang === "en" ? "Signed in as" : "यसमा साइन इन गरिएको"}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, wordBreak: "break-all" }}>{auth.email}</div>
            <button className="ss-btn ss-caption" onClick={() => { setAccountOpen(false); go("orders"); }} style={{ width: "100%", textAlign: "left", background: "none", padding: "8px 6px", fontSize: 13, color: dark ? C.ivory50 : C.ink900, borderRadius: 6 }}>{t.myOrders}</button>
            <button className="ss-btn ss-caption" onClick={() => { setAccountOpen(false); onLogout(); }} style={{ width: "100%", textAlign: "left", background: "none", padding: "8px 6px", fontSize: 13, color: C.rose500, borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <LogOut size={14} /> {t.logout}
            </button>
          </div>
        )}

        <button className="ss-btn" onClick={() => go("wishlist")} title={t.wishlist} aria-label={`${t.wishlist} (${wishlistCount})`} style={{ background: "none", color: dark ? C.ivory50 : C.ink900, position: "relative" }}>
          <Heart size={19} />
          {wishlistCount > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -8, background: C.rose500, color: "#fff", fontSize: 10, fontWeight: 700,
              borderRadius: 999, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
            }}>{wishlistCount}</span>
          )}
        </button>

        <button className="ss-btn" onClick={onCartClick} aria-label={`${t.cart} (${cartCount})`} style={{ background: "none", color: dark ? C.ivory50 : C.ink900, position: "relative" }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -8, background: C.gold400, color: C.ink900, fontSize: 10, fontWeight: 700,
              borderRadius: 999, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
            }}>{cartCount}</span>
          )}
        </button>

        <button className="ss-btn" onClick={() => setMenuOpen((m) => !m)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} style={{ background: "none", color: dark ? C.ivory50 : C.ink900 }} title="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="ss-fade-in ss-caption" style={{ borderTop: `1px solid ${C.gold400}33`, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((n) => (
            <button key={n.key} className="ss-btn" onClick={() => { go(n.key); setMenuOpen(false); }}
              style={{ textAlign: "left", background: "none", padding: "10px 8px", color: dark ? C.ivory50 : C.ink900, fontSize: 15, borderBottom: `1px solid ${C.gold400}22` }}>
              {n.label}
            </button>
          ))}
          <button className="ss-btn" onClick={() => { go("orders"); setMenuOpen(false); }} style={{ textAlign: "left", background: "none", padding: "10px 8px", color: dark ? C.ivory50 : C.ink900, fontSize: 15, borderBottom: `1px solid ${C.gold400}22` }}>{t.myOrders}</button>
          <button className="ss-btn" onClick={() => { onAdminClick(); setMenuOpen(false); }} style={{ textAlign: "left", background: "none", padding: "10px 8px", color: C.gold400, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <Lock size={13} /> {t.admin}
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .ss-nav-desktop { display:flex !important; }
          .ss-search-desktop { display:flex !important; }
        }
      `}</style>
    </header>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function AnimatedCounter({ to, label, dark }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1200;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div className="ss-display" style={{ fontSize: 40, fontWeight: 700, color: C.gold400 }}>{val.toLocaleString()}+</div>
      <div className="ss-caption" style={{ fontSize: 12, color: dark ? C.ivory100 : C.ink600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function HomePage({ t, lang, dark, products, offers, go, addToCart, addComboToCart, visitorCount, reviews, wishlist, toggleWishlist, recentlyViewed, recordRecentlyViewed, auth, orders, addReview, onRequestLogin, posts }) {
  const featured = products.filter((p) => p.featured);
  const [tIndex, setTIndex] = useState(0);
  const [quickView, setQuickView] = useState(null);
  const recentProducts = (recentlyViewed || []).map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 8);
  function openQuickView(p) {
    recordRecentlyViewed && recordRecentlyViewed(p.id);
    setQuickView(p);
  }
  useEffect(() => {
    const id = setInterval(() => setTIndex((i) => (i + 1) % SEED_TESTIMONIALS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: `radial-gradient(1200px 500px at 15% -10%, ${C.wine700}55, transparent), linear-gradient(160deg, ${C.plum950}, ${C.plum900})`,
        color: C.ivory50, padding: "72px 20px 90px",
      }}>
        <svg style={{ position: "absolute", inset: 0, opacity: 0.12 }} width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <pattern id="paisley" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M20 60c0-16 12-28 28-28s28 12 28 28-12 24-24 24c-8 0-14-6-14-14 0-6 4-10 8-10" stroke={C.gold400} strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#paisley)" />
        </svg>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40 }}>
          <div className="ss-fade-in" style={{ flex: "1 1 380px", minWidth: 280 }}>
            <Badge tone="ghost">{lang === "en" ? "Bharatpur, Nepal" : "भरतपुर, नेपाल"}</Badge>
            <h1 className="ss-display" style={{ fontSize: "clamp(38px, 6vw, 62px)", fontWeight: 700, margin: "16px 0 10px", lineHeight: 1.05 }}>
              {t.heroTitle}
            </h1>
            <p className="ss-caption" style={{ fontSize: 12, letterSpacing: "0.18em", color: C.gold300, textTransform: "uppercase", marginBottom: 18 }}>{t.tagline}</p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: C.ivory100, maxWidth: 480, marginBottom: 28 }}>{t.heroSub}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ background: C.gold400, color: C.ink900, padding: "13px 26px", borderRadius: 999, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                {t.shopNow} <ChevronRight size={16} />
              </button>
              <button className="ss-btn ss-caption" onClick={() => go("about")} style={{ background: "transparent", border: `1px solid ${C.ivory50}66`, color: C.ivory50, padding: "13px 26px", borderRadius: 999, fontWeight: 500, fontSize: 14 }}>
                {t.ourStory}
              </button>
            </div>
            <div style={{ marginTop: 30, display: "flex", gap: 18, flexWrap: "wrap" }}>
              {[[ShieldCheck, t.secureCheckout], [Star, t.verifiedReviews], [Truck, t.deliversAll]].map(([Icon, label], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }} className="ss-caption">
                  <Icon size={15} color={C.gold400} /> <span style={{ color: C.ivory100 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 300px", minWidth: 260, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 300, height: 300 }} className="ss-fade-in">
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid ${C.gold400}66`, animation: "spin 40s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg);} }`}</style>
              <div style={{
                position: "absolute", inset: 24, borderRadius: "50%",
                background: `conic-gradient(from 210deg, ${C.wine700}, ${C.rose500}, ${C.gold400}, ${C.wine700})`,
                display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 60px -20px rgba(0,0,0,.5)",
              }}>
                <div style={{ width: "78%", height: "78%", borderRadius: "50%", background: C.plum950, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
                  <Gem size={38} color={C.gold300} />
                  <span className="ss-display" style={{ color: C.gold300, fontSize: 15, marginTop: 4 }}>{lang === "en" ? "Est. Bharatpur" : "स्थापना भरतपुर"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS */}
      <SpecialOffersSection t={t} lang={lang} dark={dark} offers={offers} products={products} addComboToCart={addComboToCart} />

      {/* CATEGORIES */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 20px" }}>
        <SectionHeading title={t.exploreCategories} dark={dark} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 18, marginTop: 26 }}>
          {CATEGORIES.map((c) => {
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <button key={c.id} className="ss-btn ss-category-card" onClick={() => go("shop", { category: c.id })}
                style={{
                  position: "relative", overflow: "hidden", borderRadius: 20, padding: "28px 14px 20px",
                  textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  background: `linear-gradient(150deg, ${c.gradient[0]}, ${c.gradient[1]})`,
                  border: `1px solid ${C.gold400}55`, boxShadow: "0 10px 24px -12px rgba(42,15,29,.5)",
                }}>
                <svg style={{ position: "absolute", top: -20, right: -20, opacity: 0.15 }} width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="44" fill="none" stroke="#fff" strokeWidth="1.5" />
                </svg>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.16)",
                  border: `1.5px solid ${C.gold300}99`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, boxShadow: "inset 0 2px 6px rgba(0,0,0,.15)",
                }}>
                  {c.icon}
                </div>
                <span className="ss-caption" style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>{lang === "en" ? c.en : c.np}</span>
                <span className="ss-caption" style={{ fontSize: 10.5, color: C.gold300, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {count} {lang === "en" ? (count === 1 ? "item" : "items") : "सामान"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <style>{`
        .ss-category-card { transition: transform .25s ease, box-shadow .25s ease; }
        .ss-category-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 18px 34px -12px rgba(42,15,29,.6); }
      `}</style>

      {/* FEATURED PRODUCTS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <SectionHeading title={t.featured} dark={dark} />
          <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ background: "none", color: C.wine700, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            {t.viewAll} <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18, marginTop: 22 }}>
          {featured.map((p) => <ProductCard key={p.id} p={p} t={t} lang={lang} dark={dark} addToCart={addToCart} onQuickView={openQuickView} reviews={reviews} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
        </div>
      </section>

      {recentProducts.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
          <SectionHeading title={t.recentlyViewed} dark={dark} />
          <div className="ss-scroll" style={{ display: "flex", gap: 16, overflowX: "auto", marginTop: 22, paddingBottom: 6 }}>
            {recentProducts.map((p) => (
              <div key={p.id} style={{ minWidth: 190, maxWidth: 190, flexShrink: 0 }}>
                <ProductCard p={p} t={t} lang={lang} dark={dark} addToCart={addToCart} onQuickView={openQuickView} reviews={reviews} wishlist={wishlist} toggleWishlist={toggleWishlist} />
              </div>
            ))}
          </div>
        </section>
      )}

      {quickView && (
        <QuickViewModal
          p={quickView} t={t} lang={lang} dark={dark} addToCart={addToCart} onClose={() => setQuickView(null)}
          wishlist={wishlist} toggleWishlist={toggleWishlist} reviews={reviews} auth={auth} orders={orders}
          addReview={addReview} onRequestLogin={onRequestLogin}
        />
      )}

      {/* COUNTERS */}
      <section style={{ background: dark ? C.plum900 : C.ivory100, padding: "50px 20px" }}>
        <SectionHeading title={t.counters} dark={dark} center />
        <div style={{ maxWidth: 900, margin: "30px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 24 }}>
          <AnimatedCounter to={500} label={t.happyCustomers} dark={dark} />
          <AnimatedCounter to={1800} label={t.productsSold} dark={dark} />
          <AnimatedCounter to={5} label={t.yearsService} dark={dark} />
          <AnimatedCounter to={7} label={t.provincesServed} dark={dark} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 20px" }}>
        <SectionHeading title={t.testimonials} dark={dark} center />
        <div style={{ marginTop: 26, position: "relative", minHeight: 160 }}>
          {SEED_TESTIMONIALS.map((ts, i) => (
            <div key={i} className="ss-fade-in" style={{
              display: i === tIndex ? "block" : "none", textAlign: "center",
              background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 18, padding: "28px 24px",
            }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 10 }}>
                {Array.from({ length: 5 }).map((_, si) => <Star key={si} size={15} fill={si < ts.rating ? C.gold400 : "none"} color={C.gold400} />)}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic", marginBottom: 12 }}>"{lang === "en" ? ts.en : ts.np}"</p>
              <p className="ss-caption" style={{ fontSize: 13, fontWeight: 600, color: C.wine700 }}>— {ts.name}</p>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
            {SEED_TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTIndex(i)} className="ss-btn" style={{ width: 8, height: 8, borderRadius: "50%", background: i === tIndex ? C.gold400 : C.gold400 + "44", padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* BLOG TEASER — shows real published posts once you add them in Admin */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <SectionHeading title={t.blog} dark={dark} />
          {posts.filter((p) => p.published).length > 0 && (
            <button className="ss-btn ss-caption" onClick={() => go("blog")} style={{ background: "none", color: C.wine700, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              {t.viewAll} <ChevronRight size={14} />
            </button>
          )}
        </div>
        {posts.filter((p) => p.published).length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 22 }}>
            {[
              { icon: "🪔", en: "Teej Special: 5 Bangle Pairings to Try", np: "तीज स्पेशल: ५ चुरा जोडी सुझाव" },
              { icon: "💄", en: "Everyday Bindi Care Tips", np: "दैनिक बिन्दी हेरचाह सुझाव" },
              { icon: "🎉", en: "Dashain Offers Coming Soon", np: "दशैं अफर छिट्टै आउँदैछ" },
            ].map((b, i) => (
              <div key={i} className="ss-card" style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 28 }}>{b.icon}</div>
                <p style={{ fontWeight: 600, marginTop: 10, fontSize: 15 }}>{lang === "en" ? b.en : b.np}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 22 }}>
            {posts.filter((p) => p.published).slice(0, 3).map((post) => (
              <button key={post.id} onClick={() => go("blog", { postId: post.id })} className="ss-card" style={{
                textAlign: "left", background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
              }}>
                {post.image ? (
                  <img src={post.image} alt="" style={{ width: "100%", height: 130, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: 130, background: `linear-gradient(135deg, ${C.wine700}, ${C.plum950})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📖</div>
                )}
                <div style={{ padding: 18 }}>
                  {post.category && <span className="ss-caption" style={{ fontSize: 10, color: C.gold400, textTransform: "uppercase" }}>{post.category}</span>}
                  <p style={{ fontWeight: 700, marginTop: 4, fontSize: 15, lineHeight: 1.3 }}>{lang === "en" ? post.titleEn : (post.titleNp || post.titleEn)}</p>
                  <p style={{ fontSize: 12.5, color: C.ink600, marginTop: 6, lineHeight: 1.5 }}>{(post.excerpt || "").slice(0, 90)}{(post.excerpt || "").length > 90 ? "…" : ""}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* MAP / VISIT US */}
      <ShopLocationSection t={t} lang={lang} dark={dark} />
    </div>
  );
}

function SectionHeading({ title, dark, center }) {
  return (
    <div style={{ textAlign: center ? "center" : "left" }}>
      <h2 className="ss-display" style={{ fontSize: 30, fontWeight: 700, color: dark ? C.ivory50 : C.wine700 }}>{title}</h2>
      {center && <PaisleyDivider dark={dark} />}
      {!center && <div style={{ width: 50, height: 3, background: C.gold400, borderRadius: 2, marginTop: 8 }} />}
    </div>
  );
}

function SpecialOffersSection({ t, lang, dark, offers, products, addComboToCart }) {
  const [selected, setSelected] = useState(null);
  const activeOffers = (offers || []).filter((o) => o.active);
  if (activeOffers.length === 0) return null;
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 10px" }}>
      <SectionHeading title={t.specialOffers} dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, marginTop: 22 }}>
        {activeOffers.map((offer) => {
          const included = (offer.productIds || []).map((pid) => products.find((p) => p.id === pid)).filter(Boolean);
          const originalTotal = included.reduce((s, p) => s + Math.round(p.price * (1 - (p.discount || 0) / 100)), 0);
          const savings = Math.max(0, originalTotal - (offer.comboPrice || 0));
          const themeColor = offer.color || C.wine700;
          return (
            <button key={offer.id} onClick={() => setSelected(offer)} className="ss-btn ss-card"
              style={{
                textAlign: "left", borderRadius: 18, padding: 22, position: "relative", overflow: "hidden",
                background: `linear-gradient(135deg, ${themeColor}, ${C.plum950})`, color: "#fff", border: `1px solid ${C.gold400}55`,
              }}>
              <svg style={{ position: "absolute", inset: 0, opacity: 0.14 }} width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <pattern id={`op-${offer.id}`} width="70" height="70" patternUnits="userSpaceOnUse">
                    <path d="M10 35c0-8 6-14 14-14s14 6 14 14-6 12-12 12c-4 0-7-3-7-7 0-3 2-5 4-5" stroke="#fff" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#op-${offer.id})`} />
              </svg>
              <div style={{ position: "relative" }}>
                <Badge tone="gold">🎉 {t.limitedTime}</Badge>
                <div className="ss-display" style={{ fontSize: 22, fontWeight: 700, marginTop: 12 }}>{lang === "en" ? offer.titleEn : (offer.titleNp || offer.titleEn)}</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6, minHeight: 34 }}>{lang === "en" ? offer.descEn : (offer.descNp || offer.descEn)}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 14 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: C.gold300 }}>{fmtNPR(offer.comboPrice)}</span>
                  {originalTotal > 0 && <span style={{ fontSize: 13, textDecoration: "line-through", opacity: 0.7 }}>{fmtNPR(originalTotal)}</span>}
                </div>
                {savings > 0 && <div style={{ fontSize: 11.5, color: C.gold300, marginTop: 2 }}>{t.youSave} {fmtNPR(savings)}</div>}
                <div className="ss-caption" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff" }}>
                  {t.seeOffer} <ChevronRight size={15} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {selected && (
        <OfferDetailModal offer={selected} t={t} lang={lang} dark={dark} products={products} addComboToCart={addComboToCart} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

function OfferDetailModal({ offer, t, lang, dark, products, addComboToCart, onClose }) {
  const included = (offer.productIds || []).map((pid) => products.find((p) => p.id === pid)).filter(Boolean);
  const originalTotal = included.reduce((s, p) => s + Math.round(p.price * (1 - (p.discount || 0) / 100)), 0);
  const savings = Math.max(0, originalTotal - (offer.comboPrice || 0));
  const themeColor = offer.color || C.wine700;
  return (
    <ModalShell onClose={onClose} dark={dark} width={520}>
      <div style={{ margin: "-24px -24px 18px", padding: "22px 24px", background: `linear-gradient(135deg, ${themeColor}, ${C.plum950})`, color: "#fff", borderRadius: "18px 18px 0 0" }}>
        <Badge tone="gold">🎉 {t.limitedTime}</Badge>
        <h3 className="ss-display" style={{ fontSize: 24, fontWeight: 700, margin: "10px 0 4px" }}>{lang === "en" ? offer.titleEn : (offer.titleNp || offer.titleEn)}</h3>
        <p style={{ fontSize: 13, opacity: 0.9 }}>{lang === "en" ? offer.descEn : (offer.descNp || offer.descEn)}</p>
      </div>
      <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: C.ink600 }}>{t.includes}:</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {included.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ProductImage p={p} size={40} />
            <div style={{ flex: 1, fontSize: 13 }}>{lang === "en" ? p.nameEn : p.nameNp}</div>
            <div style={{ fontSize: 12.5, color: C.ink600 }}>{fmtNPR(Math.round(p.price * (1 - (p.discount || 0) / 100)))}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.gold400}33`, paddingTop: 14 }}>
        <Row label={t.originalPrice} value={fmtNPR(originalTotal)} />
        <Row label={t.comboPrice} value={fmtNPR(offer.comboPrice)} bold />
        {savings > 0 && <div style={{ fontSize: 12.5, color: "#2E9E5B", fontWeight: 600, marginTop: 2 }}>{t.youSave} {fmtNPR(savings)} 🎉</div>}
      </div>
      <button className="ss-btn ss-caption" onClick={() => { addComboToCart(offer.id); onClose(); }}
        style={{ width: "100%", marginTop: 18, background: C.wine700, color: "#fff", padding: 13, borderRadius: 10, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Gift size={16} /> {t.addComboToCart}
      </button>
    </ModalShell>
  );
}

function ProductCard({ p, t, lang, dark, addToCart, onQuickView, reviews, wishlist, toggleWishlist }) {
  const finalPrice = Math.round(p.price * (1 - (p.discount || 0) / 100));
  const name = lang === "en" ? p.nameEn : (p.nameNp || p.nameEn);
  const stats = getRatingStats(p, reviews);
  const isWishlisted = (wishlist || []).includes(p.id);
  return (
    <div className="ss-card ss-fade-in" style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={() => onQuickView && onQuickView(p)}>
        <ProductImage p={p} size={168} square />
        {p.discount > 0 && <div style={{ position: "absolute", top: 10, left: 10 }}><Badge tone="wine">-{p.discount}%</Badge></div>}
        {toggleWishlist && (
          <button
            className="ss-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
            title={lang === "en" ? "Save to wishlist" : "मनपर्ने सूचीमा राख्नुहोस्"}
            style={{
              position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%",
              background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Heart size={15} fill={isWishlisted ? "#E3506D" : "none"} color={isWishlisted ? "#E3506D" : "#fff"} />
          </button>
        )}
        {p.stock === 0 && <div style={{ position: "absolute", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="ss-caption" style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{t.outOfStock}</span>
        </div>}
        {p.stock > 0 && p.stock <= 4 && <div style={{ position: "absolute", bottom: 8, right: 8 }}><Badge tone="rose">{t.lowStock}</Badge></div>}
      </div>
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span className="ss-caption" style={{ fontSize: 10, color: C.gold400, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {CATEGORIES.find((c) => c.id === p.category)?.[lang] || p.category}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, minHeight: 36 }}>{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.ink600 }}>
          <Star size={12} fill={C.gold400} color={C.gold400} /> {stats.count > 0 ? stats.rating : "—"} <span style={{ opacity: 0.6 }}>({stats.count})</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: C.wine700 }}>{fmtNPR(finalPrice)}</span>
          {p.discount > 0 && <span style={{ fontSize: 12, textDecoration: "line-through", color: C.ink600, opacity: 0.6 }}>{fmtNPR(p.price)}</span>}
        </div>
        <button
          className="ss-btn ss-caption" disabled={p.stock === 0} onClick={() => (p.variants?.length ? (onQuickView && onQuickView(p)) : addToCart(p.id))}
          style={{
            marginTop: 6, background: p.stock === 0 ? "#999" : C.wine700, color: "#fff", padding: "9px 12px",
            borderRadius: 10, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            opacity: p.stock === 0 ? 0.6 : 1, cursor: p.stock === 0 ? "not-allowed" : "pointer",
          }}>
          <ShoppingBag size={14} /> {p.variants?.length ? t.selectOptions : t.addToCart}
        </button>
      </div>
    </div>
  );
}

function ShopLocationSection({ t, lang, dark }) {
  return (
    <section style={{ background: dark ? C.plum950 : C.plum950, color: C.ivory50, padding: "56px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 30 }} className="ss-shop-grid">
        <div>
          <SectionHeading title={t.visitUs} dark={true} />
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <InfoRow icon={MapPin} text={`${SHOP.address}, ${SHOP.postal}`} sub={SHOP.landmark} />
            <InfoRow icon={Phone} text={SHOP.phone} />
            <InfoRow icon={Clock} text={t.dailyFrom} />
          </div>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.mapQuery)}`} target="_blank" rel="noopener noreferrer"
            className="ss-btn ss-caption" style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 6, background: C.gold400, color: C.ink900, padding: "11px 20px", borderRadius: 999, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
            <MapPin size={15} /> {t.getDirections}
          </a>
        </div>
        <div style={{ borderRadius: 16, overflow: "hidden", minHeight: 220, border: `1px solid ${C.gold400}44` }}>
          <iframe
            title="shop-map"
            width="100%" height="100%" style={{ minHeight: 220, border: 0 }} loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(SHOP.mapQuery)}&output=embed`}
          />
        </div>
      </div>
      <style>{`@media (max-width: 720px) { .ss-shop-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
function InfoRow({ icon: Icon, text, sub }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <Icon size={17} color={C.gold400} style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 14 }}>{text}</div>
        {sub && <div style={{ fontSize: 12, color: C.ivory100, opacity: 0.7 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ============================================================
   SHOP PAGE
   ============================================================ */
function ShopPage({ t, lang, dark, products, addToCart, initialQuery, reviews, wishlist, toggleWishlist, recordRecentlyViewed, auth, orders, addReview, onRequestLogin }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState(initialQuery || "");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [quickView, setQuickView] = useState(null);
  function openQuickView(p) {
    recordRecentlyViewed && recordRecentlyViewed(p.id);
    setQuickView(p);
  }

  let list = products.filter((p) => (category === "all" || p.category === category))
    .filter((p) => (query ? (p.nameEn + p.nameNp).toLowerCase().includes(query.toLowerCase()) : true))
    .filter((p) => p.price <= maxPrice);
  if (sort === "priceLow") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "priceHigh") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 56px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 26 }} className="ss-shop-layout">
      <aside style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.ink600 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPlaceholder} className="ss-focus"
              style={{ width: "100%", padding: "9px 10px 9px 30px", borderRadius: 10, border: `1px solid ${C.gold400}44`, background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 13, boxSizing: "border-box" }} />
          </div>
        </div>
        <div>
          <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Filter size={13} />{t.allCategories}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <FilterBtn active={category === "all"} label={t.allCategories} onClick={() => setCategory("all")} dark={dark} />
            {CATEGORIES.map((c) => <FilterBtn key={c.id} active={category === c.id} label={`${c.icon} ${lang === "en" ? c.en : c.np}`} onClick={() => setCategory(c.id)} dark={dark} />)}
          </div>
        </div>
        <div>
          <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{t.priceRange}: {fmtNPR(maxPrice)}</div>
          <input type="range" min="200" max="10000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: C.wine700 }} />
        </div>
        <div>
          <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{t.sortBy}</div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="ss-focus"
            style={{ width: "100%", padding: "8px 10px", borderRadius: 10, border: `1px solid ${C.gold400}44`, background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 13 }}>
            <option value="newest">{t.newest}</option>
            <option value="priceLow">{t.priceLowHigh}</option>
            <option value="priceHigh">{t.priceHighLow}</option>
          </select>
        </div>
      </aside>

      <div>
        <SectionHeading title={t.shop} dark={dark} />
        <p className="ss-caption" style={{ fontSize: 12, color: C.ink600, marginTop: 6 }}>{list.length} {lang === "en" ? "items" : "सामानहरू"}</p>
        {list.length === 0 ? (
          <div style={{ padding: 50, textAlign: "center", color: C.ink600 }}>{t.noProducts}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 18 }}>
            {list.map((p) => <ProductCard key={p.id} p={p} t={t} lang={lang} dark={dark} addToCart={addToCart} onQuickView={openQuickView} reviews={reviews} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
          </div>
        )}
      </div>

      {quickView && (
        <QuickViewModal
          p={quickView} t={t} lang={lang} dark={dark} addToCart={addToCart} onClose={() => setQuickView(null)}
          wishlist={wishlist} toggleWishlist={toggleWishlist} reviews={reviews} auth={auth} orders={orders}
          addReview={addReview} onRequestLogin={onRequestLogin}
        />
      )}

      <style>{`@media (max-width: 780px) { .ss-shop-layout { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
function FilterBtn({ active, label, onClick, dark }) {
  return (
    <button className="ss-btn ss-caption" onClick={onClick}
      style={{ textAlign: "left", padding: "8px 10px", borderRadius: 8, fontSize: 13, background: active ? C.wine700 : "transparent", color: active ? "#fff" : (dark ? C.ivory100 : C.ink900), fontWeight: active ? 600 : 400 }}>
      {label}
    </button>
  );
}

function QuickViewModal({ p, t, lang, dark, addToCart, onClose, wishlist, toggleWishlist, reviews, auth, orders, addReview, onRequestLogin }) {
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(p.variants?.length ? null : undefined);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const finalPrice = Math.round(p.price * (1 - (p.discount || 0) / 100));
  const isWishlisted = (wishlist || []).includes(p.id);
  const stats = getRatingStats(p, reviews);
  const productReviews = getProductReviews(reviews, p.id);
  const needsVariant = p.variants?.length > 0;
  const canAdd = p.stock > 0 && (!needsVariant || variant);

  function handleAddToCart() {
    if (!canAdd) return;
    addToCart(p.id, qty, needsVariant ? variant : null);
    onClose();
  }

  function handleSubmitReview() {
    if (!auth.verified) { onRequestLogin && onRequestLogin(); return; }
    if (reviewRating < 1 || !reviewComment.trim()) return;
    const hasPurchased = (orders || []).some((o) => (o.items || []).some((it) => it.id === p.id));
    addReview({
      id: genId("rev"), productId: p.id, email: auth.email,
      name: auth.email.split("@")[0], rating: reviewRating, comment: reviewComment.trim(),
      date: new Date().toISOString(), verified: hasPurchased,
    });
    setReviewSubmitted(true);
    setReviewRating(0);
    setReviewComment("");
  }

  return (
    <ModalShell onClose={onClose} dark={dark} width={620}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", justifyContent: "center", position: "relative" }}>
          <ProductImage p={p} size={180} />
          {toggleWishlist && (
            <button
              className="ss-btn" onClick={() => toggleWishlist(p.id)}
              title={lang === "en" ? "Save to wishlist" : "मनपर्ने सूचीमा राख्नुहोस्"}
              style={{
                position: "absolute", top: 6, right: 6, width: 32, height: 32, borderRadius: "50%",
                background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Heart size={16} fill={isWishlisted ? "#E3506D" : "none"} color={isWishlisted ? "#E3506D" : "#fff"} />
            </button>
          )}
        </div>
        <div style={{ flex: "1 1 240px" }}>
          <span className="ss-caption" style={{ fontSize: 11, color: C.gold400 }}>{CATEGORIES.find((c) => c.id === p.category)?.[lang]}</span>
          <h3 className="ss-display" style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 8px" }}>{lang === "en" ? p.nameEn : p.nameNp}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, marginBottom: 10 }}>
            <Star size={13} fill={C.gold400} color={C.gold400} /> {stats.count > 0 ? stats.rating : "—"} <span style={{ color: C.ink600 }}>({stats.count} {t.verifiedReviews})</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 22, color: C.wine700 }}>{fmtNPR(finalPrice)}</span>
            {p.discount > 0 && <span style={{ textDecoration: "line-through", color: C.ink600, fontSize: 14 }}>{fmtNPR(p.price)}</span>}
          </div>

          {needsVariant && (
            <div style={{ marginBottom: 14 }}>
              <div className="ss-caption" style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{t.selectVariant}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.variants.map((v) => (
                  <button key={v} className="ss-btn ss-caption" onClick={() => setVariant(v)}
                    style={{
                      padding: "7px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                      border: `1.5px solid ${variant === v ? C.wine700 : C.gold400 + "77"}`,
                      background: variant === v ? C.wine700 : "transparent", color: variant === v ? "#fff" : (dark ? C.ivory50 : C.ink900),
                    }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <QtyStepper qty={qty} setQty={setQty} max={p.stock} />
            <span className="ss-caption" style={{ fontSize: 12, color: p.stock <= 4 ? C.rose500 : "#2E9E5B" }}>{p.stock === 0 ? t.outOfStock : p.stock <= 4 ? t.lowStock : t.inStock}</span>
          </div>
          <button className="ss-btn ss-caption" disabled={!canAdd} onClick={handleAddToCart}
            style={{ width: "100%", background: C.wine700, color: "#fff", padding: "12px", borderRadius: 10, fontWeight: 600, fontSize: 14, opacity: canAdd ? 1 : 0.5 }}>
            {needsVariant && !variant ? t.selectVariant : t.addToCart}
          </button>
          <a
            href={whatsappLink(
              lang === "en"
                ? `Hi Shringar Sansar, I'm interested in "${p.nameEn}" (${fmtNPR(finalPrice)}). Is it available?`
                : `नमस्ते श्रृंगार संसार, म "${p.nameNp || p.nameEn}" (${fmtNPR(finalPrice)}) मा जान्न चाहन्छु। के यो उपलब्ध छ?`
            )}
            target="_blank" rel="noopener noreferrer"
            className="ss-btn ss-caption"
            style={{ marginTop: 8, width: "100%", boxSizing: "border-box", background: "#25D366", color: "#fff", padding: "11px", borderRadius: 10, fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}
          >
            <WhatsappIcon size={16} color="#fff" /> {lang === "en" ? "Order via WhatsApp" : "WhatsApp मार्फत अर्डर गर्नुहोस्"}
          </a>
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${C.gold400}33` }}>
        <div className="ss-caption" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t.verifiedReviews} ({stats.count})</div>

        {productReviews.length === 0 ? (
          <p style={{ fontSize: 13, color: C.ink600, marginBottom: 16 }}>{t.noReviewsYet}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18, maxHeight: 220, overflowY: "auto" }} className="ss-scroll">
            {productReviews.map((r) => (
              <div key={r.id} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.gold400}22` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                  {r.verified && <Badge tone="gold"><CircleCheck size={11} /> {t.verifiedPurchase}</Badge>}
                  <span style={{ fontSize: 11, color: C.ink600 }}>{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: "flex", gap: 1, marginBottom: 4 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < r.rating ? C.gold400 : "none"} color={C.gold400} />)}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.5 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {!auth.verified ? (
          <div style={{ background: dark ? C.plum950 : C.ivory100, borderRadius: 10, padding: 12, fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span>{t.loginToReview}</span>
            <button className="ss-btn ss-caption" onClick={onRequestLogin} style={{ background: C.wine700, color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t.login}</button>
          </div>
        ) : reviewSubmitted ? (
          <div style={{ fontSize: 13, color: "#2E9E5B", display: "flex", alignItems: "center", gap: 6 }}><CircleCheck size={15} /> {t.reviewSubmitted}</div>
        ) : (
          <div>
            <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t.writeReview}</div>
            <div style={{ marginBottom: 8 }}>
              <label className="ss-caption" style={{ fontSize: 11, color: C.ink600, display: "block", marginBottom: 4 }}>{t.yourRating}</label>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} className="ss-btn" onMouseEnter={() => setReviewHoverRating(i + 1)} onMouseLeave={() => setReviewHoverRating(0)} onClick={() => setReviewRating(i + 1)} style={{ background: "none", padding: 2 }}>
                    <Star size={22} fill={i < (reviewHoverRating || reviewRating) ? C.gold400 : "none"} color={C.gold400} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="ss-focus" value={reviewComment} onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
              placeholder={t.yourReview} rows={3} maxLength={500}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.gold400}55`, background: dark ? C.plum950 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 13, resize: "vertical", marginBottom: 10 }}
            />
            <button className="ss-btn ss-caption" disabled={reviewRating < 1 || !reviewComment.trim()} onClick={handleSubmitReview}
              style={{ background: C.wine700, color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, opacity: reviewRating < 1 || !reviewComment.trim() ? 0.5 : 1 }}>
              {t.submitReview}
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
function QtyStepper({ qty, setQty, max = 99 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.gold400}55`, borderRadius: 8 }}>
      <button className="ss-btn" onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", padding: "6px 10px" }}><Minus size={13} /></button>
      <span style={{ minWidth: 24, textAlign: "center", fontSize: 14 }}>{qty}</span>
      <button className="ss-btn" onClick={() => setQty(Math.min(max || 99, qty + 1))} style={{ background: "none", padding: "6px 10px" }}><Plus size={13} /></button>
    </div>
  );
}

/* ============================================================
   CHAT WIDGET — floating assistant, answers from CHAT_FAQS
   ============================================================ */
function ChatWidget({ open, onOpen, onClose, lang, dark }) {
  const [messages, setMessages] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && messages === null) {
      setMessages([{ role: "bot", text: getChatReply(lang, "hello") }]);
    }
  }, [open, messages, lang]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, open]);

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...(prev || []), { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const reply = getChatReply(lang, trimmed);
      setMessages((prev) => [...(prev || []), { role: "bot", text: reply }]);
      setTyping(false);
    }, 500 + Math.random() * 400);
  }

  function askQuick(q) {
    sendMessage(lang === "en" ? q.en : q.np);
  }

  return (
    <>
      {!open && (
        <button className="ss-btn" onClick={onOpen} title={lang === "en" ? "Chat with us" : "हामीसँग च्याट गर्नुहोस्"} style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 200, width: 56, height: 56, borderRadius: "50%",
          background: C.wine700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 12px 30px -8px rgba(42,15,29,.55)",
        }}>
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="ss-fade-in" style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 200, width: "min(360px, calc(100vw - 32px))", height: "min(520px, calc(100vh - 100px))",
          background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, borderRadius: 18, overflow: "hidden",
          display: "flex", flexDirection: "column", boxShadow: "0 20px 50px -12px rgba(0,0,0,.5)", border: `1px solid ${C.gold400}44`,
        }}>
          <div style={{ background: C.plum950, color: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: `1px solid ${C.gold400}`, flexShrink: 0 }}>
              <img src="/logo.png" alt="Shringar Sansar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="ss-display" style={{ fontSize: 15, fontWeight: 700 }}>{lang === "en" ? "Shringar Sansar Assistant" : "श्रृंगार संसार सहायक"}</div>
              <div className="ss-caption" style={{ fontSize: 10.5, color: C.gold400, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E9E5B", display: "inline-block" }} /> {lang === "en" ? "Online" : "अनलाइन"}
              </div>
            </div>
            <button className="ss-btn" onClick={onClose} style={{ background: "none", color: "#fff" }}><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="ss-scroll" style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {(messages || []).map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                  background: m.role === "user" ? C.wine700 : (dark ? C.plum950 : C.ivory100), color: m.role === "user" ? "#fff" : (dark ? C.ivory50 : C.ink900),
                  fontSize: 13.5, lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 3px", background: dark ? C.plum950 : C.ivory100, display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold400, display: "inline-block", animation: `ssTypingDot 1.2s ${i * 0.15}s infinite` }} />)}
                </div>
              </div>
            )}
            {(messages || []).length <= 1 && !typing && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {CHAT_QUICK_QUESTIONS.map((q) => (
                  <button key={q.id} className="ss-btn ss-caption" onClick={() => askQuick(q)} style={{
                    textAlign: "left", background: "transparent", border: `1px solid ${C.gold400}66`, color: dark ? C.ivory50 : C.ink900,
                    padding: "8px 12px", borderRadius: 10, fontSize: 12.5,
                  }}>
                    {lang === "en" ? q.en : q.np}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: 12, borderTop: `1px solid ${C.gold400}33`, display: "flex", gap: 8 }}>
            <input
              className="ss-focus" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
              placeholder={lang === "en" ? "Type your question..." : "आफ्नो प्रश्न टाइप गर्नुहोस्..."}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.gold400}55`, background: dark ? C.plum950 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 13.5 }}
            />
            <button className="ss-btn" onClick={() => sendMessage(input)} style={{ background: C.wine700, color: "#fff", width: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ChevronRight size={18} />
            </button>
          </div>
          <style>{`@keyframes ssTypingDot { 0%, 60%, 100% { opacity: .3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }`}</style>
        </div>
      )}
    </>
  );
}

function ModalShell({ children, onClose, dark, width = 480 }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "#0009", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} className="ss-fade-in" style={{ background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, borderRadius: 18, padding: 24, width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto", position: "relative", border: `1px solid ${C.gold400}44` }}>
        <button onClick={onClose} className="ss-btn" aria-label="Close" style={{ position: "absolute", top: 14, right: 14, background: "none", color: dark ? C.ivory50 : C.ink900 }}><X size={18} /></button>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   CART DRAWER + CART PAGE
   ============================================================ */
function CartLineItem({ c, t, lang, dark, setCartQty, removeFromCart }) {
  const price = Math.round(c.product.price * (1 - (c.product.discount || 0) / 100));
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.gold400}22` }}>
      <ProductImage p={c.product} size={56} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {c.product.isCombo && <Badge tone="gold">🎁</Badge>}
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{lang === "en" ? c.product.nameEn : c.product.nameNp}</div>
        </div>
        {c.product.isCombo && c.product.includedProducts?.length > 0 && (
          <div style={{ fontSize: 11, color: C.ink600, marginTop: 2 }}>
            {t.includes}: {c.product.includedProducts.map((p) => lang === "en" ? p.nameEn : p.nameNp).join(", ")}
          </div>
        )}
        {c.variant && <div style={{ fontSize: 11, color: C.ink600, marginTop: 2 }}>{lang === "en" ? "Size" : "साइज"}: {c.variant}</div>}
        <div style={{ fontSize: 13, color: C.wine700, fontWeight: 700, marginTop: 2 }}>{fmtNPR(price)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
          <QtyStepper qty={c.qty} setQty={(q) => setCartQty(c.id, c.variant, q)} max={c.product.stock} />
          <button className="ss-btn ss-caption" onClick={() => removeFromCart(c.id, c.variant)} style={{ background: "none", color: C.ink600, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
            <Trash2 size={12} /> {t.remove}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, t, lang, dark, cartDetailed, setCartQty, removeFromCart, subtotal, go }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-hidden={!open} style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "min(380px, 100%)", zIndex: 250,
      background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, boxShadow: "-10px 0 30px -10px #0006",
      transform: open ? "translateX(0)" : "translateX(105%)", transition: "transform .3s ease", display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.gold400}33` }}>
        <span className="ss-display" style={{ fontSize: 19, fontWeight: 700 }}>{t.yourCart}</span>
        <button className="ss-btn" onClick={onClose} aria-label="Close" style={{ background: "none", color: "inherit" }}><X size={18} /></button>
      </div>
      <div className="ss-scroll" style={{ flex: 1, overflowY: "auto", padding: "0 18px" }}>
        {cartDetailed.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: C.ink600 }}>
            <ShoppingBag size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div>{t.emptyCart}</div>
          </div>
        ) : cartDetailed.map((c) => <CartLineItem key={c.id + (c.variant || "")} c={c} t={t} lang={lang} dark={dark} setCartQty={setCartQty} removeFromCart={removeFromCart} />)}
      </div>
      {cartDetailed.length > 0 && (
        <div style={{ padding: 18, borderTop: `1px solid ${C.gold400}33` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 14 }}>
            <span>{t.subtotal}</span><span style={{ fontWeight: 700 }}>{fmtNPR(subtotal)}</span>
          </div>
          <button className="ss-btn ss-caption" onClick={() => { onClose(); go("checkout"); }} style={{ width: "100%", background: C.wine700, color: "#fff", padding: 13, borderRadius: 10, fontWeight: 600, fontSize: 14 }}>{t.checkout}</button>
        </div>
      )}
    </div>
  );
}

function CartPage({ t, lang, dark, cartDetailed, setCartQty, removeFromCart, subtotal, go }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px 56px" }}>
      <SectionHeading title={t.yourCart} dark={dark} />
      <div style={{ marginTop: 20 }}>
        {cartDetailed.length === 0 ? (
          <div style={{ padding: 50, textAlign: "center", color: C.ink600 }}>
            <ShoppingBag size={40} style={{ opacity: 0.4, marginBottom: 10 }} />
            <p>{t.emptyCart}</p>
            <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ marginTop: 14, background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{t.continueShopping}</button>
          </div>
        ) : (
          <>
            {cartDetailed.map((c) => <CartLineItem key={c.id + (c.variant || "")} c={c} t={t} lang={lang} dark={dark} setCartQty={setCartQty} removeFromCart={removeFromCart} />)}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 700, marginTop: 18 }}>
              <span>{t.subtotal}</span><span>{fmtNPR(subtotal)}</span>
            </div>
            <button className="ss-btn ss-caption" onClick={() => go("checkout")} style={{ marginTop: 16, width: "100%", background: C.wine700, color: "#fff", padding: 14, borderRadius: 10, fontWeight: 600, fontSize: 15 }}>{t.checkout}</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   LOGIN / EMAIL VERIFICATION
   ============================================================ */
function LoginModal({ t, lang, dark, onClose, onVerified }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [sending, setSending] = useState(false);

  async function sendCode() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(lang === "en" ? "Please enter a valid email." : "मान्य इमेल राख्नुहोस्।"); return; }
    setError("");
    setSending(true);
    const code4 = String(Math.floor(1000 + Math.random() * 9000));
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_email: email, code: code4 },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setSentCode(code4);
      setStep(2);
    } catch (err) {
      setError(lang === "en" ? "Couldn't send the email. Please check the address and try again." : "इमेल पठाउन सकिएन। ठेगाना जाँच गरी फेरि प्रयास गर्नुहोस्।");
    } finally {
      setSending(false);
    }
  }
  function verify() {
    if (code === sentCode) {
      onVerified(email);
    } else {
      setAttempts((a) => a + 1);
      setError(t.wrongCode);
      if (attempts >= 4) { setError(lang === "en" ? "Too many attempts. Closing." : "धेरै प्रयास भयो। बन्द हुँदैछ।"); setTimeout(onClose, 1400); }
    }
  }

  return (
    <ModalShell onClose={onClose} dark={dark} width={400}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.wine700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
          {step === 1 ? <Mail size={20} color="#fff" /> : <Lock size={20} color="#fff" />}
        </div>
        <h3 className="ss-display" style={{ fontSize: 20, fontWeight: 700 }}>{t.login}</h3>
      </div>

      {step === 1 && (
        <div>
          <label className="ss-caption" style={{ fontSize: 12, fontWeight: 600 }}>{t.enterEmail}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="ss-focus"
            style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 10, border: `1px solid ${C.gold400}55`, marginTop: 6, marginBottom: 8, background: dark ? C.plum950 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 14 }} />
          {error && <div style={{ color: "#D14343", fontSize: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} />{error}</div>}
          <button className="ss-btn ss-caption" onClick={sendCode} disabled={sending} style={{ width: "100%", background: C.wine700, color: "#fff", padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 14, opacity: sending ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {sending && <RefreshCw size={14} className="ss-spin" />} {sending ? (lang === "en" ? "Sending..." : "पठाइँदैछ...") : t.sendCode}
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <p style={{ fontSize: 13, textAlign: "center", marginBottom: 14, color: C.ink600 }}>
            {lang === "en" ? "We sent a code to " : "कोड यहाँ पठाइयो: "}<strong>{email}</strong>
          </p>
          <label className="ss-caption" style={{ fontSize: 12, fontWeight: 600 }}>{t.enterCode}</label>
          <input value={code} maxLength={4} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="ss-focus"
            style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 10, border: `1px solid ${C.gold400}55`, marginTop: 6, marginBottom: 8, fontSize: 20, letterSpacing: "0.4em", textAlign: "center", background: dark ? C.plum950 : "#fff", color: dark ? C.ivory50 : C.ink900 }} />
          {error && <div style={{ color: "#D14343", fontSize: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}><AlertCircle size={12} />{error}</div>}
          <button className="ss-btn ss-caption" onClick={verify} style={{ width: "100%", background: C.wine700, color: "#fff", padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 14 }}>{t.verify}</button>
        </div>
      )}
    </ModalShell>
  );
}

/* ============================================================
   CHECKOUT FLOW
   ============================================================ */
function Stepper({ steps, current, dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 30, flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: i <= current ? C.wine700 : (dark ? C.plum900 : C.ivory100), color: i <= current ? "#fff" : C.ink600, fontSize: 12, fontWeight: 700,
              border: i <= current ? "none" : `1px solid ${C.gold400}55`,
            }}>{i < current ? <Check size={13} /> : i + 1}</div>
            <span className="ss-caption" style={{ fontSize: 12, fontWeight: 600, color: i <= current ? (dark ? C.ivory50 : C.ink900) : C.ink600 }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ width: 24, height: 1, background: C.gold400 + "77" }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function CheckoutFlow({ t, lang, dark, cartDetailed, subtotal, auth, setLoginOpen, go, onOrderPlaced, coupons }) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: "", phone: "", province: "Bagmati", district: "", municipality: "", ward: "", landmark: "" });
  const [addressErrors, setAddressErrors] = useState({});
  const [payment, setPayment] = useState("esewa");
  const [proofFile, setProofFile] = useState(null);
  const [proofName, setProofName] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const isValley = address.province === "Bagmati";
  const deliveryFee = cartDetailed.length ? (isValley ? 100 : 250) : 0;
  const codHandling = payment === "cod" && !isValley ? 150 : 0;
  const couponDiscount = appliedCoupon
    ? (appliedCoupon.type === "percent" ? Math.round(subtotal * (appliedCoupon.value / 100)) : Math.min(appliedCoupon.value, subtotal))
    : 0;
  const total = Math.max(0, subtotal - couponDiscount) + deliveryFee + codHandling;

  function applyCoupon() {
    setCouponError("");
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = (coupons || []).find((c) => c.code === code);
    if (!found || !found.active) { setCouponError(t.couponInvalid); return; }
    if (found.expiry && new Date(found.expiry) < new Date()) { setCouponError(t.couponExpired); return; }
    if (found.minOrder && subtotal < found.minOrder) { setCouponError(t.couponMinOrder.replace("{min}", fmtNPR(found.minOrder))); return; }
    setAppliedCoupon(found);
    setCouponInput("");
  }
  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponError("");
  }

  if (cartDetailed.length === 0 && !confirmedOrder) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <ShoppingBag size={40} style={{ opacity: 0.4, marginBottom: 10 }} />
        <p>{t.emptyCart}</p>
        <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ marginTop: 14, background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{t.continueShopping}</button>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "50px 20px 70px" }}>
        <div className="ss-fade-in" style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#2E9E5B22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <CircleCheck size={30} color="#2E9E5B" />
          </div>
          <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700 }}>{t.orderConfirmed}</h2>
        </div>
        <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}44`, borderRadius: 16, padding: 22 }}>
          <Row label={t.orderId} value={confirmedOrder.id} bold />
          <Row label={t.fullName} value={confirmedOrder.address.fullName} />
          <Row label={t.step2} value={`${confirmedOrder.address.municipality}-${confirmedOrder.address.ward}, ${confirmedOrder.address.district}, ${confirmedOrder.address.province}`} />
          <Row label={t.paymentMethod} value={confirmedOrder.paymentLabel} />
          {confirmedOrder.couponDiscount > 0 && <Row label={`${t.discount} (${confirmedOrder.couponCode})`} value={`− ${fmtNPR(confirmedOrder.couponDiscount)}`} />}
          <Row label={t.total} value={fmtNPR(confirmedOrder.total)} bold />
          {confirmedOrder.payment !== "esewa" && (
            <div style={{ marginTop: 12, background: C.gold400 + "22", border: `1px dashed ${C.gold400}`, borderRadius: 10, padding: 10, fontSize: 12.5, display: "flex", gap: 6 }}>
              <AlertCircle size={14} color={C.gold400} style={{ flexShrink: 0, marginTop: 1 }} /> {t.pendingVerification}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          <button className="ss-btn ss-caption" onClick={() => go("orders")} style={{ flex: 1, background: C.wine700, color: "#fff", padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 13 }}>{t.myOrders}</button>
          <button className="ss-btn ss-caption" onClick={() => go("home")} style={{ flex: 1, background: "transparent", border: `1px solid ${C.gold400}`, color: dark ? C.ivory50 : C.ink900, padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 13 }}>{t.backToHome}</button>
        </div>
      </div>
    );
  }

  function next() {
    if (step === 0) {
      if (!auth.verified) { setLoginOpen(true); return; }
      setStep(1); return;
    }
    if (step === 1) {
      const errs = {};
      if (!NAME_REGEX.test(address.fullName.trim())) {
        errs.fullName = lang === "en" ? "Enter your real full name (first and last name)." : "आफ्नो पूरा नाम राख्नुहोस् (नाम र थर)।";
      }
      if (!PHONE_REGEX.test(address.phone.trim())) {
        errs.phone = lang === "en" ? "Enter a valid 10-digit Nepali mobile number." : "मान्य १० अंकको नेपाली मोबाइल नम्बर राख्नुहोस्।";
      }
      if (!address.district) {
        errs.district = lang === "en" ? "Please select your district." : "कृपया आफ्नो जिल्ला छान्नुहोस्।";
      }
      if (!address.ward) {
        errs.ward = lang === "en" ? "Please select your ward." : "कृपया आफ्नो वडा छान्नुहोस्।";
      }
      if (!address.municipality.trim()) {
        errs.municipality = lang === "en" ? "Enter your municipality or rural municipality name." : "आफ्नो नगरपालिका वा गाउँपालिकाको नाम राख्नुहोस्।";
      }
      setAddressErrors(errs);
      if (Object.keys(errs).length > 0) return;
      setStep(2); return;
    }
    if (step === 2) {
      const order = {
        id: genId("SS"),
        date: new Date().toISOString(),
        email: auth.email,
        items: cartDetailed.map((c) => ({ id: c.id, name: c.product.nameEn, qty: c.qty, price: c.product.price })),
        address, payment, paymentLabel: payment === "esewa" ? t.esewa : payment === "bank" ? t.bank : t.cod,
        paymentProof: payment === "bank" ? proofFile : null,
        couponCode: appliedCoupon?.code || null, couponDiscount,
        subtotal, deliveryFee, codHandling, total,
        status: "pending",
      };
      setConfirmedOrder(order);
      onOrderPlaced(order, appliedCoupon);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 70px" }}>
      <Stepper steps={[t.step1, t.step2, t.step3]} current={step} dark={dark} />

      {step === 0 && (
        <div className="ss-fade-in">
          <SectionHeading title={t.yourCart} dark={dark} />
          <div style={{ marginTop: 16 }}>
            {cartDetailed.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.gold400}22`, fontSize: 14 }}>
                <span>{lang === "en" ? c.product.nameEn : c.product.nameNp} × {c.qty}</span>
                <span style={{ fontWeight: 600 }}>{fmtNPR(Math.round(c.product.price * (1 - (c.product.discount || 0) / 100)) * c.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 700, fontSize: 16 }}>
              <span>{t.subtotal}</span><span>{fmtNPR(subtotal)}</span>
            </div>
          </div>
          {!auth.verified && (
            <div style={{ marginTop: 16, background: C.rose300 + "33", border: `1px solid ${C.rose500}`, borderRadius: 10, padding: 12, fontSize: 13, display: "flex", gap: 8 }}>
              <AlertCircle size={16} color={C.rose500} style={{ flexShrink: 0 }} /> {t.verifyRequired}
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="ss-fade-in">
          <div style={{ marginBottom: 12 }}><Badge tone="wine"><Truck size={12} /> {t.deliversAll}</Badge></div>
          <FormRow label={t.fullName}>
            <input className="ss-focus" style={inputStyle(dark)} value={address.fullName} placeholder={lang === "en" ? "e.g. Priya Sharma" : "जस्तै प्रिया शर्मा"} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
            {addressErrors.fullName && <div style={fieldErrorStyle}><AlertCircle size={11} /> {addressErrors.fullName}</div>}
          </FormRow>
          <FormRow label={t.phoneNumber}>
            <input className="ss-focus" style={inputStyle(dark)} value={address.phone} maxLength={10} placeholder="98XXXXXXXX" onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
            {addressErrors.phone && <div style={fieldErrorStyle}><AlertCircle size={11} /> {addressErrors.phone}</div>}
          </FormRow>
          <FormRow label={t.selectProvince}>
            <select className="ss-focus" style={inputStyle(dark)} value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value, district: "" })}>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormRow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormRow label={t.district}>
              <select className="ss-focus" style={inputStyle(dark)} value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value, municipality: "" })}>
                <option value="">{lang === "en" ? "Select district" : "जिल्ला छान्नुहोस्"}</option>
                {(PROVINCE_DISTRICTS[address.province] || []).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {addressErrors.district && <div style={fieldErrorStyle}><AlertCircle size={11} /> {addressErrors.district}</div>}
            </FormRow>
            <FormRow label={t.ward}>
              <select className="ss-focus" style={inputStyle(dark)} value={address.ward} onChange={(e) => setAddress({ ...address, ward: e.target.value })}>
                <option value="">{lang === "en" ? "Select ward" : "वडा छान्नुहोस्"}</option>
                {Array.from({ length: 33 }, (_, i) => i + 1).map((w) => <option key={w} value={w}>{lang === "en" ? "Ward" : "वडा"} {w}</option>)}
              </select>
              {addressErrors.ward && <div style={fieldErrorStyle}><AlertCircle size={11} /> {addressErrors.ward}</div>}
            </FormRow>
          </div>
          <FormRow label={t.municipality}>
            {(() => {
              const localBodies = getLocalBodies(address.district);
              if (localBodies.length > 0) {
                return (
                  <select className="ss-focus" style={inputStyle(dark)} value={address.municipality} onChange={(e) => setAddress({ ...address, municipality: e.target.value })}>
                    <option value="">{lang === "en" ? "Select municipality / rural municipality" : "नगरपालिका / गाउँपालिका छान्नुहोस्"}</option>
                    {localBodies.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                );
              }
              return (
                <input className="ss-focus" style={inputStyle(dark)} value={address.municipality} placeholder={lang === "en" ? "e.g. Bharatpur Metropolitan City" : "जस्तै भरतपुर महानगरपालिका"} onChange={(e) => setAddress({ ...address, municipality: e.target.value })} />
              );
            })()}
            {addressErrors.municipality && <div style={fieldErrorStyle}><AlertCircle size={11} /> {addressErrors.municipality}</div>}
          </FormRow>
          <FormRow label={t.landmark}><input className="ss-focus" style={inputStyle(dark)} value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} /></FormRow>
          <div style={{ marginTop: 6, fontSize: 12.5, color: isValley ? "#2E9E5B" : C.ink600, display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={13} /> {isValley ? t.fasterDelivery : t.standardDelivery}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="ss-fade-in">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PaymentOption id="esewa" selected={payment} onSelect={setPayment} icon={QrCode} label={t.esewa} dark={dark} />
            {payment === "esewa" && (
              <div style={{ textAlign: "center", padding: 16, background: dark ? C.plum950 : C.ivory100, borderRadius: 12 }}>
                <div style={{ width: 140, height: 140, margin: "0 auto", background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.gold400}` }}>
                  <QrCode size={90} color={C.plum950} />
                </div>
                <p style={{ fontSize: 12, marginTop: 8, color: C.ink600 }}>{lang === "en" ? "Scan with eSewa app to pay" : "eSewa एपबाट स्क्यान गरी भुक्तानी गर्नुहोस्"} — {fmtNPR(total)}</p>
              </div>
            )}
            <PaymentOption id="bank" selected={payment} onSelect={setPayment} icon={Banknote} label={t.bank} dark={dark} />
            {payment === "bank" && (
              <div style={{ padding: 14, background: dark ? C.plum950 : C.ivory100, borderRadius: 12, fontSize: 13 }}>
                <p style={{ marginBottom: 8 }}>NIC Asia Bank · Shringar Sansar · A/C 0123-456-7890</p>
                <label className="ss-btn ss-caption" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.wine700, color: "#fff", padding: "9px 14px", borderRadius: 8, fontSize: 12.5, cursor: "pointer" }}>
                  <Upload size={13} /> {t.uploadProof}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProofName(file.name);
                    try {
                      const dataUrl = await resizeImageFile(file, 700);
                      setProofFile(dataUrl);
                    } catch (err) { /* ignore */ }
                  }} />
                </label>
                {proofName && <span style={{ marginLeft: 8, fontSize: 12, color: "#2E9E5B" }}><Check size={12} style={{ verticalAlign: "middle" }} /> {proofName}</span>}
              </div>
            )}
            <PaymentOption id="cod" selected={payment} onSelect={setPayment} icon={Package} label={t.cod} dark={dark} />
            {payment === "cod" && !isValley && (
              <div style={{ fontSize: 12.5, color: C.rose500, display: "flex", gap: 6, alignItems: "center" }}><AlertCircle size={13} /> {t.codOutside} (+{fmtNPR(150)})</div>
            )}
          </div>

          <div style={{ marginTop: 18 }}>
            {appliedCoupon ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#2E9E5B18", border: "1px solid #2E9E5B55", borderRadius: 10, padding: "10px 12px" }}>
                <span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <Tag size={13} color="#2E9E5B" /> <strong style={{ fontFamily: "monospace" }}>{appliedCoupon.code}</strong> — {t.couponApplied}
                </span>
                <button className="ss-btn ss-caption" onClick={removeCoupon} style={{ background: "none", color: C.rose500, fontSize: 12 }}>{t.couponRemove}</button>
              </div>
            ) : (
              <div>
                <label className="ss-caption" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>{t.haveCoupon}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="ss-focus" style={{ ...inputStyle(dark), textTransform: "uppercase" }} value={couponInput} placeholder={t.couponCode}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }} onKeyDown={(e) => e.key === "Enter" && applyCoupon()} />
                  <button className="ss-btn ss-caption" onClick={applyCoupon} style={{ background: C.wine700, color: "#fff", padding: "0 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{t.applyCoupon}</button>
                </div>
                {couponError && <div style={fieldErrorStyle}><AlertCircle size={11} /> {couponError}</div>}
              </div>
            )}
          </div>

          <div style={{ marginTop: 20, borderTop: `1px solid ${C.gold400}33`, paddingTop: 14 }}>
            <Row label={t.subtotal} value={fmtNPR(subtotal)} />
            {couponDiscount > 0 && <Row label={`${t.discount} (${appliedCoupon.code})`} value={`− ${fmtNPR(couponDiscount)}`} />}
            <Row label={t.deliveryFee} value={fmtNPR(deliveryFee)} />
            {codHandling > 0 && <Row label={t.cod} value={fmtNPR(codHandling)} />}
            <Row label={t.total} value={fmtNPR(total)} bold />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
        {step > 0 && <button className="ss-btn" onClick={() => setStep(step - 1)} style={{ background: "none", border: `1px solid ${C.gold400}55`, color: dark ? C.ivory50 : C.ink900, padding: "12px 16px", borderRadius: 10, display: "flex", alignItems: "center", gap: 6 }}><ArrowLeft size={15} /></button>}
        <button className="ss-btn ss-caption" onClick={next} style={{ flex: 1, background: C.wine700, color: "#fff", padding: 13, borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
          {step === 2 ? t.placeOrder : lang === "en" ? "Continue" : "अगाडि बढ्नुहोस्"}
        </button>
      </div>
    </div>
  );
}
function inputStyle(dark) {
  return { width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 9, border: `1px solid ${C.gold400}55`, background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 13.5 };
}
const fieldErrorStyle = { color: "#D14343", fontSize: 11.5, marginTop: 4, display: "flex", alignItems: "center", gap: 4 };
function FormRow({ label, children }) {
  const id = useId();
  const child = React.isValidElement(children) && !children.props.id
    ? React.cloneElement(children, { id, "aria-label": typeof label === "string" ? label : undefined })
    : children;
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={React.isValidElement(children) ? id : undefined} className="ss-caption" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>{label}</label>
      {child}
    </div>
  );
}
function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: bold ? 16 : 13.5, fontWeight: bold ? 700 : 400 }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
function PaymentOption({ id, selected, onSelect, icon: Icon, label, dark }) {
  const active = selected === id;
  return (
    <button className="ss-btn" onClick={() => onSelect(id)} style={{
      display: "flex", alignItems: "center", gap: 10, padding: 14, borderRadius: 12,
      border: `1.5px solid ${active ? C.wine700 : C.gold400 + "44"}`, background: active ? C.wine700 + "18" : (dark ? C.plum900 : "#fff"), textAlign: "left",
    }}>
      <Icon size={18} color={active ? C.wine700 : C.ink600} />
      <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{label}</span>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${active ? C.wine700 : C.gold400 + "77"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.wine700 }} />}
      </div>
    </button>
  );
}

/* ============================================================
   ORDERS PAGE
   ============================================================ */
function WishlistPage({ t, lang, dark, products, wishlist, toggleWishlist, reviews, addToCart, go }) {
  const items = (wishlist || []).map((id) => products.find((p) => p.id === id)).filter(Boolean);
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 56px" }}>
      <SectionHeading title={t.wishlist} dark={dark} />
      {items.length === 0 ? (
        <div style={{ padding: 50, textAlign: "center", color: C.ink600 }}>
          <Heart size={40} style={{ opacity: 0.4, marginBottom: 10 }} />
          <p>{t.emptyWishlist}</p>
          <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ marginTop: 14, background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{t.shopNow}</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 22 }}>
          {items.map((p) => <ProductCard key={p.id} p={p} t={t} lang={lang} dark={dark} addToCart={addToCart} reviews={reviews} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
        </div>
      )}
    </div>
  );
}

function OrdersPage({ t, lang, dark, orders, updateOrderStatus, auth, go, showToast }) {
  const statusColor = { pending: C.gold400, processing: "#3E7CB1", shipped: "#8355C9", delivered: "#2E9E5B", cancelled: "#D14343" };
  const statusLabel = { pending: t.pending, processing: t.processing, shipped: t.shipped, delivered: t.delivered, cancelled: t.cancelled };
  const [confirmingId, setConfirmingId] = useState(null);
  const cancellableStatuses = ["pending", "processing"];
  // Only show this customer's own orders — "orders" holds every customer's
  // orders shared across devices, so this must be filtered by their email.
  const myOrders = orders.filter((o) => o.email && auth?.email && o.email === auth.email);

  function cancelOrder(id) {
    updateOrderStatus(id, "cancelled");
    setConfirmingId(null);
    showToast && showToast(t.orderCancelledToast);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px 60px" }}>
      <SectionHeading title={t.myOrders} dark={dark} />
      {myOrders.length === 0 ? (
        <div style={{ padding: 50, textAlign: "center", color: C.ink600 }}>
          <Package size={36} style={{ opacity: 0.4, marginBottom: 10 }} />
          <p>{lang === "en" ? "No orders yet." : "अहिलेसम्म कुनै अर्डर छैन।"}</p>
          <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ marginTop: 12, background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{t.shopNow}</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
          {myOrders.map((o) => {
            const canCancel = cancellableStatuses.includes(o.status);
            const isConfirming = confirmingId === o.id;
            return (
              <div key={o.id} style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                  <span className="ss-caption" style={{ fontWeight: 700, fontSize: 13 }}>{o.id}</span>
                  <Badge tone="ghost"><span style={{ color: statusColor[o.status] }}>● {statusLabel[o.status]}</span></Badge>
                </div>
                <div style={{ fontSize: 12, color: C.ink600, marginBottom: 8 }}>{new Date(o.date).toLocaleString()}</div>
                {o.items.map((it, i) => <div key={i} style={{ fontSize: 13, display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span>{it.name} × {it.qty}</span><span>{fmtNPR(it.price * it.qty)}</span></div>)}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, marginTop: 8, borderTop: `1px solid ${C.gold400}22`, paddingTop: 8 }}>
                  <span>{t.total}</span><span>{fmtNPR(o.total)}</span>
                </div>

                {isConfirming ? (
                  <div className="ss-fade-in" style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gold400}22` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{t.confirmCancelTitle}</div>
                    <div style={{ fontSize: 12.5, color: C.ink600, marginBottom: 10 }}>{t.confirmCancelBody}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="ss-btn ss-caption" onClick={() => setConfirmingId(null)} style={{ flex: 1, background: "none", border: `1px solid ${C.gold400}55`, padding: "9px", borderRadius: 9, fontSize: 12.5, color: dark ? C.ivory50 : C.ink900 }}>{t.keepOrder}</button>
                      <button className="ss-btn ss-caption" onClick={() => cancelOrder(o.id)} style={{ flex: 1, background: "#D14343", color: "#fff", padding: "9px", borderRadius: 9, fontSize: 12.5, fontWeight: 600 }}>{t.yesCancelOrder}</button>
                    </div>
                  </div>
                ) : canCancel ? (
                  <button className="ss-btn ss-caption" onClick={() => setConfirmingId(o.id)}
                    style={{ marginTop: 12, background: "none", border: `1px solid #D1434366`, color: "#D14343", padding: "8px 16px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <X size={13} /> {t.cancelOrder}
                  </button>
                ) : o.status !== "cancelled" && (
                  <div style={{ marginTop: 10, fontSize: 11.5, color: C.ink600, display: "flex", alignItems: "center", gap: 5 }}>
                    <AlertCircle size={12} /> {t.cannotCancelNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ABOUT / CONTACT
   ============================================================ */
function NotFoundPage({ t, lang, dark, go }) {
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "70px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 50, marginBottom: 12 }}>🔍</div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: dark ? C.ivory50 : C.wine700 }}>
        {lang === "en" ? "Page not found" : "पृष्ठ फेला परेन"}
      </h2>
      <p style={{ fontSize: 14, color: C.ink600, marginBottom: 20 }}>
        {lang === "en" ? "Sorry, we couldn't find what you were looking for." : "माफ गर्नुहोस्, तपाईंले खोजेको कुरा फेला परेन।"}
      </p>
      <button className="ss-btn ss-caption" onClick={() => go("home")} style={{ background: C.wine700, color: "#fff", padding: "11px 24px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
        {t.backToHome}
      </button>
    </div>
  );
}

function BlogPage({ t, lang, dark, posts, initialPostId }) {
  const [selectedId, setSelectedId] = useState(initialPostId || null);
  const published = (posts || []).filter((p) => p.published).sort((a, b) => new Date(b.date) - new Date(a.date));
  const selected = published.find((p) => p.id === selectedId);

  if (selected) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 60px" }}>
        <button className="ss-btn ss-caption" onClick={() => setSelectedId(null)} style={{ background: "none", color: C.wine700, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
          <ArrowLeft size={14} /> {t.backToBlog}
        </button>
        {selected.image && <img src={selected.image} alt="" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 16, marginBottom: 20 }} />}
        {selected.category && <span className="ss-caption" style={{ fontSize: 11, color: C.gold400, textTransform: "uppercase" }}>{selected.category}</span>}
        <h1 className="ss-display" style={{ fontSize: 28, fontWeight: 700, margin: "6px 0 8px" }}>{lang === "en" ? selected.titleEn : (selected.titleNp || selected.titleEn)}</h1>
        <p style={{ fontSize: 12.5, color: C.ink600, marginBottom: 20 }}>{new Date(selected.date).toLocaleDateString()}</p>
        <div style={{ fontSize: 15.5, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
          {lang === "en" ? selected.contentEn : (selected.contentNp || selected.contentEn)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
      <SectionHeading title={t.blog} dark={dark} />
      {published.length === 0 ? (
        <div style={{ padding: 50, textAlign: "center", color: C.ink600 }}>{t.noPostsYet}</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18, marginTop: 22 }}>
          {published.map((post) => (
            <button key={post.id} onClick={() => setSelectedId(post.id)} className="ss-card" style={{
              textAlign: "left", background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
            }}>
              {post.image ? (
                <img src={post.image} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 150, background: `linear-gradient(135deg, ${C.wine700}, ${C.plum950})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📖</div>
              )}
              <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column" }}>
                {post.category && <span className="ss-caption" style={{ fontSize: 10, color: C.gold400, textTransform: "uppercase" }}>{post.category}</span>}
                <p style={{ fontWeight: 700, marginTop: 4, fontSize: 15.5, lineHeight: 1.35 }}>{lang === "en" ? post.titleEn : (post.titleNp || post.titleEn)}</p>
                <p style={{ fontSize: 12.5, color: C.ink600, marginTop: 8, lineHeight: 1.5, flex: 1 }}>{(post.excerpt || "").slice(0, 110)}{(post.excerpt || "").length > 110 ? "…" : ""}</p>
                <p className="ss-caption" style={{ fontSize: 11.5, color: C.wine700, fontWeight: 600, marginTop: 10 }}>{t.readMore} →</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReturnPolicyPage({ t, lang, dark }) {
  const sections = lang === "en" ? [
    { h: "Return Window", b: "If something isn't right, let us know within 3 days of delivery. Items must be unused, unworn, and in their original packaging with tags attached." },
    { h: "How to Start a Return", b: `Message us on WhatsApp (${SHOP.phone}) with your Order ID and the reason for return. We'll guide you through drop-off or pickup depending on your location.` },
    { h: "Refunds", b: "Once we receive and inspect the returned item, refunds are issued to the original payment method (or as store credit, your choice) within 5-7 business days." },
    { h: "Exchanges", b: "Want a different size or variant instead? Let us know when you reach out — we'll arrange an exchange wherever stock allows." },
    { h: "Non-Returnable Items", b: "For hygiene reasons, cosmetics and any custom or made-to-order pieces cannot be returned unless they arrive damaged or defective." },
    { h: "Damaged or Wrong Items", b: "If your order arrives damaged or isn't what you ordered, contact us immediately with photos — we'll make it right at no extra cost to you." },
  ] : [
    { h: "फिर्ता अवधि", b: "केही ठीक नभएमा, डेलिभरीको ३ दिनभित्र हामीलाई जानकारी दिनुहोस्। सामान प्रयोग नगरिएको, नलगाइएको, र मूल प्याकेजिङ र ट्यागसहित हुनुपर्छ।" },
    { h: "फिर्ता कसरी सुरु गर्ने", b: `आफ्नो अर्डर आईडी र फिर्ताको कारणसहित हामीलाई WhatsApp (${SHOP.phone}) मा म्यासेज गर्नुहोस्। तपाईंको स्थान अनुसार हामी ड्रप-अफ वा पिकअपको लागि मार्गदर्शन गर्नेछौं।` },
    { h: "फिर्ता रकम", b: "फिर्ता गरिएको सामान प्राप्त र जाँच गरेपछि, ५-७ कार्य दिनभित्र मूल भुक्तानी विधिमा (वा तपाईंको छनोटमा स्टोर क्रेडिटको रूपमा) रकम फिर्ता गरिन्छ।" },
    { h: "साटासाट", b: "फरक साइज वा विकल्प चाहनुहुन्छ? सम्पर्क गर्दा हामीलाई भन्नुहोस् — स्टक भएसम्म हामी साटासाट मिलाउनेछौं।" },
    { h: "फिर्ता नहुने सामानहरू", b: "स्वच्छताका कारण, सौन्दर्य सामान र कुनै पनि अनुकूलित सामान क्षतिग्रस्त वा त्रुटिपूर्ण भई आएको बाहेक फिर्ता हुँदैन।" },
    { h: "क्षतिग्रस्त वा गलत सामान", b: "तपाईंको अर्डर क्षतिग्रस्त भई आएमा वा तपाईंले अर्डर गरेको नभएमा, फोटोसहित तुरुन्त हामीलाई सम्पर्क गर्नुहोस् — हामी कुनै अतिरिक्त शुल्क बिना यसलाई सच्याउनेछौं।" },
  ];
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px 60px" }}>
      <SectionHeading title={t.returnPolicy} dark={dark} />
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s, i) => (
          <div key={i}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: dark ? C.ivory50 : C.wine700 }}>{s.h}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: dark ? C.ivory100 : C.ink900 }}>{s.b}</p>
          </div>
        ))}
      </div>
      <a href={whatsappLink(lang === "en" ? "Hi Shringar Sansar, I'd like to start a return/exchange for my order." : "नमस्ते श्रृंगार संसार, म मेरो अर्डरको फिर्ता/साटासाट सुरु गर्न चाहन्छु।")}
        target="_blank" rel="noopener noreferrer" className="ss-btn ss-caption"
        style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "12px 22px", borderRadius: 999, fontWeight: 600, fontSize: 13.5, textDecoration: "none" }}>
        <WhatsappIcon size={16} color="#fff" /> {lang === "en" ? "Start a Return via WhatsApp" : "WhatsApp मार्फत फिर्ता सुरु गर्नुहोस्"}
      </a>
    </div>
  );
}

function AboutPage({ t, lang, dark }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 60px" }}>
      <SectionHeading title={t.ourStory} dark={dark} center />
      <p style={{ fontSize: 16, lineHeight: 1.8, marginTop: 20, textAlign: "center" }}>{t.storyText}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginTop: 34 }}>
        {[[Award, lang === "en" ? "5+ Years Serving Bharatpur" : "५+ वर्षदेखि भरतपुरमा सेवा"], [ShieldCheck, t.secureCheckout], [Truck, t.deliversAll], [Star, t.verifiedReviews]].map(([Icon, label], i) => (
          <div key={i} style={{ textAlign: "center", background: dark ? C.plum900 : C.ivory100, borderRadius: 14, padding: 20 }}>
            <Icon size={22} color={C.wine700} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ContactPage({ t, lang, dark, onOpenChat }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const faqs = [
    { q: lang === "en" ? "Do you deliver outside Kathmandu Valley?" : "के काठमाडौं उपत्यका बाहिर डेलिभरी हुन्छ?", a: t.deliversAll },
    { q: lang === "en" ? "Can I pay with COD?" : "के COD मा भुक्तानी गर्न सकिन्छ?", a: lang === "en" ? "Yes, COD is available with a small handling fee outside the valley." : "हो, उपत्यका बाहिर सामान्य ह्यान्डलिङ शुल्कसहित COD उपलब्ध छ।" },
    { q: lang === "en" ? "How do I track my order?" : "मेरो अर्डर कसरी ट्र्याक गर्ने?", a: lang === "en" ? "Visit 'My Orders' after logging in to see real-time status." : "लगइन गरेपछि 'मेरो अर्डरहरू' मा गएर स्थिति हेर्नुहोस्।" },
  ];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 20px 60px" }}>
      <SectionHeading title={t.contact} dark={dark} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        <InfoRowLight icon={MapPin} text={`${SHOP.address}, ${SHOP.postal}`} dark={dark} />
        <InfoRowLight icon={Phone} text={SHOP.phone} dark={dark} />
        <InfoRowLight icon={Clock} text={t.dailyFrom} dark={dark} />
        <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
          <a href={`tel:${SHOP.phone.replace(/\D/g, "")}`} className="ss-btn ss-caption" style={{ background: C.wine700, color: "#fff", padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><Phone size={13} /> {lang === "en" ? "Call" : "फोन"}</a>
          <a
            href={whatsappLink(lang === "en" ? "Hi Shringar Sansar, I have a question." : "नमस्ते श्रृंगार संसार, मेरो एउटा प्रश्न छ।")}
            target="_blank" rel="noopener noreferrer"
            className="ss-btn ss-caption" style={{ background: "#25D366", color: "#fff", padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
          >
            <WhatsappIcon size={14} color="#fff" /> WhatsApp
          </a>
          <button className="ss-btn ss-caption" onClick={onOpenChat} style={{ background: "transparent", border: `1px solid ${C.gold400}`, color: dark ? C.ivory50 : C.ink900, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={13} /> {lang === "en" ? "Chat" : "च्याट"}</button>
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <SectionHeading title={t.faq} dark={dark} />
        <div style={{ marginTop: 16 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.gold400}33` }}>
              <button className="ss-btn" onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", background: "none", padding: "14px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "inherit", textAlign: "left", fontSize: 14, fontWeight: 600 }}>
                {f.q} <ChevronDown size={16} style={{ transform: faqOpen === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
              {faqOpen === i && <p className="ss-fade-in" style={{ padding: "0 4px 14px", fontSize: 13.5, color: C.ink600 }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function InfoRowLight({ icon: Icon, text, dark }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", background: dark ? C.plum900 : C.ivory100, borderRadius: 10, padding: 12 }}>
      <Icon size={16} color={C.wine700} /> <span style={{ fontSize: 13.5 }}>{text}</span>
    </div>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function TiktokIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.62h-3.03v13.7c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1-2.72-2.72 2.72 2.72 0 0 1 2.72-2.72c.28 0 .55.04.8.12V10.2a5.8 5.8 0 0 0-.8-.06A5.75 5.75 0 0 0 3.7 15.9a5.75 5.75 0 0 0 5.75 5.75 5.75 5.75 0 0 0 5.75-5.75V9.03a8.7 8.7 0 0 0 5.07 1.62V7.62a5.35 5.35 0 0 1-3.67-1.8Z"
        fill={color}
      />
    </svg>
  );
}

function WhatsappIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.27-.1-.46-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.53.07-.8.38-.28.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.13-.26-.2-.55-.35Z"
        fill={color}
      />
      <path
        d="M12.02 2C6.5 2 2 6.48 2 12c0 1.9.53 3.68 1.44 5.2L2 22l4.94-1.4A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.13c-1.7 0-3.28-.47-4.63-1.28l-.33-.2-2.93.84.82-2.86-.22-.34A8.13 8.13 0 0 1 3.86 12c0-4.5 3.66-8.14 8.16-8.14 4.5 0 8.15 3.65 8.15 8.14 0 4.5-3.65 8.13-8.15 8.13Z"
        fill={color}
      />
    </svg>
  );
}

function Footer({ t, lang, dark, go }) {
  return (
    <footer style={{ background: C.plum950, color: C.ivory100, padding: "40px 20px 20px", marginTop: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 30 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: `1px solid ${C.gold400}66`, flexShrink: 0 }}>
              <img src="/logo.png" alt="Shringar Sansar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="ss-display" style={{ fontSize: 20, fontWeight: 700, color: C.gold300 }}>{SHOP.name}</div>
          </div>
          <p style={{ fontSize: 12.5, marginTop: 8, opacity: 0.75, lineHeight: 1.6 }}>{SHOP.address}, {SHOP.postal}</p>
          <p style={{ fontSize: 12.5, opacity: 0.75 }}>{SHOP.landmark}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
            <a href="https://www.facebook.com/shringar.sansar" target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: C.gold400, display: "flex" }}>
              <Facebook size={17} color={C.gold400} />
            </a>
            <a href="https://www.tiktok.com/@shringarsansar9" target="_blank" rel="noopener noreferrer" title="TikTok" style={{ color: C.gold400, display: "flex" }}>
              <TiktokIcon size={16} color={C.gold400} />
            </a>
            <Instagram size={16} color={C.gold400} style={{ opacity: 0.5 }} title={lang === "en" ? "Instagram (coming soon)" : "इन्स्टाग्राम (छिट्टै)"} />
          </div>
        </div>
        <div>
          <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, color: C.gold400, marginBottom: 10 }}>{t.shop}</div>
          {["home", "shop", "blog", "about", "contact"].map((p) => (
            <button key={p} className="ss-btn ss-caption" onClick={() => go(p)} style={{ display: "block", background: "none", color: C.ivory100, fontSize: 13, padding: "4px 0", opacity: 0.85 }}>{t[p]}</button>
          ))}
          <button className="ss-btn ss-caption" onClick={() => go("returns")} style={{ display: "block", background: "none", color: C.ivory100, fontSize: 13, padding: "4px 0", opacity: 0.85 }}>{t.returnPolicy}</button>
        </div>
        <div>
          <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, color: C.gold400, marginBottom: 10 }}>{t.contact}</div>
          <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>{SHOP.phone}</p>
          <p style={{ fontSize: 13, opacity: 0.85 }}>{t.dailyFrom}</p>
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 11.5, opacity: 0.5, marginTop: 30, borderTop: `1px solid ${C.gold400}22`, paddingTop: 16 }}>
        © {new Date().getFullYear()} {SHOP.name}. {lang === "en" ? "All rights reserved." : "सर्वाधिकार सुरक्षित।"}
      </div>
    </footer>
  );
}

/* ============================================================
   ADMIN GATE
   ============================================================ */
function AdminGate({ t, dark, onSuccess, onCancel, lang }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const DEMO_PASSWORD = "shringar123";
  const MAX_ATTEMPTS = 5;
  const LOCK_MS = 60000;

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(LS_PREFIX + "admin-lock-until") || 0);
    if (saved > Date.now()) setLockedUntil(saved);
  }, []);
  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = lockedUntil > now;
  const secondsLeft = Math.max(0, Math.ceil((lockedUntil - now) / 1000));

  function submit() {
    if (isLocked) return;
    if (pw === DEMO_PASSWORD) {
      onSuccess();
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (nextAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCK_MS;
      setLockedUntil(until);
      window.localStorage.setItem(LS_PREFIX + "admin-lock-until", String(until));
      setError(lang === "en" ? `Too many attempts. Try again in ${LOCK_MS / 1000}s.` : `धेरै प्रयास भयो। ${LOCK_MS / 1000} सेकेन्डपछि फेरि प्रयास गर्नुहोस्।`);
    } else {
      setError(t.wrongPassword);
    }
  }
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="ss-fade-in" style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}55`, borderRadius: 18, padding: 30, width: "100%", maxWidth: 360, textAlign: "center" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.wine700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Lock size={22} color="#fff" />
        </div>
        <h3 className="ss-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t.adminLoginTitle}</h3>
        <p style={{ fontSize: 11.5, color: C.ink600, marginBottom: 16 }}>Demo password: shringar123</p>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <input type={show ? "text" : "password"} value={pw} disabled={isLocked} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t.adminPassword} className="ss-focus" aria-label={t.adminPassword} style={{ width: "100%", boxSizing: "border-box", padding: "11px 40px 11px 12px", borderRadius: 10, border: `1px solid ${C.gold400}55`, background: dark ? C.plum950 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 14, opacity: isLocked ? 0.5 : 1 }} />
          <button className="ss-btn" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} style={{ position: "absolute", right: 10, top: 10, background: "none", color: C.ink600 }}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </div>
        {isLocked ? (
          <div style={{ color: "#D14343", fontSize: 12, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <AlertCircle size={13} /> {lang === "en" ? `Locked. Try again in ${secondsLeft}s.` : `लक भयो। ${secondsLeft} सेकेन्डमा फेरि प्रयास गर्नुहोस्।`}
          </div>
        ) : error && <div style={{ color: "#D14343", fontSize: 12, marginBottom: 8 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ss-btn ss-caption" onClick={onCancel} style={{ flex: 1, background: "none", border: `1px solid ${C.gold400}55`, padding: 11, borderRadius: 10, fontSize: 13, color: dark ? C.ivory50 : C.ink900 }}>{t.cancel}</button>
          <button className="ss-btn ss-caption" onClick={submit} disabled={isLocked} style={{ flex: 1, background: C.wine700, color: "#fff", padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 600, opacity: isLocked ? 0.5 : 1 }}>{t.enter}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN APP
   ============================================================ */
function AdminApp({ t, lang, dark, products, setProducts, orders, updateOrderStatus, visitorCount, loginHistory, offers, setOffers, reviews, deleteReview, coupons, setCoupons, posts, setPosts, onExit }) {
  const [tab, setTab] = useState("overview");
  const bg = dark ? C.plum950 : C.ivory50;
  const fg = dark ? C.ivory100 : C.ink900;

  const tabs = [
    { id: "overview", label: t.overview, icon: LayoutDashboard },
    { id: "products", label: t.products, icon: Gem },
    { id: "offers", label: t.specialOffers, icon: Gift },
    { id: "coupons", label: lang === "en" ? "Coupons" : "कुपन", icon: Tag },
    { id: "blog", label: lang === "en" ? "Blog" : "ब्लग", icon: Award },
    { id: "orders", label: t.orders, icon: Package },
    { id: "customers", label: t.customers, icon: Users },
    { id: "reviews", label: lang === "en" ? "Reviews" : "समीक्षा", icon: Star },
    { id: "logins", label: lang === "en" ? "Login History" : "लगइन इतिहास", icon: Lock },
  ];

  return (
    <div style={{ minHeight: "100vh", background: bg, color: fg, display: "flex" }} className="ss-admin-shell">
      <aside style={{ width: 220, background: C.plum950, color: C.ivory50, padding: 18, flexShrink: 0 }} className="ss-admin-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 26 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.plum950, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.gold400}`, overflow: "hidden", flexShrink: 0 }}>
            <img src="/logo.png" alt="Shringar Sansar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div className="ss-display" style={{ fontSize: 15, fontWeight: 700 }}>Admin Panel</div>
            <div className="ss-caption" style={{ fontSize: 10, color: C.gold400 }}>Shringar Sansar</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map((tb) => (
            <button key={tb.id} className="ss-btn ss-caption" onClick={() => setTab(tb.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: tab === tb.id ? C.wine700 : "transparent", color: "#fff", padding: "10px 12px", borderRadius: 9, fontSize: 13.5, fontWeight: 500, textAlign: "left" }}>
              <tb.icon size={16} /> {tb.label}
            </button>
          ))}
        </nav>
        <button className="ss-btn ss-caption" onClick={onExit} style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 8, background: "none", color: C.rose300, fontSize: 13, padding: "10px 12px" }}>
          <LogOut size={15} /> {lang === "en" ? "Exit Admin" : "एडमिनबाट बाहिर"}
        </button>
      </aside>

      <main style={{ flex: 1, padding: 24, minWidth: 0 }}>
        {tab === "overview" && <AdminOverview t={t} lang={lang} dark={dark} products={products} orders={orders} visitorCount={visitorCount} />}
        {tab === "products" && <AdminProducts t={t} lang={lang} dark={dark} products={products} setProducts={setProducts} />}
        {tab === "offers" && <AdminOffers t={t} lang={lang} dark={dark} offers={offers} setOffers={setOffers} products={products} />}
        {tab === "coupons" && <AdminCoupons t={t} lang={lang} dark={dark} coupons={coupons} setCoupons={setCoupons} />}
        {tab === "blog" && <AdminPosts t={t} lang={lang} dark={dark} posts={posts} setPosts={setPosts} />}
        {tab === "orders" && <AdminOrders t={t} lang={lang} dark={dark} orders={orders} updateOrderStatus={updateOrderStatus} />}
        {tab === "customers" && <AdminCustomers t={t} lang={lang} dark={dark} orders={orders} />}
        {tab === "reviews" && <AdminReviews t={t} lang={lang} dark={dark} reviews={reviews} products={products} deleteReview={deleteReview} />}
        {tab === "logins" && <AdminLoginHistory t={t} lang={lang} dark={dark} loginHistory={loginHistory} />}
      </main>

      <style>{`
        @media (max-width: 760px) {
          .ss-admin-shell { flex-direction: column; }
          .ss-admin-sidebar { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, dark, tone = C.wine700 }) {
  return (
    <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: tone + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={19} color={tone} />
      </div>
      <div>
        <div className="ss-caption" style={{ fontSize: 11, color: C.ink600 }}>{label}</div>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}

function AdminOverview({ t, lang, dark, products, orders, visitorCount }) {
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 4);
  const bestSellers = [...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5);
  const salesTrend = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return { label: d.toLocaleDateString(undefined, { weekday: "short" }), value: 0 };
    });
    orders.forEach((o) => {
      const d = new Date(o.date);
      const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
      if (diffDays >= 0 && diffDays < 7) days[6 - diffDays].value += o.total;
    });
    return days;
  }, [orders]);
  const maxTrend = Math.max(1, ...salesTrend.map((d) => d.value));

  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 18 }}>{t.overview}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard icon={DollarSign} label={t.revenue} value={fmtNPR(revenue)} dark={dark} />
        <StatCard icon={Package} label={t.totalOrders} value={orders.length} dark={dark} tone="#3E7CB1" />
        <StatCard icon={AlertCircle} label={t.lowStockAlert} value={lowStock.length} dark={dark} tone="#D14343" />
        <StatCard icon={Eye} label={t.visitors} value={visitorCount} dark={dark} tone="#8355C9" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }} className="ss-admin-grid">
        <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 18 }}>
          <div className="ss-caption" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><TrendingUp size={15} color={C.wine700} /> {lang === "en" ? "Sales Trend (7 days)" : "बिक्री प्रवृत्ति (७ दिन)"}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
            {salesTrend.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", maxWidth: 30, height: Math.max(4, (d.value / maxTrend) * 110), background: `linear-gradient(180deg, ${C.gold400}, ${C.wine700})`, borderRadius: 6 }} title={fmtNPR(d.value)} />
                <span className="ss-caption" style={{ fontSize: 10, color: C.ink600 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 18 }}>
          <div className="ss-caption" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{lang === "en" ? "Best Sellers" : "उत्कृष्ट बिक्री"}</div>
          {bestSellers.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < bestSellers.length - 1 ? `1px solid ${C.gold400}22` : "none" }}>
              <ProductImage p={p} size={30} />
              <div style={{ flex: 1, fontSize: 12.5 }}>{lang === "en" ? p.nameEn : p.nameNp}</div>
              <div style={{ fontSize: 11, color: C.ink600 }}>{p.reviews} {lang === "en" ? "reviews" : "समीक्षा"}</div>
            </div>
          ))}
        </div>
      </div>

      {lowStock.length > 0 && (
        <div style={{ marginTop: 20, background: "#D1434322", border: `1px solid #D1434355`, borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={15} color="#D14343" /> {t.lowStockAlert}</div>
          {lowStock.map((p) => <div key={p.id} style={{ fontSize: 12.5, padding: "3px 0" }}>{lang === "en" ? p.nameEn : p.nameNp} — {p.stock} {lang === "en" ? "left" : "बाँकी"}</div>)}
        </div>
      )}
      <style>{`@media (max-width: 700px) { .ss-admin-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function emptyDraft() {
  return { nameEn: "", nameNp: "", category: CATEGORIES[0].id, price: "", discount: "0", stock: "", featured: false, image: null, emoji: "💠", color: C.wine700, variants: "" };
}

function AdminProducts({ t, lang, dark, products, setProducts }) {
  const [draft, setDraft] = useState(emptyDraft());
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      setDraft((d) => ({ ...d, image: dataUrl }));
    } catch (err) { /* ignore */ }
    setUploading(false);
  }

  function resetForm() { setDraft(emptyDraft()); setEditingId(null); if (fileRef.current) fileRef.current.value = ""; }

  function saveProduct() {
    if (!draft.nameEn || !draft.price || draft.stock === "") return;
    const variantsArr = draft.variants.split(",").map((s) => s.trim()).filter(Boolean);
    if (editingId) {
      setProducts(products.map((p) => (p.id === editingId ? { ...p, ...draft, price: Number(draft.price), discount: Number(draft.discount) || 0, stock: Number(draft.stock), variants: variantsArr } : p)));
    } else {
      const newProduct = {
        id: genId("p"), ...draft, price: Number(draft.price), discount: Number(draft.discount) || 0, stock: Number(draft.stock),
        variants: variantsArr, rating: 5.0, reviews: 0,
      };
      setProducts([newProduct, ...products]);
    }
    resetForm();
  }
  function editProduct(p) {
    setDraft({ nameEn: p.nameEn, nameNp: p.nameNp || "", category: p.category, price: String(p.price), discount: String(p.discount || 0), stock: String(p.stock), featured: !!p.featured, image: p.image || null, emoji: p.emoji || "💠", color: p.color || C.wine700, variants: (p.variants || []).join(", ") });
    setEditingId(p.id);
  }
  function deleteProduct(id) {
    setProducts(products.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
  }

  const list = products.filter((p) => (p.nameEn + (p.nameNp || "")).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 18 }}>{t.products}</h2>

      <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 18, marginBottom: 24 }}>
        <div className="ss-caption" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{editingId ? t.edit : t.addProduct}</div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }} className="ss-product-form">
          <div>
            <div onClick={() => fileRef.current?.click()} style={{
              width: 110, height: 110, borderRadius: 12, border: `2px dashed ${C.gold400}77`, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden", background: dark ? C.plum950 : C.ivory100, flexDirection: "column", gap: 4,
            }}>
              {uploading ? <RefreshCw size={20} className="ss-spin" /> : draft.image ? <img src={draft.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                <><Upload size={20} color={C.ink600} /><span style={{ fontSize: 10, color: C.ink600, textAlign: "center", padding: "0 6px" }}>{t.productImage}</span></>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {draft.image && <button className="ss-btn ss-caption" onClick={() => setDraft((d) => ({ ...d, image: null }))} style={{ marginTop: 6, fontSize: 10, background: "none", color: C.rose500 }}>{t.remove}</button>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormRow label={t.productNameEn}><input className="ss-focus" style={inputStyle(dark)} value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} /></FormRow>
            <FormRow label={t.productNameNp}><input className="ss-focus" style={inputStyle(dark)} value={draft.nameNp} onChange={(e) => setDraft({ ...draft, nameNp: e.target.value })} /></FormRow>
            <FormRow label={t.category}>
              <select className="ss-focus" style={inputStyle(dark)} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{lang === "en" ? c.en : c.np}</option>)}
              </select>
            </FormRow>
            <FormRow label={t.price}><input type="number" className="ss-focus" style={inputStyle(dark)} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} /></FormRow>
            <FormRow label={t.discount}><input type="number" className="ss-focus" style={inputStyle(dark)} value={draft.discount} onChange={(e) => setDraft({ ...draft, discount: e.target.value })} /></FormRow>
            <FormRow label={t.stock}><input type="number" className="ss-focus" style={inputStyle(dark)} value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} /></FormRow>
            <FormRow label={lang === "en" ? "Variants (e.g. sizes, comma separated, optional)" : "विकल्प (जस्तै साइज, अल्पविरामले छुट्याएर)"}>
              <input className="ss-focus" style={inputStyle(dark)} placeholder={lang === "en" ? "e.g. 2.4in, 2.6in, 2.8in" : "जस्तै २.४, २.६, २.८"} value={draft.variants} onChange={(e) => setDraft({ ...draft, variants: e.target.value })} />
            </FormRow>
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13 }}>
          <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> {t.featuredToggle}
        </label>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="ss-btn ss-caption" onClick={saveProduct} style={{ background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13 }}>{t.save}</button>
          {editingId && <button className="ss-btn ss-caption" onClick={resetForm} style={{ background: "none", border: `1px solid ${C.gold400}55`, padding: "10px 20px", borderRadius: 10, fontSize: 13, color: dark ? C.ivory50 : C.ink900 }}>{t.cancel}</button>}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="ss-focus" style={{ ...inputStyle(dark), maxWidth: 240 }} />
        <span className="ss-caption" style={{ fontSize: 12, color: C.ink600 }}>{list.length} {t.products}</span>
      </div>

      <div style={{ overflowX: "auto", border: `1px solid ${C.gold400}33`, borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: dark ? C.plum900 : C.ivory100, textAlign: "left" }}>
              {["", t.productNameEn, t.category, t.price, t.stock, t.featuredToggle, ""].map((h, i) => (
                <th key={i} className="ss-caption" style={{ padding: "10px 12px", fontSize: 11, color: C.ink600, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} style={{ borderTop: `1px solid ${C.gold400}22` }}>
                <td style={{ padding: 10 }}><ProductImage p={p} size={36} /></td>
                <td style={{ padding: 10, fontWeight: 500 }}>{lang === "en" ? p.nameEn : p.nameNp}</td>
                <td style={{ padding: 10 }}>{CATEGORIES.find((c) => c.id === p.category)?.[lang]}</td>
                <td style={{ padding: 10 }}>{fmtNPR(p.price)}</td>
                <td style={{ padding: 10, color: p.stock <= 4 ? "#D14343" : "inherit" }}>{p.stock}</td>
                <td style={{ padding: 10 }}>{p.featured ? <Check size={14} color="#2E9E5B" /> : "—"}</td>
                <td style={{ padding: 10, display: "flex", gap: 6 }}>
                  <button className="ss-btn" onClick={() => editProduct(p)} style={{ background: "none", color: C.wine700 }}><Edit2 size={14} /></button>
                  <button className="ss-btn" onClick={() => deleteProduct(p.id)} style={{ background: "none", color: "#D14343" }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .ss-spin { animation: ssspin 1s linear infinite; }
        @keyframes ssspin { to { transform: rotate(360deg); } }
        @media (max-width: 560px) { .ss-product-form { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function emptyOfferDraft() {
  return { titleEn: "", titleNp: "", descEn: "", descNp: "", productIds: [], comboPrice: "", active: true, image: null, color: C.wine700 };
}

function AdminOffers({ t, lang, dark, offers, setOffers, products }) {
  const [draft, setDraft] = useState(emptyOfferDraft());
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file, 600);
      setDraft((d) => ({ ...d, image: dataUrl }));
    } catch (err) { /* ignore */ }
    setUploading(false);
  }

  function resetForm() { setDraft(emptyOfferDraft()); setEditingId(null); if (fileRef.current) fileRef.current.value = ""; }

  function toggleProduct(pid) {
    setDraft((d) => ({
      ...d,
      productIds: d.productIds.includes(pid) ? d.productIds.filter((x) => x !== pid) : [...d.productIds, pid],
    }));
  }

  function saveOffer() {
    if (!draft.titleEn || !draft.comboPrice || draft.productIds.length === 0) return;
    if (editingId) {
      setOffers(offers.map((o) => (o.id === editingId ? { ...o, ...draft, comboPrice: Number(draft.comboPrice) } : o)));
    } else {
      const newOffer = { id: genId("offer"), ...draft, comboPrice: Number(draft.comboPrice), createdAt: new Date().toISOString() };
      setOffers([newOffer, ...offers]);
    }
    resetForm();
  }
  function editOffer(o) {
    setDraft({
      titleEn: o.titleEn, titleNp: o.titleNp || "", descEn: o.descEn || "", descNp: o.descNp || "",
      productIds: o.productIds || [], comboPrice: String(o.comboPrice || ""), active: !!o.active,
      image: o.image || null, color: o.color || C.wine700,
    });
    setEditingId(o.id);
  }
  function deleteOffer(id) {
    setOffers(offers.filter((o) => o.id !== id));
    if (editingId === id) resetForm();
  }
  function toggleActive(o) {
    setOffers(offers.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)));
  }

  const includedTotal = draft.productIds.reduce((s, pid) => {
    const p = products.find((x) => x.id === pid);
    if (!p) return s;
    return s + Math.round(p.price * (1 - (p.discount || 0) / 100));
  }, 0);

  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{t.specialOffers}</h2>
      <p className="ss-caption" style={{ fontSize: 12, color: C.ink600, marginBottom: 18 }}>
        {lang === "en"
          ? "Create seasonal combo offers (e.g. Teej Special) by bundling existing products at a special price. Active offers appear on the homepage for every customer."
          : "मौजुदा सामानहरू मिलाएर विशेष मूल्यमा मौसमी कम्बो अफर (जस्तै तीज स्पेशल) बनाउनुहोस्। सक्रिय अफरहरू सबै ग्राहकको गृहपृष्ठमा देखिन्छ।"}
      </p>

      <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 18, marginBottom: 24 }}>
        <div className="ss-caption" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
          {editingId ? t.edit : (lang === "en" ? "Create New Offer" : "नयाँ अफर बनाउनुहोस्")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }} className="ss-product-form">
          <div>
            <div onClick={() => fileRef.current?.click()} style={{
              width: 110, height: 110, borderRadius: 12, border: `2px dashed ${C.gold400}77`, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden", background: dark ? C.plum950 : C.ivory100, flexDirection: "column", gap: 4,
            }}>
              {uploading ? <RefreshCw size={20} className="ss-spin" /> : draft.image ? <img src={draft.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                <><Gift size={20} color={C.ink600} /><span style={{ fontSize: 10, color: C.ink600, textAlign: "center", padding: "0 6px" }}>{lang === "en" ? "Offer Photo" : "अफर फोटो"}</span></>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {draft.image && <button className="ss-btn ss-caption" onClick={() => setDraft((d) => ({ ...d, image: null }))} style={{ marginTop: 6, fontSize: 10, background: "none", color: C.rose500 }}>{t.remove}</button>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormRow label={lang === "en" ? "Offer Title (English)" : "अफर शीर्षक (अंग्रेजी)"}>
              <input className="ss-focus" style={inputStyle(dark)} placeholder={lang === "en" ? "e.g. Teej Special Combo" : "जस्तै तीज स्पेशल कम्बो"} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} />
            </FormRow>
            <FormRow label={lang === "en" ? "Offer Title (Nepali)" : "अफर शीर्षक (नेपाली)"}>
              <input className="ss-focus" style={inputStyle(dark)} value={draft.titleNp} onChange={(e) => setDraft({ ...draft, titleNp: e.target.value })} />
            </FormRow>
            <FormRow label={lang === "en" ? "Description (English)" : "विवरण (अंग्रेजी)"}>
              <input className="ss-focus" style={inputStyle(dark)} placeholder={lang === "en" ? "e.g. Bangles + Tikka + Earrings bundle" : ""} value={draft.descEn} onChange={(e) => setDraft({ ...draft, descEn: e.target.value })} />
            </FormRow>
            <FormRow label={lang === "en" ? "Description (Nepali)" : "विवरण (नेपाली)"}>
              <input className="ss-focus" style={inputStyle(dark)} value={draft.descNp} onChange={(e) => setDraft({ ...draft, descNp: e.target.value })} />
            </FormRow>
            <FormRow label={t.comboPrice + " (NPR)"}>
              <input type="number" className="ss-focus" style={inputStyle(dark)} value={draft.comboPrice} onChange={(e) => setDraft({ ...draft, comboPrice: e.target.value })} />
            </FormRow>
            <div>
              <label className="ss-caption" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>{lang === "en" ? "Original Total (auto)" : "सामान्य जम्मा (स्वतः)"}</label>
              <div style={{ ...inputStyle(dark), display: "flex", alignItems: "center", color: C.ink600 }}>{fmtNPR(includedTotal)}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label className="ss-caption" style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 8 }}>
            {lang === "en" ? "Select products included in this combo" : "यो कम्बोमा समावेश हुने सामानहरू छान्नुहोस्"}
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, maxHeight: 220, overflowY: "auto", padding: 10, border: `1px solid ${C.gold400}33`, borderRadius: 10 }} className="ss-scroll">
            {products.map((p) => (
              <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, padding: 6, borderRadius: 8, background: draft.productIds.includes(p.id) ? (dark ? C.wine700 + "33" : C.rose300 + "33") : "transparent", cursor: "pointer" }}>
                <input type="checkbox" checked={draft.productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                <ProductImage p={p} size={26} />
                <span style={{ flex: 1 }}>{lang === "en" ? p.nameEn : p.nameNp}</span>
              </label>
            ))}
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 13 }}>
          <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
          {lang === "en" ? "Active (visible to customers on homepage)" : "सक्रिय (गृहपृष्ठमा ग्राहकलाई देखिने)"}
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="ss-btn ss-caption" onClick={saveOffer} style={{ background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13 }}>{t.save}</button>
          {editingId && <button className="ss-btn ss-caption" onClick={resetForm} style={{ background: "none", border: `1px solid ${C.gold400}55`, padding: "10px 20px", borderRadius: 10, fontSize: 13, color: dark ? C.ivory50 : C.ink900 }}>{t.cancel}</button>}
        </div>
      </div>

      <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{offers.length} {lang === "en" ? "offers" : "अफरहरू"}</div>
      {offers.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: C.ink600, border: `1px dashed ${C.gold400}44`, borderRadius: 14 }}>
          {lang === "en" ? "No offers yet. Create your first combo offer above." : "अहिलेसम्म कुनै अफर छैन। माथि पहिलो कम्बो अफर बनाउनुहोस्।"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {offers.map((o) => {
            const included = (o.productIds || []).map((pid) => products.find((p) => p.id === pid)).filter(Boolean);
            return (
              <div key={o.id} style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: `linear-gradient(135deg, ${o.color || C.wine700}, ${C.plum950})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {o.image ? <img src={o.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Gift size={18} color="#fff" />}
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{lang === "en" ? o.titleEn : (o.titleNp || o.titleEn)}</div>
                  <div style={{ fontSize: 11.5, color: C.ink600 }}>{included.length} {lang === "en" ? "items" : "सामान"} · {fmtNPR(o.comboPrice)}</div>
                </div>
                <button className="ss-btn ss-caption" onClick={() => toggleActive(o)} style={{
                  background: o.active ? "#2E9E5B22" : "#99999922", color: o.active ? "#2E9E5B" : C.ink600,
                  padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5,
                }}>
                  <Tag size={12} /> {o.active ? (lang === "en" ? "Active" : "सक्रिय") : (lang === "en" ? "Hidden" : "लुकेको")}
                </button>
                <button className="ss-btn" onClick={() => editOffer(o)} style={{ background: "none", color: C.wine700 }}><Edit2 size={15} /></button>
                <button className="ss-btn" onClick={() => deleteOffer(o.id)} style={{ background: "none", color: "#D14343" }}><Trash2 size={15} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function emptyCouponDraft() {
  return { code: "", type: "percent", value: "", minOrder: "", expiry: "", active: true };
}

function AdminCoupons({ t, lang, dark, coupons, setCoupons }) {
  const [draft, setDraft] = useState(emptyCouponDraft());
  const [editingId, setEditingId] = useState(null);

  function resetForm() { setDraft(emptyCouponDraft()); setEditingId(null); }

  function saveCoupon() {
    const code = draft.code.trim().toUpperCase();
    if (!code || !draft.value) return;
    if (editingId) {
      setCoupons(coupons.map((c) => (c.id === editingId ? { ...c, ...draft, code, value: Number(draft.value), minOrder: draft.minOrder ? Number(draft.minOrder) : 0 } : c)));
    } else {
      if (coupons.some((c) => c.code === code)) return; // avoid duplicate codes
      const newCoupon = { id: genId("coupon"), ...draft, code, value: Number(draft.value), minOrder: draft.minOrder ? Number(draft.minOrder) : 0, usedCount: 0, createdAt: new Date().toISOString() };
      setCoupons([newCoupon, ...coupons]);
    }
    resetForm();
  }
  function editCoupon(c) {
    setDraft({ code: c.code, type: c.type, value: String(c.value), minOrder: c.minOrder ? String(c.minOrder) : "", expiry: c.expiry || "", active: !!c.active });
    setEditingId(c.id);
  }
  function deleteCoupon(id) {
    setCoupons(coupons.filter((c) => c.id !== id));
    if (editingId === id) resetForm();
  }
  function toggleActive(c) {
    setCoupons(coupons.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
  }

  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{lang === "en" ? "Coupons" : "कुपन"}</h2>
      <p className="ss-caption" style={{ fontSize: 12, color: C.ink600, marginBottom: 18 }}>
        {lang === "en" ? "Create discount codes customers can enter at checkout." : "ग्राहकले चेकआउटमा राख्न सक्ने छुट कोडहरू बनाउनुहोस्।"}
      </p>

      <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 18, marginBottom: 24 }}>
        <div className="ss-caption" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{editingId ? t.edit : t.createCoupon}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          <FormRow label={t.couponCodeLabel}>
            <input className="ss-focus" style={{ ...inputStyle(dark), textTransform: "uppercase" }} value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
          </FormRow>
          <FormRow label={t.couponType}>
            <select className="ss-focus" style={inputStyle(dark)} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>
              <option value="percent">{t.percentOff}</option>
              <option value="flat">{t.flatOff}</option>
            </select>
          </FormRow>
          <FormRow label={draft.type === "percent" ? `${t.couponValue} (%)` : `${t.couponValue} (NPR)`}>
            <input type="number" className="ss-focus" style={inputStyle(dark)} value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} />
          </FormRow>
          <FormRow label={t.couponMinOrderLabel}>
            <input type="number" className="ss-focus" style={inputStyle(dark)} value={draft.minOrder} onChange={(e) => setDraft({ ...draft, minOrder: e.target.value })} />
          </FormRow>
          <FormRow label={t.couponExpiryLabel}>
            <input type="date" className="ss-focus" style={inputStyle(dark)} value={draft.expiry} onChange={(e) => setDraft({ ...draft, expiry: e.target.value })} />
          </FormRow>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13 }}>
          <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> {t.couponActive}
        </label>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="ss-btn ss-caption" onClick={saveCoupon} style={{ background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13 }}>{t.save}</button>
          {editingId && <button className="ss-btn ss-caption" onClick={resetForm} style={{ background: "none", border: `1px solid ${C.gold400}55`, padding: "10px 20px", borderRadius: 10, fontSize: 13, color: dark ? C.ivory50 : C.ink900 }}>{t.cancel}</button>}
        </div>
      </div>

      {coupons.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: C.ink600, border: `1px dashed ${C.gold400}44`, borderRadius: 14 }}>{t.noCouponsYet}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {coupons.map((c) => (
            <div key={c.id} style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "monospace", letterSpacing: "0.05em" }}>{c.code}</div>
              <div style={{ flex: 1, minWidth: 140, fontSize: 12.5, color: C.ink600 }}>
                {c.type === "percent" ? `${c.value}% ${t.discount.toLowerCase()}` : `${fmtNPR(c.value)} ${t.discount.toLowerCase()}`}
                {c.minOrder > 0 && ` · min ${fmtNPR(c.minOrder)}`}
                {c.expiry && ` · exp ${c.expiry}`}
                {` · ${c.usedCount || 0} ${t.timesUsed}`}
              </div>
              <button className="ss-btn ss-caption" onClick={() => toggleActive(c)} style={{
                background: c.active ? "#2E9E5B22" : "#99999922", color: c.active ? "#2E9E5B" : C.ink600,
                padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              }}>
                {c.active ? (lang === "en" ? "Active" : "सक्रिय") : (lang === "en" ? "Hidden" : "लुकेको")}
              </button>
              <button className="ss-btn" onClick={() => editCoupon(c)} style={{ background: "none", color: C.wine700 }}><Edit2 size={15} /></button>
              <button className="ss-btn" onClick={() => deleteCoupon(c.id)} style={{ background: "none", color: "#D14343" }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function emptyPostDraft() {
  return { titleEn: "", titleNp: "", category: "", excerpt: "", contentEn: "", contentNp: "", image: null, published: true };
}

function AdminPosts({ t, lang, dark, posts, setPosts }) {
  const [draft, setDraft] = useState(emptyPostDraft());
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file, 900);
      setDraft((d) => ({ ...d, image: dataUrl }));
    } catch (err) { /* ignore */ }
    setUploading(false);
  }

  function resetForm() { setDraft(emptyPostDraft()); setEditingId(null); if (fileRef.current) fileRef.current.value = ""; }

  function savePost() {
    if (!draft.titleEn || !draft.contentEn) return;
    if (editingId) {
      setPosts(posts.map((p) => (p.id === editingId ? { ...p, ...draft } : p)));
    } else {
      const newPost = { id: genId("post"), ...draft, date: new Date().toISOString() };
      setPosts([newPost, ...posts]);
    }
    resetForm();
  }
  function editPost(p) {
    setDraft({ titleEn: p.titleEn, titleNp: p.titleNp || "", category: p.category || "", excerpt: p.excerpt || "", contentEn: p.contentEn || "", contentNp: p.contentNp || "", image: p.image || null, published: !!p.published });
    setEditingId(p.id);
  }
  function deletePost(id) {
    setPosts(posts.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
  }
  function togglePublished(p) {
    setPosts(posts.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)));
  }

  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{lang === "en" ? "Blog" : "ब्लग"}</h2>
      <p className="ss-caption" style={{ fontSize: 12, color: C.ink600, marginBottom: 18 }}>
        {lang === "en" ? "Share styling tips, festival guides, and shop stories. Published posts appear on your homepage and Blog page." : "स्टाइलिङ सुझाव, चाडपर्व गाइड र पसलका कथाहरू सेयर गर्नुहोस्। प्रकाशित पोस्टहरू गृहपृष्ठ र ब्लग पृष्ठमा देखिन्छन्।"}
      </p>

      <div style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 14, padding: 18, marginBottom: 24 }}>
        <div className="ss-caption" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{editingId ? t.edit : (lang === "en" ? "New Post" : "नयाँ पोस्ट")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16 }} className="ss-product-form">
          <div>
            <div onClick={() => fileRef.current?.click()} style={{
              width: 130, height: 130, borderRadius: 12, border: `2px dashed ${C.gold400}77`, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden", background: dark ? C.plum950 : C.ivory100, flexDirection: "column", gap: 4,
            }}>
              {uploading ? <RefreshCw size={20} className="ss-spin" /> : draft.image ? <img src={draft.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                <><Upload size={20} color={C.ink600} /><span style={{ fontSize: 10, color: C.ink600, textAlign: "center", padding: "0 6px" }}>{lang === "en" ? "Cover Photo" : "कभर फोटो"}</span></>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {draft.image && <button className="ss-btn ss-caption" onClick={() => setDraft((d) => ({ ...d, image: null }))} style={{ marginTop: 6, fontSize: 10, background: "none", color: C.rose500 }}>{t.remove}</button>}
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <FormRow label={lang === "en" ? "Title (English)" : "शीर्षक (अंग्रेजी)"}>
                <input className="ss-focus" style={inputStyle(dark)} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} />
              </FormRow>
              <FormRow label={lang === "en" ? "Title (Nepali)" : "शीर्षक (नेपाली)"}>
                <input className="ss-focus" style={inputStyle(dark)} value={draft.titleNp} onChange={(e) => setDraft({ ...draft, titleNp: e.target.value })} />
              </FormRow>
            </div>
            <FormRow label={lang === "en" ? "Category (optional, e.g. Styling Tips)" : "श्रेणी (वैकल्पिक)"}>
              <input className="ss-focus" style={inputStyle(dark)} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            </FormRow>
            <FormRow label={lang === "en" ? "Short Excerpt (shown in previews)" : "छोटो विवरण"}>
              <input className="ss-focus" style={inputStyle(dark)} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
            </FormRow>
          </div>
        </div>
        <FormRow label={lang === "en" ? "Full Content (English)" : "पूरा सामग्री (अंग्रेजी)"}>
          <textarea className="ss-focus" rows={6} style={{ ...inputStyle(dark), resize: "vertical" }} value={draft.contentEn} onChange={(e) => setDraft({ ...draft, contentEn: e.target.value })} />
        </FormRow>
        <FormRow label={lang === "en" ? "Full Content (Nepali, optional)" : "पूरा सामग्री (नेपाली, वैकल्पिक)"}>
          <textarea className="ss-focus" rows={6} style={{ ...inputStyle(dark), resize: "vertical" }} value={draft.contentNp} onChange={(e) => setDraft({ ...draft, contentNp: e.target.value })} />
        </FormRow>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 13 }}>
          <input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> {lang === "en" ? "Published (visible to customers)" : "प्रकाशित (ग्राहकलाई देखिने)"}
        </label>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="ss-btn ss-caption" onClick={savePost} style={{ background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13 }}>{t.save}</button>
          {editingId && <button className="ss-btn ss-caption" onClick={resetForm} style={{ background: "none", border: `1px solid ${C.gold400}55`, padding: "10px 20px", borderRadius: 10, fontSize: 13, color: dark ? C.ivory50 : C.ink900 }}>{t.cancel}</button>}
        </div>
      </div>

      {posts.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: C.ink600, border: `1px dashed ${C.gold400}44`, borderRadius: 14 }}>
          {lang === "en" ? "No posts yet. Write your first one above." : "अहिलेसम्म कुनै पोस्ट छैन। माथि पहिलो लेख्नुहोस्।"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((p) => (
            <div key={p.id} style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: `linear-gradient(135deg, ${C.wine700}, ${C.plum950})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.image ? <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 18 }}>📖</span>}
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{lang === "en" ? p.titleEn : (p.titleNp || p.titleEn)}</div>
                <div style={{ fontSize: 11.5, color: C.ink600 }}>{new Date(p.date).toLocaleDateString()}{p.category ? ` · ${p.category}` : ""}</div>
              </div>
              <button className="ss-btn ss-caption" onClick={() => togglePublished(p)} style={{
                background: p.published ? "#2E9E5B22" : "#99999922", color: p.published ? "#2E9E5B" : C.ink600,
                padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              }}>
                {p.published ? (lang === "en" ? "Published" : "प्रकाशित") : (lang === "en" ? "Draft" : "मस्यौदा")}
              </button>
              <button className="ss-btn" onClick={() => editPost(p)} style={{ background: "none", color: C.wine700 }}><Edit2 size={15} /></button>
              <button className="ss-btn" onClick={() => deletePost(p.id)} style={{ background: "none", color: "#D14343" }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminOrders({ t, lang, dark, orders, updateOrderStatus }) {
  const [expanded, setExpanded] = useState({});
  const [zoomImage, setZoomImage] = useState(null);

  function updateStatus(id, status) {
    updateOrderStatus(id, status);
  }
  function exportCSV() {
    const rows = [["Order ID", "Date", "Customer", "Phone", "Total", "Status"], ...orders.map((o) => [o.id, o.date, o.address.fullName, o.address.phone, o.total, o.status])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "shringar-sansar-orders.csv"; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700 }}>{t.manageOrders}</h2>
        <button className="ss-btn ss-caption" onClick={exportCSV} style={{ background: C.wine700, color: "#fff", padding: "9px 16px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Package size={13} /> {t.exportCSV}</button>
      </div>
      {orders.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: C.ink600 }}>{lang === "en" ? "No orders yet." : "अहिलेसम्म अर्डर छैन।"}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((o) => {
            const isOpen = !!expanded[o.id];
            return (
              <div key={o.id} style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 12, padding: 16 }}>
                <button className="ss-btn" onClick={() => setExpanded((e) => ({ ...e, [o.id]: !e[o.id] }))} style={{ width: "100%", background: "none", textAlign: "left", padding: 0, color: "inherit" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                        {o.id} — {o.address.fullName}
                        {o.payment === "bank" && <Badge tone="gold"><Banknote size={11} /> {lang === "en" ? "Proof attached" : "प्रमाण संलग्न"}</Badge>}
                      </div>
                      <div style={{ fontSize: 11.5, color: C.ink600 }}>{new Date(o.date).toLocaleString()} · {o.address.province} · {o.paymentLabel} · {o.address.phone}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{fmtNPR(o.total)}</div>
                      <ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="ss-fade-in" style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.gold400}22` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="ss-admin-grid">
                      <div>
                        <div className="ss-caption" style={{ fontSize: 11, fontWeight: 700, color: C.gold400, marginBottom: 6, textTransform: "uppercase" }}>{lang === "en" ? "Items Ordered" : "अर्डर गरिएका सामान"}</div>
                        {(o.items || []).map((it, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
                            <span>{it.name} × {it.qty}</span>
                            <span>{fmtNPR((it.price || 0) * it.qty)}</span>
                          </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 8, color: C.ink600 }}>
                          <span>{t.subtotal}</span><span>{fmtNPR(o.subtotal)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.ink600 }}>
                          <span>{t.deliveryFee}</span><span>{fmtNPR(o.deliveryFee)}</span>
                        </div>

                        <div className="ss-caption" style={{ fontSize: 11, fontWeight: 700, color: C.gold400, margin: "14px 0 6px", textTransform: "uppercase" }}>{lang === "en" ? "Delivery Contact" : "डेलिभरी सम्पर्क"}</div>
                        <div style={{ fontSize: 13 }}>{o.address.fullName}</div>
                        <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Phone size={12} /> {o.address.phone}</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>{o.address.municipality}-{o.address.ward}, {o.address.district}, {o.address.province}</div>
                        {o.address.landmark && <div style={{ fontSize: 12.5, color: C.ink600 }}>{lang === "en" ? "Landmark" : "ल्यान्डमार्क"}: {o.address.landmark}</div>}
                      </div>

                      <div>
                        <div className="ss-caption" style={{ fontSize: 11, fontWeight: 700, color: C.gold400, marginBottom: 6, textTransform: "uppercase" }}>{t.paymentMethod}</div>
                        <div style={{ fontSize: 13, marginBottom: 8 }}>{o.paymentLabel}</div>
                        {o.payment === "bank" && (
                          o.paymentProof ? (
                            <div>
                              <div style={{ fontSize: 12, color: C.ink600, marginBottom: 6 }}>{t.uploadProof}:</div>
                              <img
                                src={o.paymentProof} alt="Payment proof" onClick={() => setZoomImage(o.paymentProof)}
                                style={{ width: "100%", maxWidth: 260, borderRadius: 10, border: `1px solid ${C.gold400}44`, cursor: "zoom-in" }}
                              />
                            </div>
                          ) : (
                            <div style={{ fontSize: 12.5, color: C.rose500, display: "flex", alignItems: "center", gap: 6 }}>
                              <AlertCircle size={13} /> {lang === "en" ? "No proof image was uploaded by the customer." : "ग्राहकले कुनै प्रमाण फोटो अपलोड गरेनन्।"}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="ss-caption" style={{ fontSize: 11, color: C.ink600 }}>{t.updateStatus}:</span>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="ss-focus" style={{ ...inputStyle(dark), width: "auto", padding: "6px 10px", fontSize: 12 }}>
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{t[s]}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {zoomImage && (
        <div onClick={() => setZoomImage(null)} style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "zoom-out" }}>
          <img src={zoomImage} alt="Payment proof" style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 12, border: `1px solid ${C.gold400}55` }} />
        </div>
      )}
    </div>
  );
}

function AdminCustomers({ t, lang, dark, orders }) {
  const byEmailOrName = {};
  orders.forEach((o) => {
    const key = o.address.fullName + o.address.phone;
    if (!byEmailOrName[key]) byEmailOrName[key] = { name: o.address.fullName, phone: o.address.phone, orders: 0, spent: 0 };
    byEmailOrName[key].orders += 1;
    byEmailOrName[key].spent += o.total;
  });
  const customers = Object.values(byEmailOrName);
  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 18 }}>{t.customers}</h2>
      {customers.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: C.ink600 }}>{lang === "en" ? "No customers yet — orders will appear here." : "अहिलेसम्म ग्राहक छैन — अर्डर यहाँ देखिनेछ।"}</div>
      ) : (
        <div style={{ overflowX: "auto", border: `1px solid ${C.gold400}33`, borderRadius: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: dark ? C.plum900 : C.ivory100, textAlign: "left" }}>
                {[t.fullName, t.phoneNumber, t.totalOrders, t.revenue].map((h, i) => <th key={i} className="ss-caption" style={{ padding: "10px 12px", fontSize: 11, color: C.ink600 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.gold400}22` }}>
                  <td style={{ padding: 10 }}>{c.name}</td>
                  <td style={{ padding: 10 }}>{c.phone}</td>
                  <td style={{ padding: 10 }}>{c.orders}</td>
                  <td style={{ padding: 10 }}>{fmtNPR(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminLoginHistory({ t, lang, dark, loginHistory }) {
  const list = loginHistory || [];
  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{lang === "en" ? "Login History" : "लगइन इतिहास"}</h2>
      <p className="ss-caption" style={{ fontSize: 12, color: C.ink600, marginBottom: 18 }}>
        {lang === "en" ? "Every verified email login, saved permanently and visible to all admins." : "हरेक प्रमाणित इमेल लगइन, स्थायी रूपमा सुरक्षित र सबै एडमिनलाई देखिने।"}
      </p>
      {list.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: C.ink600 }}>{lang === "en" ? "No logins recorded yet." : "अहिलेसम्म कुनै लगइन रेकर्ड छैन।"}</div>
      ) : (
        <div style={{ overflowX: "auto", border: `1px solid ${C.gold400}33`, borderRadius: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: dark ? C.plum900 : C.ivory100, textAlign: "left" }}>
                {[lang === "en" ? "Email" : "इमेल", lang === "en" ? "Date & Time" : "मिति र समय"].map((h, i) => (
                  <th key={i} className="ss-caption" style={{ padding: "10px 12px", fontSize: 11, color: C.ink600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((entry, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.gold400}22` }}>
                  <td style={{ padding: 10 }}>{entry.email}</td>
                  <td style={{ padding: 10, color: C.ink600 }}>{new Date(entry.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminReviews({ t, lang, dark, reviews, products, deleteReview }) {
  const list = [...(reviews || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div>
      <h2 className="ss-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{lang === "en" ? "Reviews" : "समीक्षा"}</h2>
      <p className="ss-caption" style={{ fontSize: 12, color: C.ink600, marginBottom: 18 }}>
        {lang === "en" ? "All customer reviews across your products. Remove anything inappropriate or spam." : "तपाईंका सबै सामानमा भएका ग्राहक समीक्षाहरू। अनुपयुक्त वा स्प्याम भएमा हटाउनुहोस्।"}
      </p>
      {list.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: C.ink600 }}>{lang === "en" ? "No reviews yet." : "अहिलेसम्म कुनै समीक्षा छैन।"}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((r) => {
            const product = products.find((p) => p.id === r.productId);
            return (
              <div key={r.id} style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</span>
                      {r.verified && <Badge tone="gold"><CircleCheck size={11} /> {t.verifiedPurchase}</Badge>}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.ink600, marginBottom: 4 }}>
                      {product ? (lang === "en" ? product.nameEn : (product.nameNp || product.nameEn)) : r.productId} · {new Date(r.date).toLocaleString()}
                    </div>
                    <div style={{ display: "flex", gap: 1, marginBottom: 6 }}>
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < r.rating ? C.gold400 : "none"} color={C.gold400} />)}
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 560 }}>{r.comment}</p>
                    <p style={{ fontSize: 11, color: C.ink600, marginTop: 4 }}>{r.email}</p>
                  </div>
                  <button className="ss-btn" onClick={() => deleteReview(r.id)} style={{ background: "none", color: "#D14343", flexShrink: 0 }}><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
