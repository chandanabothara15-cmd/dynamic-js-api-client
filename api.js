// API URL
const API_URL = "https://fakestoreapi.com/products";

// Function to get products from API
export async function getProducts() {

    // Send request to API
    const response = await fetch(API_URL);

    // Check if request was successful
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    // Convert response into JavaScript data
    const products = await response.json();

    // Return products
    return products;
}