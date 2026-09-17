/**
 * STYLEO CEYLON — Core Full-Stack Application Engine
 * Project 4: Frontend & Backend Integration ("The Unified System")
 * DecodeLabs Industrial Training Kit
 * 
 * Features:
 * - Native fetch() API with async / await
 * - Defensive Programming: try / catch / finally
 * - HTTP Status Checks (response.ok)
 * - Safe UI Injection & Live MySQL Order Placement
 * - Graceful Offline Fallback
 */

const API_BASE_URL = window.location.origin.includes(':5000') 
  ? '/api' 
  : 'http://localhost:5000/api';

let isApiOnline = false;

/**
 * STYLEO CEYLON — Core Application Logic & State Engine
 * Built with pure Vanilla JavaScript (Zero Frameworks)
 * DecodeLabs Industrial Training Kit (Project 1)
 */

// --- 1. Luxury Sri Lankan Product Catalog (14 Curated Pieces) ---
let products = [
  {
    id: 1,
    name: "Oversized Tailored Mocha Blazer",
    category: "blazers",
    price: 8900,
    regularPrice: 11500,
    rating: 4.9,
    reviewsCount: 48,
    badge: "Bestseller",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Artisanal Silk Linen Shirt",
    category: "linen",
    price: 4900,
    regularPrice: 6500,
    rating: 4.8,
    reviewsCount: 32,
    badge: "New",
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Minimal White Leather Sneaker",
    category: "footwear",
    price: 8900,
    regularPrice: 10800,
    rating: 4.7,
    reviewsCount: 56,
    badge: "Trending",
    img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Sculptural Leather Shoulder Bag",
    category: "bags",
    price: 6900,
    regularPrice: 8500,
    rating: 4.9,
    reviewsCount: 41,
    badge: "Exclusive",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Dumbara Handloom Cotton Kimono",
    category: "blazers",
    price: 9800,
    regularPrice: 12500,
    rating: 5.0,
    reviewsCount: 27,
    badge: "Heritage",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Ratnapura Ceylon Sapphire Pendant",
    category: "jewelry",
    price: 18500,
    regularPrice: 24000,
    rating: 4.9,
    reviewsCount: 19,
    badge: "Certified",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Champagne Silk Evening Slip",
    category: "blazers",
    price: 12400,
    regularPrice: 15500,
    rating: 4.8,
    reviewsCount: 23,
    badge: "Limited",
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Breathable Cuban Collar Linen",
    category: "linen",
    price: 5400,
    regularPrice: 6900,
    rating: 4.7,
    reviewsCount: 38,
    badge: "Essential",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Tailored Ivory Double-Breasted Suit",
    category: "blazers",
    price: 11200,
    regularPrice: 14500,
    rating: 4.9,
    reviewsCount: 17,
    badge: "Signature",
    img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Indigo Hand-Dyed Batik Shirt",
    category: "linen",
    price: 6200,
    regularPrice: 7800,
    rating: 4.8,
    reviewsCount: 29,
    badge: "Artisan",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Handcrafted Saddle Leather Loafers",
    category: "footwear",
    price: 9600,
    regularPrice: 12000,
    rating: 4.8,
    reviewsCount: 34,
    badge: "Crafted",
    img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Colombo Mini Leather Crossbody",
    category: "bags",
    price: 5800,
    regularPrice: 7200,
    rating: 4.9,
    reviewsCount: 45,
    badge: "Popular",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 13,
    name: "Ratnapura Star Ruby Signet Ring",
    category: "jewelry",
    price: 15900,
    regularPrice: 21000,
    rating: 5.0,
    reviewsCount: 14,
    badge: "Collector",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    name: "Resort Raw Silk Band-Collar Shirt",
    category: "linen",
    price: 5100,
    regularPrice: 6800,
    rating: 4.7,
    reviewsCount: 22,
    badge: "Classic",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 15,
    name: "Woven Natural Rush Studio Tote",
    category: "bags",
    price: 7400,
    regularPrice: 9200,
    rating: 4.8,
    reviewsCount: 25,
    badge: "Eco-Luxe",
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 16,
    name: "Ceylon Moonstone & Silver Drop Earrings",
    category: "jewelry",
    price: 6800,
    regularPrice: 8500,
    rating: 4.9,
    reviewsCount: 31,
    badge: "Handmade",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
  }
];

// --- 2. Application State ---
const initialUser = JSON.parse(localStorage.getItem("styleo-user") || "null");
const state = {
  user: initialUser,
  // Cart is only loaded if user is authenticated; guest cart is empty until sign-in
  cart: initialUser ? JSON.parse(localStorage.getItem("styleo-cart") || "[]") : [],
  wishlist: JSON.parse(localStorage.getItem("styleo-wishlist") || "[]"),
  orders: JSON.parse(localStorage.getItem("styleo-orders") || "[]"),
  pendingCartItem: null,
  filters: {
    category: "all",
    search: "",
    sort: "featured"
  }
};

// Ensure guest cart is clean if not signed in
if (!initialUser) {
  localStorage.removeItem("styleo-cart");
}

// Clear any legacy default demo order from previous sessions
if (state.orders.length) {
  state.orders = state.orders.filter((o) => o.id !== "DOMEX-LK-89421");
  localStorage.setItem("styleo-orders", JSON.stringify(state.orders));
}

// --- 3. DOM Elements Cache ---
const els = {
  // Navigation
  menuToggle: document.getElementById("menuToggle"),
  siteNav: document.getElementById("siteNav"),
  backdrop: document.getElementById("backdrop"),

  // Actions in Header
  wishlistCount: document.getElementById("wishlistCount"),
  wishlistCountBtn: document.getElementById("wishlistCountBtn"),
  cartCount: document.getElementById("cartCount"),
  openCartBtn: document.getElementById("openCartBtn"),
  accountBtn: document.getElementById("accountBtn"),
  mobileAccountBtn: document.getElementById("mobileAccountBtn"),
  searchTriggerBtn: document.getElementById("searchTriggerBtn"),

  // Category Filters
  tabButtons: document.querySelectorAll(".tab-btn"),
  avatarButtons: document.querySelectorAll(".avatar-pill-btn"),
  searchInput: document.getElementById("searchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  sortFilter: document.getElementById("sortFilter"),

  // Catalog
  productGrid: document.getElementById("productGrid"),
  productCount: document.getElementById("productCount"),
  viewAllCatalogLink: document.getElementById("viewAllCatalogLink"),

  // Sidebar Dashboard
  orderTotal: document.getElementById("orderTotal"),
  revenueTotal: document.getElementById("revenueTotal"),
  savedTotal: document.getElementById("savedTotal"),
  ordersList: document.getElementById("ordersList"),

  // Cart Drawer
  cartDrawer: document.getElementById("cartDrawer"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  continueShoppingBtn: document.getElementById("continueShoppingBtn"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  drawerItemCount: document.getElementById("drawerItemCount"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  freeShippingText: document.getElementById("freeShippingText"),
  shippingProgressBar: document.getElementById("shippingProgressBar"),

  // Checkout Modal
  checkoutModal: document.getElementById("checkoutModal"),
  closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),
  cancelCheckoutBtn: document.getElementById("cancelCheckoutBtn"),
  checkoutForm: document.getElementById("checkoutForm"),
  modalCheckoutTotal: document.getElementById("modalCheckoutTotal"),

  // Account Modal
  accountModal: document.getElementById("accountModal"),
  closeAccountBtn: document.getElementById("closeAccountBtn"),
  accountForm: document.getElementById("accountForm"),
  accEmail: document.getElementById("accEmail"),
  accPass: document.getElementById("accPass"),

  // Interactive Features Modals
  ratesModal: document.getElementById("ratesModal"),
  closeRatesBtn: document.getElementById("closeRatesBtn"),
  serviceRatesTrigger: document.getElementById("serviceRatesTrigger"),
  openRatesFooterBtn: document.getElementById("openRatesFooterBtn"),

  returnsModal: document.getElementById("returnsModal"),
  closeReturnsBtn: document.getElementById("closeReturnsBtn"),
  serviceReturnsTrigger: document.getElementById("serviceReturnsTrigger"),
  openReturnsFooterBtn: document.getElementById("openReturnsFooterBtn"),

  faqModal: document.getElementById("faqModal"),
  closeFaqBtn: document.getElementById("closeFaqBtn"),
  openFaqFooterBtn: document.getElementById("openFaqFooterBtn"),
  faqQuestions: document.querySelectorAll(".faq-question-btn"),

  whatsappModal: document.getElementById("whatsappModal"),
  closeWhatsAppBtn: document.getElementById("closeWhatsAppBtn"),
  topWhatsAppBtn: document.getElementById("topWhatsAppBtn"),
  serviceWhatsAppTrigger: document.getElementById("serviceWhatsAppTrigger"),
  openWhatsAppFromCardBtn: document.getElementById("openWhatsAppFromCardBtn"),
  openWhatsAppFooterBtn: document.getElementById("openWhatsAppFooterBtn"),

  // Newsletter
  newsletterForm: document.getElementById("newsletterForm"),

  // Toast
  toastContainer: document.getElementById("toastContainer")
};

// --- 4. Utilities ---
function money(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
}

function persist() {
  localStorage.setItem("styleo-cart", JSON.stringify(state.cart));
  localStorage.setItem("styleo-wishlist", JSON.stringify(state.wishlist));
  localStorage.setItem("styleo-orders", JSON.stringify(state.orders));
}

function showToast(message, iconSvg = null) {
  if (!els.toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast-msg";

  const iconHtml = iconSvg || `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

  toast.innerHTML = `<span aria-hidden="true">${iconHtml}</span> <span>${message}</span>`;
  els.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 180ms ease";
    setTimeout(() => toast.remove(), 200);
  }, 2400);
}

// --- 5. Filtering & Calculations ---
function getFilteredProducts() {
  const query = state.filters.search.trim().toLowerCase();
  let list = products.filter((p) => {
    const matchesCat = state.filters.category === "all" || p.category === state.filters.category;
    const matchesSearch = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  if (state.filters.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.filters.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.filters.sort === "rating-desc") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return state.cart.reduce((sum, entry) => {
    const p = products.find((x) => x.id === entry.id);
    return sum + (p ? p.price * entry.qty : (entry.price || 0) * entry.qty);
  }, 0);
}

// --- 6. Rendering Logic ---
function renderProducts() {
  const items = getFilteredProducts();

  if (els.productCount) {
    els.productCount.textContent = `Showing ${items.length} of ${products.length} luxury pieces`;
  }

  if (!items.length) {
    els.productGrid.innerHTML = `
      <div class="no-catalog-items">
        <h3 style="margin-bottom: 8px;">No matching pieces found</h3>
        <p style="font-size: 0.9rem; margin-bottom: 16px;">Try adjusting your search query or selecting a different category tab.</p>
        <button class="primary-pill-btn" id="resetCatalogBtn">View All Pieces</button>
      </div>
    `;
    const resetBtn = document.getElementById("resetCatalogBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        setCategory("all");
        if (els.searchInput) els.searchInput.value = "";
        state.filters.search = "";
        if (els.clearSearchBtn) els.clearSearchBtn.classList.add("hidden");
        renderProducts();
      });
    }
    return;
  }

  els.productGrid.innerHTML = items
    .map((item) => {
      const isSaved = state.wishlist.includes(item.id);
      return `
        <article class="product-card" data-product-id="${item.id}">
          <div class="product-card-img-box">
            <img
              src="${item.img}"
              alt="${item.name} by STYLEO Ceylon"
              class="product-img"
              loading="lazy"
            />
            <span class="product-tag-pill">${item.badge}</span>
            <button
              class="wishlist-heart-btn ${isSaved ? "saved" : ""}"
              data-wish="${item.id}"
              aria-label="${isSaved ? "Remove from wishlist" : "Add to wishlist"}"
            >
              ${isSaved ? "♥" : "♡"}
            </button>
          </div>

          <div class="product-info">
            <span class="product-cat-kicker">${item.category}</span>
            <h3 class="product-name">${item.name}</h3>
            <div class="product-rating-row">
              <svg class="star-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="#E5A93C">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <strong>${item.rating.toFixed(1)}</strong>
              <small>(${item.reviewsCount})</small>
            </div>

            <div class="product-bottom-row">
              <div class="product-price-box">
                <span class="price-main">${money(item.price)}</span>
                <span class="price-regular">${money(item.regularPrice)}</span>
              </div>
              <button class="add-bag-pill" data-add="${item.id}" aria-label="Add ${item.name} to bag">
                + Add
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();
  const freeThreshold = 8500;

  if (els.cartCount) els.cartCount.textContent = count;
  if (els.drawerItemCount) els.drawerItemCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  if (els.cartTotal) els.cartTotal.textContent = money(total);
  if (els.modalCheckoutTotal) els.modalCheckoutTotal.textContent = money(total);

  // Free shipping progress
  if (els.shippingProgressBar && els.freeShippingText) {
    if (total >= freeThreshold) {
      els.shippingProgressBar.style.width = "100%";
      els.shippingProgressBar.style.backgroundColor = "var(--success)";
      els.freeShippingText.innerHTML = `<strong>Free Islandwide Shipping Unlocked!</strong>`;
    } else {
      const remaining = freeThreshold - total;
      const pct = Math.min(100, Math.round((total / freeThreshold) * 100));
      els.shippingProgressBar.style.width = `${pct}%`;
      els.shippingProgressBar.style.backgroundColor = "var(--mocha-mousse)";
      els.freeShippingText.innerHTML = `Add <strong>${money(remaining)}</strong> more for Free Islandwide Delivery`;
    }
  }

  if (!state.cart.length) {
    const emptySubtext = !state.user
      ? `<p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 14px;">Sign in to your STYLEO account to add items and manage your bag.</p>
         <button type="button" id="cartSignInPromptBtn" class="primary-pill-btn" style="padding: 9px 22px; font-size: 0.84rem;">Sign In to Shop</button>`
      : `<p style="font-size: 0.88rem; color: var(--text-muted);">Explore our new arrivals to elevate your personal style.</p>`;

    els.cartItems.innerHTML = `
      <div style="text-align: center; padding: 48px 16px;">
        <div style="width: 52px; height: 52px; margin: 0 auto 12px; border-radius: 50%; background: var(--surface-cream); display: grid; place-items: center; color: var(--text-muted);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h4 style="margin-bottom: 6px;">Your shopping bag is empty</h4>
        ${emptySubtext}
      </div>
    `;

    const promptBtn = document.getElementById("cartSignInPromptBtn");
    if (promptBtn) {
      promptBtn.addEventListener("click", () => {
        closeDrawer();
        openModal(els.accountModal);
        const emailInput = document.getElementById("accEmail");
        if (emailInput) setTimeout(() => emailInput.focus(), 100);
      });
    }

    if (els.checkoutBtn) {
      els.checkoutBtn.disabled = true;
      els.checkoutBtn.style.opacity = "0.45";
      els.checkoutBtn.style.cursor = "not-allowed";
    }
    return;
  }

  if (els.checkoutBtn) {
    els.checkoutBtn.disabled = false;
    els.checkoutBtn.style.opacity = "1";
    els.checkoutBtn.style.cursor = "pointer";
  }

  els.cartItems.innerHTML = state.cart
    .map((entry) => {
      const p = products.find((item) => item.id === entry.id) || {
        id: entry.id,
        name: entry.name,
        price: entry.price,
        img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=200&q=80"
      };

      return `
        <div class="cart-item-row">
          <img src="${p.img}" alt="${p.name}" class="cart-item-thumb" />
          <div class="cart-item-details">
            <strong>${p.name}</strong>
            <small>${money(p.price)} each</small>
            <div class="qty-pill">
              <button class="qty-btn" data-dec="${p.id}" aria-label="Decrease quantity">−</button>
              <span style="font-size:0.85rem;font-weight:700;min-width:18px;text-align:center;">${entry.qty}</span>
              <button class="qty-btn" data-inc="${p.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-item-right">
            <strong>${money(p.price * entry.qty)}</strong>
            <button class="remove-btn" data-remove="${p.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderOrders() {
  if (!state.orders.length) {
    els.ordersList.innerHTML = `
      <div style="text-align:center; padding: 22px 10px; color: var(--text-light);">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:8px; opacity:0.45; display:inline-block;">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <p style="font-size:0.86rem; margin:0; font-weight:600; color:var(--text-main);">No active orders yet</p>
        <small style="font-size:0.78rem; opacity:0.8; display:block; margin-top:4px;">Place an order to track live delivery status.</small>
      </div>
    `;
    return;
  }

  els.ordersList.innerHTML = state.orders
    .slice()
    .reverse()
    .map((order) => {
      const summary = order.items
        .map((i) => {
          const p = products.find((x) => x.id === i.id);
          return `${i.qty}× ${p ? p.name : i.name || "Item"}`;
        })
        .join(", ");

      return `
        <div class="order-feed-card">
          <div class="order-feed-header">
            <span class="order-id-txt">${order.id}</span>
            <span class="order-status-badge">${order.status}</span>
          </div>
          <div class="order-feed-items">${summary}</div>
          <div class="order-feed-footer">
            <span>${order.customer ? order.customer.district || "Islandwide" : "Colombo"}</span>
            <span class="order-feed-total">${money(order.total)}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateDashboard() {
  if (els.wishlistCount) els.wishlistCount.textContent = state.wishlist.length;
  if (els.savedTotal) els.savedTotal.textContent = state.wishlist.length;
  if (els.orderTotal) els.orderTotal.textContent = state.orders.length;

  const revenue = state.orders.reduce((sum, ord) => sum + ord.total, 0);
  if (els.revenueTotal) els.revenueTotal.textContent = money(revenue);
}

function setCategory(cat) {
  state.filters.category = cat;

  // Sync tab buttons
  els.tabButtons.forEach((tab) => {
    if (tab.dataset.category === cat) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Sync avatar buttons
  els.avatarButtons.forEach((btn) => {
    if (btn.dataset.category === cat) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderProducts();
}

function syncUI() {
  renderProducts();
  renderCart();
  renderOrders();
  updateDashboard();
  updateAuthUI();
}

// --- 7. Authentication State & UI Sync ---
function updateAuthUI() {
  const isAuth = !!state.user;
  const accountBtn = els.accountBtn;
  const mobileBtn = els.mobileAccountBtn;

  if (isAuth) {
    const displayName = (state.user && state.user.name) ? state.user.name : "Member";
    if (accountBtn) {
      accountBtn.classList.add("signed-in");
      accountBtn.innerHTML = `<span class="auth-status-dot" aria-hidden="true"></span><span>Sign Out</span>`;
      accountBtn.setAttribute("title", `Signed in as ${displayName} • Click to Sign Out`);
      accountBtn.setAttribute("aria-label", `Sign Out (${displayName})`);
    }
    if (mobileBtn) {
      mobileBtn.classList.add("signed-in");
      mobileBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span id="mobileAccountBtnText">Sign Out (${displayName})</span>
      `;
      mobileBtn.setAttribute("title", `Signed in as ${displayName} • Click to Sign Out`);
    }
  } else {
    if (accountBtn) {
      accountBtn.classList.remove("signed-in");
      accountBtn.innerHTML = `<span>Sign In</span>`;
      accountBtn.setAttribute("title", "Sign in to STYLEO Circle");
      accountBtn.setAttribute("aria-label", "Sign in to STYLEO Circle");
    }
    if (mobileBtn) {
      mobileBtn.classList.remove("signed-in");
      mobileBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span id="mobileAccountBtnText">Sign In</span>
      `;
      mobileBtn.setAttribute("title", "Sign in to STYLEO Circle");
    }
  }
}

function handleAuthAction() {
  if (state.user) {
    const prevName = state.user.name || "Member";
    state.user = null;
    localStorage.removeItem("styleo-user");
    // Clear cart on sign out
    state.cart = [];
    localStorage.removeItem("styleo-cart");
    renderCart();
    updateDashboard();
    updateAuthUI();
    if (els.siteNav && els.siteNav.classList.contains("open")) {
      els.siteNav.classList.remove("open");
      if (els.menuToggle) els.menuToggle.setAttribute("aria-expanded", "false");
    }
    showToast(`Signed out of STYLEO Circle. See you soon, ${prevName}!`);
  } else {
    if (els.siteNav && els.siteNav.classList.contains("open")) {
      els.siteNav.classList.remove("open");
      if (els.menuToggle) els.menuToggle.setAttribute("aria-expanded", "false");
    }
    openModal(els.accountModal);
    const emailInput = document.getElementById("accEmail");
    if (emailInput) setTimeout(() => emailInput.focus(), 100);
  }
}

// --- 7. Drawer & Modal Management ---
function openModal(modalEl) {
  if (!modalEl) return;

  // If opening the authentication modal, synchronize profile vs login view
  if (modalEl === els.accountModal) {
    const loggedOutView = document.getElementById("authContentLoggedOut");
    const loggedInView = document.getElementById("authContentLoggedIn");
    if (state.user) {
      if (loggedOutView) loggedOutView.classList.add("hidden");
      if (loggedInView) {
        loggedInView.classList.remove("hidden");
        const initial = document.getElementById("profileAvatarInitial");
        const dispName = document.getElementById("profileDisplayName");
        const dispEmail = document.getElementById("profileDisplayEmail");
        if (initial) initial.textContent = (state.user.name || "M").charAt(0).toUpperCase();
        if (dispName) dispName.textContent = state.user.name || "STYLEO VIP Member";
        if (dispEmail) dispEmail.textContent = state.user.email || "devindi@styleo.lk";
      }
    } else {
      if (loggedOutView) loggedOutView.classList.remove("hidden");
      if (loggedInView) loggedInView.classList.add("hidden");
    }
  }

  modalEl.classList.remove("hidden");
  els.backdrop.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("hidden");
  // Only hide backdrop if all modals and drawers are closed
  const anyModalOpen = document.querySelector(".modal:not(.hidden)");
  const isDrawerOpen = els.cartDrawer.classList.contains("open");
  if (!anyModalOpen && !isDrawerOpen) {
    els.backdrop.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function closeAllOverlays() {
  els.cartDrawer.classList.remove("open");
  document.querySelectorAll(".modal").forEach((m) => m.classList.add("hidden"));
  els.backdrop.classList.add("hidden");
  document.body.style.overflow = "";
}

function openDrawer() {
  els.cartDrawer.classList.add("open");
  els.backdrop.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  els.cartDrawer.classList.remove("open");
  const anyModalOpen = document.querySelector(".modal:not(.hidden)");
  if (!anyModalOpen) {
    els.backdrop.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// --- 8. Shopping Bag & Wishlist Actions ---
function addToCart(id, customItem = null) {
  // Authentication Gate: Only signed-in members can add to cart
  if (!state.user) {
    state.pendingCartItem = { id, customItem };
    showToast("Please sign in to add items to your shopping bag!");
    openModal(els.accountModal);
    const emailInput = document.getElementById("accEmail");
    if (emailInput) setTimeout(() => emailInput.focus(), 100);
    return;
  }

  const product = customItem || products.find((p) => p.id === id);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  persist();
  renderCart();
  updateDashboard();
  showToast(`Added "${product.name}" to Bag`);
}

function toggleWishlist(id) {
  const p = products.find((item) => item.id === id);
  if (!p) return;

  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter((wId) => wId !== id);
    showToast(`Removed "${p.name}" from saved list`);
  } else {
    state.wishlist.push(id);
    showToast(`Saved "${p.name}" to wishlist`);
  }

  persist();
  renderProducts();
  updateDashboard();
}

function changeQty(id, delta) {
  const entry = state.cart.find((item) => item.id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== id);
  }
  persist();
  renderCart();
  updateDashboard();
}

function removeFromCart(id) {
  const p = products.find((item) => item.id === id);
  state.cart = state.cart.filter((item) => item.id !== id);
  persist();
  renderCart();
  updateDashboard();
  if (p) showToast(`Removed "${p.name}" from bag`);
}

// --- 9. Event Listeners ---
// Cart Drawer
if (els.openCartBtn) els.openCartBtn.addEventListener("click", openDrawer);
if (els.closeCartBtn) els.closeCartBtn.addEventListener("click", closeDrawer);
if (els.continueShoppingBtn) els.continueShoppingBtn.addEventListener("click", closeDrawer);

// Checkout Modal
if (els.checkoutBtn) {
  els.checkoutBtn.addEventListener("click", () => {
    if (!state.user) {
      closeDrawer();
      showToast("Please sign in before proceeding to checkout!");
      openModal(els.accountModal);
      const emailInput = document.getElementById("accEmail");
      if (emailInput) setTimeout(() => emailInput.focus(), 100);
      return;
    }
    if (!state.cart.length) {
      showToast("Please add items to your shopping bag first!");
      return;
    }
    closeDrawer();
    openModal(els.checkoutModal);
    const custName = document.getElementById("custName");
    const custEmail = document.getElementById("custEmail");
    if (custName && !custName.value) custName.value = state.user.name;
    if (custEmail && !custEmail.value && state.user.email && state.user.email.includes("@")) {
      custEmail.value = state.user.email;
    }
    if (custName) setTimeout(() => custName.focus(), 100);
  });
}
if (els.closeCheckoutBtn) els.closeCheckoutBtn.addEventListener("click", () => closeModal(els.checkoutModal));
if (els.cancelCheckoutBtn) els.cancelCheckoutBtn.addEventListener("click", () => closeModal(els.checkoutModal));

// Account Modal & Auth Triggers
if (els.accountBtn) els.accountBtn.addEventListener("click", handleAuthAction);
if (els.mobileAccountBtn) els.mobileAccountBtn.addEventListener("click", handleAuthAction);
if (els.closeAccountBtn) els.closeAccountBtn.addEventListener("click", () => closeModal(els.accountModal));

// Authenticated Profile Actions
const profileSignOutBtn = document.getElementById("profileSignOutBtn");
if (profileSignOutBtn) {
  profileSignOutBtn.addEventListener("click", () => {
    closeModal(els.accountModal);
    handleAuthAction();
  });
}

const profileTrackOrdersBtn = document.getElementById("profileTrackOrdersBtn");
if (profileTrackOrdersBtn) {
  profileTrackOrdersBtn.addEventListener("click", () => {
    closeModal(els.accountModal);
    const dash = document.getElementById("dashboard");
    if (dash) dash.scrollIntoView({ behavior: "smooth" });
  });
}

if (els.accountForm) {
  els.accountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("accEmail");
    const passInput = document.getElementById("accPass");
    const rawVal = (emailInput ? emailInput.value : "").trim();

    let displayName = "Member";
    if (rawVal) {
      if (rawVal.includes("@")) {
        displayName = rawVal.split("@")[0];
      } else {
        displayName = rawVal;
      }
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    }

    state.user = {
      name: displayName,
      email: rawVal,
      token: "VIP-" + Math.floor(1000 + Math.random() * 9000),
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem("styleo-user", JSON.stringify(state.user));

    updateAuthUI();
    closeModal(els.accountModal);
    if (els.accountForm.reset) els.accountForm.reset();

    // Auto-populate checkout name/email if empty
    const custName = document.getElementById("custName");
    const custEmail = document.getElementById("custEmail");
    if (custName && !custName.value) custName.value = state.user.name;
    if (custEmail && !custEmail.value && rawVal.includes("@")) custEmail.value = rawVal;

    showToast(`Welcome back, ${state.user.name}! Signed in to STYLEO.`);

    // If user attempted to add an item before signing in, fulfill it now
    if (state.pendingCartItem) {
      const pending = state.pendingCartItem;
      state.pendingCartItem = null;
      setTimeout(() => {
        addToCart(pending.id, pending.customItem);
      }, 350);
    }
  });
}

// Feature 1: Islandwide Courier Rates Modal
if (els.serviceRatesTrigger) els.serviceRatesTrigger.addEventListener("click", () => openModal(els.ratesModal));
if (els.openRatesFooterBtn) els.openRatesFooterBtn.addEventListener("click", () => openModal(els.ratesModal));
if (els.closeRatesBtn) els.closeRatesBtn.addEventListener("click", () => closeModal(els.ratesModal));

// Feature 2: Returns & Exchanges Modal
if (els.serviceReturnsTrigger) els.serviceReturnsTrigger.addEventListener("click", () => openModal(els.returnsModal));
if (els.openReturnsFooterBtn) els.openReturnsFooterBtn.addEventListener("click", () => openModal(els.returnsModal));
if (els.closeReturnsBtn) els.closeReturnsBtn.addEventListener("click", () => closeModal(els.returnsModal));

// Feature 3: FAQs Modal & Accordions
if (els.openFaqFooterBtn) els.openFaqFooterBtn.addEventListener("click", () => openModal(els.faqModal));
if (els.closeFaqBtn) els.closeFaqBtn.addEventListener("click", () => closeModal(els.faqModal));

els.faqQuestions.forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    // Close other FAQ items
    document.querySelectorAll(".faq-item").forEach((f) => f.classList.remove("open"));
    if (!isOpen) {
      item.classList.add("open");
    }
  });
});

// Feature 4: WhatsApp Concierge Modal
const openWhatsAppModal = () => openModal(els.whatsappModal);
if (els.topWhatsAppBtn) els.topWhatsAppBtn.addEventListener("click", openWhatsAppModal);
if (els.serviceWhatsAppTrigger) els.serviceWhatsAppTrigger.addEventListener("click", openWhatsAppModal);
if (els.openWhatsAppFromCardBtn) els.openWhatsAppFromCardBtn.addEventListener("click", openWhatsAppModal);
if (els.openWhatsAppFooterBtn) els.openWhatsAppFooterBtn.addEventListener("click", openWhatsAppModal);
if (els.closeWhatsAppBtn) els.closeWhatsAppBtn.addEventListener("click", () => closeModal(els.whatsappModal));

// Backdrop click closes all overlays
if (els.backdrop) {
  els.backdrop.addEventListener("click", closeAllOverlays);
}

// Search Button in Header: Scrolls and focuses search
if (els.searchTriggerBtn) {
  els.searchTriggerBtn.addEventListener("click", () => {
    const cat = document.getElementById("catalog");
    if (cat) cat.scrollIntoView({ behavior: "smooth" });
    if (els.searchInput) setTimeout(() => els.searchInput.focus(), 300);
  });
}

// Wishlist button in Header
if (els.wishlistCountBtn) {
  els.wishlistCountBtn.addEventListener("click", () => {
    if (state.wishlist.length === 0) {
      showToast("Your wishlist is empty. Tap ♡ to save pieces.");
    } else {
      showToast(`You have ${state.wishlist.length} saved pieces in your collection.`);
    }
    const cat = document.getElementById("catalog");
    if (cat) cat.scrollIntoView({ behavior: "smooth" });
  });
}

// Mobile Hamburger Menu
if (els.menuToggle && els.siteNav) {
  els.menuToggle.addEventListener("click", () => {
    const isOpen = els.siteNav.classList.toggle("open");
    els.menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  els.siteNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      els.siteNav.classList.remove("open");
      els.menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Category Tabs (Desktop & Tablet)
els.tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => {
    setCategory(tab.dataset.category);
  });
});

// Category Avatars (Mobile)
els.avatarButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setCategory(btn.dataset.category);
    const cat = document.getElementById("catalog");
    if (cat) cat.scrollIntoView({ behavior: "smooth" });
  });
});

// Shop Now buttons inside Featured Collection cards
document.querySelectorAll("[data-filter-trigger]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const targetCat = btn.getAttribute("data-filter-trigger");
    setCategory(targetCat);
  });
});

// Search input
if (els.searchInput) {
  els.searchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value;
    if (els.clearSearchBtn) {
      if (e.target.value.length > 0) {
        els.clearSearchBtn.classList.remove("hidden");
      } else {
        els.clearSearchBtn.classList.add("hidden");
      }
    }
    renderProducts();
  });
}

if (els.clearSearchBtn) {
  els.clearSearchBtn.addEventListener("click", () => {
    state.filters.search = "";
    els.searchInput.value = "";
    els.clearSearchBtn.classList.add("hidden");
    els.searchInput.focus();
    renderProducts();
  });
}

// Sort dropdown
if (els.sortFilter) {
  els.sortFilter.addEventListener("change", (e) => {
    state.filters.sort = e.target.value;
    renderProducts();
  });
}

// Product Grid Delegation (Add to Cart & Wishlist Heart)
if (els.productGrid) {
  els.productGrid.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    const wishBtn = e.target.closest("[data-wish]");

    if (addBtn) {
      const id = Number(addBtn.getAttribute("data-add"));
      addToCart(id);
    } else if (wishBtn) {
      const id = Number(wishBtn.getAttribute("data-wish"));
      toggleWishlist(id);
    }
  });
}

// Quick Add from Best Sellers
document.querySelectorAll("[data-quick-item]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-quick-item");
    const price = Number(btn.getAttribute("data-price"));
    const tempId = 100 + Math.floor(Math.random() * 800);
    addToCart(tempId, { id: tempId, name, price });
  });
});

// Cart Items Delegation (+, -, Remove)
if (els.cartItems) {
  els.cartItems.addEventListener("click", (e) => {
    const incBtn = e.target.closest("[data-inc]");
    const decBtn = e.target.closest("[data-dec]");
    const removeBtn = e.target.closest("[data-remove]");

    if (incBtn) {
      changeQty(Number(incBtn.getAttribute("data-inc")), 1);
    } else if (decBtn) {
      changeQty(Number(decBtn.getAttribute("data-dec")), -1);
    } else if (removeBtn) {
      removeFromCart(Number(removeBtn.getAttribute("data-remove")));
    }
  });
}

// Checkout Form Submission
if (els.checkoutForm) {
  els.checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.cart.length) return;

    const formData = new FormData(els.checkoutForm);
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `DOMEX-LK-${orderNum}`;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

    const newOrder = {
      id: orderId,
      date: formattedDate,
      customer: {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        district: formData.get("district"),
        city: formData.get("city"),
        address: formData.get("address")
      },
      items: [...state.cart],
      total: getCartTotal(),
      paymentMethod: formData.get("paymentMethod"),
      status: `Dispatched to ${formData.get("district")}`
    };

    state.orders.push(newOrder);
    state.cart = [];

    persist();
    els.checkoutForm.reset();
    closeModal(els.checkoutModal);
    syncUI();

    showToast(`Order ${orderId} placed successfully! Tracking live.`);

    const dash = document.getElementById("dashboard");
    if (dash) dash.scrollIntoView({ behavior: "smooth" });
  });
}

// Newsletter Subscription
if (els.newsletterForm) {
  els.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Welcome! Use code CEYLON10 for 10% off your order.");
    els.newsletterForm.reset();
  });
}

// Keyboard ESC closes all modals and drawers
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllOverlays();
  }
});

// Boot application
syncUI();


// --- 10. Project 4 Full-Stack Dynamic Fetch Engine ---
async function fetchProductsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    // Defensive programming: check response.ok before deserializing JSON
    if (!response.ok) {
      throw new Error(`Failed to fetch products: HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      products = result.data;
      isApiOnline = true;
      renderProducts();
      console.log(`[FULL-STACK INTEGRATION] Successfully loaded ${products.length} products dynamically from MySQL.`);
    }
  } catch (err) {
    console.warn('[FULL-STACK INTEGRATION] Using local product cache (Server offline or connecting):', err.message);
  }
}

// Trigger dynamic fetch on startup
fetchProductsFromAPI();
