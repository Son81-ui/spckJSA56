
const products = [
    {
        name: "iPhone 15",
        price: 17990000,
        image: "https://placehold.co/400x250?text=iPhone+15"
    },
    {
        name: "Samsung Galaxy",
        price: 12990000,
        image: "https://placehold.co/400x250?text=Samsung"
    },
    {
        name: "MacBook Air",
        price: 24990000,
        image: "https://placehold.co/400x250?text=MacBook"
    },
    {
        name: "Laptop ASUS",
        price: 15990000,
        image: "https://placehold.co/400x250?text=ASUS"
    },
    {
        name: "Tai nghe Bluetooth",
        price: 990000,
        image: "https://placehold.co/400x250?text=Headphones"
    },
    {
        name: "Đồng hồ thông minh",
        price: 1990000,
        image: "https://placehold.co/400x250?text=Smartwatch"
    }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + " ₫";
}

function displayProducts(items) {
    if (items.length === 0) {
        productGrid.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
        return;
    }

    productGrid.innerHTML = items.map((product, index) => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <button onclick="showProduct(${index})">
                Xem sản phẩm
            </button>
        </div>
    `).join("");
}

function showProduct(index) {
    const product = products[index];

    if (product) {
        alert(
            "Sản phẩm: " + product.name +
            "\nGiá: " + formatPrice(product.price)
        );
    }
}

searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    displayProducts(filteredProducts);
});

displayProducts(products);
