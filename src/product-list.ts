import { Product } from "./types";
import { loadProducts, saveProducts } from "./storage";
import { showSuccessModal } from "./modal";

let products: Product[] = [];
let deleteProductId: string | null = null;

type SortableKey = "id" | "name" | "price";

document.addEventListener("DOMContentLoaded", () => {
  products = loadProducts();
  renderProductCards();

  const addBtn = document.getElementById("addProductBtn");
  if (addBtn) {
    addBtn.classList.remove("d-none");
  }

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn?.addEventListener("click", handleDelete);
});

// Render product cards with filter and sorting
function renderProductCards(): void {
  const container = document.getElementById(
    "productCardContainer"
  ) as HTMLElement;
  const noProductsMessage = document.getElementById(
    "noProductsMessage"
  ) as HTMLElement;
  container.innerHTML = "";

  const filterId = (document.getElementById("filterId") as HTMLInputElement)
    .value;
  const filterName = (
    document.getElementById("filterName") as HTMLInputElement
  ).value.toLowerCase();
  const filterDescription = (
    document.getElementById("filterDescription") as HTMLInputElement
  ).value.toLowerCase();
  const filterPrice = (
    document.getElementById("filterPrice") as HTMLInputElement
  ).value;

  let filteredProducts = products.filter((product) => {
    return (
      (!filterId || product.id.includes(filterId)) &&
      (!filterName || product.name.toLowerCase().includes(filterName)) &&
      (!filterDescription ||
        product.description.toLowerCase().includes(filterDescription)) &&
      (!filterPrice || product.price.toString().includes(filterPrice))
    );
  });

  const sortKey = (document.getElementById("sortBy") as HTMLSelectElement)
    .value as SortableKey;
  const sortOrder = (document.getElementById("sortOrder") as HTMLSelectElement)
    .value;

  if (sortKey) {
    filteredProducts.sort((a, b) => {
      const aVal =
        sortKey === "price"
          ? parseFloat(a[sortKey] as string)
          : (a[sortKey] as string).toLowerCase();
      const bVal =
        sortKey === "price"
          ? parseFloat(b[sortKey] as string)
          : (b[sortKey] as string).toLowerCase();

      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
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
      (f) =>
        (document.getElementById(f.id) as HTMLInputElement).value.trim() !== ""
    );
    if (activeFilter) {
      const filterValue = (
        document.getElementById(activeFilter.id) as HTMLInputElement
      ).value.trim();
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
          <a href="product2.html?mode=edit&id=${product.id}" class="btn btn-sm btn-info">Edit</a>
          <button class="btn btn-sm btn-danger" onclick="confirmDelete('${product.id}')">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Trigger delete confirmation modal
function confirmDelete(productId: string): void {
  deleteProductId = productId;
  // @ts-ignore: jQuery assumed to be available globally
  $("#deleteConfirmModal").modal("show");
}

// Handle deletion confirmation
function handleDelete(): void {
  if (deleteProductId) {
    products = products.filter((product) => product.id !== deleteProductId);
    saveProducts(products);
    renderProductCards();
    // @ts-ignore
    $("#deleteConfirmModal").modal("hide");
    showSuccessModal("Product deleted successfully!");
    deleteProductId = null;
  }
}

// Clear all filters and re-render
function clearFilters(): void {
  (document.getElementById("filterId") as HTMLInputElement).value = "";
  (document.getElementById("filterName") as HTMLInputElement).value = "";
  (document.getElementById("filterDescription") as HTMLInputElement).value = "";
  (document.getElementById("filterPrice") as HTMLInputElement).value = "";
  (document.getElementById("sortBy") as HTMLSelectElement).value = "";
  (document.getElementById("sortOrder") as HTMLSelectElement).value = "asc";
  renderProductCards();
}

// Make functions globally accessible if referenced in HTML
(window as any).clearFilters = clearFilters;
(window as any).confirmDelete = confirmDelete;
