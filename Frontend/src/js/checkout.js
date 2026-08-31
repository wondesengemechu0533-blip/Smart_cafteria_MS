import api from "./api.js";
import { validateName, validatePhone, validateRequired } from "./utils/validators.js";

// Check authentication before loading checkout
const authToken = localStorage.getItem("auth_token");
if (!authToken) {
    alert("Please log in to place an order.");
    window.location.href = "../common/login.html";
}

document.addEventListener("DOMContentLoaded", () => {

    const CART_KEY = "smart_cafeteria_cart";
    const SERVICE_FEE_ETB = 20;

    const checkoutItemsContainer =
        document.getElementById("checkout-items-list");

    const subtotalElement =
        document.getElementById("checkout-subtotal");

    const serviceFeeElement =
        document.getElementById("checkout-service-fee");

    const totalElement =
        document.getElementById("checkout-total");

    const checkoutForm =
        document.getElementById("checkout-form");

    const orderTypeRadios =
        document.querySelectorAll('input[name="orderType"]');

    const tableNumberGroup =
        document.getElementById("table-number-group");

    const tableNumberInput =
        document.getElementById("table-number");

    const paymentCards =
        document.querySelectorAll(".payment-card");

    const radioCards =
        document.querySelectorAll(".radio-card");


    function getCart() {

        try {

            const savedCart =
                localStorage.getItem(CART_KEY);

            if (!savedCart) {
                return [];
            }

            const cart =
                JSON.parse(savedCart);

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            console.error(
                "Error reading cart:",
                error
            );

            return [];
        }
    }


    function renderOrderReview() {

        const cart = getCart();

        console.log(
            "Checkout cart:",
            cart
        );


        if (!cart.length) {

            alert(
                "Your cart is empty! Returning to menu."
            );

            window.location.href =
                "menu.html";

            return;
        }


        let itemsHTML = "";
        let subtotal = 0;


        cart.forEach((item) => {

            const itemPrice =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 1;

            const itemTotal =
                itemPrice * quantity;

            subtotal += itemTotal;


            itemsHTML += `
                <div
                    class="checkout-item-row"
                    style="
                        display:flex;
                        justify-content:space-between;
                        margin-bottom:10px;
                        font-size:0.9rem;
                    "
                >

                    <span>
                        <strong>
                            ${quantity}x
                        </strong>

                        ${escapeHTML(item.name)}
                    </span>

                    <span>
                        <strong>
                            ${itemTotal.toFixed(2)}
                        </strong>
                        ETB
                    </span>

                </div>
            `;

        });


        if (checkoutItemsContainer) {

            checkoutItemsContainer.innerHTML =
                itemsHTML;
        }


        const total =
            subtotal + SERVICE_FEE_ETB;


        if (subtotalElement) {

            subtotalElement.textContent =
                subtotal.toFixed(2);
        }


        if (serviceFeeElement) {

            serviceFeeElement.textContent =
                SERVICE_FEE_ETB.toFixed(2);
        }


        if (totalElement) {

            totalElement.textContent =
                total.toFixed(2);
        }

    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;
    }


    orderTypeRadios.forEach((radio) => {

        radio.addEventListener(
            "change",
            async (event) => {

                radioCards.forEach((card) => {
                    card.classList.remove("active");
                });


                const selectedCard =
                    event.target.closest(".radio-card");


                if (selectedCard) {

                    selectedCard.classList.add(
                        "active"
                    );
                }


                if (
                    event.target.value ===
                    "dine-in"
                ) {

                    if (tableNumberGroup) {
                        tableNumberGroup.style.display =
                            "block";
                    }

                    if (tableNumberInput) {
                        tableNumberInput.required =
                            true;
                    }

                } else {

                    if (tableNumberGroup) {
                        tableNumberGroup.style.display =
                            "none";
                    }

                    if (tableNumberInput) {

                        tableNumberInput.required =
                            false;

                        tableNumberInput.value =
                            "";
                    }
                }

            }
        );

    });


    const paymentRadios =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );


    paymentRadios.forEach((radio) => {

        radio.addEventListener(
            "change",
            async (event) => {

                paymentCards.forEach((card) => {
                    card.classList.remove("active");
                });


                const selectedCard =
                    event.target.closest(
                        ".payment-card"
                    );


                if (selectedCard) {

                    selectedCard.classList.add(
                        "active"
                    );
                }

                // Show Chapa test-mode instructions only when Chapa is selected.
                const chapaTestInfo =
                    document.getElementById(
                        "chapa-test-info"
                    );

                if (chapaTestInfo) {

                    chapaTestInfo.style.display =
                        event.target.value === "CHAPA"
                            ? "block"
                            : "none";
                }

            }
        );

    });


    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const cart =
                    getCart();


                if (!cart.length) {

                    alert(
                        "Your cart is empty."
                    );

                    window.location.href =
                        "menu.html";

                    return;
                }


                const selectedOrderType =
                    document.querySelector(
                        'input[name="orderType"]:checked'
                    );


                const selectedPaymentMethod =
                    document.querySelector(
                        'input[name="paymentMethod"]:checked'
                    );


                if (!selectedOrderType) {

                    alert(
                        "Please select an order type."
                    );

                    return;
                }


                if (!selectedPaymentMethod) {

                    alert(
                        "Please select a payment method."
                    );

                    return;
                }


                const orderType =
                    selectedOrderType.value;


                const tableNumber =
                    orderType === "dine-in"
                        ? (
                            tableNumberInput
                                ? tableNumberInput.value.trim()
                                : ""
                        )
                        : "N/A (Takeaway)";


                if (
                    orderType === "dine-in" &&
                    !tableNumber
                ) {

                    alert(
                        "Please enter your table number."
                    );

                    if (tableNumberInput) {
                        tableNumberInput.focus();
                    }

                    return;
                }


                const customerNameElement =
                    document.getElementById(
                        "customer-name"
                    );


                const customerPhoneElement =
                    document.getElementById(
                        "customer-phone"
                    );


                const customerName =
                    customerNameElement
                        ? customerNameElement.value.trim()
                        : "";


                const customerPhone =
                    customerPhoneElement
                        ? customerPhoneElement.value.trim()
                        : "";

                // Validate name
                const nameValidation = validateName(customerName);
                if (!nameValidation.valid) {
                    alert(nameValidation.error);
                    if (customerNameElement) customerNameElement.focus();
                    return;
                }

                // Validate phone
                const phoneValidation = validatePhone(customerPhone);
                if (!phoneValidation.valid) {
                    alert(phoneValidation.error);
                    if (customerPhoneElement) customerPhoneElement.focus();
                    return;
                }


                const paymentMethod =
                    selectedPaymentMethod.value;


                const subtotal =
                    cart.reduce(
                        (sum, item) => {

                            const price =
                                Number(item.price) || 0;

                            const quantity =
                                Number(item.quantity) || 0;

                            return (
                                sum +
                                price * quantity
                            );

                        },
                        0
                    );


                const totalAmount =
                    subtotal + SERVICE_FEE_ETB;

                // Map cart items to backend expected format
                const orderItems = cart.map(item => ({
                    id: item.menuItemId || item.id,
                    name: item.name,
                    quantity: Number(item.quantity) || 1,
                    price: Number(item.price) || 0
                }));

                const orderId =
                    "ET-" +
                    Math.floor(
                        1000 +
                        Math.random() * 9000
                    );


                const newOrder = {

                    orderId: orderId,

                    orderDate:
                        new Date().toLocaleString(),

                    orderType:
                        orderType,

                    tableNumber:
                        tableNumber,

                    customerName:
                        customerName,

                    customerPhone:
                        customerPhone,

                    paymentMethod:
                        paymentMethod,

                    items:
                        orderItems,

                    subtotal:
                        subtotal,

                    serviceFee:
                        SERVICE_FEE_ETB,

                    totalAmount:
                        totalAmount,

                    status:
                        "Received"
                };


                try {
                    const orderResponse = await api.post("/orders", newOrder);
                    const createdOrderId = orderResponse.order?.orderId || orderId;
                    
                    // Try real payment first, fallback to simulation if not configured
                    let checkoutUrl = null;
                    let paymentSuccess = false;
                    
                    const paymentEndpoint = paymentMethod === "TELEBIRR"
                        ? "/payments/telebirr/initialize"
                        : paymentMethod === "CBE_BIRR"
                            ? "/payments/cbe-birr/initialize"
                            : "/payments/chapa/initialize";
                    
                    try {
                        const paymentResponse = await api.post(paymentEndpoint, {
                            orderId: createdOrderId,
                            returnUrl: `${window.location.origin}/src/pages/customer/order-tracking.html?orderId=${encodeURIComponent(createdOrderId)}`
                        });
                        
                        checkoutUrl = paymentResponse.data?.checkoutUrl || paymentResponse.checkoutUrl;

                        if (!checkoutUrl) {
                            throw new Error("Provider did not return a checkout URL");
                        }

                        // Remember the Chapa transaction reference so the
                        // order-tracking page can verify payment after the
                        // user completes checkout on Chapa's hosted page.
                        if (paymentMethod === "CHAPA") {
                            const txRef =
                                paymentResponse.transactionReference ||
                                paymentResponse.data?.transactionReference ||
                                paymentResponse.data?.tx_ref ||
                                "";
                            if (txRef) {
                                try {
                                    localStorage.setItem(
                                        "chapa_pending_payment",
                                        JSON.stringify({
                                            orderId: createdOrderId,
                                            txRef,
                                            paymentId:
                                                paymentResponse.data?.paymentId ||
                                                paymentResponse.data?.id ||
                                                ""
                                        })
                                    );
                                } catch (e) {
                                    console.warn("Could not save pending Chapa payment:", e);
                                }
                            }
                        }
                    } catch (paymentError) {
                        console.log('Real payment failed, trying simulation:', paymentError.message);
                        // Fallback to simulation payment with checkout URL
                        try {
                            const simResponse = await api.post("/payments/simulate", {
                                orderId: createdOrderId,
                                method: paymentMethod,
                                phone: customerPhone,
                                simulationMode: 'checkout',
                                returnUrl: `${window.location.origin}/src/pages/customer/order-tracking.html?orderId=${encodeURIComponent(createdOrderId)}`
                            });
                            
                            checkoutUrl = simResponse.data?.checkoutUrl || simResponse.checkoutUrl;
                        } catch (simError) {
                            console.error('Simulation payment also failed:', simError);
                            throw new Error('Payment initialization failed. Please try again.');
                        }
                    }
                    
                    if (!checkoutUrl) {
                        throw new Error(`${paymentMethod} did not return a checkout URL.`);
                    }

                    // Persist the order locally so the receipt / order-tracking
                    // page can render it immediately after payment, even when
                    // no backend order-history page is open.
                    const orderRecord = {
                        ...newOrder,
                        orderId: createdOrderId,
                        paymentMethod: paymentMethod,
                        paymentStatus: "PENDING",
                        status: "In Progress"
                    };
                    try {
                        localStorage.setItem("latestOrder", JSON.stringify(orderRecord));
                        let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
                        let exists = false;
                        history = history.map((o) => {
                            if ((o.orderId || o.id) === createdOrderId) {
                                exists = true;
                                return orderRecord;
                            }
                            return o;
                        });
                        if (!exists) {
                            history.unshift(orderRecord);
                        }
                        localStorage.setItem("orderHistory", JSON.stringify(history));
                    } catch (e) {
                        console.warn("Could not save order locally:", e);
                    }

                    localStorage.removeItem(CART_KEY);
                    localStorage.removeItem("checkoutCart");
                    window.dispatchEvent(new CustomEvent("cart:updated"));
                    window.location.href = checkoutUrl;
                } catch (error) {
                    alert(error.message || "Unable to start payment.");
                }

            }
        );

    }


    renderOrderReview();

});