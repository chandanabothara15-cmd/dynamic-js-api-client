import { getProducts } from "./api.js";


// DOM ELEMENTS

const productContainer =
    document.getElementById("productContainer");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const productCount =
    document.getElementById("productCount");

const topButton =
    document.getElementById("topButton");

const cartContainer =
    document.getElementById("cartContainer");


// VARIABLES

let products = [];

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// LOAD PRODUCTS FROM API

async function loadProducts() {

    try {

        loading.style.display = "block";

        error.textContent = "";

        products = await getProducts();

        displayProducts(products);

    } catch (err) {

        error.textContent =
            "Unable to load products. Please try again.";

        console.error(err);

    } finally {

        loading.style.display = "none";
    }
}


// DISPLAY PRODUCTS

function displayProducts(productList) {

    productContainer.innerHTML = "";

    productCount.textContent =
        `${productList.length} products found`;


    // No products found
    if (productList.length === 0) {

        productContainer.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    // Create product cards
    productList.forEach(product => {

        const card =
            document.createElement("div");


        card.innerHTML = `
            <h3>${product.title}</h3>

            <img
                src="${product.image}"
                width="150"
                alt="${product.title}"
            >

            <p>Price: $${product.price}</p>

            <p>Category: ${product.category}</p>

            <button
                class="add-cart"
                data-id="${product.id}"
            >
                Add to Cart
            </button>
        `;


        productContainer.appendChild(card);


        // Add to Cart button
        const button =
            card.querySelector(".add-cart");


        button.addEventListener("click", () => {

            addToCart(product.id);

        });

    });
}


// SEARCH + FILTER + SORT

function updateProducts() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const sortValue =
        sortFilter.value;


    // Search
    let filteredProducts =
        products.filter(product =>
            product.title
                .toLowerCase()
                .includes(searchText)
        );


    // Category filter
    if (selectedCategory !== "all") {

        filteredProducts =
            filteredProducts.filter(product =>
                product.category === selectedCategory
            );
    }


    // Sorting
    if (sortValue === "priceLow") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    } else if (sortValue === "priceHigh") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    } else if (sortValue === "nameAZ") {

        filteredProducts.sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );
    }


    displayProducts(filteredProducts);
}


// ADD TO CART

function addToCart(productId) {

    const product =
        products.find(product =>
            product.id === productId
        );


    if (product) {

        cart.push(product);


        // Save cart
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        displayCart();
    }
}


// ==============================
// DISPLAY CART
// ==============================

function displayCart() {

    cartContainer.innerHTML = "";


    // Empty cart
    if (cart.length === 0) {

        cartContainer.innerHTML =
            "Your cart is empty.";

        return;
    }


    // Display cart products
    cart.forEach(product => {

        const cartItem =
            document.createElement("div");


        cartItem.innerHTML = `
            <p>
                ${product.title} - $${product.price}
            </p>

            <button
                class="remove-cart"
                data-id="${product.id}"
            >
                Remove
            </button>
        `;


        cartContainer.appendChild(cartItem);


        // Remove button
        const removeButton =
            cartItem.querySelector(".remove-cart");


        removeButton.addEventListener("click", () => {

            removeFromCart(product.id);

        });

    });


    // Calculate total
    const total =
        cart.reduce((sum, product) => {

            return sum + product.price;

        }, 0);


    // Total element
    const totalElement =
        document.createElement("h3");


    totalElement.textContent =
        `Total: $${total.toFixed(2)}`;


    cartContainer.appendChild(totalElement);


    // Clear cart button
    const clearButton =
        document.createElement("button");


    clearButton.textContent =
        "Clear Cart";


    clearButton.addEventListener(
        "click",
        clearCart
    );


    cartContainer.appendChild(clearButton);
}


// REMOVE FROM CART

function removeFromCart(productId) {

    cart =
        cart.filter(product =>
            product.id !== productId
        );


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();
}


// CLEAR CART

function clearCart() {

    cart = [];


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();
}


// EVENT LISTENERS

searchInput.addEventListener(
    "input",
    updateProducts
);


categoryFilter.addEventListener(
    "change",
    updateProducts
);


sortFilter.addEventListener(
    "change",
    updateProducts
);


// Back to Top
topButton.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// START APPLICATION

loadProducts();

displayCart();