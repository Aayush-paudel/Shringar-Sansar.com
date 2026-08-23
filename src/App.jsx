import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ShoppingBag, Heart, User, Search, Menu, X, Globe, Moon, Sun, Star,
  ChevronRight, ChevronLeft, MapPin, Phone, Clock, Upload, Trash2, Edit2,
  Plus, Check, Lock, Mail, Package, TrendingUp, Users, DollarSign,
  LayoutDashboard, LogOut, Gem, Sparkles, ShieldCheck, Truck, Minus,
  AlertCircle, ChevronDown, MessageCircle, Facebook, Instagram, Award,
  RefreshCw, Eye, EyeOff, Filter, ArrowLeft, CircleCheck, Banknote, QrCode
} from "lucide-react";
import emailjs from "@emailjs/browser";

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
   TRANSLATIONS
   ============================================================ */
const STR = {
  en: {
    tagline: "Adorn Your Story",
    heroTitle: "Shringar Sansar",
    heroSub: "Bharatpur's home for bridal jewellery, traditional adornments & everyday elegance — curated with love since day one.",
    shopNow: "Shop Now",
    exploreCategories: "Explore Categories",
    ourStory: "Our Story",
    storyText: "What began as a small counter near Sahid Chowk has grown into Bharatpur's trusted address for shringar — the Nepali art of adornment. Every bangle, tikka and necklace on our shelves is chosen the way we'd choose for our own family: with care, honesty and an eye for lasting beauty.",
    featured: "Featured Pieces",
    viewAll: "View All",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    testimonials: "What Our Customers Say",
    counters: "Trusted by Bharatpur & Beyond",
    happyCustomers: "Happy Customers",
    productsSold: "Pieces Sold",
    yearsService: "Years of Trust",
    provincesServed: "Provinces Delivered",
    deliversAll: "Delivers to all 7 provinces of Nepal",
    blog: "Beauty Tips & Stories",
    faq: "Frequently Asked Questions",
    visitUs: "Visit Our Shop",
    cart: "Cart",
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    total: "Total",
    checkout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    login: "Login",
    logout: "Logout",
    myOrders: "My Orders",
    admin: "Admin",
    home: "Home",
    shop: "Shop",
    about: "About",
    contact: "Contact",
    searchPlaceholder: "Search jewellery, cosmetics...",
    verifyRequired: "Please verify your email to continue to checkout.",
    enterEmail: "Enter your email",
    sendCode: "Send Verification Code",
    enterCode: "Enter the 4-digit code",
    verify: "Verify & Continue",
    wrongCode: "Incorrect code. Please try again.",
    demoCodeNote: "Demo mode — no real email is sent. Your code is shown below for testing.",
    step1: "Cart",
    step2: "Delivery",
    step3: "Payment",
    step4: "Confirmation",
    selectProvince: "Select Province",
    district: "District",
    municipality: "Municipality / VDC",
    ward: "Ward No.",
    landmark: "Landmark (optional)",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    fasterDelivery: "⚡ Faster delivery (1–2 days) in Bagmati / Kathmandu Valley",
    standardDelivery: "Standard delivery (3–6 days) to other provinces",
    paymentMethod: "Choose Payment Method",
    esewa: "eSewa QR Payment",
    bank: "Bank Transfer",
    cod: "Cash on Delivery",
    codOutside: "Handling fee applies for COD outside Kathmandu Valley",
    uploadProof: "Upload Payment Proof",
    placeOrder: "Place Order",
    orderConfirmed: "Order Confirmed!",
    orderId: "Order ID",
    pendingVerification: "Payment pending verification",
    backToHome: "Back to Home",
    allCategories: "All Categories",
    priceRange: "Price Range",
    sortBy: "Sort By",
    newest: "Newest",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    noProducts: "No products match your filters.",
    quickView: "Quick View",
    inStock: "In stock",
    lowStock: "Low stock",
    qty: "Qty",
    remove: "Remove",
    secureCheckout: "Secure Checkout",
    verifiedReviews: "Verified Reviews",
    freeReturns: "Easy Returns",
    adminLoginTitle: "Owner / Staff Access",
    adminPassword: "Access Password",
    enter: "Enter",
    wrongPassword: "Incorrect password.",
    overview: "Overview",
    products: "Products",
    orders: "Orders",
    customers: "Customers",
    revenue: "Total Revenue",
    totalOrders: "Total Orders",
    lowStockAlert: "Low Stock Items",
    visitors: "Site Visitors",
    addProduct: "Add New Product",
    productNameEn: "Product Name (English)",
    productNameNp: "Product Name (Nepali)",
    category: "Category",
    price: "Price (NPR)",
    discount: "Discount %",
    stock: "Stock Quantity",
    featuredToggle: "Featured Product",
    productImage: "Product Photo",
    save: "Save Product",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    manageOrders: "Manage Orders",
    updateStatus: "Update Status",
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    exportCSV: "Export CSV",
    shopInfo: "Shop Information",
    getDirections: "Get Directions",
    openingHours: "Opening Hours",
    dailyFrom: "Daily from 8:30 AM",
    close: "Close",
  },
  np: {
    tagline: "तपाईंको कथा सिँगार्नुहोस्",
    heroTitle: "श्रृंगार संसार",
    heroSub: "भरतपुरको दुलही गहना, परम्परागत श्रृंगार र दैनिक सुन्दरताको भरपर्दो ठेगाना — मायाका साथ छानिएको।",
    shopNow: "किनमेल गर्नुहोस्",
    exploreCategories: "श्रेणीहरू हेर्नुहोस्",
    ourStory: "हाम्रो कथा",
    storyText: "सहिद चोक नजिकैको सानो पसलबाट सुरु भएको यो यात्रा आज भरतपुरको भरपर्दो श्रृंगार गन्तव्य बनेको छ। हाम्रो सेल्फमा भएको हरेक चुरा, टीका र माला आफ्नै परिवारका लागि छान्ने भावनाले छानिएको हो।",
    featured: "विशेष सामानहरू",
    viewAll: "सबै हेर्नुहोस्",
    addToCart: "कार्टमा राख्नुहोस्",
    outOfStock: "स्टक छैन",
    testimonials: "ग्राहकका अनुभवहरू",
    counters: "भरतपुर र बाहिर पनि भरपर्दो",
    happyCustomers: "खुसी ग्राहकहरू",
    productsSold: "बिक्री भएका सामान",
    yearsService: "वर्षको विश्वास",
    provincesServed: "प्रदेशमा डेलिभरी",
    deliversAll: "नेपालका सबै ७ प्रदेशमा डेलिभरी हुन्छ",
    blog: "सौन्दर्य सुझाव र कथाहरू",
    faq: "बारम्बार सोधिने प्रश्नहरू",
    visitUs: "हाम्रो पसलमा आउनुहोस्",
    cart: "कार्ट",
    yourCart: "तपाईंको कार्ट",
    emptyCart: "तपाईंको कार्ट खाली छ",
    subtotal: "उप-जम्मा",
    deliveryFee: "डेलिभरी शुल्क",
    total: "जम्मा",
    checkout: "चेकआउट गर्नुहोस्",
    continueShopping: "किनमेल जारी राख्नुहोस्",
    login: "लगइन",
    logout: "लगआउट",
    myOrders: "मेरो अर्डरहरू",
    admin: "एडमिन",
    home: "गृहपृष्ठ",
    shop: "पसल",
    about: "हाम्रो बारे",
    contact: "सम्पर्क",
    searchPlaceholder: "गहना, सौन्दर्य सामान खोज्नुहोस्...",
    verifyRequired: "चेकआउट अगाडि बढ्न कृपया इमेल प्रमाणित गर्नुहोस्।",
    enterEmail: "आफ्नो इमेल राख्नुहोस्",
    sendCode: "प्रमाणीकरण कोड पठाउनुहोस्",
    enterCode: "४-अंकको कोड राख्नुहोस्",
    verify: "प्रमाणित गर्नुहोस्",
    wrongCode: "गलत कोड। फेरि प्रयास गर्नुहोस्।",
    demoCodeNote: "डेमो मोड — वास्तविक इमेल पठाइँदैन। परीक्षणका लागि कोड तल देखाइएको छ।",
    step1: "कार्ट",
    step2: "डेलिभरी",
    step3: "भुक्तानी",
    step4: "पुष्टि",
    selectProvince: "प्रदेश छान्नुहोस्",
    district: "जिल्ला",
    municipality: "नगरपालिका / गाउँपालिका",
    ward: "वडा नं.",
    landmark: "ल्यान्डमार्क (वैकल्पिक)",
    fullName: "पूरा नाम",
    phoneNumber: "फोन नम्बर",
    fasterDelivery: "⚡ बागमती / काठमाडौं उपत्यकामा छिटो डेलिभरी (१-२ दिन)",
    standardDelivery: "अन्य प्रदेशमा साधारण डेलिभरी (३-६ दिन)",
    paymentMethod: "भुक्तानी विधि छान्नुहोस्",
    esewa: "eSewa QR भुक्तानी",
    bank: "बैंक ट्रान्सफर",
    cod: "डेलिभरीमा नगद भुक्तानी",
    codOutside: "उपत्यका बाहिर COD मा ह्यान्डलिङ शुल्क लाग्छ",
    uploadProof: "भुक्तानी प्रमाण अपलोड गर्नुहोस्",
    placeOrder: "अर्डर गर्नुहोस्",
    orderConfirmed: "अर्डर पुष्टि भयो!",
    orderId: "अर्डर आईडी",
    pendingVerification: "भुक्तानी प्रमाणीकरण बाँकी",
    backToHome: "गृहपृष्ठमा फर्कनुहोस्",
    allCategories: "सबै श्रेणी",
    priceRange: "मूल्य दायरा",
    sortBy: "क्रमबद्ध गर्नुहोस्",
    newest: "नयाँ",
    priceLowHigh: "मूल्य: कम देखि बढी",
    priceHighLow: "मूल्य: बढी देखि कम",
    noProducts: "तपाईंको फिल्टरसँग मिल्ने सामान भेटिएन।",
    quickView: "छिटो हेर्नुहोस्",
    inStock: "स्टकमा छ",
    lowStock: "थोरै स्टक",
    qty: "परिमाण",
    remove: "हटाउनुहोस्",
    secureCheckout: "सुरक्षित चेकआउट",
    verifiedReviews: "प्रमाणित समीक्षा",
    freeReturns: "सजिलो फिर्ता",
    adminLoginTitle: "मालिक / कर्मचारी पहुँच",
    adminPassword: "पहुँच पासवर्ड",
    enter: "प्रवेश गर्नुहोस्",
    wrongPassword: "गलत पासवर्ड।",
    overview: "सिंहावलोकन",
    products: "सामानहरू",
    orders: "अर्डरहरू",
    customers: "ग्राहकहरू",
    revenue: "कुल आम्दानी",
    totalOrders: "कुल अर्डर",
    lowStockAlert: "कम स्टक भएका सामान",
    visitors: "साइट भ्रमणकर्ता",
    addProduct: "नयाँ सामान थप्नुहोस्",
    productNameEn: "सामानको नाम (अंग्रेजी)",
    productNameNp: "सामानको नाम (नेपाली)",
    category: "श्रेणी",
    price: "मूल्य (रु.)",
    discount: "छुट %",
    stock: "स्टक परिमाण",
    featuredToggle: "विशेष सामान",
    productImage: "सामानको फोटो",
    save: "सामान सुरक्षित गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    edit: "सम्पादन",
    delete: "मेटाउनुहोस्",
    manageOrders: "अर्डर व्यवस्थापन",
    updateStatus: "स्थिति अपडेट गर्नुहोस्",
    pending: "पेन्डिङ",
    processing: "प्रोसेसिङ",
    shipped: "पठाइयो",
    delivered: "डेलिभर भयो",
    cancelled: "रद्द भयो",
    exportCSV: "CSV निर्यात",
    shopInfo: "पसलको जानकारी",
    getDirections: "बाटो हेर्नुहोस्",
    openingHours: "खुल्ने समय",
    dailyFrom: "हरेक दिन बिहान ८:३० बजेदेखि",
    close: "बन्द गर्नुहोस्",
  },
};

const PROVINCES = [
  "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim",
];

const CATEGORIES = [
  { id: "necklace", en: "Necklace Sets", np: "माला सेट", icon: "💎" },
  { id: "earrings", en: "Earrings", np: "कान का बाला", icon: "✨" },
  { id: "bangles", en: "Bangles", np: "चुरा", icon: "⭕" },
  { id: "tikka", en: "Tikka & Mang Tikka", np: "टीका", icon: "👑" },
  { id: "rings", en: "Rings", np: "औंठी", icon: "💍" },
  { id: "cosmetics", en: "Cosmetics", np: "सौन्दर्य सामान", icon: "💄" },
];

const SHOP = {
  name: "Shringar Sansar",
  address: "Narayanghat, Sahid Chowk, Indradev Marga, Bharatpur",
  postal: "00977",
  phone: "985-5015832",
  landmark: "Near The Mobile Solution",
  plusCode: "MCVF+XH Bharatpur",
  hours: "Daily from 8:30 AM",
  mapQuery: "MCVF+XH Bharatpur Nepal",
};

/* ============================================================
   SEED DATA
   ============================================================ */
const SEED_PRODUCTS = [
  { id: "p1", nameEn: "Royal Kundan Necklace Set", nameNp: "रोयल कुन्दन माला सेट", category: "necklace", price: 4500, discount: 10, stock: 6, featured: true, rating: 4.8, reviews: 32, emoji: "💎", color: C.wine700 },
  { id: "p2", nameEn: "Gold Plated Jhumka Earrings", nameNp: "गोल्ड प्लेटेड झुम्का", category: "earrings", price: 1200, discount: 0, stock: 14, featured: true, rating: 4.7, reviews: 51, emoji: "✨", color: C.gold400 },
  { id: "p3", nameEn: "Traditional Glass Bangles (Set of 12)", nameNp: "परम्परागत चुरा (१२ को सेट)", category: "bangles", price: 650, discount: 5, stock: 25, featured: true, rating: 4.6, reviews: 88, emoji: "⭕", color: C.rose500 },
  { id: "p4", nameEn: "Bridal Mang Tikka", nameNp: "दुलही मांग टीका", category: "tikka", price: 1800, discount: 15, stock: 3, featured: true, rating: 4.9, reviews: 19, emoji: "👑", color: C.gold300 },
  { id: "p5", nameEn: "Antique Finish Ring", nameNp: "एन्टिक फिनिस औंठी", category: "rings", price: 950, discount: 0, stock: 18, featured: false, rating: 4.5, reviews: 27, emoji: "💍", color: C.wine600 },
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
   UTILITIES
   ============================================================ */
const fmtNPR = (n) => "Rs. " + Number(n || 0).toLocaleString("en-IN");

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

function ProductImage({ p, size = 64 }) {
  if (p.image) {
    return <img src={p.image} alt={p.nameEn} style={{ width: size, height: size, objectFit: "cover", borderRadius: 10 }} />;
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.42, background: `linear-gradient(150deg, ${p.color || C.wine700}22, ${p.color || C.wine700}55)`,
        border: `1px solid ${p.color || C.gold400}55`,
      }}
    >
      {p.emoji || "💠"}
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
export default function ShringarSansarApp() {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const [route, setRoute] = useState({ page: "home" });
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useState({ email: null, verified: false });
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [booted, setBooted] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const t = STR[lang];
  const dark = theme === "dark";

  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(showToast._h);
    showToast._h = window.setTimeout(() => setToast(null), 2600);
  }, []);

  /* ---------- boot: load persisted state ---------- */
  useEffect(() => {
    (async () => {
      const storedProducts = await storageGet("products", true, null);
      if (storedProducts && Array.isArray(storedProducts) && storedProducts.length) {
        setProducts(storedProducts);
      } else {
        await storageSet("products", SEED_PRODUCTS, true);
      }
      const storedCart = await storageGet("cart", false, []);
      setCart(storedCart || []);
      const storedOrders = await storageGet("orders", false, []);
      setOrders(storedOrders || []);
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

  const persistProducts = useCallback(async (next) => {
    setProducts(next);
    await storageSet("products", next, true);
  }, []);

  /* ---------- cart helpers ---------- */
  const cartDetailed = useMemo(
    () => cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((c) => c.product),
    [cart, products]
  );
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartSubtotal = cartDetailed.reduce((s, c) => {
    const price = c.product.price * (1 - (c.product.discount || 0) / 100);
    return s + price * c.qty;
  }, 0);

  function addToCart(productId, qty = 1) {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === productId);
      if (exists) return prev.map((c) => (c.id === productId ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { id: productId, qty }];
    });
    showToast(lang === "en" ? "Added to cart" : "कार्टमा थपियो");
    setCartOpen(true);
  }
  function setCartQty(productId, qty) {
    setCart((prev) => (qty <= 0 ? prev.filter((c) => c.id !== productId) : prev.map((c) => (c.id === productId ? { ...c, qty } : c))));
  }
  function removeFromCart(productId) {
    setCart((prev) => prev.filter((c) => c.id !== productId));
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

      {adminMode ? (
        <AdminApp
          t={t} lang={lang} dark={dark}
          products={products} setProducts={persistProducts}
          orders={orders} setOrders={setOrders}
          visitorCount={visitorCount}
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
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          />

          <main>
            {route.page === "home" && (
              <HomePage t={t} lang={lang} dark={dark} products={products} go={go} addToCart={addToCart} visitorCount={visitorCount} />
            )}
            {route.page === "shop" && (
              <ShopPage t={t} lang={lang} dark={dark} products={products} addToCart={addToCart} initialQuery={searchQuery} />
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
                auth={auth} setLoginOpen={setLoginOpen} go={go}
                onOrderPlaced={(order) => {
                  setOrders((prev) => [order, ...prev]);
                  setCart([]);
                }}
              />
            )}
            {route.page === "orders" && <OrdersPage t={t} lang={lang} dark={dark} orders={orders} go={go} />}
            {route.page === "admin-gate" && (
              <AdminGate t={t} dark={dark} onSuccess={() => setAdminMode(true)} onCancel={() => go("home")} />
            )}
            {route.page === "about" && <AboutPage t={t} lang={lang} dark={dark} />}
            {route.page === "contact" && <ContactPage t={t} lang={lang} dark={dark} />}
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
              onVerified={(email) => { setAuth({ email, verified: true }); setLoginOpen(false); showToast(lang === "en" ? "Email verified" : "इमेल प्रमाणित भयो"); }}
            />
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function Header({ t, lang, setLang, theme, setTheme, cartCount, onCartClick, onLoginClick, auth, onLogout, go, route, dark, onAdminClick, searchQuery, setSearchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navItems = [
    { key: "home", label: t.home },
    { key: "shop", label: t.shop },
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
            width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(140deg, ${C.wine700}, ${C.plum950})`,
            display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${C.gold400}`,
          }}>
            <span className="ss-display" style={{ color: C.gold300, fontWeight: 700, fontSize: 17 }}>SS</span>
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

        <button className="ss-btn" title={lang === "en" ? "नेपाली" : "English"} onClick={() => setLang(lang === "en" ? "np" : "en")}
          style={{ background: "none", display: "flex", alignItems: "center", gap: 4, color: dark ? C.ivory50 : C.ink900, fontSize: 12 }} className="ss-caption">
          <Globe size={17} /> <span style={{ fontWeight: 600 }}>{lang === "en" ? "EN" : "ने"}</span>
        </button>

        <button className="ss-btn" onClick={() => setTheme(dark ? "light" : "dark")} style={{ background: "none", color: dark ? C.gold300 : C.ink900 }}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="ss-btn" onClick={() => auth.verified ? setAccountOpen((o) => !o) : onLoginClick()} title={t.login} style={{ background: "none", color: dark ? C.ivory50 : C.ink900, position: "relative" }}>
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

        <button className="ss-btn" onClick={onCartClick} style={{ background: "none", color: dark ? C.ivory50 : C.ink900, position: "relative" }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -8, background: C.gold400, color: C.ink900, fontSize: 10, fontWeight: 700,
              borderRadius: 999, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
            }}>{cartCount}</span>
          )}
        </button>

        <button className="ss-btn" onClick={() => setMenuOpen((m) => !m)} style={{ background: "none", color: dark ? C.ivory50 : C.ink900 }} title="Menu">
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

function HomePage({ t, lang, dark, products, go, addToCart, visitorCount }) {
  const featured = products.filter((p) => p.featured);
  const [tIndex, setTIndex] = useState(0);
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

      {/* CATEGORIES */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 20px" }}>
        <SectionHeading title={t.exploreCategories} dark={dark} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginTop: 24 }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} className="ss-btn ss-card" onClick={() => go("shop", { category: c.id })}
              style={{
                background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 16, padding: "22px 12px",
                textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}>
              <span style={{ fontSize: 30 }}>{c.icon}</span>
              <span className="ss-caption" style={{ fontSize: 13, fontWeight: 600, color: dark ? C.ivory50 : C.ink900 }}>{lang === "en" ? c.en : c.np}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <SectionHeading title={t.featured} dark={dark} />
          <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ background: "none", color: C.wine700, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            {t.viewAll} <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18, marginTop: 22 }}>
          {featured.map((p) => <ProductCard key={p.id} p={p} t={t} lang={lang} dark={dark} addToCart={addToCart} />)}
        </div>
      </section>

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

      {/* EVENTS / BLOG TEASER */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 56px" }}>
        <SectionHeading title={t.blog} dark={dark} />
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

function ProductCard({ p, t, lang, dark, addToCart, onQuickView }) {
  const finalPrice = Math.round(p.price * (1 - (p.discount || 0) / 100));
  const name = lang === "en" ? p.nameEn : (p.nameNp || p.nameEn);
  return (
    <div className="ss-card ss-fade-in" style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", padding: 14, display: "flex", justifyContent: "center", background: dark ? C.plum950 + "66" : C.ivory100 }}
        onClick={() => onQuickView && onQuickView(p)}>
        <ProductImage p={p} size={130} />
        {p.discount > 0 && <div style={{ position: "absolute", top: 10, left: 10 }}><Badge tone="wine">-{p.discount}%</Badge></div>}
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
          <Star size={12} fill={C.gold400} color={C.gold400} /> {p.rating} <span style={{ opacity: 0.6 }}>({p.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: C.wine700 }}>{fmtNPR(finalPrice)}</span>
          {p.discount > 0 && <span style={{ fontSize: 12, textDecoration: "line-through", color: C.ink600, opacity: 0.6 }}>{fmtNPR(p.price)}</span>}
        </div>
        <button
          className="ss-btn ss-caption" disabled={p.stock === 0} onClick={() => addToCart(p.id)}
          style={{
            marginTop: 6, background: p.stock === 0 ? "#999" : C.wine700, color: "#fff", padding: "9px 12px",
            borderRadius: 10, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            opacity: p.stock === 0 ? 0.6 : 1, cursor: p.stock === 0 ? "not-allowed" : "pointer",
          }}>
          <ShoppingBag size={14} /> {t.addToCart}
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
function ShopPage({ t, lang, dark, products, addToCart, initialQuery }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState(initialQuery || "");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [quickView, setQuickView] = useState(null);

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
            {list.map((p) => <ProductCard key={p.id} p={p} t={t} lang={lang} dark={dark} addToCart={addToCart} onQuickView={setQuickView} />)}
          </div>
        )}
      </div>

      {quickView && <QuickViewModal p={quickView} t={t} lang={lang} dark={dark} addToCart={addToCart} onClose={() => setQuickView(null)} />}

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

function QuickViewModal({ p, t, lang, dark, addToCart, onClose }) {
  const [qty, setQty] = useState(1);
  const finalPrice = Math.round(p.price * (1 - (p.discount || 0) / 100));
  return (
    <ModalShell onClose={onClose} dark={dark} width={560}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", justifyContent: "center" }}><ProductImage p={p} size={180} /></div>
        <div style={{ flex: "1 1 240px" }}>
          <span className="ss-caption" style={{ fontSize: 11, color: C.gold400 }}>{CATEGORIES.find((c) => c.id === p.category)?.[lang]}</span>
          <h3 className="ss-display" style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 8px" }}>{lang === "en" ? p.nameEn : p.nameNp}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, marginBottom: 10 }}>
            <Star size={13} fill={C.gold400} color={C.gold400} /> {p.rating} ({p.reviews} {t.verifiedReviews})
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 22, color: C.wine700 }}>{fmtNPR(finalPrice)}</span>
            {p.discount > 0 && <span style={{ textDecoration: "line-through", color: C.ink600, fontSize: 14 }}>{fmtNPR(p.price)}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <QtyStepper qty={qty} setQty={setQty} max={p.stock} />
            <span className="ss-caption" style={{ fontSize: 12, color: p.stock <= 4 ? C.rose500 : "#2E9E5B" }}>{p.stock === 0 ? t.outOfStock : p.stock <= 4 ? t.lowStock : t.inStock}</span>
          </div>
          <button className="ss-btn ss-caption" disabled={p.stock === 0} onClick={() => { addToCart(p.id, qty); onClose(); }}
            style={{ width: "100%", background: C.wine700, color: "#fff", padding: "12px", borderRadius: 10, fontWeight: 600, fontSize: 14, opacity: p.stock === 0 ? 0.5 : 1 }}>
            {t.addToCart}
          </button>
        </div>
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

function ModalShell({ children, onClose, dark, width = 480 }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#0009", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} className="ss-fade-in" style={{ background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, borderRadius: 18, padding: 24, width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto", position: "relative", border: `1px solid ${C.gold400}44` }}>
        <button onClick={onClose} className="ss-btn" style={{ position: "absolute", top: 14, right: 14, background: "none", color: dark ? C.ivory50 : C.ink900 }}><X size={18} /></button>
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
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{lang === "en" ? c.product.nameEn : c.product.nameNp}</div>
        <div style={{ fontSize: 13, color: C.wine700, fontWeight: 700, marginTop: 2 }}>{fmtNPR(price)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
          <QtyStepper qty={c.qty} setQty={(q) => setCartQty(c.id, q)} max={c.product.stock} />
          <button className="ss-btn ss-caption" onClick={() => removeFromCart(c.id)} style={{ background: "none", color: C.ink600, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
            <Trash2 size={12} /> {t.remove}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, t, lang, dark, cartDetailed, setCartQty, removeFromCart, subtotal, go }) {
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "min(380px, 100%)", zIndex: 250,
      background: dark ? C.plum900 : "#fff", color: dark ? C.ivory50 : C.ink900, boxShadow: "-10px 0 30px -10px #0006",
      transform: open ? "translateX(0)" : "translateX(105%)", transition: "transform .3s ease", display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.gold400}33` }}>
        <span className="ss-display" style={{ fontSize: 19, fontWeight: 700 }}>{t.yourCart}</span>
        <button className="ss-btn" onClick={onClose} style={{ background: "none", color: "inherit" }}><X size={18} /></button>
      </div>
      <div className="ss-scroll" style={{ flex: 1, overflowY: "auto", padding: "0 18px" }}>
        {cartDetailed.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: C.ink600 }}>
            <ShoppingBag size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div>{t.emptyCart}</div>
          </div>
        ) : cartDetailed.map((c) => <CartLineItem key={c.id} c={c} t={t} lang={lang} dark={dark} setCartQty={setCartQty} removeFromCart={removeFromCart} />)}
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
            {cartDetailed.map((c) => <CartLineItem key={c.id} c={c} t={t} lang={lang} dark={dark} setCartQty={setCartQty} removeFromCart={removeFromCart} />)}
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

function CheckoutFlow({ t, lang, dark, cartDetailed, subtotal, auth, setLoginOpen, go, onOrderPlaced }) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: "", phone: "", province: "Bagmati", district: "", municipality: "", ward: "", landmark: "" });
  const [payment, setPayment] = useState("esewa");
  const [proofName, setProofName] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const isValley = address.province === "Bagmati";
  const deliveryFee = cartDetailed.length ? (isValley ? 100 : 250) : 0;
  const codHandling = payment === "cod" && !isValley ? 150 : 0;
  const total = subtotal + deliveryFee + codHandling;

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
      if (!address.fullName || !address.phone || !address.district || !address.municipality || !address.ward) return;
      setStep(2); return;
    }
    if (step === 2) {
      const order = {
        id: genId("SS"),
        date: new Date().toISOString(),
        items: cartDetailed.map((c) => ({ id: c.id, name: c.product.nameEn, qty: c.qty, price: c.product.price })),
        address, payment, paymentLabel: payment === "esewa" ? t.esewa : payment === "bank" ? t.bank : t.cod,
        subtotal, deliveryFee, codHandling, total,
        status: "pending",
      };
      setConfirmedOrder(order);
      onOrderPlaced(order);
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
          <FormRow label={t.fullName}><input className="ss-focus" style={inputStyle(dark)} value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} /></FormRow>
          <FormRow label={t.phoneNumber}><input className="ss-focus" style={inputStyle(dark)} value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} /></FormRow>
          <FormRow label={t.selectProvince}>
            <select className="ss-focus" style={inputStyle(dark)} value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })}>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormRow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormRow label={t.district}><input className="ss-focus" style={inputStyle(dark)} value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} /></FormRow>
            <FormRow label={t.ward}><input className="ss-focus" style={inputStyle(dark)} value={address.ward} onChange={(e) => setAddress({ ...address, ward: e.target.value })} /></FormRow>
          </div>
          <FormRow label={t.municipality}><input className="ss-focus" style={inputStyle(dark)} value={address.municipality} onChange={(e) => setAddress({ ...address, municipality: e.target.value })} /></FormRow>
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
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setProofName(e.target.files?.[0]?.name || "")} />
                </label>
                {proofName && <span style={{ marginLeft: 8, fontSize: 12, color: "#2E9E5B" }}><Check size={12} style={{ verticalAlign: "middle" }} /> {proofName}</span>}
              </div>
            )}
            <PaymentOption id="cod" selected={payment} onSelect={setPayment} icon={Package} label={t.cod} dark={dark} />
            {payment === "cod" && !isValley && (
              <div style={{ fontSize: 12.5, color: C.rose500, display: "flex", gap: 6, alignItems: "center" }}><AlertCircle size={13} /> {t.codOutside} (+{fmtNPR(150)})</div>
            )}
          </div>
          <div style={{ marginTop: 20, borderTop: `1px solid ${C.gold400}33`, paddingTop: 14 }}>
            <Row label={t.subtotal} value={fmtNPR(subtotal)} />
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
function FormRow({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label className="ss-caption" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 5 }}>{label}</label>
      {children}
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
function OrdersPage({ t, lang, dark, orders, go }) {
  const statusColor = { pending: C.gold400, processing: "#3E7CB1", shipped: "#8355C9", delivered: "#2E9E5B", cancelled: "#D14343" };
  const statusLabel = { pending: t.pending, processing: t.processing, shipped: t.shipped, delivered: t.delivered, cancelled: t.cancelled };
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px 60px" }}>
      <SectionHeading title={t.myOrders} dark={dark} />
      {orders.length === 0 ? (
        <div style={{ padding: 50, textAlign: "center", color: C.ink600 }}>
          <Package size={36} style={{ opacity: 0.4, marginBottom: 10 }} />
          <p>{lang === "en" ? "No orders yet." : "अहिलेसम्म कुनै अर्डर छैन।"}</p>
          <button className="ss-btn ss-caption" onClick={() => go("shop")} style={{ marginTop: 12, background: C.wine700, color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{t.shopNow}</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
          {orders.map((o) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ABOUT / CONTACT
   ============================================================ */
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
function ContactPage({ t, lang, dark }) {
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
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <a href={`tel:${SHOP.phone.replace(/\D/g, "")}`} className="ss-btn ss-caption" style={{ background: C.wine700, color: "#fff", padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><Phone size={13} /> {lang === "en" ? "Call" : "फोन"}</a>
          <button className="ss-btn ss-caption" style={{ background: "transparent", border: `1px solid ${C.gold400}`, color: dark ? C.ivory50 : C.ink900, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={13} /> {lang === "en" ? "Chat" : "च्याट"}</button>
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
function Footer({ t, lang, dark, go }) {
  return (
    <footer style={{ background: C.plum950, color: C.ivory100, padding: "40px 20px 20px", marginTop: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 30 }}>
        <div>
          <div className="ss-display" style={{ fontSize: 20, fontWeight: 700, color: C.gold300 }}>{SHOP.name}</div>
          <p style={{ fontSize: 12.5, marginTop: 8, opacity: 0.75, lineHeight: 1.6 }}>{SHOP.address}, {SHOP.postal}</p>
          <p style={{ fontSize: 12.5, opacity: 0.75 }}>{SHOP.landmark}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <Facebook size={16} color={C.gold400} /> <Instagram size={16} color={C.gold400} />
          </div>
        </div>
        <div>
          <div className="ss-caption" style={{ fontSize: 12, fontWeight: 700, color: C.gold400, marginBottom: 10 }}>{t.shop}</div>
          {["home", "shop", "about", "contact"].map((p) => (
            <button key={p} className="ss-btn ss-caption" onClick={() => go(p)} style={{ display: "block", background: "none", color: C.ivory100, fontSize: 13, padding: "4px 0", opacity: 0.85 }}>{t[p]}</button>
          ))}
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
function AdminGate({ t, dark, onSuccess, onCancel }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const DEMO_PASSWORD = "!@#$%";
  function submit() {
    if (pw === DEMO_PASSWORD) onSuccess();
    else setError(t.wrongPassword);
  }
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="ss-fade-in" style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}55`, borderRadius: 18, padding: 30, width: "100%", maxWidth: 360, textAlign: "center" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.wine700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Lock size={22} color="#fff" />
        </div>
        <h3 className="ss-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t.adminLoginTitle}</h3>
        <p style={{ fontSize: 11.5, color: C.ink600, marginBottom: 16 }}></p>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t.adminPassword} className="ss-focus" style={{ width: "100%", boxSizing: "border-box", padding: "11px 40px 11px 12px", borderRadius: 10, border: `1px solid ${C.gold400}55`, background: dark ? C.plum950 : "#fff", color: dark ? C.ivory50 : C.ink900, fontSize: 14 }} />
          <button className="ss-btn" onClick={() => setShow((s) => !s)} style={{ position: "absolute", right: 10, top: 10, background: "none", color: C.ink600 }}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </div>
        {error && <div style={{ color: "#D14343", fontSize: 12, marginBottom: 8 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ss-btn ss-caption" onClick={onCancel} style={{ flex: 1, background: "none", border: `1px solid ${C.gold400}55`, padding: 11, borderRadius: 10, fontSize: 13, color: dark ? C.ivory50 : C.ink900 }}>{t.cancel}</button>
          <button className="ss-btn ss-caption" onClick={submit} style={{ flex: 1, background: C.wine700, color: "#fff", padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 600 }}>{t.enter}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN APP
   ============================================================ */
function AdminApp({ t, lang, dark, products, setProducts, orders, setOrders, visitorCount, onExit }) {
  const [tab, setTab] = useState("overview");
  const bg = dark ? C.plum950 : C.ivory50;
  const fg = dark ? C.ivory100 : C.ink900;

  const tabs = [
    { id: "overview", label: t.overview, icon: LayoutDashboard },
    { id: "products", label: t.products, icon: Gem },
    { id: "orders", label: t.orders, icon: Package },
    { id: "customers", label: t.customers, icon: Users },
  ];

  return (
    <div style={{ minHeight: "100vh", background: bg, color: fg, display: "flex" }} className="ss-admin-shell">
      <aside style={{ width: 220, background: C.plum950, color: C.ivory50, padding: 18, flexShrink: 0 }} className="ss-admin-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 26 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.wine700, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.gold400}` }}>
            <span className="ss-display" style={{ color: C.gold300, fontWeight: 700, fontSize: 13 }}>SS</span>
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
        {tab === "orders" && <AdminOrders t={t} lang={lang} dark={dark} orders={orders} setOrders={setOrders} />}
        {tab === "customers" && <AdminCustomers t={t} lang={lang} dark={dark} orders={orders} />}
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
  return { nameEn: "", nameNp: "", category: CATEGORIES[0].id, price: "", discount: "0", stock: "", featured: false, image: null, emoji: "💠", color: C.wine700 };
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
    if (editingId) {
      setProducts(products.map((p) => (p.id === editingId ? { ...p, ...draft, price: Number(draft.price), discount: Number(draft.discount) || 0, stock: Number(draft.stock) } : p)));
    } else {
      const newProduct = {
        id: genId("p"), ...draft, price: Number(draft.price), discount: Number(draft.discount) || 0, stock: Number(draft.stock),
        rating: 5.0, reviews: 0,
      };
      setProducts([newProduct, ...products]);
    }
    resetForm();
  }
  function editProduct(p) {
    setDraft({ nameEn: p.nameEn, nameNp: p.nameNp || "", category: p.category, price: String(p.price), discount: String(p.discount || 0), stock: String(p.stock), featured: !!p.featured, image: p.image || null, emoji: p.emoji || "💠", color: p.color || C.wine700 });
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

function AdminOrders({ t, lang, dark, orders, setOrders }) {
  function updateStatus(id, status) {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  }
  function exportCSV() {
    const rows = [["Order ID", "Date", "Customer", "Total", "Status"], ...orders.map((o) => [o.id, o.date, o.address.fullName, o.total, o.status])];
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
          {orders.map((o) => (
            <div key={o.id} style={{ background: dark ? C.plum900 : "#fff", border: `1px solid ${C.gold400}33`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{o.id} — {o.address.fullName}</div>
                  <div style={{ fontSize: 11.5, color: C.ink600 }}>{new Date(o.date).toLocaleString()} · {o.address.province} · {o.paymentLabel}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{fmtNPR(o.total)}</div>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="ss-caption" style={{ fontSize: 11, color: C.ink600 }}>{t.updateStatus}:</span>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="ss-focus" style={{ ...inputStyle(dark), width: "auto", padding: "6px 10px", fontSize: 12 }}>
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{t[s]}</option>)}
                </select>
              </div>
            </div>
          ))}
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
