let cart = [];
let selectedProduct = {}; // para guardar temporalmente el producto al dar clic en Comprar

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let subtotal = item.price * item.quantity;
    total += subtotal;

    cartItems.innerHTML += `
      <tr>
        <td>${item.name} <br><small>Talla: ${item.size}</small></td>
        <td>$${item.price}</td>
        <td>${item.quantity}</td>
        <td>$${subtotal}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">X</button></td>
      </tr>
    `;
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// ✅ Paso 1: Al hacer clic en "Comprar", mostramos el modal de selección
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseInt(button.getAttribute("data-price"));
    const image = button.closest(".card").querySelector("img").getAttribute("src");

    // guardamos temporalmente el producto
    selectedProduct = { name, price, image };

    // mostramos los datos en el modal
    document.getElementById("modal-product-name").textContent = name;
    document.getElementById("modal-product-price").textContent = `$${price}`;
    document.getElementById("modal-product-image").setAttribute("src", image);
    document.getElementById("product-quantity").value = 1;
    document.getElementById("product-size").value = "";

    // abrir modal de selección
    const modal = new bootstrap.Modal(document.getElementById("productoModal"));
    modal.show();
  });
});

// ✅ Paso 2: Confirmar selección y agregar al carrito
document.getElementById("confirm-add").addEventListener("click", () => {
  const size = document.getElementById("product-size").value;
  const quantity = parseInt(document.getElementById("product-quantity").value);

  if (!size) {
    alert("Por favor selecciona una talla.");
    return;
  }

  // Verificar si el producto con la misma talla ya existe
  const existing = cart.find(item => item.name === selectedProduct.name && item.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ 
      name: selectedProduct.name, 
      price: selectedProduct.price, 
      quantity: quantity,
      size: size
      // puedes agregar image: selectedProduct.image si quieres guardar imagen en el carrito
    });
  }

  updateCart();

  // cerrar modal después de confirmar
  const modal = bootstrap.Modal.getInstance(document.getElementById("productoModal"));
  modal.hide();
});

// ✅ Vaciar carrito
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCart();
});

function addToCart(name, price, quantity = 1, size = "") {
  const cartItems = document.getElementById("cart-items");
  const row = document.createElement("tr");

  const subtotal = price * quantity;

  row.innerHTML = `
    <td>${name} <br><small>Talla: ${size}</small></td>
    <td>$${price}</td>
    <td>${quantity}</td>
    <td>$${subtotal}</td>
    <td><button class="btn btn-danger btn-sm" onclick="row.remove()">Eliminar</button></td>
  `;

  cartItems.appendChild(row);

  updateCartTotal();
}

function updateCartTotal() {
  let total = 0;
  document.querySelectorAll("#cart-items tr").forEach(tr => {
    const subtotalCell = tr.children[3];
    total += parseInt(subtotalCell.textContent.replace("$", ""));
  });
  document.getElementById("cart-total").textContent = total;
}

/* =====================================================
   🧾 FUNCIÓN: MOSTRAR RECIBO GRAFFITI
===================================================== */
function showReceipt() {
  // Calculamos el total
  let total = 0;
  cart.forEach(item => total += item.price * item.quantity);

  // Creamos el HTML del recibo
  const reciboHTML = `
    <div class="recibo-container">
      <h2>🧾 Recibo Gio Star</h2>
      <div class="recibo-detalle">
        ${cart.map(item => `
          <p>${item.name} (${item.size}) — ${item.quantity} × $${item.price} = $${item.price * item.quantity}</p>
        `).join("")}
      </div>
      <div class="recibo-total">Total: $${total}</div>
      <button class="btn-recibo" id="cerrar-recibo">Cerrar</button>
    </div>
  `;

  // Creamos el contenedor visual del recibo (overlay)
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.85)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";
  overlay.innerHTML = reciboHTML;

  document.body.appendChild(overlay);

  // Botón cerrar
  document.getElementById("cerrar-recibo").addEventListener("click", () => {
    document.body.removeChild(overlay);
    cart = [];
    updateCart();
  });
}

/* =====================================================
   ✅ EVENTO FINALIZAR COMPRA
===================================================== */
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  showReceipt();
});

