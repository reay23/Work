const CART_KEY = "reresfits_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(
    item => item.id === product.id && item.size === product.size
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      qty: 1
    });
  }

  saveCart(cart);
}

function removeFromCart(id, size) {
  let cart = getCart();

  cart = cart.filter(
    item => !(item.id === id && item.size === size)
  );

  saveCart(cart);
  renderCart();
}

function updateQty(id, size, newQty) {
  const cart = getCart();

  const item = cart.find(
    item => item.id === id && item.size === size
  );

  if (!item) return;

  if (newQty <= 0) {
    removeFromCart(id, size);
    return;
  }

  item.qty = newQty;

  saveCart(cart);
  renderCart();
}

function getCartTotal() {
  return getCart().reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
}

function updateCartCount() {
  const countEl = document.getElementById("nav-cart-count");

  if (!countEl) return;

  const totalItems = getCart().reduce(
    (sum, item) => sum + item.qty,
    0
  );

  countEl.textContent = totalItems;
}

function renderCart() {
  const listEl = document.getElementById("cart-items-list");
  const emptyEl = document.getElementById("cart-empty-state");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  if (!listEl || !emptyEl || !subtotalEl || !totalEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    listEl.innerHTML = "";
    emptyEl.classList.remove("hidden");
    subtotalEl.textContent = "₦0.00";
    totalEl.textContent = "₦0.00";
    return;
  }

  emptyEl.classList.add("hidden");

  listEl.innerHTML = cart
    .map(
      item => `
      <div class="cart-item flex gap-4 md:gap-6 bg-blue-500/5 border border-blue-900/40 rounded-2xl p-4 md:p-5">

        <img
          src="${item.image}"
          alt="${item.name}"
          class="w-20 h-24 md:w-24 md:h-28 object-cover rounded-xl flex-shrink-0"
        >

        <div class="flex-1 flex flex-col justify-between">

          <div class="flex items-start justify-between gap-4">

            <div>
              <h3 class="font-['Manrope'] font-semibold text-white text-sm md:text-base">
                ${item.name}
              </h3>

              <p class="font-['Manrope'] text-blue-100/50 text-xs md:text-sm mt-1">
                Size ${item.size}
              </p>
            </div>

            <button
              onclick="removeFromCart('${item.id}','${item.size}')"
              class="text-red-400 hover:text-red-300 text-xs"
            >
              Remove
            </button>

          </div>

          <div class="flex items-center justify-between mt-4">

            <div class="flex items-center gap-3 bg-blue-500/10 rounded-full px-3 py-1.5">

              <button
                onclick="updateQty('${item.id}','${item.size}',${item.qty-1})"
              >
                −
              </button>

              <span>${item.qty}</span>

              <button
                onclick="updateQty('${item.id}','${item.size}',${item.qty+1})"
              >
                +
              </button>

            </div>

            <span class="text-blue-300 font-semibold">
              ₦${(item.price * item.qty).toLocaleString()}
            </span>

          </div>

        </div>

      </div>
    `
    )
    .join("");

  const total = getCartTotal();

  subtotalEl.textContent = `₦${total.toLocaleString()}`;
  totalEl.textContent = `₦${total.toLocaleString()}`;
}

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {

    btn.addEventListener("click", () => {

      addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: Number(btn.dataset.price),
        image: btn.dataset.image,
        size: btn.dataset.size
      });

      const original = btn.textContent;

      btn.textContent = "Added ✓";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);

    });

  });

  updateCartCount();
  renderCart();
});

const cart = getCart();
console.log(cart);
