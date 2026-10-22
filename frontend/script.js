const API_URL = "https://fruit-inventory-management.onrender.com/fruits";

const fruitForm = document.getElementById("fruitForm");
const fruitTable = document.getElementById("fruitTable");
const message = document.getElementById("message");

const fruitId = document.getElementById("fruitId");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const stockInput = document.getElementById("stock_quantity");
const priceInput = document.getElementById("unit_price");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const refreshBtn = document.getElementById("refreshBtn");

let fruits = [];

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "#c0392b" : "#217346";
}

// Prevent user-entered text from being interpreted as HTML.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function formatMoney(value) {
    return "৳" + Number(value).toFixed(2);
}

// READ: Load all fruits from the API.
async function loadFruits() {
    fruitTable.innerHTML =
        '<tr><td colspan="7">Loading fruits...</td></tr>';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load fruits.");
        }

        fruits = await response.json();

        displayFruits();
        updateSummary();

        showMessage("Fruit inventory loaded successfully.");
    } catch (error) {
        fruitTable.innerHTML =
            '<tr><td colspan="7">Could not load fruits. Check the backend.</td></tr>';

        showMessage(
            "Failed to fetch. Start FastAPI and check API_URL.",
            true
        );

        console.error(error);
    }
}

// DISPLAY: Show fruits in the table.
function displayFruits() {
    if (fruits.length === 0) {
        fruitTable.innerHTML =
            '<tr><td colspan="7">No fruits found. Add your first fruit!</td></tr>';
        return;
    }

    fruitTable.innerHTML = fruits.map(fruit => {
        const totalValue =
            Number(fruit.stock_quantity) * Number(fruit.unit_price);

        return `
            <tr>
                <td>${fruit.id}</td>
                <td>${escapeHTML(fruit.name)}</td>
                <td>${escapeHTML(fruit.category)}</td>
                <td>${fruit.stock_quantity}</td>
                <td>${formatMoney(fruit.unit_price)}</td>
                <td>${formatMoney(totalValue)}</td>
                <td>
                    <button class="edit-btn"
                        data-action="edit"
                        data-id="${fruit.id}">
                        Edit
                    </button>

                    <button class="delete-btn"
                        data-action="delete"
                        data-id="${fruit.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// SUMMARY: Calculate inventory statistics.
function updateSummary() {
    const totalTypes = fruits.length;

    const totalStock = fruits.reduce(
        (sum, fruit) => sum + Number(fruit.stock_quantity),
        0
    );

    const totalValue = fruits.reduce(
        (sum, fruit) =>
            sum + Number(fruit.stock_quantity) *
                  Number(fruit.unit_price),
        0
    );

    document.getElementById("totalTypes").textContent = totalTypes;
    document.getElementById("totalStock").textContent = totalStock;
    document.getElementById("totalValue").textContent =
        formatMoney(totalValue);
}

// CREATE and UPDATE: Submit the fruit form.
fruitForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fruit = {
        name: nameInput.value.trim(),
        category: categoryInput.value.trim(),
        stock_quantity: Number(stockInput.value),
        unit_price: Number(priceInput.value)
    };

    if (
        !fruit.name ||
        !fruit.category ||
        stockInput.value.trim() === "" ||
        priceInput.value.trim() === "" ||
        !Number.isInteger(fruit.stock_quantity) ||
        fruit.stock_quantity < 0 ||
        !Number.isFinite(fruit.unit_price) ||
        fruit.unit_price < 0
    ) {
        showMessage(
            "Enter valid fruit details, quantity and price.",
            true
        );
        return;
    }

    const isEditing = fruitId.value !== "";

    const url = isEditing
        ? `${API_URL}/${fruitId.value}`
        : API_URL;

    const method = isEditing ? "PUT" : "POST";

    submitBtn.disabled = true;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fruit)
        });

        if (!response.ok) {
            const errorData = await response.json();

            throw new Error(
                errorData.detail
                    ? JSON.stringify(errorData.detail)
                    : "Unable to save fruit."
            );
        }

        resetForm();

        await loadFruits();

        showMessage(
            isEditing
                ? "Fruit updated successfully."
                : "Fruit added successfully."
        );
    } catch (error) {
        showMessage(error.message, true);
        console.error(error);
    } finally {
        submitBtn.disabled = false;
    }
});

// EDIT: Fill the form with an existing fruit.
function editFruit(id) {
    const fruit = fruits.find(item => item.id === id);

    if (!fruit) {
        showMessage("Fruit not found.", true);
        return;
    }

    fruitId.value = fruit.id;
    nameInput.value = fruit.name;
    categoryInput.value = fruit.category;
    stockInput.value = fruit.stock_quantity;
    priceInput.value = fruit.unit_price;

    formTitle.textContent = "Update Fruit";
    submitBtn.textContent = "Update Fruit";
    cancelBtn.hidden = false;

    fruitForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    nameInput.focus();
}

// DELETE: Remove a fruit from the database.
async function deleteFruit(id) {
    const fruit = fruits.find(item => item.id === id);

    if (!fruit) {
        showMessage("Fruit not found.", true);
        return;
    }

    if (!confirm(`Delete "${fruit.name}" from inventory?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json();

            throw new Error(
                errorData.detail || "Could not delete fruit."
            );
        }

        if (fruitId.value === String(id)) {
            resetForm();
        }

        await loadFruits();
        showMessage("Fruit deleted successfully.");
    } catch (error) {
        showMessage(error.message, true);
        console.error(error);
    }
}

// Handle Edit and Delete button clicks.
fruitTable.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {
        editFruit(id);
    } else if (action === "delete") {
        deleteFruit(id);
    }
});

// Reset the form after saving or cancelling.
function resetForm() {
    fruitForm.reset();
    fruitId.value = "";

    formTitle.textContent = "Add New Fruit";
    submitBtn.textContent = "Add Fruit";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", function () {
    resetForm();
    showMessage("Editing cancelled.");
});

refreshBtn.addEventListener("click", loadFruits);

// Load inventory when the page opens.
loadFruits();