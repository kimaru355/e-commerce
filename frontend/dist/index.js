"use strict";
const header = document.querySelector("header");
const dashboardBtn = document.querySelector("#dashboard-button");
const homeBtn = document.querySelector("#home-button");
const cartBtn = document.querySelector("#cart-button");
const showSearch = document.querySelector("#show-search");
const dashboard = document.querySelector("#dashboard");
const home = document.querySelector("#home");
const cartSection = document.querySelector("#cart");
let display = localStorage.getItem("display");
let feedback = localStorage.getItem("feedback");
if (!display) {
    display = "home";
    localStorage.setItem("display", display);
}
const formatPrice = (price) => {
    const priceStr = price.toString();
    const priceArr = priceStr.split("");
    let formattedPrice = "";
    let counter = 0;
    for (let i = priceArr.length - 1; i >= 0; i--) {
        if (counter === 3) {
            formattedPrice = "," + formattedPrice;
            counter = 0;
        }
        formattedPrice = priceArr[i] + formattedPrice;
        counter++;
    }
    return "Ksh. " + formattedPrice;
};
class Products {
    products;
    allProducts;
    constructor() {
        this.products = [];
        this.allProducts = [];
    }
    async getProducts() {
        const response = await fetch("http://localhost:3000/products");
        this.products = await response.json();
        this.allProducts = JSON.parse(JSON.stringify(this.products));
        return this.products;
    }
    async addProduct(product) {
        try {
            await fetch("http://localhost:3000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            localStorage.setItem("feedback", "Product added successfully");
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async updateProduct(product) {
        try {
            await fetch("http://localhost:3000/products/" + product.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            localStorage.setItem("feedback", "Product updated successfully");
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async deleteProduct(productId) {
        try {
            await fetch("http://localhost:3000/products/" + productId, {
                method: "DELETE",
            });
            localStorage.setItem("feedback", "Product deleted successfully");
            return true;
        }
        catch (error) {
            return true;
        }
    }
    filterProducts(search) {
        if (search.length === 0) {
            this.products = JSON.parse(JSON.stringify(this.allProducts));
            return;
        }
        this.products = this.allProducts.filter((product) => {
            return product.name.toLowerCase().includes(search.toLowerCase());
        });
    }
}
class Cart {
    cartProducts;
    constructor() {
        this.cartProducts = [];
    }
    async getProducts() {
        const response = await fetch("http://localhost:3000/cart");
        this.cartProducts = await response.json();
        return this.cartProducts;
    }
    async checkExists(id) {
        await this.getProducts();
        const cartProduct = this.cartProducts.find((cartProduct) => cartProduct.productId === id);
        if (cartProduct) {
            return cartProduct;
        }
        return false;
    }
    async addProduct(product) {
        try {
            const cartProduct = {
                productId: product.id,
                quantity: 1,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                imageUrl: product.imageUrl,
            };
            await fetch("http://localhost:3000/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartProduct),
            });
            localStorage.setItem("feedback", "Product successfully added to cart");
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async incrementProduct(id) {
        await this.getProducts();
        const cartItem = this.cartProducts.find((cartProduct) => cartProduct.productId === id);
        if (!cartItem) {
            return false;
        }
        cartItem.quantity += 1;
        try {
            await fetch("http://localhost:3000/cart/" + cartItem.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartItem),
            });
            localStorage.setItem("feedback", "Product quantity successfully increased");
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async decrementProduct(id) {
        await this.getProducts();
        const cartItem = this.cartProducts.find((cartProduct) => cartProduct.productId === id);
        if (!cartItem) {
            return false;
        }
        if (cartItem.quantity === 1) {
            return this.removeProduct(cartItem.id);
        }
        cartItem.quantity -= 1;
        try {
            await fetch("http://localhost:3000/cart/" + cartItem.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartItem),
            });
            localStorage.setItem("feedback", "Product quantity successfully decreased");
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async removeProduct(id) {
        try {
            await fetch("http://localhost:3000/cart/" + id, {
                method: "DELETE",
            });
            localStorage.setItem("feedback", "Product successfully removed from cart");
            return true;
        }
        catch (error) {
            return true;
        }
    }
}
const createSearchForm = () => {
    const div = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    div.setAttribute("id", "search-form");
    input.setAttribute("type", "text");
    input.setAttribute("id", "search");
    input.setAttribute("name", "search");
    label.setAttribute("for", "search");
    label.textContent = "Search: ";
    input.placeholder = "Search products";
    input.addEventListener("input", () => {
        const products = new Products();
        products.filterProducts(input.value);
    });
    div.appendChild(label);
    div.appendChild(input);
    showSearch?.appendChild(div);
};
const createAddProductForm = (product) => {
    const div = document.createElement("div");
    const form = document.createElement("form");
    const closeButton = document.createElement("button");
    const closeImage = document.createElement("img");
    const formTitle = document.createElement("h2");
    const labelName = document.createElement("label");
    const inputName = document.createElement("input");
    const labelDescription = document.createElement("label");
    const inputDescription = document.createElement("textarea");
    const labelCategory = document.createElement("label");
    const inputCategory = document.createElement("input");
    const labelPrice = document.createElement("label");
    const inputPrice = document.createElement("input");
    const labelImageUrl = document.createElement("label");
    const inputImageUrl = document.createElement("input");
    const submitButton = document.createElement("button");
    div.setAttribute("id", "add-product-form");
    form.setAttribute("id", "product-form");
    closeButton.setAttribute("type", "button");
    closeImage.setAttribute("src", "./assets/close_black.svg");
    closeImage.setAttribute("alt", "Close button");
    labelName.setAttribute("for", "product-name");
    inputName.setAttribute("id", "product-name");
    inputName.setAttribute("name", "product-name");
    inputName.setAttribute("type", "text");
    labelDescription.setAttribute("for", "product-description");
    inputDescription.setAttribute("id", "product-description");
    inputDescription.setAttribute("rows", "6");
    inputDescription.setAttribute("columns", "10");
    labelCategory.setAttribute("for", "product-category");
    inputCategory.setAttribute("id", "product-category");
    inputCategory.setAttribute("name", "product-category");
    inputCategory.setAttribute("type", "text");
    labelPrice.setAttribute("for", "product-price");
    inputPrice.setAttribute("id", "product-price");
    inputPrice.setAttribute("name", "product-price");
    inputPrice.setAttribute("type", "number");
    labelImageUrl.setAttribute("for", "product-image-url");
    inputImageUrl.setAttribute("id", "product-image-url");
    inputImageUrl.setAttribute("name", "product-image-url");
    inputImageUrl.setAttribute("type", "url"); // to confirm
    submitButton.setAttribute("type", "button");
    labelName.textContent = "Product Name:";
    labelDescription.textContent = "Product Description:";
    labelCategory.textContent = "Product Category:";
    labelPrice.textContent = "Product Price:";
    labelImageUrl.textContent = "Product Image URL:";
    if (!product) {
        formTitle.textContent = "Add Product";
        inputName.placeholder = "Product name";
        inputDescription.placeholder = "Product description";
        inputCategory.placeholder = "Product category";
        inputPrice.placeholder = "Product price";
        inputImageUrl.placeholder = "Product image URL";
        submitButton.textContent = "Add Product";
    }
    else {
        formTitle.textContent = "Update Product";
        inputName.value = product.name;
        inputDescription.value = product.description;
        inputCategory.value = product.category;
        inputPrice.value = product.price.toString();
        inputImageUrl.value = product.imageUrl;
        submitButton.textContent = "Update Product";
    }
    closeButton.addEventListener("click", () => {
        dashboard?.removeChild(div);
    });
    if (!product) {
        submitButton.addEventListener("click", async () => {
            const newProduct = {
                name: inputName.value,
                description: inputDescription.value,
                category: inputCategory.value,
                price: parseFloat(inputPrice.value),
                imageUrl: inputImageUrl.value,
            };
            let isValid = true;
            Object.keys(newProduct).forEach((key) => {
                if (!newProduct[key]) {
                    isValid = false;
                }
            });
            if (!isValid) {
                const feedbackDiv = document.createElement("div");
                const feedbackText = document.createElement("p");
                feedbackDiv.setAttribute("class", "feedback-warning");
                feedbackText.textContent = "Please fill in all fields to add a product";
                feedbackDiv.appendChild(feedbackText);
                header?.appendChild(feedbackDiv);
                setTimeout(() => {
                    header?.removeChild(feedbackDiv);
                }, 2000);
                return;
            }
            const products = new Products();
            const result = await products.addProduct(newProduct);
            if (result) {
                dashboard?.removeChild(div);
            }
        });
    }
    else {
        submitButton.addEventListener("click", async () => {
            const updatedProduct = {
                id: product.id,
                name: inputName.value,
                description: inputDescription.value,
                category: inputCategory.value,
                price: parseFloat(inputPrice.value),
                imageUrl: inputImageUrl.value,
            };
            let isValid = true;
            Object.keys(updatedProduct).forEach((key) => {
                if (!updatedProduct[key]) {
                    isValid = false;
                }
            });
            if (!isValid) {
                const feedbackDiv = document.createElement("div");
                const feedbackText = document.createElement("p");
                feedbackDiv.setAttribute("class", "feedback-warning");
                feedbackText.textContent = "Please fill in all fields to add a product";
                feedbackDiv.appendChild(feedbackText);
                header?.appendChild(feedbackDiv);
                setTimeout(() => {
                    header?.removeChild(feedbackDiv);
                }, 2000);
                return;
            }
            const products = new Products();
            const result = await products.updateProduct(updatedProduct);
            if (result) {
                dashboard?.removeChild(div);
            }
        });
    }
    closeButton.appendChild(closeImage);
    form.appendChild(closeButton);
    form.appendChild(formTitle);
    form.appendChild(labelName);
    form.appendChild(inputName);
    form.appendChild(labelDescription);
    form.appendChild(inputDescription);
    form.appendChild(labelCategory);
    form.appendChild(inputCategory);
    form.appendChild(labelPrice);
    form.appendChild(inputPrice);
    form.appendChild(labelImageUrl);
    form.appendChild(inputImageUrl);
    form.appendChild(submitButton);
    div.appendChild(form);
    dashboard?.appendChild(div);
};
const createManageProductTable = (products) => {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    const thImage = document.createElement("th");
    const thName = document.createElement("th");
    const thCategory = document.createElement("th");
    const thPrice = document.createElement("th");
    const thActions = document.createElement("th");
    thImage.textContent = "Image";
    thName.textContent = "Name";
    thCategory.textContent = "Category";
    thPrice.textContent = "Price";
    thActions.textContent = "Actions";
    tr.appendChild(thImage);
    tr.appendChild(thName);
    tr.appendChild(thCategory);
    tr.appendChild(thPrice);
    tr.appendChild(thActions);
    thead.appendChild(tr);
    table.appendChild(thead);
    products.forEach((product) => {
        const tr = document.createElement("tr");
        const tdImage = document.createElement("td");
        const tdName = document.createElement("td");
        const image = document.createElement("img");
        const tdCategory = document.createElement("td");
        const tdPrice = document.createElement("td");
        const tdActions = document.createElement("td");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        image.setAttribute("src", product.imageUrl);
        image.setAttribute("alt", product.name);
        tdImage.setAttribute("class", "td-image");
        editButton.setAttribute("class", "edit");
        deleteButton.setAttribute("class", "delete");
        tdName.textContent = product.name;
        tdCategory.textContent = product.category;
        tdPrice.textContent = formatPrice(product.price);
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";
        editButton.addEventListener("click", () => {
            createAddProductForm(product);
        });
        deleteButton.addEventListener("click", async () => {
            const products = new Products();
            const result = await products.deleteProduct(product.id);
            if (result) {
                tbody.removeChild(tr);
            }
        });
        tdImage.appendChild(image);
        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdImage);
        tr.appendChild(tdName);
        tr.appendChild(tdCategory);
        tr.appendChild(tdPrice);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    dashboard?.appendChild(table);
};
const showDashBoard = async () => {
    while (dashboard?.firstElementChild) {
        dashboard.removeChild(dashboard.firstElementChild);
    }
    const products = new Products();
    const productList = await products.getProducts();
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    const button = document.createElement("button");
    const image = document.createElement("img");
    image.setAttribute("src", "assets/create_black.svg");
    h2.textContent = "Manage Products";
    button.addEventListener("click", () => {
        createAddProductForm(null);
    });
    button.appendChild(image);
    div.appendChild(button);
    dashboard?.appendChild(h2);
    dashboard?.appendChild(div);
    createManageProductTable(productList);
};
const showProduct = async (product) => {
    while (home?.firstElementChild) {
        home.removeChild(home.firstElementChild);
    }
    header?.scrollIntoView();
    localStorage.setItem("display", "product");
    localStorage.setItem("product", JSON.stringify(product));
    const div = document.createElement("div");
    const backBtn = document.createElement("button");
    const backImg = document.createElement("img");
    const image = document.createElement("img");
    const name = document.createElement("h2");
    const price = document.createElement("h3");
    const category = document.createElement("h4");
    const cartDiv = document.createElement("button");
    const description = document.createElement("p");
    div.setAttribute("class", "product");
    backImg.setAttribute("src", "assets/arrow_left.svg");
    image.setAttribute("src", product.imageUrl);
    image.setAttribute("alt", product.name);
    name.textContent = product.name;
    price.textContent = formatPrice(product.price);
    category.textContent = product.category;
    description.textContent = product.description;
    backBtn.addEventListener("click", () => {
        while (home?.firstElementChild) {
            home.removeChild(home.firstElementChild);
        }
        showHome();
    });
    const cart = new Cart();
    const cartProduct = await cart.checkExists(product.id);
    if (!cartProduct) {
        const cartButton = document.createElement("button");
        cartButton.setAttribute("class", "add-cart-button");
        cartButton.textContent = "Add to Cart";
        cartButton.addEventListener("click", async () => {
            const result = await cart.addProduct(product);
            if (result) {
                const feedbackDiv = document.createElement("div");
                const feedbackText = document.createElement("p");
                feedbackDiv.setAttribute("class", "feedback");
                feedbackText.textContent = "Product successfully added to cart";
                feedbackDiv.appendChild(feedbackText);
                header?.appendChild(feedbackDiv);
                setTimeout(() => {
                    header?.removeChild(feedbackDiv);
                }, 2000);
            }
        });
        cartDiv.appendChild(cartButton);
    }
    else {
        const cartAddBtn = document.createElement("button");
        const cartSubBtn = document.createElement("button");
        const quantity = document.createElement("h4");
        cartDiv.setAttribute("class", "cart-modify");
        cartAddBtn.textContent = "+";
        cartSubBtn.textContent = "-";
        quantity.textContent = cartProduct.quantity.toString();
        cartAddBtn.addEventListener("click", async () => {
            const result = await cart.incrementProduct(cartProduct.productId);
            if (result) {
                quantity.textContent = (cartProduct.quantity + 1).toString();
            }
        });
        cartSubBtn.addEventListener("click", async () => {
            const result = await cart.decrementProduct(cartProduct.productId);
            if (result) {
                quantity.textContent = (cartProduct.quantity - 1).toString();
            }
        });
        cartDiv.appendChild(cartSubBtn);
        cartDiv.appendChild(quantity);
        cartDiv.appendChild(cartAddBtn);
    }
    backBtn.appendChild(backImg);
    div.appendChild(backBtn);
    div.appendChild(image);
    div.appendChild(name);
    div.appendChild(price);
    div.appendChild(category);
    div.appendChild(cartDiv);
    div.appendChild(description);
    home?.appendChild(div);
};
const createProductCard = (product) => {
    const div = document.createElement("div");
    const name = document.createElement("h2");
    const price = document.createElement("h3");
    const description = document.createElement("p");
    const img = document.createElement("img");
    div.setAttribute("class", "product-card");
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.name);
    name.textContent = product.name;
    price.textContent = formatPrice(product.price);
    description.textContent = product.description;
    div.addEventListener("click", () => {
        showProduct(product);
    });
    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(price);
    div.appendChild(description);
    return div;
};
const showProducts = async () => {
    while (home?.firstElementChild) {
        home.removeChild(home.firstElementChild);
    }
    const productsDiv = document.createElement("div");
    // createSearchForm();
    const products = new Products();
    const productList = await products.getProducts();
    productsDiv.setAttribute("id", "products");
    productList.forEach((product) => {
        const productCard = createProductCard(product);
        productsDiv.appendChild(productCard);
    });
    home?.appendChild(productsDiv);
};
const createCartProductCard = (product) => {
    const div = document.createElement("div");
    const details = document.createElement("div");
    const image = document.createElement("img");
    const name = document.createElement("h3");
    const price = document.createElement("h3");
    const actions = document.createElement("div");
    const removeBtn = document.createElement("button");
    const quantity = document.createElement("h4");
    const modQuantity = document.createElement("div");
    const addBtn = document.createElement("button");
    const subBtn = document.createElement("button");
    div.setAttribute("class", "cart-product");
    image.setAttribute("src", product.imageUrl);
    image.setAttribute("alt", product.name);
    name.textContent = product.name;
    price.textContent = formatPrice(product.price);
    quantity.textContent = product.quantity.toString();
    addBtn.textContent = "+";
    subBtn.textContent = "-";
    removeBtn.textContent = "Remove";
    addBtn.addEventListener("click", async () => {
        const cart = new Cart();
        const result = await cart.incrementProduct(product.productId);
        if (result) {
            quantity.textContent = (product.quantity + 1).toString();
        }
    });
    subBtn.addEventListener("click", async () => {
        const cart = new Cart();
        const result = await cart.decrementProduct(product.productId);
        console.log(result);
        if (result) {
            quantity.textContent = (product.quantity - 1).toString();
        }
    });
    removeBtn.addEventListener("click", async () => {
        const cart = new Cart();
        const result = await cart.removeProduct(product.id);
    });
    modQuantity.appendChild(subBtn);
    modQuantity.appendChild(quantity);
    modQuantity.appendChild(addBtn);
    details.appendChild(image);
    details.appendChild(name);
    details.appendChild(price);
    actions.appendChild(removeBtn);
    actions.appendChild(modQuantity);
    div.appendChild(details);
    div.appendChild(actions);
    return div;
};
const createCartCheckout = (products) => {
    const div = document.createElement("div");
    const labeTotal = document.createElement("h2");
    const total = document.createElement("h2");
    div.setAttribute("class", "cart-checkout");
    labeTotal.textContent = "Total:";
    total.textContent = formatPrice(products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0));
    div.appendChild(labeTotal);
    div.appendChild(total);
    return div;
};
const showCart = async () => {
    const cart = new Cart();
    const products = await cart.getProducts();
    while (cartSection?.firstElementChild) {
        cartSection.removeChild(cartSection.firstElementChild);
    }
    products.forEach((product) => {
        const cartProduct = createCartProductCard(product);
        cartSection?.appendChild(cartProduct);
    });
    const cartCheckout = createCartCheckout(products);
    cartSection?.appendChild(cartCheckout);
};
const showHome = async () => {
    await showProducts();
};
homeBtn?.addEventListener("click", () => {
    if (display === "home") {
        return;
    }
    display = "home";
    localStorage.setItem("display", display);
    while (dashboard?.firstElementChild) {
        dashboard.removeChild(dashboard.firstElementChild);
    }
    while (cartSection?.firstElementChild) {
        cartSection.removeChild(cartSection.firstElementChild);
    }
    showHome();
});
dashboardBtn?.addEventListener("click", () => {
    if (display === "dashboard") {
        return;
    }
    display = "dashboard";
    localStorage.setItem("display", display);
    while (home?.firstElementChild) {
        home.removeChild(home.firstElementChild);
    }
    while (cartSection?.firstElementChild) {
        cartSection.removeChild(cartSection.firstElementChild);
    }
    showDashBoard();
});
cartBtn?.addEventListener("click", () => {
    if (display === "cart") {
        return;
    }
    display = "cart";
    localStorage.setItem("display", display);
    while (home?.firstElementChild) {
        home.removeChild(home.firstElementChild);
    }
    while (dashboard?.firstElementChild) {
        dashboard.removeChild(dashboard.firstElementChild);
    }
    showCart();
});
if (display === "dashboard") {
    showDashBoard();
}
else if (display === "home") {
    showHome();
}
else if (display === "cart") {
    showCart();
}
else if (display === "product") {
    const product = JSON.parse(localStorage.getItem("product"));
    showProduct(product);
}
const showFeedback = async () => {
    setTimeout(() => {
        const feedbackDiv = document.createElement("div");
        const feedbackText = document.createElement("p");
        feedbackDiv.setAttribute("id", "feedback");
        feedbackText.textContent = feedback;
        feedbackDiv.appendChild(feedbackText);
        header?.appendChild(feedbackDiv);
        setTimeout(() => {
            header?.removeChild(feedbackDiv);
        }, 3000);
    }, 500);
};
if (feedback) {
    showFeedback();
    localStorage.removeItem("feedback");
}
const updateCartCount = async () => {
    const cart = new Cart();
    const products = await cart.getProducts();
    const cartCount = document.createElement("h3");
    const cartQuantity = products.reduce((acc, curr) => acc + curr.quantity, 0);
    cartCount.textContent = `Cart (${cartQuantity})`;
    while (cartBtn?.firstElementChild) {
        cartBtn.removeChild(cartBtn.firstElementChild);
    }
    cartBtn?.appendChild(cartCount);
};
updateCartCount();
