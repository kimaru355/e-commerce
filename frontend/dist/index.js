"use strict";
const show_dashboard = document.querySelector("#show-dashboard");
const show_home = document.querySelector("#show-home");
const dashboard = document.querySelector("#dashboard");
const home = document.querySelector("#home");
let display = localStorage.getItem("display");
if (!display) {
    display = "home";
    localStorage.setItem("display", display);
}
class Products {
    products;
    constructor() {
        this.products = [];
    }
    async getProducts() {
        const response = await fetch("http://localhost:3000/products");
        this.products = await response.json();
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
            return true;
        }
        catch (error) {
            return true;
        }
    }
}
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
    const thName = document.createElement("th");
    const thCategory = document.createElement("th");
    const thPrice = document.createElement("th");
    const thActions = document.createElement("th");
    thName.textContent = "Name";
    thCategory.textContent = "Category";
    thPrice.textContent = "Price";
    thActions.textContent = "Actions";
    tr.appendChild(thName);
    tr.appendChild(thCategory);
    tr.appendChild(thPrice);
    tr.appendChild(thActions);
    thead.appendChild(tr);
    table.appendChild(thead);
    products.forEach((product) => {
        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        const tdCategory = document.createElement("td");
        const tdPrice = document.createElement("td");
        const tdActions = document.createElement("td");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        tdName.textContent = product.name;
        tdCategory.textContent = product.category;
        tdPrice.textContent = product.price.toString();
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
        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);
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
show_home?.addEventListener("click", () => {
    if (display === "home") {
        return;
    }
    display = "home";
    localStorage.setItem("display", display);
    while (dashboard?.firstElementChild) {
        dashboard.removeChild(dashboard.firstElementChild);
    }
});
show_dashboard?.addEventListener("click", () => {
    if (display === "dashboard") {
        return;
    }
    display = "dashboard";
    localStorage.setItem("display", display);
    while (home?.firstElementChild) {
        home.removeChild(home.firstElementChild);
    }
    showDashBoard();
});
if (display === "dashboard") {
    showDashBoard();
}