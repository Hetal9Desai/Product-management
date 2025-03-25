"use strict";
// Product list and delete target
let products = [];
let deleteProductId = null;
// On DOM ready: load and render products
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  renderProductCards();
  const addBtn = document.getElementById("addProductBtn");
  if (addBtn) {
    addBtn.classList.remove("d-none");
  }
});
// Load products from localStorage
function loadProducts() {
  const storedProducts = localStorage.getItem("products");
  products = storedProducts ? JSON.parse(storedProducts) : [];
}
// Save products to localStorage
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}
// Render all visible product cards based on filters/sorting
function renderProductCards() {
  const container = document.getElementById("productCardContainer");
  const noProductsMessage = document.getElementById("noProductsMessage");
  container.innerHTML = "";
  const filterId = document.getElementById("filterId").value;
  const filterName = document.getElementById("filterName").value.toLowerCase();
  const filterDescription = document
    .getElementById("filterDescription")
    .value.toLowerCase();
  const filterPrice = document.getElementById("filterPrice").value;
  let filteredProducts = products.filter((product) => {
    return (
      (!filterId || product.id.includes(filterId)) &&
      (!filterName || product.name.toLowerCase().includes(filterName)) &&
      (!filterDescription ||
        product.description.toLowerCase().includes(filterDescription)) &&
      (!filterPrice || product.price.toString().includes(filterPrice))
    );
  });
  const sortKey = document.getElementById("sortBy").value;
  const sortOrder = document.getElementById("sortOrder").value;
  if (sortKey) {
    filteredProducts.sort((a, b) => {
      const aValue =
        sortKey === "price" ? parseFloat(a[sortKey]) : a[sortKey].toLowerCase();
      const bValue =
        sortKey === "price" ? parseFloat(b[sortKey]) : b[sortKey].toLowerCase();
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  }
  if (filteredProducts.length === 0) {
    const filters = [
      { id: "filterId", label: "Product ID" },
      { id: "filterName", label: "Product Name" },
      { id: "filterDescription", label: "Description" },
      { id: "filterPrice", label: "Price" },
    ];
    const activeFilter = filters.find(
      (f) => document.getElementById(f.id).value.trim() !== ""
    );
    if (activeFilter) {
      const filterValue = document.getElementById(activeFilter.id).value.trim();
      noProductsMessage.innerText = `No products found for ${activeFilter.label} "${filterValue}".`;
    } else {
      noProductsMessage.innerText = "No products found.";
    }
    noProductsMessage.style.display = "block";
  } else {
    noProductsMessage.style.display = "none";
  }
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "col-md-6 mb-4";
    card.innerHTML = `
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" style="object-fit: cover; height: 200px;">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text"><strong>ID:</strong> ${product.id}</p>
            <p class="card-text"><strong>Price:</strong> $${product.price}</p>
            <p class="card-text">${product.description}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <a href="product.html?mode=edit&id=${product.id}" class="btn btn-sm btn-info">Edit</a>
            <button class="btn btn-sm btn-danger" onclick="confirmDelete('${product.id}')">Delete</button>
          </div>
        </div>
      `;
    container.appendChild(card);
  });
}
// Trigger delete confirmation modal
function confirmDelete(productId) {
  deleteProductId = productId;
  // @ts-ignore: Assuming jQuery is loaded
  $("#deleteConfirmModal").modal("show");
}
// Delete confirmation handler
const confirmBtn = document.getElementById("confirmDeleteBtn");
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    if (deleteProductId) {
      products = products.filter((product) => product.id !== deleteProductId);
      saveProducts();
      renderProductCards();
      // @ts-ignore
      $("#deleteConfirmModal").modal("hide");
      showSuccessModal("Product deleted successfully!");
      deleteProductId = null;
    }
  });
}
// Clear filters and re-render
function clearFilters() {
  document.getElementById("filterId").value = "";
  document.getElementById("filterName").value = "";
  document.getElementById("filterDescription").value = "";
  document.getElementById("filterPrice").value = "";
  document.getElementById("sortBy").value = "";
  document.getElementById("sortOrder").value = "asc";
  renderProductCards();
}
