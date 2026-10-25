
const products = [
  {id:1, name:"iPhone 15", price:17990000, category:"phone", image:"https://placehold.co/400x250?text=iPhone+15"},
  {id:2, name:"Samsung Galaxy", price:12990000, category:"phone", image:"https://placehold.co/400x250?text=Samsung"},
  {id:3, name:"Redmi Note", price:4990000, category:"phone", image:"https://placehold.co/400x250?text=Redmi"},
  {id:4, name:"MacBook Air", price:24990000, category:"laptop", image:"https://placehold.co/400x250?text=MacBook"},
  {id:5, name:"Laptop ASUS", price:15990000, category:"laptop", image:"https://placehold.co/400x250?text=ASUS"},
  {id:6, name:"Laptop Dell", price:18990000, category:"laptop", image:"https://placehold.co/400x250?text=Dell"},
  {id:7, name:"iPad", price:9990000, category:"tablet", image:"https://placehold.co/400x250?text=iPad"},
  {id:8, name:"Máy tính bảng Samsung", price:7990000, category:"tablet", image:"https://placehold.co/400x250?text=Tablet"},
  {id:9, name:"Tai nghe Bluetooth", price:990000, category:"audio", image:"https://placehold.co/400x250?text=Headphones"},
  {id:10, name:"Tai nghe Gaming", price:1490000, category:"audio", image:"https://placehold.co/400x250?text=Gaming+Headset"},
  {id:11, name:"Chuột máy tính", price:350000, category:"accessory", image:"https://placehold.co/400x250?text=Mouse"},
  {id:12, name:"Bàn phím cơ", price:890000, category:"accessory", image:"https://placehold.co/400x250?text=Keyboard"},
  {id:13, name:"Sạc dự phòng", price:590000, category:"accessory", image:"https://placehold.co/400x250?text=Power+Bank"},
  {id:14, name:"Cáp USB-C", price:150000, category:"accessory", image:"https://placehold.co/400x250?text=USB-C"},
  {id:15, name:"Đồng hồ thông minh", price:2990000, category:"watch", image:"https://placehold.co/400x250?text=Smartwatch"},
  {id:16, name:"Đồng hồ thể thao", price:1590000, category:"watch", image:"https://placehold.co/400x250?text=Sport+Watch"}
];

const $ = id => document.getElementById(id);
const money = price => price.toLocaleString("vi-VN") + " ₫";

const categoryNames = {
  phone: "Điện thoại",
  laptop: "Laptop",
  tablet: "Máy tính bảng",
  audio: "Tai nghe",
  accessory: "Phụ kiện",
  watch: "Đồng hồ"
};

let cart = [];

try {
  const saved = JSON.parse(localStorage.getItem("techstore_cart") || "[]");
  if (Array.isArray(saved)) {
    cart = saved.filter(item =>
      products.some(product => product.id === item.id) &&
      Number.isInteger(item.qty) &&
      item.qty > 0
    );
  }
} catch {
  cart = [];
}

function displayProducts() {
  const keyword = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const sort = $("sortSelect").value;

  let result = products.filter(product =>
    product.name.toLowerCase().includes(keyword) &&
    (category === "all" || product.category === category)
  );

  if (sort === "low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  $("productStatus").textContent =
    "Tìm thấy " + result.length + " sản phẩm";

  if (result.length === 0) {
    $("productGrid").innerHTML =
      '<p class="muted">Không tìm thấy sản phẩm phù hợp.</p>';
    return;
  }

  $("productGrid").innerHTML = result.map(product => `
    <article class="product">
      <img src="${product.image}" alt="${product.name}" loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/400x250?text=TechStore'">
      <div class="product-info">
        <span class="category-name">${categoryNames[product.category]}</span>
        <h3>${product.name}</h3>
        <p class="price">${money(product.price)}</p>
        <button class="btn" type="button" data-add="${product.id}">
          + Thêm vào giỏ
        </button>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  localStorage.setItem("techstore_cart", JSON.stringify(cart));
  displayCart();
}

function addToCart(id) {
  const item = cart.find(product => product.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({id: id, qty: 1});
  }

  saveCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function displayCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  $("cartCount").textContent = count;
  $("navCartCount").textContent = count;

  if (cart.length === 0) {
    $("cartItems").innerHTML =
      '<p class="muted">Giỏ hàng đang trống.</p>';
  } else {
    $("cartItems").innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);

      return `
        <div class="cart-row">
          <div>
            <strong>${product.name}</strong>
            <small>${money(product.price)} / sản phẩm</small>
          </div>
          <div class="quantity">
            <button type="button" data-minus="${product.id}">−</button>
            <span>${item.qty}</span>
            <button type="button" data-plus="${product.id}">+</button>
            <button type="button" class="remove-btn"
              data-remove="${product.id}">Xóa</button>
          </div>
        </div>
      `;
    }).join("");
  }

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  $("cartTotal").textContent = money(total);
}

$("productGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

$("cartItems").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.plus) {
    changeQuantity(Number(button.dataset.plus), 1);
  } else if (button.dataset.minus) {
    changeQuantity(Number(button.dataset.minus), -1);
  } else if (button.dataset.remove) {
    removeFromCart(Number(button.dataset.remove));
  }
});

$("searchInput").addEventListener("input", displayProducts);
$("categoryFilter").addEventListener("change", displayProducts);
$("sortSelect").addEventListener("change", displayProducts);

$("clearCartBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Giỏ hàng đã trống.");
    return;
  }

  if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
    cart = [];
    saveCart();
  }
});

$("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Bạn hãy thêm sản phẩm vào giỏ hàng trước nhé!");
  } else {
    alert("Đây là website demo. Chức năng thanh toán chưa được thêm.");
  }
});

$("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");
  localStorage.setItem("techstore_dark", dark ? "1" : "0");
  $("themeBtn").textContent = dark ? "☀️" : "🌙";
});

if (localStorage.getItem("techstore_dark") === "1") {
  document.body.classList.add("dark");
  $("themeBtn").textContent = "☀️";
}

function updateNavigation() {
  const username = localStorage.getItem("techstore_user");

  if (!username) return;

  $("loginLink").textContent = "Xin chào, " + username;
  $("loginLink").href = "#";

  $("signupLink").textContent = "Đăng xuất";
  $("signupLink").href = "#";

  $("signupLink").addEventListener("click", event => {
    event.preventDefault();
    localStorage.removeItem("techstore_user");
    window.location.reload();
  });
}

displayProducts();
displayCart();
updateNavigation();
