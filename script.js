// --- Extended Products Dataset in Indian Rupees (INR) ---
const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Audio",
    price: 29990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Apple Watch Series 9 GPS",
    category: "Wearables",
    price: 41900,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Keychron K2 Mechanical Keyboard",
    category: "Electronics",
    price: 8499,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Logitech MX Master 3S Mouse",
    category: "Electronics",
    price: 9495,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "JBL Flip 6 Portable Bluetooth Speaker",
    category: "Audio",
    price: 9999,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Sony PlayStation 5 DualSense Controller",
    category: "Gaming",
    price: 5990,
    image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "HyperX Cloud II Gaming Headset",
    category: "Gaming",
    price: 6890,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Samsung Galaxy Watch 6 LTE",
    category: "Wearables",
    price: 28999,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Spigen MagSafe Armor Case",
    category: "Accessories",
    price: 1899,
    image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Anker 65W GaN Fast Charger",
    category: "Accessories",
    price: 3499,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "SteelSeries RGB Gaming Mousepad",
    category: "Gaming",
    price: 2499,
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "SanDisk Extreme 1TB Portable SSD",
    category: "Electronics",
    price: 10999,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80"
  }
];

// --- Currency Formatter Utility (Indian Numbering & Symbol) ---
const formatINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};

// --- Application State ---
let cart = JSON.parse(localStorage.getItem("martx_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("martx_wishlist")) || [];
let currentCategory = "all";
let searchQuery = "";

// --- DOM References ---
const productsGrid = document.getElementById("productsGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");

const wishlistBtn = document.getElementById("wishlistBtn");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const closeWishlist = document.getElementById("closeWishlist");
const wishlistItems = document.getElementById("wishlistItems");
const wishlistBadge = document.getElementById("wishlistBadge");
const checkoutBtn = document.getElementById("checkoutBtn");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  setupEventListeners();
});

// --- Theme Handler ---
function initTheme() {
  const savedTheme = localStorage.getItem("martx_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  themeToggle.innerHTML = theme === "dark" 
    ? '<i class="fa-solid fa-sun"></i>' 
    : '<i class="fa-solid fa-moon"></i>';
}

// --- Render Dynamic Product Cards ---
function renderProducts() {
  const filtered = products.filter(item => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");
  productsGrid.innerHTML = filtered.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    return `
      <div class="product-card glass">
        <div class="product-img-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
          <button class="wishlist-heart-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="toggleWishlist(${product.id})" 
                  aria-label="Wishlist">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h4 class="product-title">${product.name}</h4>
          <span class="product-price">${formatINR(product.price)}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// --- Cart Operations ---
window.addToCart = function(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added <b>${product.name}</b> to cart`);
};

window.updateQty = function(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem("martx_cart", JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  cartBadge.innerText = totalCount;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="text-align:center; color: var(--text-muted); margin-top:2rem;">Your cart is empty.</p>`;
    cartTotal.innerText = formatINR(0);
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="item-card">
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <div class="item-title">${item.name}</div>
        <div class="item-price">${formatINR(item.price * item.qty)}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  cartTotal.innerText = formatINR(total);
}

// --- Wishlist Operations ---
window.toggleWishlist = function(id) {
  const index = wishlist.indexOf(id);
  const product = products.find(p => p.id === id);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`Removed from wishlist`);
  } else {
    wishlist.push(id);
    showToast(`Saved to wishlist`);
  }

  localStorage.setItem("martx_wishlist", JSON.stringify(wishlist));
  updateWishlistUI();
  renderProducts();
};

function updateWishlistUI() {
  wishlistBadge.innerText = wishlist.length;

  if (wishlist.length === 0) {
    wishlistItems.innerHTML = `<p style="text-align:center; color: var(--text-muted); margin-top:2rem;">No items saved in wishlist.</p>`;
    return;
  }

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  wishlistItems.innerHTML = wishlistedProducts.map(item => `
    <div class="item-card">
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <div class="item-title">${item.name}</div>
        <div class="item-price">${formatINR(item.price)}</div>
        <button class="add-to-cart-btn" style="padding: 6px 10px; font-size: 0.8rem; margin-top: 6px;" onclick="addToCart(${item.id})">
          Move to Cart
        </button>
      </div>
    </div>
  `).join("");
}

// --- Toast Notifications ---
function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast glass";
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--success)"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// --- Event Handlers ---
function setupEventListeners() {
  // Live Search
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Category Tabs
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Theme Toggler
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const target = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", target);
    localStorage.setItem("martx_theme", target);
    updateThemeIcon(target);
  });

  // Drawer Toggles
  cartBtn.addEventListener("click", () => cartDrawer.classList.add("open"));
  closeCart.addEventListener("click", () => cartDrawer.classList.remove("open"));

  wishlistBtn.addEventListener("click", () => wishlistDrawer.classList.add("open"));
  closeWishlist.addEventListener("click", () => wishlistDrawer.classList.remove("open"));

  [cartDrawer, wishlistDrawer].forEach(drawer => {
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) drawer.classList.remove("open");
    });
  });

  // Checkout Handler
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }
    showToast("Order placed successfully! 🎉");
    cart = [];
    saveCart();
    updateCartUI();
    cartDrawer.classList.remove("open");
  });
}