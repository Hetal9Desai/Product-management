let products = [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  renderProductTable();
});

function loadProducts() {
  const storedProducts = localStorage.getItem("products");
  products = storedProducts ? JSON.parse(storedProducts) : [];
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Render the Product
function renderProductTable() {
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  products.forEach((product) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td><img src="${product.image}" alt="${product.name}" width="50" height="50" style="object-fit: cover;"></td>
      <td>${product.price}</td>
      <td>${product.description}</td>
      <td>
        <a href="product1.html?mode=edit&id=${product.id}" class="btn btn-sm btn-info">Edit</a>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr); // Append the row to the table body
  });
}

// Delete Product
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    loadProducts(); // Reload the product list
    products = products.filter((product) => product.id !== productId);
    saveProducts();
    window.location.reload(); // Refresh the page to reflect changes
  }
}
