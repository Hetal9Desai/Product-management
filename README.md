# Product Management System

This is a **Product Management System** built using **HTML, CSS, Bootstrap, and TypeScript**. The application allows users to create, update, view, and manage products with **localStorage** for data persistence. It also supports **filtering, sorting, and routing for product Add/edit** operations.

## Features

### **Product Attributes:**

- **Product ID** (Unique Identifier)
- **Product Name**
- **Image**
- **Price**
- **Description**

### **Core Functionalities:**

- **Create Product:** Add new products with proper real-time validation.
- **Update Product:** Edit existing product details.
- **Delete Product:** Remove a product from the list.
- **View Product List:** Display all stored products.
- **Filter Products:** Filter by Product ID, Name, Price , Description
- **Sort Products:** Sort by **Product ID, Product Name, and Price**.
- **Local Storage:** Persist products using `localStorage`.
- **Routing Support:** Use query parameters to handle view/edit actions. -**Real-Time Fields validation** validate instantly as the user types. -**Dynamic Filter Feedback** – Displays specific messages like “No products found for Product ID ‘17427230’.” when filters return no results
- **Dynamic Pagination Display** The pagination controls should only be displayed when there are products to paginate. When there are no products, the pagination controls should be hidden. This behavior ensures that pagination is visible only when necessary, i.e., when products are available to display across multiple pages.

## Implementation Details

-**Validation:** Ensures correct input for all fields (e.g., numeric price, valid image URL). -**Validation Field Rules** -**Name** Required, minimum 2 characters. -**Image Upload** Required for new products, JPG/PNG only, max . -**Price** Must be a number greater than 0. -**Description** Required, minimum 10 characters. -**Image Size Restriction** – Image uploads are limited to 1MB, with a clear alert: “Image file size should not exceed 1MB.” -**Filtering:** Users can search for products using Product ID. -**Sorting:** Products can be sorted **ascending/descending** based on ID, Name, or Price. -**LocalStorage:** Stores all product details persistently in the browser. -**Bootstrap UI:** Provides a responsive and user-friendly interface. -**Modular TypeScript Structure** All business logic is written in TypeScript and modularized inside the src/ folder for better maintainability:

## File Purpose

-**types.ts** Shared TypeScript type definitions (e.g., Product interface) -**storage.ts** Handles loading and saving products from localStorage. -**modal.ts** Displays success confirmation popups using Bootstrap modals. -**product-form.ts** Manages form input, validation, and saving new or edited products. -**product-list.ts** Renders product cards, applies filters/sorting, and handles deletions.
-Each module is responsible for a distinct feature, ensuring clean separation of concerns and type safety throughout the app.

## Usage Instructions

- **Add Product:** Click the **Add Product** button and fill in the form.
- **Edit Product:** Click **Edit** on a product row to modify details.
- **Delete Product:** Click **Delete** to remove a product.
- **Filter Products:** Enter a Product ID in the filter input.When no results match the filters, a specific message is displayed.
- **Sort Products:** Choose a sorting option (ID, Name, or Price) from the dropdown.
- **Clear Storage:** Click **Clear Storage** to remove all stored products.

TEST LINK :
https://deploy-preview-1--silly-kulfi-c7c12b.netlify.app/
