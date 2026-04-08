const API_URL = "/productos";

const form = document.getElementById("product-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const feedback = document.getElementById("feedback");
const productsBody = document.getElementById("products-body");

const fields = {
    id: document.getElementById("product-id"),
    nombre: document.getElementById("nombre"),
    descripcion: document.getElementById("descripcion"),
    precio: document.getElementById("precio"),
    stock: document.getElementById("stock"),
    categoria: document.getElementById("categoria"),
};

let products = [];

const showFeedback = (message, type = "success") => {
    feedback.textContent = message;
    feedback.className = `feedback show ${type}`;
};

const clearFeedback = () => {
    feedback.textContent = "";
    feedback.className = "feedback";
};

const formatApiError = (payload) => {
    if (!payload) return "Ocurrio un error inesperado";
    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        return `${payload.message}: ${payload.errors.join(", ")}`;
    }
    return payload.message || "Ocurrio un error inesperado";
};

const resetFormState = () => {
    fields.id.value = "";
    form.reset();
    formTitle.textContent = "Registrar producto";
    submitBtn.textContent = "Guardar producto";
    cancelBtn.classList.add("hidden");
};

const toCurrency = (amount) => {
    return Number(amount).toLocaleString("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
    });
};

const renderProducts = () => {
    productsBody.innerHTML = "";

    if (products.length === 0) {
        productsBody.innerHTML = `
            <tr>
                <td colspan="6">No hay productos registrados.</td>
            </tr>
        `;
        return;
    }

    for (const product of products) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.descripcion}</td>
            <td>${product.categoria}</td>
            <td>${toCurrency(product.precio)}</td>
            <td>${product.stock}</td>
            <td>
                <div class="actions">
                    <button type="button" data-action="edit" data-id="${product._id}">Editar</button>
                    <button type="button" class="danger" data-action="delete" data-id="${product._id}">Eliminar</button>
                </div>
            </td>
        `;

        productsBody.appendChild(row);
    }
};

const loadProducts = async () => {
    try {
        const response = await fetch(API_URL);
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(formatApiError(payload));
        }

        products = payload.data ?? [];
        renderProducts();
    } catch (error) {
        showFeedback(error.message, "error");
    }
};

const startEdit = (productId) => {
    const product = products.find((item) => item._id === productId);
    if (!product) return;

    fields.id.value = product._id;
    fields.nombre.value = product.nombre;
    fields.descripcion.value = product.descripcion;
    fields.precio.value = product.precio;
    fields.stock.value = product.stock;
    fields.categoria.value = product.categoria;

    formTitle.textContent = "Editar producto";
    submitBtn.textContent = "Actualizar producto";
    cancelBtn.classList.remove("hidden");
    clearFeedback();
}

const deleteProduct = async (productId) => {
    const confirmed = window.confirm("Estas seguro de eliminar este producto?");
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(formatApiError(payload));
        }

        showFeedback(payload.message || "Producto eliminado correctamente");
        await loadProducts();
    } catch (error) {
        showFeedback(error.message, "error");
    }
};

productsBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;

    const action = target.dataset.action;
    const productId = target.dataset.id;

    if (!action || !productId) return;

    if (action === "edit") {
        startEdit(productId);
        return;
    }

    if (action === "delete") {
        await deleteProduct(productId);
    }
});

cancelBtn.addEventListener("click", () => {
    resetFormState();
    clearFeedback();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        nombre: fields.nombre.value.trim(),
        descripcion: fields.descripcion.value.trim(),
        precio: Number(fields.precio.value),
        stock: Number(fields.stock.value),
        categoria: fields.categoria.value,
    };

    const isEditing = fields.id.value.length > 0;
    const endpoint = isEditing ? `${API_URL}/${fields.id.value}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(formatApiError(result));
        }

        showFeedback(result.message || "Operacion completada con exito");
        resetFormState();
        await loadProducts();
    } catch (error) {
        showFeedback(error.message, "error");
    }
});

resetFormState();
loadProducts();
