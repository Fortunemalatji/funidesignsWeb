function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const authToken = getCookie("sessionToken");

if (authToken) {
  console.log("Token retrieved:", authToken);
} else {
  console.log("No token found.");
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}
const decodedToken = parseJwt(authToken);
const user_ID = decodedToken ? decodedToken.user_ID : null;
console.log(user_ID);

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".sidebar a");
  const content = document.getElementById("content");
  const popup = document.getElementById("popup-form");
  const closeBtn = document.querySelector(".popup .close");
  const openPopupBtn = document.getElementById("open-popup");
  const componentForm = document.getElementById("component-form");
  let components = [];

  function setActiveLink(id) {
    links.forEach((link) => {
      link.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
  }

  async function loadProducts() {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const products = await response.json();
      return products;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  }

  async function loadComponents() {
    try {
      const response = await fetch("http://localhost:5000/api/components");
      const components = await response.json();
      return components;
    } catch (error) {
      console.error("Failed to fetch components:", error);
      return [];
    }
  }

  async function loadOrders() {
    try {
      const response = await fetch("http://localhost:5000/api/Adminorders");
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  }
  

  async function loadContent(id) {
    switch (id) {
      case "home":
        content.innerHTML = `
         
            `;
        const script = document.createElement("script");
        script.src = "chart.js";
        document.body.appendChild(script);
        break;
      case "orders":
        content.innerHTML = `
        <h1>Orders</h1>
        <p>Manage all orders here. You can view, update, and track orders.</p>
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product Name</th>
                    <th>Components</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total Cost</th>
                </tr>
            </thead>
            <tbody id="orders-table-body">
                <!-- Orders will be dynamically added here -->
            </tbody>
        </table>
    `;
        const orders = await loadOrders();
        updateOrdersTable(orders);
        break;

      case "products":
        content.innerHTML = `
                        <h1>Products</h1>
                        <p>Manage all products here. You can add, update, or remove products.</p>
                        <button id="open-profile-modal" class="btn">Add Product</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="products-table-body">
                                <!-- Products will be dynamically added here -->
                            </tbody>
                        </table>
                    `;
        const products = await loadProducts();
        updateProductsTable(products);
        break;
      case "customers":
        content.innerHTML = `
                    <h1>Customers</h1>
                    <p>Manage all customers here. You can view customer details and their orders.</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>C001</td>
                                <td>John Doe</td>
                                <td>john.doe@example.com</td>
                                <td>555-1234</td>
                                <td>123 Elm St, Springfield</td>
                            </tr>
                            <tr>
                                <td>C002</td>
                                <td>Jane Smith</td>
                                <td>jane.smith@example.com</td>
                                <td>555-5678</td>
                                <td>456 Oak St, Springfield</td>
                            </tr>
                        </tbody>
                    </table>
                `;
        break;
      case "components":
        content.innerHTML = `
                        <h1>Furniture Components</h1>
                        <p>Manage furniture components here. You can add, update, or remove components.</p>
                        <button id="open-profile-modal" class="btn">Add New Component</button>
                        <table id="component-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Material</th>
                                    <th>Color</th>
                                    <th>Quantity</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Rows will be dynamically added here -->
                            </tbody>
                        </table>
                    `;
        const components = await loadComponents();
        updateTable(components);
        break;

      case "logout":
        content.innerHTML = `
                    <h1>Logout</h1>
                    <p>You have been logged out. Click <a href="#">here</a> to return to the login page.</p>
                `;
        break;
      default:
        content.innerHTML = `
                    <h1>Welcome</h1>
                    <p>Select an option from the sidebar to get started.</p>
                `;
        break;
    }
  }

  function updateProductsTable(products) {
    const tableBody = document.getElementById("products-table-body");
    tableBody.innerHTML = "";
    products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${product.prod_id}</td>
                <td>${product.prod_name}</td>
                <td>${product.description}</td>
                <td>$${product.prod_price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>
                    <button  onclick="editProduct(${
                      product.prod_id
                    })">Edit</button>
                    <button onclick="deleteProduct(${
                      product.prod_id
                    })">Delete</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }
  

  function updateOrdersTable(orders) {
    const tableBody = document.getElementById("orders-table-body");
    tableBody.innerHTML = "";

    orders.forEach((order) => {
      const componentsList = order.components
        ? order.components
            .map(
              (comp) => `
                <li>${comp.comp_Name} (Type: ${comp.comp_Type}, Material: ${comp.material}, Color: ${comp.color})</li>
            `
            )
            .join("")
        : "No components";

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${order.orderID}</td>
                <td>${order.prod_name}</td>
                <td><ul>${componentsList}</ul></td>
                <td>${order.order_date}</td>
                <td>${order.status || "N/A"}</td> <!-- Add status here -->
                <td>$${order.TotalCost.toFixed(2)}</td>
            `;
      tableBody.appendChild(row);
    });
  }

  function updateTable(components) {
    const tableBody = document.querySelector("#component-table tbody");
    tableBody.innerHTML = "";
    components.forEach((component) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${component.comp_ID}</td>
                <td>${component.comp_Name}</td>
                <td>${component.comp_Type}</td>
                <td>${component.material}</td>
                <td>${component.color}</td>
                <td>${component.quantity}</td>
                <td>
                    <img src="data:image/png;base64,${component.image}" alt="Component Image" width="50" height="50"/>
                </td>
                <td>
                    <button onclick="editComponent(${component.comp_ID})">Edit</button>
                    <button onclick="deleteComponent(${component.comp_ID})">Delete</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }

  function addComponent(event) {
    event.preventDefault();
    const id = components.length ? components[components.length - 1].id + 1 : 1;
    const name = document.getElementById("component-name").value;
    const description = document.getElementById("component-description").value;
    const price = parseFloat(document.getElementById("component-price").value);
    const stock = parseInt(document.getElementById("component-stock").value);

    components.push({ id, name, description, price, stock });
    updateTable();
    closePopup();
  }

  function editComponent(id) {
    const component = components.find((c) => c.id === id);
    document.getElementById("component-id").value = component.id;
    document.getElementById("component-name").value = component.name;
    document.getElementById("component-description").value =
      component.description;
    document.getElementById("component-price").value = component.price;
    document.getElementById("component-stock").value = component.stock;

    openPopup();
  }

  function deleteComponent(id) {
    const index = components.findIndex((c) => c.id === id);
    components.splice(index, 1);
    updateTable();
  }

  function openPopup() {
    popup.style.display = "block";
  }

  function closePopup() {
    popup.style.display = "none";
    componentForm.reset();
  }

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.id;
      setActiveLink(id);
      loadContent(id);
    });
  });

  closeBtn.addEventListener("click", closePopup);
  openPopupBtn.addEventListener("click", openPopup);
  componentForm.addEventListener("submit", addComponent);

  setActiveLink("home");
  loadContent("home");
});

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector(".product-grid");

  fetch("http://localhost:5000/api/products")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = product.Image;
        productImage.alt = product.prod_name;

        const productName = document.createElement("h3");
        productName.textContent = product.prod_name;

        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;

        const productPrice = document.createElement("p");
        productPrice.innerHTML = `<strong>Price: R${product.prod_price}</strong>`;

        const button = document.createElement("button");
        button.textContent = "Customize";
        button.addEventListener("click", () => {
          window.location.href = `customization.html?id=${product.prod_id}`;
        });

        const productInfo = document.createElement("div");
        productInfo.classList.add("product-info");
        productInfo.appendChild(productName);
        productInfo.appendChild(productDescription);
        productInfo.appendChild(productPrice);
        productInfo.appendChild(button);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productGrid.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});

// Fetch products from the API
document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector(".product-grid");

  fetch("http://localhost:5000/api/products")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = product.Image;
        productImage.alt = product.prod_name;

        const productName = document.createElement("h3");
        productName.textContent = product.prod_name;

        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;

        const productPrice = document.createElement("p");
        productPrice.innerHTML = `<strong>Price: $${product.prod_price}</strong>`;

        const button = document.createElement("button");
        button.textContent = "Customize";
        button.addEventListener("click", () => {
          window.location.href = `customization.html?id=${product.prod_id}`;
        });

        const productInfo = document.createElement("div");
        productInfo.classList.add("product-info");
        productInfo.appendChild(productName);
        productInfo.appendChild(productDescription);
        productInfo.appendChild(productPrice);
        productInfo.appendChild(button);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productGrid.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});


document.addEventListener("DOMContentLoaded", function () {
  async function loadOrders() {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  }

  async function populateOrdersTable() {
    const orders = await loadOrders();
    const tableBody = document.querySelector("#orders-table tbody");
    tableBody.innerHTML = "";

    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${order.orderID}</td>
          <td>${order.order_date}</td>
          <td>$${order.TotalCost.toFixed(2)}</td>
          <td>${order.status || "N/A"}</td>
        `;
      tableBody.appendChild(row);
    });
  }

  populateOrdersTable();
});

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");

  // Fetch products from API
  fetch("http://localhost:5000/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    })
    .then((products) => {
      products.forEach((product) => {
        // Create product element
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        // Product image
        const productImg = document.createElement("img");
        productImg.src = product.image || "placeholder.jpg"; // Fallback image
        productImg.alt = product.prod_name;

        // Product name
        const productName = document.createElement("h3");
        productName.textContent = product.prod_name;

        // Product description
        const productDesc = document.createElement("p");
        productDesc.textContent =
          product.description || "No description available";

        // Customize button
        const customizeButton = document.createElement("a");
        customizeButton.href = `Customization.html?prod_id=${product.prod_id}`; // Assuming you have a customize page
        customizeButton.classList.add("customize-button");
        customizeButton.textContent = "Customize";

        // Append elements to productDiv
        productDiv.appendChild(productImg);
        productDiv.appendChild(productName);
        productDiv.appendChild(productDesc);
        productDiv.appendChild(customizeButton);

        productGrid.appendChild(productDiv);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
});


function popUp(message) {
  const modal = document.getElementById("successModal");
  const successMessage = document.getElementById("successMessage");
  successMessage.textContent = message;
  modal.style.display = "block";

  const closeButton = document.querySelector("#successModal .close");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}



const cartCount = document.getElementById("cart-count");
cartCount.innerHTML = "";
console.log(user_ID);
fetch(`http://localhost:5000/api/cart/items/${user_ID}`)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
    document.getElementById("cart-count").textContent = data.totalItems;
  })
  .catch((err) => {
    console.log(err);
  });

document.addEventListener("DOMContentLoaded", function () {
  async function loadOrders() {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  }

  async function populateOrdersTable() {
    const orders = await loadOrders();
    const tableBody = document.querySelector("#orders-table tbody");
    tableBody.innerHTML = "";

    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${order.orderID}</td>
            <td>${order.order_date}</td>
            <td>$${order.TotalCost.toFixed(2)}</td>
            <td>${order.status || "N/A"}</td>
          `;
      tableBody.appendChild(row);
    });
  }

  populateOrdersTable();
});

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");

  // Fetch products from API
  fetch("http://localhost:5000/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    })
    .then((products) => {
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const productImg = document.createElement("img");
        productImg.src = product.image || "placeholder.jpg";

        const productName = document.createElement("h3");
        productName.textContent = product.prod_name;

        const productDesc = document.createElement("p");
        productDesc.textContent =
          product.description || "No description available";

        const customizeButton = document.createElement("a");
        customizeButton.href = `Customization.html?prod_id=${product.prod_id}`;
        customizeButton.classList.add("customize-button");
        customizeButton.textContent = "Customize";

        productDiv.appendChild(productImg);
        productDiv.appendChild(productName);
        productDiv.appendChild(productDesc);
        productDiv.appendChild(customizeButton);

        productGrid.appendChild(productDiv);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
});


async function submitProductForm() {
  const prod_type = document.getElementById("prod_type").value;
  const prod_name = document.getElementById("prod_name").value;
  const description = document.getElementById("description").value;
  const prod_price = document.getElementById("prod_price").value;
  const quantity = document.getElementById("quantity").value;
  const Image = document.getElementById("Image").value;

  if (
    !prod_type ||
    !prod_name ||
    !description ||
    !prod_price ||
    !quantity ||
    !Image
  ) {
    popUp("All fields are required.");
    return;
  }

  const productData = {
    prod_type,
    prod_name,
    description,
    prod_price,
    quantity,
    Image,
  };

  try {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (response.ok) {
      popUp("Product added successfully!");
      document.getElementById("modal").style.display = "none";
    } else {
      popUp(result.error || "Failed to add product.");
    }
  } catch (error) {
    console.error("Error:", error);
    popUp("Error adding product.");
  }
}
async function submitComponentForm() {
  const comp_Name = document.getElementById("comp_Name").value;
  const comp_Type = document.getElementById("comp_Type").value;
  const material = document.getElementById("material").value;
  const color = document.getElementById("color").value;
  const quantity = document.getElementById("quantity").value;
  const image = document.getElementById("image").value;

  if (!comp_Name || !comp_Type || !material || !color || !quantity || !image) {
    popUp("All fields are required.");
    return;
  }

  const componentData = {
    comp_Name,
    comp_Type,
    material,
    color,
    quantity,
    image,
  };

  try {
    const response = await fetch("/api/components", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(componentData),
    });

    const result = await response.json();

    if (response.ok) {
      popUp("Component added successfully!");
      document.getElementById("modal").style.display = "none";
    } else {
      popUp(result.error || "Failed to add component.");
    }
  } catch (error) {
    console.error("Error:", error);
    popUp("Error adding component.");
  }
}

function popUp(message) {
  const modal = document.getElementById("successModal");
  const successMessage = document.getElementById("successMessage");
  successMessage.textContent = message;
  modal.style.display = "block";

  const closeButton = document.querySelector("#successModal .close");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
