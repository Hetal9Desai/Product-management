# Product Management System

This is a **Product Management System** built using **HTML, CSS, JavaScript, and Bootstrap**. The application allows users to create, update, view, and manage products with **localStorage** for data persistence. It also supports **filtering, sorting, and routing for product view/edit** operations.

## Features

### **Product Attributes:**

- **Product ID** (Unique Identifier)
- **Product Name**
- **Image URL**
- **Price**
- **Description**

### **Core Functionalities:**

- **Create Product:** Add new products with proper validation.
- **Update Product:** Edit existing product details.
- **Delete Product:** Remove a product from the list.
- **View Product List:** Display all stored products.
- **Filter Products:** Filter by Product ID.
- **Sort Products:** Sort by **Product ID, Product Name, and Price**.
- **Local Storage:** Persist products using `localStorage`.
- **Routing Support:** Use query parameters to handle view/edit actions.

## Implementation Details

- **Validation:** Ensures correct input for all fields (e.g., numeric price, valid image URL).
- **Filtering:** Users can search for products using Product ID.
- **Sorting:** Products can be sorted **ascending/descending** based on ID, Name, or Price.
- **LocalStorage:** Stores all product details persistently in the browser.
- **Bootstrap UI:** Provides a responsive and user-friendly interface.

## Usage Instructions

- **Add Product:** Click the **Add Product** button and fill in the form.
- **Edit Product:** Click **Edit** on a product row to modify details.
- **Delete Product:** Click **Delete** to remove a product.
- **Filter Products:** Enter a Product ID in the filter input.
- **Sort Products:** Choose a sorting option (ID, Name, or Price) from the dropdown.
- **Clear Storage:** Click **Clear Storage** to remove all stored products.
