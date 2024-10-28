// Retrieve cart details from localStorage
const cartDetails = JSON.parse(localStorage.getItem("cartDetails"));
const selectedItems = [];

// Function to display items in the grid
function displayCartItems(itemsToDisplay) {
    const itemGrid = document.getElementById("itemGrid");
    itemGrid.innerHTML = ""; // Clear existing items

    if (itemsToDisplay && itemsToDisplay.length > 0) {
        itemsToDisplay.forEach(item => {
            const gridItem = document.createElement("div");
            gridItem.className = "grid-item";

            gridItem.innerHTML = `
                <h3>${item.itemName}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: Rs ${item.price.toFixed(2)}</p>
                <p>Total: Rs ${item.total.toFixed(2)}</p>
                <p>Discount: Rs ${item.discount.toFixed(2)}</p>
                <div class="actions">
                    <button onclick="addItem('${item.itemName}')">➕ Add</button>
                    <button onclick="removeItem('${item.itemName}')">➖ Remove</button>
                </div>
            `;

            itemGrid.appendChild(gridItem);
        });
    } else {
        itemGrid.innerHTML = "<p>No items found.</p>";
    }
}

// Function to filter items based on search input
function filterItems() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    const filteredItems = cartDetails.items.filter(item =>
        item.itemName.toLowerCase().startsWith(searchTerm)
    );
    displayCartItems(filteredItems);
}

// Function to add item to the selected items table
function addItem(itemName) {
    if (!selectedItems.includes(itemName)) {
        selectedItems.push(itemName);
        updateSelectedItemsTable();
    }
}

// Function to remove item from the selected items table
function removeItem(itemName) {
    const index = selectedItems.indexOf(itemName);
    if (index > -1) {
        selectedItems.splice(index, 1);
        updateSelectedItemsTable();
    }
}

// Function to update the selected items table
function updateSelectedItemsTable() {
    const selectedItemsTableBody = document.querySelector("#selectedItemsTable tbody");
    selectedItemsTableBody.innerHTML = ""; // Clear existing rows

    selectedItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item}</td>
            <td><button onclick="removeItem('${item}')">Remove</button></td>
        `;
        selectedItemsTableBody.appendChild(row);
    });
}

// Call the function to display items
displayCartItems(cartDetails.items);
