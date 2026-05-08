// ===== Product Data =====
var products = [
  { id: 1,  name: "Kamatis",      emoji: "🍅", price: 35,  unit: "per kilo" },
  { id: 2,  name: "Sibuyas",      emoji: "🧅", price: 60,  unit: "per kilo" },
  { id: 3,  name: "Bawang",       emoji: "🧄", price: 90,  unit: "per kilo" },
  { id: 4,  name: "Patatas",      emoji: "🥔", price: 50,  unit: "per kilo" },
  { id: 5,  name: "Kalabasa",     emoji: "🎃", price: 30,  unit: "per kilo" },
  { id: 6,  name: "Ampalaya",     emoji: "🥒", price: 55,  unit: "per piraso" },
  { id: 7,  name: "Kangkong",     emoji: "🥬", price: 15,  unit: "per ikat" },
  { id: 8,  name: "Sitaw",        emoji: "🫘", price: 40,  unit: "per ikat" },
  { id: 9,  name: "Okra",         emoji: "🫑", price: 45,  unit: "per kilo" },
  { id: 10, name: "Repolyo",      emoji: "🥦", price: 40,  unit: "per ulo" },
  { id: 11, name: "Pechay",       emoji: "🥬", price: 20,  unit: "per ikat" },
  { id: 12, name: "Talong",       emoji: "🍆", price: 50,  unit: "per kilo" },
  { id: 13, name: "Labanos",      emoji: "🌿", price: 25,  unit: "per piraso" },
  { id: 14, name: "Upo",          emoji: "🥗", price: 20,  unit: "per piraso" },
  { id: 15, name: "Mais",         emoji: "🌽", price: 25,  unit: "per piraso" },
  { id: 16, name: "Camote",       emoji: "🍠", price: 35,  unit: "per kilo" },
];

// ===== State Variables =====
var cart = [];
var quantities = {};       // selected qty per product on the shop
var promoApplied = false;
var discountPercent = 0;

// ===== Initialize quantities =====
function initQuantities() {
  products.forEach(function(p) {
    quantities[p.id] = 1;
  });
}

// ===== Render Products =====
function renderProducts(list) {
  var grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = '<p class="no-results">Walang nahanap na gulay. 😔</p>';
    return;
  }

  list.forEach(function(product) {
    var card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML =
      '<div class="product-emoji">' + product.emoji + '</div>' +
      '<h3 class="product-name">' + product.name + '</h3>' +
      '<p class="product-unit">' + product.unit + '</p>' +
      '<p class="product-price">&#8369;' + product.price.toFixed(2) + '</p>' +
      '<div class="qty-controls">' +
        '<button class="qty-btn" onclick="changeQty(' + product.id + ', -1)">&#8722;</button>' +
        '<span class="qty-display" id="qty-' + product.id + '">' + quantities[product.id] + '</span>' +
        '<button class="qty-btn" onclick="changeQty(' + product.id + ', 1)">&#43;</button>' +
      '</div>' +
      '<button class="add-btn" onclick="addToCart(' + product.id + ')">+ Idagdag sa Basket</button>';
    grid.appendChild(card);
  });
}

// ===== Change Qty on Product Card =====
function changeQty(productId, delta) {
  quantities[productId] = Math.max(1, (quantities[productId] || 1) + delta);
  var el = document.getElementById("qty-" + productId);
  if (el) el.textContent = quantities[productId];
}

// ===== Add to Cart =====
function addToCart(productId) {
  var product = products.find(function(p) { return p.id === productId; });
  if (!product) return;

  var qty = quantities[productId] || 1;
  var existing = cart.find(function(item) { return item.id === productId; });

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, emoji: product.emoji, price: product.price, unit: product.unit, qty: qty });
  }

  showToast(product.emoji + " " + product.name + " naidagdag sa basket!");
  renderCart();
  updateBadge();
}

// ===== Render Cart =====
function renderCart() {
  var container = document.getElementById("cartItems");
  var emptyMsg = document.getElementById("emptyMsg");
  var summary = document.getElementById("cartSummary");

  // Clear old items (keep emptyMsg element)
  var oldItems = container.querySelectorAll(".cart-item");
  oldItems.forEach(function(el) { el.remove(); });

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    summary.style.display = "none";
    return;
  }

  emptyMsg.style.display = "none";
  summary.style.display = "flex";

  cart.forEach(function(item) {
    var div = document.createElement("div");
    div.className = "cart-item";
    div.id = "cart-item-" + item.id;
    div.innerHTML =
      '<span class="cart-item-emoji">' + item.emoji + '</span>' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-price">&#8369;' + item.price.toFixed(2) + ' x ' + item.qty + ' = &#8369;' + (item.price * item.qty).toFixed(2) + '</div>' +
      '</div>' +
      '<div class="cart-item-controls">' +
        '<button class="cart-qty-btn" onclick="adjustCartQty(' + item.id + ', -1)">&#8722;</button>' +
        '<span class="cart-qty-num">' + item.qty + '</span>' +
        '<button class="cart-qty-btn" onclick="adjustCartQty(' + item.id + ', 1)">&#43;</button>' +
        '<button class="cart-remove-btn" onclick="removeFromCart(' + item.id + ')" title="Alisin">&#10006;</button>' +
      '</div>';
    container.appendChild(div);
  });

  updateTotals();
}

// ===== Adjust Cart Qty =====
function adjustCartQty(productId, delta) {
  var item = cart.find(function(i) { return i.id === productId; });
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  renderCart();
  updateBadge();
}

// ===== Remove from Cart =====
function removeFromCart(productId) {
  cart = cart.filter(function(i) { return i.id !== productId; });
  renderCart();
  updateBadge();
  showToast("Inalis sa basket.");
}

// ===== Clear Cart =====
function clearCart() {
  if (cart.length === 0) { showToast("Walang laman ang basket!"); return; }
  cart = [];
  promoApplied = false;
  discountPercent = 0;
  document.getElementById("promoInput").value = "";
  document.getElementById("discountRow").style.display = "none";
  renderCart();
  updateBadge();
  showToast("Nalis na ang lahat sa basket.");
}

// ===== Update Totals =====
function updateTotals() {
  var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.qty); }, 0);
  var discount = promoApplied ? subtotal * (discountPercent / 100) : 0;
  var total = subtotal - discount;

  document.getElementById("subtotal").textContent = "₱" + subtotal.toFixed(2);
  document.getElementById("totalPrice").textContent = "₱" + total.toFixed(2);

  if (promoApplied) {
    document.getElementById("discountAmt").textContent = "-₱" + discount.toFixed(2);
    document.getElementById("discountRow").style.display = "flex";
  } else {
    document.getElementById("discountRow").style.display = "none";
  }
}

// ===== Update Badge =====
function updateBadge() {
  var total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  document.getElementById("cartBadge").textContent = total;
}

// ===== Apply Promo =====
function applyPromo() {
  var code = document.getElementById("promoInput").value.trim().toUpperCase();
  if (cart.length === 0) { showToast("Walang laman ang basket!"); return; }

  if (code === "DISKWENTO10") {
    promoApplied = true;
    discountPercent = 10;
    showToast("Naka-apply na ang 10% diskwento!");
    updateTotals();
  } else if (code === "GULAY20") {
    promoApplied = true;
    discountPercent = 20;
    showToast("Naka-apply na ang 20% diskwento!");
    updateTotals();
  } else {
    showToast("Di valid ang promo code. Subukan muli!");
  }
}

// ===== Checkout =====
function checkout() {
  if (cart.length === 0) { showToast("Wala pang laman ang basket mo!"); return; }

  var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.qty); }, 0);
  var discount = promoApplied ? subtotal * (discountPercent / 100) : 0;
  var total = subtotal - discount;

  var itemList = cart.map(function(item) {
    return item.emoji + " " + item.name + " x" + item.qty;
  }).join(", ");

  var msg = "Binili mo: " + itemList + ".\n\nKabuuang bayad: ₱" + total.toFixed(2) + ". Magpapadala kami ng iyong mga gulay sa lalong madaling panahon! 🚚🥦";

  document.getElementById("modalMessage").textContent = msg;
  document.getElementById("modalOverlay").classList.add("active");

  // Reset
  cart = [];
  promoApplied = false;
  discountPercent = 0;
  document.getElementById("promoInput").value = "";
  renderCart();
  updateBadge();
}

// ===== Close Modal =====
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
}

// ===== Toggle Cart on Mobile =====
function toggleCart() {
  var sidebar = document.getElementById("cartSidebar");
  sidebar.classList.toggle("open");
}

// ===== Show Toast =====
function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() {
    toast.classList.remove("show");
  }, 2500);
}

// ===== Filter / Search Products =====
function filterProducts() {
  var query = document.getElementById("searchInput").value.toLowerCase();
  var filtered = products.filter(function(p) {
    return p.name.toLowerCase().includes(query);
  });
  renderProducts(filtered);
}

// ===== Init =====
initQuantities();
renderProducts(products);
