/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useId } from 'react';

// Editable constants
const WA_NUMBER = "923000000000";
const PHONE_DISPLAY = "+92 300 0000000";

interface Product {
  id: string;
  eyebrow: string;
  name: string;
  cardDesc: string;
  price: number;
  unit: string;
  image?: string;
  objectPos?: string;
  placeholderGrad?: string;
  alt?: string;
  modalDesc: string;
  bullets: [string, string, string];
}

interface CartItem {
  id: string;
  qty: number;
}

interface CustomerDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

interface OrderSummary {
  orderNumber: string;
  items: { name: string; qty: number; unit: string; total: number; image?: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer?: CustomerDetails;
}

const PRODUCTS: Product[] = [
  {
    id: "ghee",
    eyebrow: "A2 · Bilona",
    name: "A2 Bilona Desi Ghee",
    cardDesc: "Hand-churned from A2 cow milk and slow-simmered to a rich, nutty aroma.",
    price: 4500,
    unit: "kg",
    image: "/assets/aistudio/herosec_ghee_337295a7.jpg",
    objectPos: "38% 50%",
    alt: "Jar of A2 Bilona Desi Ghee with wooden spoon and white butter",
    modalDesc: "Hand-churned from A2 cow milk using the traditional bilona method, then slow-simmered over a low flame for a rich, nutty aroma.",
    bullets: [
      "Made from whole A2 curd",
      "Packed in sterilized glass jars",
      "Shelf life of 12 months"
    ]
  },
  {
    id: "saffron",
    eyebrow: "Kashmir · Grade I",
    name: "Kashmiri Saffron",
    cardDesc: "Deep red threads with intense colour and fragrance, hand-picked and sun-dried.",
    price: 1200,
    unit: "gram",
    image: "/assets/aistudio/img_al_syed_6750a5b7.jpg",
    objectPos: "48% 50%",
    alt: "Deep red Kashmiri Saffron threads in a carved wooden keepsake box",
    modalDesc: "Deep red Kashmiri threads with intense colour and fragrance, hand-picked and sun-dried.",
    bullets: [
      "Pure Mongra filaments only",
      "Hand-picked and sun-dried",
      "Comes in a keepsake wooden box"
    ]
  },
  {
    id: "haldi",
    eyebrow: "Heirloom · Stone-milled",
    name: "Heirloom Haldi",
    cardDesc: "Deep golden turmeric, stone-ground from sun-dried farm roots.",
    price: 900,
    unit: "250g",
    image: "/assets/aistudio/img_al_syed_2_6f10a85b.jpg",
    objectPos: "60% 50%",
    alt: "Stone-ground turmeric powder in a carved stone bowl with fresh roots",
    modalDesc: "Deep golden turmeric, stone-ground from sun-dried farm roots to keep its natural oils and colour.",
    bullets: [
      "Full-spectrum curcumin, untouched",
      "Water-cooled stone milled",
      "No colour or additives"
    ]
  },
  {
    id: "moringa",
    eyebrow: "Superfood · Shade-dried",
    name: "Moringa Leaf Powder",
    cardDesc: "Fresh moringa leaves, shade-dried and finely ground, rich in nutrients.",
    price: 750,
    unit: "250g",
    image: "/assets/aistudio/al_4_213b0b82.jpg",
    objectPos: "45% 50%",
    alt: "Fresh shade-dried moringa leaf powder in a terracotta bowl with leaves",
    modalDesc: "Fresh moringa leaves, shade-dried and finely ground to keep their nutrients intact.",
    bullets: [
      "Shade-dried, never sun-baked",
      "Finely ground leaf powder",
      "Zero additives"
    ]
  },
  {
    id: "honey",
    eyebrow: "Wild · Unfiltered",
    name: "Raw Forest Honey",
    cardDesc: "Unheated, unfiltered honey collected from wild flower seasons.",
    price: 2200,
    unit: "kg",
    placeholderGrad: "linear-gradient(135deg, #fbe3a6, #e0a030)",
    modalDesc: "Unheated, unfiltered honey collected from wild flower seasons on our land.",
    bullets: [
      "Raw and unfiltered",
      "From wild flower seasons",
      "Packed in glass jars"
    ]
  },
  {
    id: "atta",
    eyebrow: "Whole Wheat · Stone-milled",
    name: "Stone-Ground Atta",
    cardDesc: "Whole wheat milled slowly on stone to keep the bran and sweetness.",
    price: 450,
    unit: "kg",
    placeholderGrad: "linear-gradient(135deg, #f5e8c8, #cfae6a)",
    modalDesc: "Whole wheat milled slowly on stone to keep the bran, germ and natural sweetness.",
    bullets: [
      "100% whole wheat",
      "Slow stone-milled",
      "Soft, fluffy rotis"
    ]
  },
  {
    id: "oil",
    eyebrow: "Cold-pressed",
    name: "Pure Mustard Oil",
    cardDesc: "Cold-pressed from farm mustard seeds with a bold, pungent flavour.",
    price: 1100,
    unit: "litre",
    placeholderGrad: "linear-gradient(135deg, #eef0b8, #b7bf4a)",
    modalDesc: "Cold-pressed from farm mustard seeds with a bold, pungent flavour.",
    bullets: [
      "Cold-pressed, no heat",
      "No blending or additives",
      "Packed in glass bottles"
    ]
  },
  {
    id: "gur",
    eyebrow: "Chemical-free",
    name: "Organic Jaggery",
    cardDesc: "Slow-cooked sugarcane jaggery, naturally sweet with no additives.",
    price: 350,
    unit: "kg",
    placeholderGrad: "linear-gradient(135deg, #e7c49a, #a8672d)",
    modalDesc: "Slow-cooked sugarcane jaggery, naturally sweet with no additives.",
    bullets: [
      "No chemicals or colour",
      "Slow-cooked in open pans",
      "Rich, earthy sweetness"
    ]
  },
  {
    id: "seeds",
    eyebrow: "Heirloom · Hand-selected",
    name: "Heirloom Seeds",
    cardDesc: "Hand-selected heirloom seeds, saved from our own farm harvest.",
    price: 600,
    unit: "250g",
    image: "/assets/aistudio/img_al_3_f8d8c7e4.jpg",
    objectPos: "50% 50%",
    alt: "Hand-selected heirloom seeds and grains in ceramic bowls on wood",
    modalDesc: "Hand-selected heirloom seeds, saved from our own farm harvest.",
    bullets: [
      "Saved from our own harvest",
      "Hand-selected and cleaned",
      "Open-pollinated heirloom variety"
    ]
  }
];

const COMPARISON_ROWS = [
  {
    standard: "Desi Ghee Process",
    commercial: "Industrial cream centrifuge, boiled rapidly at high heat (>120°C)",
    alSyed: "A2 Whole Curd Bilona Churned at sunrise with wooden madhani"
  },
  {
    standard: "Turmeric Curcumin",
    commercial: "1.2% - 2.0% (Therapeutic oils often stripped & sold separately)",
    alSyed: "5.2% Full-Spectrum Curcumin Untouched & water-cooled stone milled"
  },
  {
    standard: "Saffron Purity",
    commercial: "Adulterated with corn silk, animal fibers, or synthetic orange dye",
    alSyed: "Certified ISO Category I Pure Kashmiri Mongra filaments only"
  },
  {
    standard: "Packaging Vessel",
    commercial: "Single-use plastic pouches & cheap PET jars (Microplastic & BPA risk)",
    alSyed: "Sterilized Food-Grade Glass Jars & Keepsake Wood Crated Boxes"
  },
  {
    standard: "Milk Source & Feed",
    commercial: "Confined buffalo/Holstein herds fed commercial silage & hormone stimulants",
    alSyed: "Pasture-grazing indigenous Gir cows fed natural herbs, grass & jaggery"
  },
  {
    standard: "Preservatives & Additives",
    commercial: "BHA/BHT preservatives, artificial clarifying agents, synthetic aromatics",
    alSyed: "Zero chemicals, zero anti-caking agents, zero artificial coloring"
  }
];

function formatPrice(amount: number): string {
  return "Rs " + amount.toLocaleString("en-US");
}

export default function App() {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("asfcart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) =>
            PRODUCTS.some((p) => p.id === item.id)
          );
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [cartBadgeBump, setCartBadgeBump] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderSummary | null>(null);

  // Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Checkout Form fields
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custCity, setCustCity] = useState("");
  const [custNotes, setCustNotes] = useState("");
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Product modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalAddedTick, setModalAddedTick] = useState(false);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  const checkoutCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  // Carousel ref and scroll states
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Contact form state
  const [contactSuccess, setContactSuccess] = useState(false);
  const contactFormRef = useRef<HTMLFormElement | null>(null);
  const nameInputId = useId();
  const phoneInputId = useId();
  const messageInputId = useId();

  // Footer newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("asfcart", JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  // Lock body scroll when any overlay is active
  useEffect(() => {
    const isLocked = isDrawerOpen || selectedProduct !== null || isCheckoutModalOpen;
    document.body.classList.toggle("lock", isLocked);
  }, [isDrawerOpen, selectedProduct, isCheckoutModalOpen]);

  // Check carousel scroll limits
  const updateCarouselScrollStatus = () => {
    if (!carouselTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselTrackRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track) return;
    updateCarouselScrollStatus();
    track.addEventListener("scroll", updateCarouselScrollStatus, { passive: true });
    window.addEventListener("resize", updateCarouselScrollStatus);
    return () => {
      track.removeEventListener("scroll", updateCarouselScrollStatus);
      window.removeEventListener("resize", updateCarouselScrollStatus);
    };
  }, []);

  // Scroll reveal Intersection Observer for animated sections and components
  useEffect(() => {
    const revealElements = document.querySelectorAll(
      ".reveal-init, .reveal-left-init, .reveal-zoom-init, .reveal-pop-init"
    );
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle keyboard Escape for modal / drawer / checkout
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isCheckoutModalOpen) {
          closeCheckoutModal();
        } else if (selectedProduct) {
          closeProductModal();
        } else if (isDrawerOpen) {
          closeCartDrawer();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct, isDrawerOpen, isCheckoutModalOpen]);

  // Carousel navigation handlers
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const firstCard = track.querySelector(".product-card") as HTMLElement | null;
    const cardStep = firstCard ? firstCard.offsetWidth + 24 : 260;
    const isDesktop = window.innerWidth > 900;
    const numCards = isDesktop ? 2 : 1;
    const offset = cardStep * numCards * (direction === "left" ? -1 : 1);
    track.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Cart operations
  const totalCartUnits = cart.reduce((acc, item) => acc + item.qty, 0);

  const triggerBadgeBump = () => {
    setCartBadgeBump(false);
    requestAnimationFrame(() => {
      setCartBadgeBump(true);
      setTimeout(() => setCartBadgeBump(false), 400);
    });
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, qty: Math.min(99, item.qty + quantity) }
            : item
        );
      }
      return [...prev, { id: productId, qty: Math.min(99, quantity) }];
    });
    triggerBadgeBump();
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const nextQty = item.qty + delta;
            return nextQty > 99 ? { ...item, qty: 99 } : { ...item, qty: nextQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Cart subtotal
  const cartSubtotal = cart.reduce((acc, item) => {
    const prod = PRODUCTS.find((p) => p.id === item.id);
    return acc + (prod ? prod.price * item.qty : 0);
  }, 0);

  // Open modal
  const openProductModal = (product: Product, e?: React.MouseEvent) => {
    lastActiveElementRef.current = (e?.currentTarget as HTMLElement) || document.activeElement as HTMLElement;
    setSelectedProduct(product);
    setModalQty(1);
    setModalAddedTick(false);
    setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 50);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === "function") {
      lastActiveElementRef.current.focus();
    }
  };

  // Open/close drawer
  const openCartDrawer = (e?: React.MouseEvent) => {
    lastActiveElementRef.current = (e?.currentTarget as HTMLElement) || document.activeElement as HTMLElement;
    setIsDrawerOpen(true);
    setTimeout(() => {
      drawerCloseBtnRef.current?.focus();
    }, 50);
  };

  const closeCartDrawer = () => {
    setIsDrawerOpen(false);
    if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === "function") {
      lastActiveElementRef.current.focus();
    }
  };

  // Pakistan Phone & Field Validation helpers
  const cleanPakPhone = (raw: string): string => {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("923") && digits.length === 12) {
      digits = "0" + digits.slice(2);
    }
    return digits;
  };

  const isPhoneValid = (val: string): boolean => {
    const digits = cleanPakPhone(val);
    return digits.length === 11 && digits.startsWith("03");
  };

  const isNameValid = (val: string): boolean => val.trim().length >= 2;
  const isAddressValid = (val: string): boolean => val.trim().length >= 5;
  const isCityValid = (val: string): boolean => val.trim().length >= 2;

  const isFormValid =
    isNameValid(custName) &&
    isPhoneValid(custPhone) &&
    isAddressValid(custAddress) &&
    isCityValid(custCity);

  // Delivery fee: Free on >= 5,000, else flat Rs 250 across Pakistan
  const deliveryFee = cartSubtotal >= 5000 ? 0 : (cartSubtotal > 0 ? 250 : 0);
  const grandTotal = cartSubtotal + deliveryFee;

  const markTouched = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const openCheckoutModal = () => {
    setIsDrawerOpen(false);
    setIsCheckoutModalOpen(true);
    setCheckoutSuccess(false);
    setTimeout(() => {
      checkoutCloseBtnRef.current?.focus();
    }, 50);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    if (checkoutSuccess) {
      setCustName("");
      setCustPhone("");
      setCustAddress("");
      setCustCity("");
      setCustNotes("");
      setTouchedFields({});
      setCheckoutSuccess(false);
    }
  };

  // Confirm and submit order
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields({ name: true, phone: true, address: true, city: true });

    if (!isFormValid || isSubmittingOrder || cart.length === 0) return;

    setIsSubmittingOrder(true);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNum = `#ASF-${randomNum}`;

    const summaryItems = cart.map((item) => {
      const prod = PRODUCTS.find((p) => p.id === item.id)!;
      return {
        name: prod.name,
        qty: item.qty,
        unit: prod.unit,
        total: prod.price * item.qty,
        image: prod.image,
      };
    });

    const orderPayload = {
      orderNumber: orderNum,
      name: custName.trim(),
      phone: cleanPakPhone(custPhone),
      address: custAddress.trim(),
      city: custCity.trim(),
      notes: custNotes.trim(),
      items: summaryItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total: grandTotal,
    };

    // Send order to backend API endpoint
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) {
        console.warn("Backend order submission responded with status:", res.status);
      }
    } catch (err) {
      console.warn("Network error submitting to backend, order saved locally:", err);
    }

    // Persist locally for client-side order inquiry tracking
    try {
      const history = JSON.parse(localStorage.getItem("asf_orders") || "[]");
      localStorage.setItem("asf_orders", JSON.stringify([orderPayload, ...history]));
    } catch {
      // ignore storage errors
    }

    setCompletedOrder({
      orderNumber: orderNum,
      items: summaryItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total: grandTotal,
      customer: {
        fullName: custName.trim(),
        phone: cleanPakPhone(custPhone),
        address: custAddress.trim(),
        city: custCity.trim(),
        notes: custNotes.trim(),
      },
    });

    // Clear cart and display Thank You confirmation screen
    setCart([]);
    setIsSubmittingOrder(false);
    setCheckoutSuccess(true);
  };

  // WhatsApp order link
  const getWhatsAppOrderConfirmationUrl = (order: OrderSummary) => {
    const itemList = order.items
      .map((item) => `• ${item.qty} × ${item.name} (${item.unit}) = ${formatPrice(item.total)}`)
      .join("\n");
    const text = `Hello Al Syed Organic Farm, I have placed Order ${order.orderNumber}:\n\n*Customer Details:*\nName: ${order.customer?.fullName}\nPhone: ${order.customer?.phone}\nCity: ${order.customer?.city}\nAddress: ${order.customer?.address}${order.customer?.notes ? `\nNotes: ${order.customer.notes}` : ""}\n\n*Order Items:*\n${itemList}\n\nSubtotal: ${formatPrice(order.subtotal)}\nDelivery: ${order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}\n*Total (Cash on Delivery): ${formatPrice(order.total)}*\n\nPlease confirm my order dispatch.`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  // Contact form submit
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSuccess(true);
    contactFormRef.current?.reset();
  };

  // Footer Newsletter submit
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
    }
  };

  // Modal WhatsApp prefilled link
  const getModalWhatsAppUrl = (product: Product, quantity: number) => {
    const total = product.price * quantity;
    const text = `Hello Al Syed Organic Farm, I would like to order:\n- ${quantity} x ${product.name} (${product.unit}) = ${formatPrice(
      total
    )}\nTotal: ${formatPrice(total)}`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1c2a22]">
      {/* ---------- A) TOP ANNOUNCEMENT BAR ---------- */}
      <aside aria-label="Announcement" className="w-full bg-[#1f5c3a] text-[#e6ebe6] text-[12px] text-center py-2 px-6 tracking-wide">
        <div className="wrap w-full max-w-[1200px] mx-auto px-6 max-[520px]:px-4">
          Free delivery on orders above Rs 5,000 across Pakistan
        </div>
      </aside>

      {/* ---------- B) STICKY HEADER ---------- */}
      <header className="site-header">
        <div className="site-header-wrap">
          <nav aria-label="Main Navigation" className="site-header-nav nav">
            {/* Left logo */}
            <a
              href="#top"
              className="header-logo-link text-[#2e7d4f] no-underline focus-visible:outline-2 focus-visible:outline-[#f2a93b]"
              aria-label="Al Syed Organic Farm - Home"
            >
              <i
                aria-hidden="true"
                className="header-logo-badge"
              >
                A
              </i>
              <span className="header-logo-text">
                Al Syed Organic Farm
              </span>
            </a>

            {/* Center nav links */}
            <div className="header-nav-links nav-links">
              <a href="#products" className="nav-link-item">
                Products
              </a>
              <a href="#process" className="nav-link-item">
                Our Process
              </a>
              <a href="#why" className="nav-link-item">
                About
              </a>
              <a href="#reviews" className="nav-link-item">
                Reviews
              </a>
              <a href="#contact" className="nav-link-item">
                Contact
              </a>
            </div>

            {/* Right group: Icons + Button */}
            <div className="header-right-actions header-right">
              <button
                type="button"
                className={`cart-header-btn ${cartBadgeBump ? "cart-bump" : ""}`}
                aria-label={`Open shopping cart, ${totalCartUnits} items`}
                onClick={openCartDrawer}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[19px] h-[19px]"
                  aria-hidden="true"
                >
                  <path d="M6 8h12l-1 12H7L6 8z" />
                  <path d="M9 8V6a3 3 0 016 0v2" />
                </svg>
                {totalCartUnits > 0 && (
                  <span className="cart-count-badge" aria-hidden="true">
                    {totalCartUnits}
                  </span>
                )}
              </button>

              <a href="#contact" className="btn header-order-btn">
                Order now
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* ---------- C) HERO (WITH INNER PADDING) ---------- */}
        <section className="py-6 sm:py-8 max-[900px]:py-5">
          <div className="w-full max-w-[1280px] mx-auto px-4 min-[640px]:px-6">
            <div
              className="w-full rounded-[32px] overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 88% 18%, rgba(242,169,59,0.18), transparent 45%), linear-gradient(180deg, #eef7f0, #ffffff)",
                border: "1px solid var(--line)",
              }}
            >
              <div className="grid grid-cols-1 min-[901px]:grid-cols-[1.18fr_0.82fr] items-center">
                {/* Left Content */}
                <div
                  className="hero-left-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "40px",
                  }}
                >
                  <span
                    className="hero-anim-badge hero-badge-pill"
                    style={{
                      padding: "8px 16px",
                      marginBottom: "24px",
                    }}
                  >
                    100% organic, farm fresh
                  </span>
                  <h1
                    className="hero-anim-heading hero-title-text"
                    style={{
                      lineHeight: "1.2",
                      marginBottom: "20px",
                      letterSpacing: "-0.5px",
                      fontWeight: 700,
                    }}
                  >
                    Pure Desi Ghee and Organic Staples,{" "}
                    <span className="text-[#2e7d4f] not-italic">
                      Straight From Our Farm
                    </span>
                  </h1>
                  <p
                    className="hero-anim-sub hero-paragraph-text"
                    style={{
                      marginTop: "0px",
                      marginBottom: "32px",
                      lineHeight: "1.7",
                      fontSize: "16px",
                      maxWidth: "520px",
                      color: "#555555",
                    }}
                  >
                    Authentic A2 Bilona Desi Ghee, Kashmiri Saffron, and stone-ground organic staples harvested direct from our soil.
                  </p>
                  <div
                    className="hero-anim-buttons hero-buttons-group"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      marginTop: "12px",
                      marginBottom: "32px",
                    }}
                  >
                    <a
                      href="#products"
                      className="btn btn-hero"
                      style={{ padding: "14px 32px" }}
                    >
                      Shop now
                    </a>
                    <a
                      href="#process"
                      className="btn line btn-hero"
                      style={{ padding: "14px 32px" }}
                    >
                      How we make it
                    </a>
                  </div>
                  {/* Stats Row */}
                  <div className="hero-anim-stats flex flex-wrap gap-8 sm:gap-10 pt-4 border-t border-[#d6e8db]/60">
                    <div>
                      <b className="block font-['Playfair_Display'] font-bold text-[22px] text-[#2e7d4f] leading-tight">
                        A2
                      </b>
                      <span className="text-[12.5px] text-[#63726a]">Bilona method</span>
                    </div>
                    <div>
                      <b className="block font-['Playfair_Display'] font-bold text-[22px] text-[#2e7d4f] leading-tight">
                        500+
                      </b>
                      <span className="text-[12.5px] text-[#63726a]">Happy families</span>
                    </div>
                    <div>
                      <b className="block font-['Playfair_Display'] font-bold text-[22px] text-[#2e7d4f] leading-tight">
                        0
                      </b>
                      <span className="text-[12.5px] text-[#63726a]">Chemicals added</span>
                    </div>
                  </div>
                </div>

                {/* Right Photo */}
                <div className="w-full flex justify-center min-[901px]:justify-end p-6 min-[901px]:p-10">
                  <div className="hero-anim-image w-full max-w-[360px] min-[901px]:max-w-[420px]">
                    <div className="hero-float-wrapper w-full">
                      <div
                        className="hero-image-frame image-container w-full aspect-[5/4] overflow-hidden border-[5px] border-white shadow-[0_16px_36px_rgba(31,92,58,0.16)]"
                        style={{
                          borderRadius: "112px 20px 112px 20px",
                        }}
                      >
                        <img
                          src="/assets/aistudio/herosec_ghee_337295a7.jpg"
                          alt="Jar of A2 Bilona Desi Ghee with a wooden spoon and fresh white butter on burlap"
                          className="hero-image w-full h-full object-cover"
                          style={{ objectPosition: "34% 50%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- D) MARQUEE STRIP ---------- */}
        <div
          className="marquee-strip bg-[#eef7f0] py-3.5 overflow-hidden border-y border-[#e3eee6]"
          role="region"
          aria-label="Farm values announcement"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="marquee-track">
            {/* Group 1 */}
            <div className="marquee-group">
              <span className="marquee-text">Chemical free</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Hand made</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Farm direct</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Fresh delivery</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Chemical free</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Hand made</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Farm direct</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Fresh delivery</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Chemical free</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Hand made</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Farm direct</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
              <span className="marquee-text">Fresh delivery</span>
              <i className="marquee-sep" aria-hidden="true">✦</i>
            </div>
            {/* Group 2 (duplicate for seamless loop) */}
            <div className="marquee-group" aria-hidden="true">
              <span className="marquee-text">Chemical free</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Hand made</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Farm direct</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Fresh delivery</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Chemical free</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Hand made</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Farm direct</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Fresh delivery</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Chemical free</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Hand made</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Farm direct</span>
              <i className="marquee-sep">✦</i>
              <span className="marquee-text">Fresh delivery</span>
              <i className="marquee-sep">✦</i>
            </div>
          </div>
        </div>

        {/* ---------- E) OUR BEST SELLERS (id=products) ---------- */}
        <section id="products" className="py-14 max-[900px]:py-10">
          <div className="wrap w-full max-w-[1040px] mx-auto px-6 max-[520px]:px-4 text-center">
            <div className="reveal-init">
              <h2 className="font-['Playfair_Display'] font-semibold">Our best sellers</h2>
              <p className="sub">Made the traditional way and packed fresh on the farm.</p>
            </div>

            {/* Carousel track */}
            <div
              ref={carouselTrackRef}
              className="carousel-track mt-7"
              tabIndex={0}
              role="region"
              aria-label="Products carousel, scroll sideways"
            >
              {PRODUCTS.map((prod, idx) => (
                <article
                  key={prod.id}
                  className={`product-card reveal-init stagger-${(idx % 4) + 1}`}
                  onClick={(e) => openProductModal(prod, e)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${prod.name}, ${formatPrice(prod.price)} per ${prod.unit}. View details`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openProductModal(prod);
                    }
                  }}
                >
                  {/* Top ARCH Image */}
                  <div className="product-arch image-container">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.alt || prod.name}
                        className="product-image"
                        style={{ objectPosition: prod.objectPos || "50% 50%" }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center p-3 text-center"
                        style={{ background: prod.placeholderGrad }}
                      >
                        <span className="font-['Playfair_Display'] font-semibold text-[13px] text-[#133524]/60">
                          Your photo here
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="pt-3 flex flex-col items-center flex-1 w-full">
                    <small className="block font-['Poppins'] font-medium text-[10.5px] tracking-[0.12em] uppercase text-[#b9822a] mb-1">
                      {prod.eyebrow}
                    </small>
                    <h3 className="font-['Playfair_Display'] font-semibold text-[14.5px] leading-[1.25] mb-1 min-h-[2.4em] flex items-center justify-center text-center">
                      {prod.name}
                    </h3>
                    <p className="text-[12px] text-[#63726a] leading-[1.45] max-w-[28ch] mx-auto mb-3 flex-1 line-clamp-2">
                      {prod.cardDesc}
                    </p>

                    {/* Price Pill Pinned to Bottom */}
                    <div className="price-pill">
                      <span className="flex items-baseline gap-1">
                        <b className="font-['Playfair_Display'] font-semibold text-[14px] text-[#2e7d4f]">
                          {formatPrice(prod.price)}
                        </b>
                        <span className="font-['Poppins'] text-[10.5px] text-[#63726a]">
                          / {prod.unit}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="arrow-circle-btn"
                        aria-label={`View details for ${prod.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openProductModal(prod);
                        }}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center gap-3 mt-[-4px]">
              <button
                type="button"
                className="nav-arrow-btn"
                aria-label="Previous products"
                disabled={!canScrollLeft}
                onClick={() => scrollCarousel("left")}
              >
                ←
              </button>
              <button
                type="button"
                className="nav-arrow-btn"
                aria-label="Next products"
                disabled={!canScrollRight}
                onClick={() => scrollCarousel("right")}
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* ---------- F) HOW OUR GHEE IS MADE (id=process) ---------- */}
        <section id="process" className="bg-[#eef7f0] py-16 max-[900px]:py-12">
          <div className="wrap w-full max-w-[1200px] mx-auto px-6 max-[520px]:px-4 text-center">
            <div className="reveal-init">
              <h2 className="font-['Playfair_Display'] font-semibold">How our ghee is made</h2>
              <p className="sub">The bilona method takes longer. We never shortcut it.</p>
            </div>

            <div className="grid grid-cols-1 min-[521px]:grid-cols-2 min-[901px]:grid-cols-4 gap-5 mt-8 text-left">
              {/* Step 1 */}
              <div className="reveal-init stagger-1 bg-white rounded-[16px] p-5 shadow-sm">
                <i
                  aria-hidden="true"
                  className="w-[34px] h-[34px] rounded-full bg-[#f2a93b] text-[#1f5c3a] flex items-center justify-center font-['Playfair_Display'] font-bold text-[15px] not-italic mb-2.5"
                >
                  1
                </i>
                <h3 className="font-['Playfair_Display'] font-semibold text-[15px] mb-1 text-[#1c2a22]">
                  Fresh A2 milk
                </h3>
                <p className="text-[12.5px] text-[#63726a] leading-[1.5]">
                  Milked at dawn from grass-fed desi cows.
                </p>
              </div>

              {/* Step 2 */}
              <div className="reveal-init stagger-2 bg-white rounded-[16px] p-5 shadow-sm">
                <i
                  aria-hidden="true"
                  className="w-[34px] h-[34px] rounded-full bg-[#f2a93b] text-[#1f5c3a] flex items-center justify-center font-['Playfair_Display'] font-bold text-[15px] not-italic mb-2.5"
                >
                  2
                </i>
                <h3 className="font-['Playfair_Display'] font-semibold text-[15px] mb-1 text-[#1c2a22]">
                  Set as curd
                </h3>
                <p className="text-[12.5px] text-[#63726a] leading-[1.5]">
                  Boiled gently, then set overnight in clay.
                </p>
              </div>

              {/* Step 3 */}
              <div className="reveal-init stagger-3 bg-white rounded-[16px] p-5 shadow-sm">
                <i
                  aria-hidden="true"
                  className="w-[34px] h-[34px] rounded-full bg-[#f2a93b] text-[#1f5c3a] flex items-center justify-center font-['Playfair_Display'] font-bold text-[15px] not-italic mb-2.5"
                >
                  3
                </i>
                <h3 className="font-['Playfair_Display'] font-semibold text-[15px] mb-1 text-[#1c2a22]">
                  Hand-churned
                </h3>
                <p className="text-[12.5px] text-[#63726a] leading-[1.5]">
                  Curd is churned into butter with a wooden churner.
                </p>
              </div>

              {/* Step 4 */}
              <div className="reveal-init stagger-4 bg-white rounded-[16px] p-5 shadow-sm">
                <i
                  aria-hidden="true"
                  className="w-[34px] h-[34px] rounded-full bg-[#f2a93b] text-[#1f5c3a] flex items-center justify-center font-['Playfair_Display'] font-bold text-[15px] not-italic mb-2.5"
                >
                  4
                </i>
                <h3 className="font-['Playfair_Display'] font-semibold text-[15px] mb-1 text-[#1c2a22]">
                  Slow-simmered
                </h3>
                <p className="text-[12.5px] text-[#63726a] leading-[1.5]">
                  Butter is clarified over a low flame into golden ghee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- G) WHY FAMILIES CHOOSE US (id=why) ---------- */}
        <section id="why" className="w-full bg-white">
          <div className="why-section-container">
            {/* Left Photo (45% width) */}
            <div className="why-left-col reveal-zoom-init">
              <div className="why-image-wrapper image-container">
                <img
                  src="/assets/aistudio/img_al_3_f8d8c7e4.jpg"
                  alt="Heirloom seeds and grains in ceramic bowls on a rustic wooden table with scoop"
                  className="farm-image"
                  style={{ objectPosition: "50% 50%" }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Content (55% width) */}
            <div className="why-right-col reveal-left-init">
              <h2 className="why-heading">Why families choose us</h2>
              <p className="why-sub">Real food, made by people you can trust.</p>

              <ul className="why-checklist">
                <li className="reveal-pop-init stagger-1">
                  <b>Grown without chemicals</b>
                  <span>No pesticides or synthetic fertilisers, only healthy soil.</span>
                </li>
                <li className="reveal-pop-init stagger-2">
                  <b>Traceable to the field</b>
                  <span>Every batch is made on our own farm.</span>
                </li>
                <li className="reveal-pop-init stagger-3">
                  <b>Delivered fresh</b>
                  <span>Packed in glass and cloth, shipped within days.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- H) REVIEWS (id=reviews) ---------- */}
        <section id="reviews" className="bg-[#eef7f0] py-16 max-[900px]:py-12">
          <div className="wrap w-full max-w-[1200px] mx-auto px-6 max-[520px]:px-4 text-center">
            <div className="reveal-init">
              <h2 className="font-['Playfair_Display'] font-semibold">Loved by our customers</h2>
            </div>

            <div className="grid grid-cols-1 min-[901px]:grid-cols-3 gap-5 mt-8 text-left">
              {/* Review 1 */}
              <div className="reveal-init stagger-1 bg-white border border-[#e3eee6] rounded-[16px] p-5 shadow-sm">
                <div
                  className="text-[#f2a93b] tracking-[1.5px] text-[12px] mb-1.5"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </div>
                <p className="text-[13px] text-[#1c2a22] leading-relaxed mb-3">
                  The ghee tastes like the one my grandmother used to make. We have not bought any other since.
                </p>
                <b className="block text-[12px] font-semibold text-[#2e7d4f]">
                  Ayesha K., Lahore
                </b>
              </div>

              {/* Review 2 */}
              <div className="reveal-init stagger-2 bg-white border border-[#e3eee6] rounded-[16px] p-5 shadow-sm">
                <div
                  className="text-[#f2a93b] tracking-[1.5px] text-[12px] mb-1.5"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </div>
                <p className="text-[13px] text-[#1c2a22] leading-relaxed mb-3">
                  The saffron colour and aroma are unmatched. Perfect for kheer and biryani.
                </p>
                <b className="block text-[12px] font-semibold text-[#2e7d4f]">
                  Usman R., Karachi
                </b>
              </div>

              {/* Review 3 */}
              <div className="reveal-init stagger-3 bg-white border border-[#e3eee6] rounded-[16px] p-5 shadow-sm">
                <div
                  className="text-[#f2a93b] tracking-[1.5px] text-[12px] mb-1.5"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </div>
                <p className="text-[13px] text-[#1c2a22] leading-relaxed mb-3">
                  Fresh atta, soft rotis. Delivery was quick and the packing was lovely.
                </p>
                <b className="block text-[12px] font-semibold text-[#2e7d4f]">
                  Sana M., Islamabad
                </b>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- I) PURITY STANDARD COMPARISON (id=purity) ---------- */}
        <section id="purity" className="py-16 max-[900px]:py-12 bg-white">
          <div className="wrap w-full max-w-[1200px] mx-auto px-6 max-[520px]:px-4">
            <div className="cmp-card reveal-init">
              {/* Card Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#e3eee6] mb-5">
                <div>
                  <h2 className="font-['Playfair_Display'] font-semibold text-[clamp(20px,2.4vw,26px)]">
                    Purity Standard: Al Syed vs Commercial Market
                  </h2>
                  <p className="sub text-[13px] text-[#63726a] mt-1">
                    Transparent disclosure of agricultural inputs and process handling.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#eef7f0] text-[#2e7d4f] font-['Poppins'] font-medium text-[12px] px-3.5 py-1.5 rounded-full border border-[#cfe6d6]">
                  ✓ 100% Traceable Lab Certificates
                </span>
              </div>

              {/* Desktop Table (>760px) */}
              <div className="hidden min-[761px]:block overflow-x-auto">
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th scope="col">Harvest Standard</th>
                      <th scope="col">Commercial Market Produce</th>
                      <th scope="col" className="us-col">
                        Al Syed Farm Standard
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, idx) => (
                      <tr key={idx}>
                        <th scope="row">{row.standard}</th>
                        <td className="them-col">{row.commercial}</td>
                        <td className="us-col">
                          <span className="check-tick" aria-hidden="true">✓</span>
                          {row.alSyed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Cards (<761px) */}
              <div className="block min-[761px]:hidden space-y-3">
                {COMPARISON_ROWS.map((row, idx) => (
                  <div
                    key={idx}
                    className="border border-[#e3eee6] rounded-[14px] overflow-hidden"
                  >
                    <div className="bg-[#eef7f0] px-4 py-2.5 font-semibold text-[#1c2a22] text-[13.5px]">
                      {row.standard}
                    </div>
                    <div className="p-3 text-[12.5px]">
                      <span className="block text-[11px] font-semibold text-[#b4772a] mb-0.5">
                        Commercial market
                      </span>
                      <p className="text-[#63726a] leading-relaxed">{row.commercial}</p>
                    </div>
                    <div className="bg-[#f1f9f3] p-3 text-[12.5px]">
                      <span className="block text-[11px] font-semibold text-[#2e7d4f] mb-0.5">
                        ✓ Al Syed Farm Standard
                      </span>
                      <p className="text-[#173f2b] font-medium leading-relaxed">
                        {row.alSyed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- J) GREEN CTA BANNER ---------- */}
        <div className="green-banner-wrapper">
          <div className="green-banner-container">
            <div className="reveal-left-init">
              <h2 className="green-banner-title">
                Taste the difference of real farm food
              </h2>
              <p className="green-banner-sub">
                Order today and get it fresh at your door.
              </p>
            </div>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                "Hello Al Syed Organic Farm, I would like to place an order."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn reveal-init stagger-2"
            >
              {/* WhatsApp Logo Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[18px] h-[18px] flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M12.04 2a9.9 9.9 0 00-8.46 15.04L2 22l5.1-1.34A9.9 9.9 0 1012.04 2zm0 1.8a8.1 8.1 0 11-4.13 15.07l-.3-.18-3.02.8.81-2.94-.2-.31A8.1 8.1 0 0112.04 3.8zM8.6 7.5c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.07 3.3 5.1 4.5 2.52 1 3.03.8 3.58.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5z" />
              </svg>
              <span>Order from WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ---------- K) CONTACT US (id=contact) ---------- */}
        <section id="contact" className="w-full bg-white">
          <div className="contact-section-container">
            {/* Left Info Column */}
            <div className="reveal-left-init">
              <h2 className="font-['Playfair_Display'] font-semibold">Contact us</h2>
              <p className="sub">
                Have a question or want to know more about our products? Get in touch and we will gladly help you.
              </p>

              <div className="grid gap-3.5 mt-5">
                <div>
                  <b className="block font-semibold text-[#2e7d4f] text-[13.5px]">Phone / WhatsApp</b>
                  <span className="text-[#1c2a22] text-[13.5px]">{PHONE_DISPLAY}</span>
                </div>
                <div>
                  <b className="block font-semibold text-[#2e7d4f] text-[13.5px]">Farm location</b>
                  <span className="text-[#1c2a22] text-[13.5px]">Punjab, Pakistan</span>
                </div>
                <div>
                  <b className="block font-semibold text-[#2e7d4f] text-[13.5px]">Hours</b>
                  <span className="text-[#1c2a22] text-[13.5px]">Daily, 9 am to 7 pm</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="reveal-init stagger-2">
              <form
                ref={contactFormRef}
                onSubmit={handleContactSubmit}
                className="contact-form-card"
              >
                <div>
                  <label htmlFor={nameInputId} className="sr-only">
                    Your name
                  </label>
                  <input
                    id={nameInputId}
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="contact-input"
                  />
                </div>

                <div>
                  <label htmlFor={phoneInputId} className="sr-only">
                    Phone number
                  </label>
                  <input
                    id={phoneInputId}
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    required
                    className="contact-input"
                  />
                </div>

                <div>
                  <label htmlFor={messageInputId} className="sr-only">
                    How can we help you?
                  </label>
                  <textarea
                    id={messageInputId}
                    name="message"
                    rows={3}
                    placeholder="How can we help you?"
                    className="contact-input"
                  />
                </div>

                <button type="submit" className="btn dk justify-self-start">
                  Send message
                </button>

                <div className="min-h-[18px]" role="status" aria-live="polite">
                  {contactSuccess && (
                    <p className="text-[#2e7d4f] text-[13px]">
                      Thank you for reaching out. We will get back to you soon.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- L) COMPACT GREEN FOOTER ---------- */}
      <footer className="site-footer">
        <div className="site-footer-wrap">
          <div className="footer-grid">
            {/* Column 1 (35%): Brand & Newsletter */}
            <div className="flex flex-col">
              <a
                href="#top"
                className="inline-flex items-center gap-2 text-white no-underline focus-visible:outline-2 focus-visible:outline-[#E8C86A] self-start"
                aria-label="Al Syed Organic Farm - Home"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 text-[#E8C86A] flex items-center justify-center flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d="M12 22V8" />
                    <path d="M12 8C12 4.5 14.5 2 18 2c.5 3.5-1.5 6-6 6Z" />
                    <path d="M12 12C12 9 9.5 7 6 7c-.5 3.5 1.5 5.5 6 5Z" />
                  </svg>
                </div>
                <span className="font-['Playfair_Display'] font-semibold text-[16px] text-white tracking-tight">
                  Al Syed Organic Farm
                </span>
              </a>

              <p className="footer-brand-desc">
                Sustainably nurturing ancestral heirloom traditions. From grass-fed A2 cattle to ancient stone-ground spices, our farm delivers pure, zero-chemical sustenance directly from our soil to your family table.
              </p>

              {/* HARVEST NOTES & CHURN ALERTS */}
              <div className="mt-0.5">
                <p className="footer-harvest-label">
                  Harvest Notes & Churn Alerts
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5 max-w-[310px]">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="footer-email-input flex-1"
                  />
                  <button type="submit" className="footer-subscribe-btn">
                    Subscribe
                  </button>
                </form>
                {newsletterSubmitted && (
                  <p className="text-[11px] text-[#E8C86A] mt-1.5 font-medium flex items-center gap-1">
                    <span>✓</span> Subscribed to churn alerts.
                  </p>
                )}
              </div>
            </div>

            {/* Column 2 (21%): SHOP ALL */}
            <div>
              <h4 className="footer-heading">SHOP ALL</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#products" className="footer-link">
                    A2 Bilona Desi Ghee
                  </a>
                </li>
                <li>
                  <a href="#products" className="footer-link">
                    Kashmiri Saffron Mongra
                  </a>
                </li>
                <li>
                  <a href="#products" className="footer-link">
                    Stone-Ground Salem Haldi
                  </a>
                </li>
                <li>
                  <a href="#products" className="footer-link">
                    Raw Heirloom Giyaa Seeds
                  </a>
                </li>
                <li>
                  <a href="#products" className="footer-link">
                    Chemical-Free Pure Mehndi
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 (21%): THE FARM */}
            <div>
              <h4 className="footer-heading">THE FARM</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#process" className="footer-link">
                    Our Free-Grazing Cattle
                  </a>
                </li>
                <li>
                  <a href="#process" className="footer-link">
                    Vedic Wooden Churning
                  </a>
                </li>
                <li>
                  <a href="#why" className="footer-link">
                    Zero Chemical Promise
                  </a>
                </li>
                <li>
                  <a href="#why" className="footer-link">
                    3rd Party Lab Certificates
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-link">
                    Farm Visits & Tours
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 (21%): CUSTOMER CARE */}
            <div>
              <h4 className="footer-heading">CUSTOMER CARE</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#faq" className="footer-link">
                    Shipping & Glass Protection
                  </a>
                </li>
                <li>
                  <a href="#faq" className="footer-link">
                    Returns & Pure Guarantee
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Al Syed Organic Farm, I would like to connect with your WhatsApp concierge.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    WhatsApp Direct Concierge
                  </a>
                </li>
                <li>
                  <a href="#faq" className="footer-link">
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-link">
                    Track Your Fresh Parcel
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Integrated Bottom Line (Centered, Compact, No payment pills) */}
          <div className="footer-bottom-inline">
            <span className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E8C86A"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 text-[#E8C86A] flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M12 2l2.4 2.2 3.2-.4 1.2 3 2.8 1.6-.6 3.2 1.8 2.6-1.8 2.6.6 3.2-2.8 1.6-1.2 3-3.2-.4L12 22l-2.4-2.2-3.2.4-1.2-3-2.8-1.6.6-3.2L1.2 12l1.8-2.6-.6-3.2 2.8-1.6 1.2-3 3.2.4z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>100% Halal & Certified Pure</span>
            </span>
            <span className="footer-sep" aria-hidden="true">•</span>
            <span>© 2026 Al Syed Organic Farm. All agricultural rights reserved.</span>
          </div>

          <div className="footer-credit-line">
            Designed by Laiba Shahid
          </div>
        </div>
      </footer>

      {/* =====================================================
          4. PRODUCT DETAIL MODAL
          ===================================================== */}
      {selectedProduct && (
        <div
          className="overlay-backdrop"
          onClick={closeProductModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Round Close Button */}
            <button
              ref={modalCloseBtnRef}
              type="button"
              className="close-round-btn absolute top-3.5 right-3.5 z-10"
              aria-label="Close dialog"
              onClick={closeProductModal}
            >
              ×
            </button>

            {/* Left: ARCH image frame */}
            <div className="modal-arch-container">
              <div className="modal-arch image-container">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.alt || selectedProduct.name}
                    className="product-image"
                    style={{ objectPosition: selectedProduct.objectPos || "50% 50%" }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-center p-3"
                    style={{ background: selectedProduct.placeholderGrad }}
                  >
                    <span className="font-['Playfair_Display'] font-semibold text-[15px] text-[#133524]/60">
                      Your photo here
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details & Controls */}
            <div className="modal-content flex flex-col justify-between">
              <div>
                <small className="block font-['Poppins'] font-medium text-[11px] tracking-[0.14em] uppercase text-[#b9822a] mb-1.5">
                  {selectedProduct.eyebrow}
                </small>
                <h3
                  id="modal-product-title"
                  className="font-['Playfair_Display'] font-semibold text-[clamp(21px,2.5vw,27px)] mb-2 text-[#1c2a22]"
                >
                  {selectedProduct.name}
                </h3>
                <div className="font-['Playfair_Display'] font-semibold text-[22px] text-[#2e7d4f] mb-2.5">
                  {formatPrice(selectedProduct.price)}{" "}
                  <span className="font-['Poppins'] font-normal text-[12.5px] text-[#63726a] ml-1">
                    per {selectedProduct.unit}
                  </span>
                </div>
                <p className="text-[13px] text-[#63726a] leading-relaxed mb-3">
                  {selectedProduct.modalDesc}
                </p>

                {/* Three Checklist Bullets */}
                <ul className="check-list mt-3 mb-4 text-[13px] text-[#1c2a22]">
                  {selectedProduct.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <div>
                {/* Quantity row */}
                <div className="flex items-center gap-3 flex-wrap py-3 border-t border-b border-[#e3eee6] mb-4">
                  <span className="font-medium text-[13.5px]">Quantity</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      className="w-9 h-9 bg-transparent border-0 text-[19px] text-[#2e7d4f] hover:text-[#1f5c3a] cursor-pointer flex items-center justify-center"
                      aria-label="Decrease quantity"
                      onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span
                      className="min-w-[30px] text-center font-semibold text-[13.5px]"
                      aria-live="polite"
                    >
                      {modalQty}
                    </span>
                    <button
                      type="button"
                      className="w-9 h-9 bg-transparent border-0 text-[19px] text-[#2e7d4f] hover:text-[#1f5c3a] cursor-pointer flex items-center justify-center"
                      aria-label="Increase quantity"
                      onClick={() => setModalQty((q) => Math.min(99, q + 1))}
                    >
                      +
                    </button>
                  </div>

                  {/* Live Total */}
                  <span className="ml-auto font-['Playfair_Display'] font-semibold text-[17px] text-[#2e7d4f]">
                    {formatPrice(selectedProduct.price * modalQty)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 flex-wrap">
                  <button
                    type="button"
                    className="btn dk flex-1 text-center"
                    onClick={() => {
                      addToCart(selectedProduct.id, modalQty);
                      setModalAddedTick(true);
                      setTimeout(() => setModalAddedTick(false), 1400);
                    }}
                  >
                    {modalAddedTick ? "Added ✓" : "Add to cart"}
                  </button>
                  <a
                    href={getModalWhatsAppUrl(selectedProduct, modalQty)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn flex-1 text-center"
                  >
                    Order now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          3. CART DRAWER OVERLAY
          ===================================================== */}
      {isDrawerOpen && (
        <div
          className="overlay-backdrop drawer-overlay"
          onClick={closeCartDrawer}
          role="dialog"
          aria-modal="true"
          aria-label="Your shopping cart"
        >
          <aside
            className="drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-[18px_20px] border-b border-[#e3eee6]">
              <h3 className="font-['Playfair_Display'] text-[20px] font-semibold text-[#1c2a22]">
                Your cart {totalCartUnits > 0 && `(${totalCartUnits})`}
              </h3>
              <button
                ref={drawerCloseBtnRef}
                type="button"
                className="close-round-btn"
                aria-label="Close cart"
                onClick={closeCartDrawer}
              >
                ×
              </button>
            </div>

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {cart.length === 0 ? (
                <div className="text-center text-[#63726a] py-14 px-2">
                  <p className="text-[14.5px] mb-1 font-medium">Your cart is empty.</p>
                  <p className="text-[13px]">Pick something from our best sellers.</p>
                </div>
              ) : (
                cart.map((item) => {
                  const prod = PRODUCTS.find((p) => p.id === item.id);
                  if (!prod) return null;
                  const lineTotal = prod.price * item.qty;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[60px_1fr] gap-3 py-3 border-b border-[#e3eee6]"
                    >
                      {/* 60px Rounded Thumbnail */}
                      <div className="w-[60px] h-[60px] rounded-[14px] overflow-hidden bg-[#eef7f0] flex-shrink-0">
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: prod.objectPos || "50% 50%" }}
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ background: prod.placeholderGrad }}
                          />
                        )}
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <h4 className="font-['Poppins'] font-semibold text-[13.5px] mb-0.5 text-[#1c2a22]">
                            {prod.name}
                          </h4>
                          <div className="text-[12px] text-[#63726a]">
                            {formatPrice(prod.price)} per {prod.unit}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1.5 gap-2">
                          {/* Pill Stepper */}
                          <div className="qty-stepper">
                            <button
                              type="button"
                              className="w-7 h-7 bg-transparent border-0 text-[16px] text-[#2e7d4f] hover:text-[#1f5c3a] cursor-pointer flex items-center justify-center"
                              aria-label={`Decrease quantity of ${prod.name}`}
                              onClick={() => updateCartQty(prod.id, -1)}
                            >
                              −
                            </button>
                            <span className="min-w-[22px] text-center font-semibold text-[13px]">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              className="w-7 h-7 bg-transparent border-0 text-[16px] text-[#2e7d4f] hover:text-[#1f5c3a] cursor-pointer flex items-center justify-center"
                              aria-label={`Increase quantity of ${prod.name}`}
                              onClick={() => updateCartQty(prod.id, 1)}
                            >
                              +
                            </button>
                          </div>

                          <span className="font-['Playfair_Display'] font-semibold text-[14px] text-[#2e7d4f]">
                            {formatPrice(lineTotal)}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="text-[#a2542a] text-[11.5px] underline bg-transparent border-0 cursor-pointer self-start p-0 mt-1"
                          onClick={() => removeCartItem(prod.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Subtotal & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-[16px_20px_20px] border-t border-[#e3eee6] grid gap-2.5 bg-[#ffffff]">
                <div className="flex items-center justify-between text-[13.5px]">
                  <span>Subtotal:</span>
                  <b className="font-['Playfair_Display'] font-semibold text-[18px] text-[#2e7d4f]">
                    {formatPrice(cartSubtotal)}
                  </b>
                </div>

                <div className="flex items-center justify-between text-[11.5px] text-[#63726a] pb-0.5">
                  <span>Delivery Charges:</span>
                  <span className={cartSubtotal >= 5000 ? "text-[#2e7d4f] font-semibold" : ""}>
                    {cartSubtotal >= 5000 ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn dk w-full text-center flex items-center justify-center gap-2"
                  onClick={openCheckoutModal}
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* =====================================================
          6. CHECKOUT FORM / POPUP MODAL
          ===================================================== */}
      {isCheckoutModalOpen && (
        <div
          className="overlay-backdrop"
          onClick={closeCheckoutModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
        >
          <div
            className="checkout-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="checkout-header">
              <div>
                <h3
                  id="checkout-modal-title"
                  className="font-['Playfair_Display'] font-semibold text-[20px] text-[#1c2a22]"
                >
                  {checkoutSuccess ? "Order Confirmed" : "Checkout - Al Syed Organic Farm"}
                </h3>
                <p className="text-[12px] text-[#63726a] mt-0.5">
                  {checkoutSuccess
                    ? "Your order has been recorded successfully"
                    : "Complete your delivery details to confirm your fresh farm order"}
                </p>
              </div>
              <button
                ref={checkoutCloseBtnRef}
                type="button"
                className="close-round-btn"
                aria-label="Close checkout"
                onClick={closeCheckoutModal}
              >
                ×
              </button>
            </div>

            {/* Content: Form or Thank You message */}
            {!checkoutSuccess ? (
              <form onSubmit={handleConfirmOrder} className="checkout-body">
                {/* Left Column: Customer Delivery Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#e3eee6]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#2e7d4f] text-white text-[11px] font-bold flex items-center justify-center">
                        1
                      </span>
                      <h4 className="font-['Playfair_Display'] font-semibold text-[15px] text-[#1c2a22]">
                        Delivery Information
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-[#eef7f0] text-[#2e7d4f] text-[11px] font-medium px-2 py-0.5 rounded-full border border-[#d6e8db]">
                      Cash on Delivery
                    </span>
                  </div>

                  {/* 1. Full Name */}
                  <div>
                    <label htmlFor="cust-name" className="checkout-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      id="cust-name"
                      type="text"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      onBlur={() => markTouched("name")}
                      placeholder="e.g. Muhammad Ali"
                      className={`checkout-input ${
                        touchedFields.name
                          ? isNameValid(custName)
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }`}
                      required
                    />
                    {touchedFields.name && !isNameValid(custName) && (
                      <p className="checkout-error">
                        <span>⚠</span>
                        <span>Full Name is required (minimum 2 characters).</span>
                      </p>
                    )}
                  </div>

                  {/* 2. Phone Number (Pakistan format validation) */}
                  <div>
                    <label htmlFor="cust-phone" className="checkout-label">
                      Phone Number <span className="req">*</span>
                    </label>
                    <input
                      id="cust-phone"
                      type="tel"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      onBlur={() => markTouched("phone")}
                      placeholder="0300 1234567 (11 digits)"
                      maxLength={15}
                      className={`checkout-input ${
                        touchedFields.phone
                          ? isPhoneValid(custPhone)
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }`}
                      required
                    />
                    <p className="checkout-hint">
                      Must be 11 digits starting with 03 (e.g. 0300 1234567).
                    </p>
                    {touchedFields.phone && !isPhoneValid(custPhone) && (
                      <p className="checkout-error">
                        <span>⚠</span>
                        <span>
                          {custPhone.trim().length === 0
                            ? "Phone number is required."
                            : "Phone number must be an 11-digit Pakistan number (e.g., 0300 1234567)."}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* 3. City */}
                  <div>
                    <label htmlFor="cust-city" className="checkout-label">
                      City <span className="req">*</span>
                    </label>
                    <input
                      id="cust-city"
                      type="text"
                      list="pakistan-cities"
                      value={custCity}
                      onChange={(e) => setCustCity(e.target.value)}
                      onBlur={() => markTouched("city")}
                      placeholder="e.g. Lahore, Karachi, Islamabad..."
                      className={`checkout-input ${
                        touchedFields.city
                          ? isCityValid(custCity)
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }`}
                      required
                    />
                    <datalist id="pakistan-cities">
                      <option value="Lahore" />
                      <option value="Karachi" />
                      <option value="Islamabad" />
                      <option value="Rawalpindi" />
                      <option value="Faisalabad" />
                      <option value="Multan" />
                      <option value="Peshawar" />
                      <option value="Quetta" />
                      <option value="Sialkot" />
                      <option value="Gujranwala" />
                      <option value="Bahawalpur" />
                      <option value="Sargodha" />
                    </datalist>
                    {touchedFields.city && !isCityValid(custCity) && (
                      <p className="checkout-error">
                        <span>⚠</span>
                        <span>Please enter your city.</span>
                      </p>
                    )}
                  </div>

                  {/* 4. Complete Address */}
                  <div>
                    <label htmlFor="cust-address" className="checkout-label">
                      Complete Address <span className="req">*</span>
                    </label>
                    <textarea
                      id="cust-address"
                      rows={2}
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      onBlur={() => markTouched("address")}
                      placeholder="House / Flat #, Street, Block, Area, Landmark..."
                      className={`checkout-input ${
                        touchedFields.address
                          ? isAddressValid(custAddress)
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }`}
                      required
                    />
                    {touchedFields.address && !isAddressValid(custAddress) && (
                      <p className="checkout-error">
                        <span>⚠</span>
                        <span>Please enter your complete delivery address.</span>
                      </p>
                    )}
                  </div>

                  {/* 5. Additional Notes (optional) */}
                  <div>
                    <label htmlFor="cust-notes" className="checkout-label">
                      Additional Notes{" "}
                      <span className="text-[#63726a] font-normal text-[11px]">(optional)</span>
                    </label>
                    <textarea
                      id="cust-notes"
                      rows={2}
                      value={custNotes}
                      onChange={(e) => setCustNotes(e.target.value)}
                      placeholder="Special delivery instructions, gate code, or nearest landmark..."
                      className="checkout-input"
                    />
                  </div>
                </div>

                {/* Right Column: Order Summary & Place Order Button */}
                <div className="bg-[#f7fbf8] border border-[#d6e8db] rounded-2xl p-4 flex flex-col h-full shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#d6e8db] mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#f2a93b] text-[#1c2a22] text-[11px] font-bold flex items-center justify-center">
                        2
                      </span>
                      <h4 className="font-['Playfair_Display'] font-semibold text-[15px] text-[#1c2a22]">
                        Order Summary
                      </h4>
                    </div>
                    <span className="text-[12px] font-medium text-[#2e7d4f]">
                      {totalCartUnits} {totalCartUnits === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Products list */}
                  <div className="space-y-2.5 max-h-[175px] overflow-y-auto pr-1 mb-3">
                    {cart.map((item) => {
                      const prod = PRODUCTS.find((p) => p.id === item.id);
                      if (!prod) return null;
                      return (
                        <div key={item.id} className="flex items-center justify-between gap-2 text-[12.5px]">
                          <div className="flex items-center gap-2 min-w-0">
                            {prod.image && (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-[#d6e8db]"
                              />
                            )}
                            <div className="truncate">
                              <div className="font-medium text-[#1c2a22] truncate">{prod.name}</div>
                              <div className="text-[11px] text-[#63726a]">
                                {item.qty} × {formatPrice(prod.price)} / {prod.unit}
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-[#1c2a22] whitespace-nowrap">
                            {formatPrice(prod.price * item.qty)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculations */}
                  <div className="border-t border-[#d6e8db] pt-3 space-y-2 text-[13px] text-[#1c2a22] mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#63726a]">Subtotal:</span>
                      <span className="font-medium">{formatPrice(cartSubtotal)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#63726a]">Delivery Charges:</span>
                      {deliveryFee === 0 ? (
                        <span className="text-[#2e7d4f] font-semibold text-[11.5px] bg-[#eef7f0] px-2 py-0.5 rounded-full border border-[#d6e8db]">
                          FREE (Orders &gt; Rs 5,000)
                        </span>
                      ) : (
                        <span className="font-medium">{formatPrice(deliveryFee)}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-[#d6e8db]">
                      <span className="font-bold text-[14px]">Total Payable:</span>
                      <b className="font-['Playfair_Display'] font-bold text-[20px] text-[#2e7d4f]">
                        {formatPrice(grandTotal)}
                      </b>
                    </div>

                    <div className="text-[11px] text-[#63726a] pt-0.5">
                      Payment Mode:{" "}
                      <span className="text-[#1c2a22] font-semibold">Cash on Delivery (COD)</span>
                    </div>
                  </div>

                  {/* Confirm Order Button - DISABLED until form is valid */}
                  <div className="mt-auto pt-2">
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmittingOrder}
                      className="btn-confirm-order"
                      aria-disabled={!isFormValid || isSubmittingOrder}
                    >
                      {isSubmittingOrder ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 flex-shrink-0"
                          >
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                          <span>Confirm Order</span>
                        </>
                      )}
                    </button>

                    {!isFormValid && (
                      <p className="text-[11px] text-[#a2542a] text-center mt-2 font-medium">
                        Please fill in all required fields marked with * to enable order confirmation.
                      </p>
                    )}

                    <button
                      type="button"
                      className="w-full text-center text-[12px] text-[#63726a] hover:text-[#1c2a22] mt-3 underline bg-transparent border-0 cursor-pointer"
                      onClick={() => {
                        setIsCheckoutModalOpen(false);
                        setIsDrawerOpen(true);
                      }}
                    >
                      ← Return to Cart
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Thank You Screen */
              <div className="p-6 md:p-8 text-center max-w-[560px] mx-auto overflow-y-auto">
                <div className="w-[68px] h-[68px] rounded-full bg-[#eef7f0] text-[#2e7d4f] mx-auto flex items-center justify-center mb-3 success-pop shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-9 h-9"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>

                <span className="inline-block bg-[#eef7f0] text-[#2e7d4f] font-semibold text-[12px] px-3 py-1 rounded-full border border-[#d6e8db] mb-2">
                  Order {completedOrder?.orderNumber}
                </span>

                <h3 className="font-['Playfair_Display'] font-bold text-[24px] text-[#1c2a22] mb-3">
                  Order Placed Successfully!
                </h3>

                {/* EXACT REQUIRED MESSAGE */}
                <div className="bg-[#f7fbf8] border border-[#d6e8db] rounded-2xl p-4 mb-4 text-center shadow-xs">
                  <p className="font-['Poppins'] font-semibold text-[14.5px] text-[#1f5c3a] leading-relaxed">
                    Thank you for your order from Al Syed Organic Farm! We will contact you soon.
                  </p>
                </div>

                {/* Order Summary & Customer details */}
                <div className="bg-white border border-[#e3eee6] rounded-xl p-4 text-left text-[12.5px] space-y-2 mb-6 shadow-xs">
                  <div className="flex justify-between border-b border-[#e3eee6] pb-2 font-medium">
                    <span className="text-[#63726a]">Recipient:</span>
                    <span className="text-[#1c2a22] font-semibold">{completedOrder?.customer?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#63726a]">Phone:</span>
                    <span className="text-[#1c2a22] font-medium">{completedOrder?.customer?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#63726a]">Delivery Address:</span>
                    <span className="text-[#1c2a22] text-right max-w-[65%] truncate">
                      {completedOrder?.customer?.address}, {completedOrder?.customer?.city}
                    </span>
                  </div>
                  {completedOrder?.customer?.notes && (
                    <div className="flex justify-between">
                      <span className="text-[#63726a]">Notes:</span>
                      <span className="text-[#63726a] italic text-right max-w-[65%] truncate">
                        {completedOrder.customer.notes}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#e3eee6] pt-2 font-medium">
                    <span className="text-[#63726a]">
                      Items ({completedOrder?.items.length}) • Cash on Delivery:
                    </span>
                    <span className="text-[#2e7d4f] font-bold text-[14px]">
                      {formatPrice(completedOrder?.total || 0)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {completedOrder && (
                    <a
                      href={getWhatsAppOrderConfirmationUrl(completedOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wa-btn w-full sm:w-auto justify-center"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-[18px] h-[18px] flex-shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M12.04 2a9.9 9.9 0 00-8.46 15.04L2 22l5.1-1.34A9.9 9.9 0 1012.04 2zm0 1.8a8.1 8.1 0 11-4.13 15.07l-.3-.18-3.02.8.81-2.94-.2-.31A8.1 8.1 0 0112.04 3.8zM8.6 7.5c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.07 3.3 5.1 4.5 2.52 1 3.03.8 3.58.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5z" />
                      </svg>
                      <span>Send via WhatsApp</span>
                    </a>
                  )}

                  <button
                    type="button"
                    className="btn dk w-full sm:w-auto"
                    onClick={closeCheckoutModal}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
