const CART_KEY = "smart_cafeteria_cart";
const CHECKOUT_KEY = "checkoutCart";
function getLang(){ try{ return localStorage.getItem("scos_language")||localStorage.getItem("cafeteria_language")||"en"; }catch(e){return "en";} }
function tc(key){ const m={ en:{emptyTitle:"Your cart is empty", emptyDesc:"Add some delicious food from the menu.", browse:"Browse Menu", clearConfirm:"Are you sure you want to clear your cart?", emptyAlert:"Your cart is empty."}, am:{emptyTitle:"ካርትዎ ባዶ ነው!", emptyDesc:"ከማውጫው አንዳንድ ጣፋጭ ምግቦችን ይጨምሩ።", browse:"ምግቦችን ይመልከቱ", clearConfirm:"ካርትዎን ማፅዳት ይፈልጋሉ?", emptyAlert:"ካርትዎ ባዶ ነው።"} }; return (m[getLang()]&&m[getLang()][key])||m.en[key]; }
const DISH_NAME_MAP = {
  "Pasta with Bread": "ፓስታ በዳቦ",
  "Pasta with Injera": "ፓስታ በእንጀራ",
  "Firfir": "ፍርፍር",
  "Egg": "እንቁላል",
  "Scrambled Egg": "እንቁላል ፍርፍር",
  "Omelette": "እንቁላል ስልስ",
  "Pasta with Vegetables": "ፓስታ በአትክልት",
  "Shiro Feses": "ሽሮ ፈሰስ",
  "Tomato Sauce": "ቲማቲም ስልስ",
  "Cheese with Butter": "አይብ በቅቤ",
  "Red Stew": "ቀይ ወጥ",
  "Grilled Meat": "የስጋ ጥብስ",
  "Egg with Meat": "እንቁላል በስጋ",
  "Cabbage with Meat": "ጎመን በስጋ",
  "Vegetables with Meat": "አትክልት በስጋ",
  "Lentil Stew": "ምስር ኖርማል",
  "Ful with Bread": "ፉል የጾም በዳቦ",
  "Fasting Sandwich": "የጾም ሳንዱች",
  "Mixed Fasting (5 types)": "በየዓይነት (5 ዓይነት)",
  "Juice": "ጁስ",
  "Water": "ውሃ",
  "Soft Drink": "ለስላሳ",
  "Avocado with Injera": "አቮካዶ በእንጀራ",
  "Meat Sandwich": "የስጋ ሳንዱች",
  "Juice": "ጁስ"
};
function translateDish(name){ if(getLang()==="am" && DISH_NAME_MAP[name]) return DISH_NAME_MAP[name]; return name; }

// ===================================================================
// Shared cart API (module scope + exports)
//   LocalStorage key: "smart_cafeteria_cart"
// ===================================================================

export function getCart() {
    try {
        const savedCart = localStorage.getItem(CART_KEY);
        if (!savedCart) return [];
        const cart = JSON.parse(savedCart);
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Error reading cart:", error);
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart:updated"));
}

/** Convenience alias for getCart(). */
export function getCartItems() {
    return getCart();
}

/** Sum of all item quantities currently in the cart. */
export function getCartCount() {
    return getCart().reduce(function (total, item) {
        return total + (Number(item.quantity) || 0);
    }, 0);
}

/** Total value of the cart (sum of price * quantity). */
export function getCartTotal() {
    return getCart().reduce(function (total, item) {
        return total + (Number(item.price) || 0) * (Number(item.quantity) || 0);
    }, 0);
}

/** Empty the cart (clears localStorage + stale checkout data). */
export function clearCart() {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(CHECKOUT_KEY);
    window.dispatchEvent(new CustomEvent("cart:updated"));
}

document.addEventListener("DOMContentLoaded", function () {

    const cartContainer = document.getElementById("cart-container");
    const navbarCartCount = document.getElementById("navbar-cart-count");
    const itemsCartCount = document.getElementById("items-cart-count");

    const clearCartBtn = document.getElementById("clear-cart-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    const subtotalElement = document.getElementById("summary-subtotal");
    const serviceFeeElement = document.getElementById("summary-service-fee");
    const totalElement = document.getElementById("summary-total");


    function showCartLoginRequired() {
        if (document.getElementById("login-required-modal")) return;

        const isAm = getLang() === "am";
        const title = isAm ? "እባክዎ ይመዝገቡ ወይም ይግቡ" : "Please register or log in to order";
        const message = isAm ? "እቃ ለማዘዝ መግባት ያስፈልግዎታል።" : "You need to log in to proceed to checkout and place your order.";
        const loginText = isAm ? "ግባ" : "Login";
        const registerText = isAm ? "ተመዝገብ" : "Register";

        const modal = document.createElement("div");
        modal.id = "login-required-modal";
        modal.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;";
        modal.innerHTML = `
            <div style="background:#ffffff;color:#0f172a;border-radius:16px;max-width:420px;width:100%;padding:32px 28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);font-family:'Poppins',sans-serif;">
                <div style="font-size:3rem;margin-bottom:12px;">🔒</div>
                <h3 style="margin:0 0 10px;font-size:1.35rem;font-weight:700;color:#0f172a;">${title}</h3>
                <p style="margin:0 0 24px;font-size:0.95rem;color:#475569;line-height:1.5;">${message}</p>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <a href="../common/login.html" style="display:block;width:100%;padding:12px;border-radius:10px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;font-weight:600;font-size:0.95rem;text-align:center;">${loginText}</a>
                    <a href="../common/register.html" style="display:block;width:100%;padding:12px;border-radius:10px;background:transparent;color:#2563eb;border:2px solid #2563eb;text-decoration:none;font-weight:600;font-size:0.95rem;text-align:center;box-sizing:border-box;">${registerText}</a>
                    <button type="button" id="login-required-close-cart" style="margin-top:6px;border:none;background:none;color:#64748b;cursor:pointer;font-size:0.85rem;text-decoration:underline;padding:6px;">Close</button>
                </div>
            </div>`;

        document.body.appendChild(modal);

        const close = modal.querySelector("#login-required-close-cart");
        if (close) {
            close.addEventListener("click", function () {
                modal.remove();
            });
        }
        modal.addEventListener("click", function (e) {
            if (e.target === modal) modal.remove();
        });
    }


    function updateCart() {

        const cart = getCart();
        let totalQuantity = 0;
        let subtotal = 0;

        cart.forEach(function (item) {

            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;

            totalQuantity += quantity;
            subtotal += price * quantity;

        });

        const serviceFee = 0;
        const total = subtotal + serviceFee;


        if (navbarCartCount) {
            navbarCartCount.textContent = totalQuantity;
        }

        if (itemsCartCount) {
            itemsCartCount.textContent = totalQuantity;
        }

        if (subtotalElement) {
            subtotalElement.textContent = subtotal.toFixed(2);
        }

        if (serviceFeeElement) {
            serviceFeeElement.textContent = serviceFee.toFixed(2);
        }

        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
        }


        if (clearCartBtn) {
            clearCartBtn.style.display =
                cart.length > 0 ? "inline-flex" : "none";
        }


        if (checkoutBtn) {
            checkoutBtn.disabled = cart.length === 0;
        }


        renderCart(cart);
    }


    function renderCart(cart) {

        if (!cartContainer) {
            return;
        }


        if (cart.length === 0) {

            cartContainer.innerHTML = `
                <div class="empty-cart">

                    <div class="empty-icon">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>

                    <h3>${tc("emptyTitle")}</h3>

                    <p>${tc("emptyDesc")}</p>

                    <a href="menu.html" class="btn btn-primary">
                        ${tc("browse")}
                    </a>

                </div>
            `;

            return;
        }


        cartContainer.innerHTML = cart.map(function (item) {

            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const itemTotal = price * quantity;

            const itemId = escapeHTML(String(item.menuItemId || item.id || ''));

            return `
                <div class="cart-item-card">

                    <div class="cart-item-info">

                        <div class="cart-item-title">
                            ${escapeHTML(translateDish(item.name))}
                        </div>

                        <div class="cart-item-price">
                            ${price.toFixed(2)} ETB
                        </div>

                    </div>


                    <div class="cart-item-controls">

                        <div class="qty-control">

                            <button
                                type="button"
                                class="btn-qty decrease-btn"
                                data-id="${itemId}"
                            >
                                −
                            </button>

                            <span class="qty-value">
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                class="btn-qty increase-btn"
                                data-id="${itemId}"
                            >
                                +
                            </button>

                        </div>


                        <strong class="item-total-price">
                            ${itemTotal.toFixed(2)} ETB
                        </strong>


                        <button
                            type="button"
                            class="btn-remove remove-btn"
                            data-id="${itemId}"
                            title="Remove item"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>
            `;

        }).join("");
    }


    function escapeHTML(value) {

        const div = document.createElement("div");

        div.textContent = value || "";

        return div.innerHTML;
    }


    document.addEventListener("click", function (event) {

        const increaseButton =
            event.target.closest(".increase-btn");

        const decreaseButton =
            event.target.closest(".decrease-btn");

        const removeButton =
            event.target.closest(".remove-btn");


        if (increaseButton) {

            if (localStorage.getItem("isLoggedIn") !== "true" && !localStorage.getItem("auth_token")) {
                window.location.href = "../common/register.html";
                return;
            }

            const id = String(
                increaseButton.dataset.id
            );

            const cart = getCart();

            const item = cart.find(function (item) {
                return String(item.menuItemId || item.id) === id;
            });

            if (item) {

                item.quantity =
                    (Number(item.quantity) || 0) + 1;

                saveCart(cart);
                updateCart();
            }

            return;
        }


        if (decreaseButton) {

            if (localStorage.getItem("isLoggedIn") !== "true" && !localStorage.getItem("auth_token")) {
                window.location.href = "../common/register.html";
                return;
            }

            const id = String(
                decreaseButton.dataset.id
            );

            const cart = getCart();

            const item = cart.find(function (item) {
                return String(item.menuItemId || item.id) === id;
            });

            if (item) {

                item.quantity =
                    (Number(item.quantity) || 0) - 1;


                if (item.quantity <= 0) {

                    const newCart =
                        cart.filter(function (cartItem) {
                            return String(cartItem.menuItemId || cartItem.id) !== id;
                        });

                    saveCart(newCart);

                } else {

                    saveCart(cart);
                }

                updateCart();
            }

            return;
        }


        if (removeButton) {

            const id = String(
                removeButton.dataset.id
            );

            const newCart =
                getCart().filter(function (item) {
                    return String(item.menuItemId || item.id) !== id;
                });

            saveCart(newCart);
            updateCart();

            return;
        }

    });


    if (clearCartBtn) {

        clearCartBtn.addEventListener(
            "click",
            function () {

                const cart = getCart();

                if (cart.length === 0) {
                    return;
                }

                const confirmClear = confirm(
                    tc("clearConfirm")
                );

                if (!confirmClear) {
                    return;
                }

                localStorage.removeItem(CART_KEY);

                localStorage.removeItem(CHECKOUT_KEY);

                window.dispatchEvent(
                    new CustomEvent("cart:updated")
                );

                updateCart();
            }
        );
    }


    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || Boolean(localStorage.getItem("auth_token"));
                if (!isLoggedIn) {
                    localStorage.setItem("redirect_after_auth", window.location.pathname + window.location.search);
                    window.location.href = "../common/register.html";
                    return;
                }

                const cart = getCart();


                if (!Array.isArray(cart) || cart.length === 0) {

                    alert(tc("emptyAlert"));

                    return;
                }


                localStorage.setItem(
                    CHECKOUT_KEY,
                    JSON.stringify(cart)
                );


                const checkoutUrl =
                    new URL(
                        "checkout.html",
                        window.location.href
                    ).href;


                console.log("Going to checkout:", checkoutUrl);


                window.location.assign(checkoutUrl);

            }
        );
    }


    window.addEventListener(
        "cart:updated",
        updateCart
    );


    window.addEventListener(
        "storage",
        updateCart
    );

    window.addEventListener("language:changed", updateCart);
    window.addEventListener("languageChanged", updateCart);


    updateCart();

});