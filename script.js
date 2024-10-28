let itemCount = 0;
let grossAmount = 0; 
let totalDiscount = 0;
let netAmount = 0; 

function addItem() {
    // Get input values
    const itemNameInput = document.getElementById("itemName");
    const quantityInput = document.getElementById("quantity");
    const priceInput = document.getElementById("price");
    const itemName = itemNameInput.value;

    
    // Function to validate input and highlight if invalid
function validateInput(input, value) {
    if (!value || value <= 0 || isNaN(value)) {
        input.style.border = "2px solid red"; // Highlight invalid input
        return false;
    } else {
        input.style.border = ""; // Clear highlight
        return true;
    }
}

// Retrieve values
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);

// Perform validations
    let isValid = true;

if (!itemName) {
    itemNameInput.style.border = "2px solid red";
    isValid = false;
} else {
    itemNameInput.style.border = ""; 
}

const isQuantityValid = validateInput(quantityInput, quantity);
const isPriceValid = validateInput(priceInput, price);

// Update overall validation status
isValid = isValid && isQuantityValid && isPriceValid;

// If any input is invalid, return early
if (!isValid) {
    return;
}

// Continue with further processing if all inputs are valid

    itemCount++;

    // Create a new row in the table
    const table = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Insert cells with item details
    const cellSn = newRow.insertCell(0);
    const cellItem = newRow.insertCell(1);
    const cellQuantity = newRow.insertCell(2);
    const cellPrice = newRow.insertCell(3);
    const cellTotal = newRow.insertCell(4);
    const cellDiscounted = newRow.insertCell(5);
    const cellConfirm = newRow.insertCell(6);

    // Create checkbox and serial number
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onclick = () => toggleEdit(newRow, checkbox);

    cellSn.appendChild(checkbox);
    cellSn.appendChild(document.createTextNode(` ${itemCount}`));

    // Set initial item details
    cellItem.innerText = itemName;
    cellQuantity.innerText = quantity;
    cellPrice.innerText = price.toFixed(2);
    
    // Calculate total and discount
    updatePriceDetails(cellTotal, cellDiscounted, quantity, price);

    // Create confirm button
    const confirmButton = document.createElement("button");
    confirmButton.innerText = "Confirm";
    confirmButton.style.display = "none"; // Initially hide the button
    confirmButton.onclick = () => confirmChanges(newRow, confirmButton, checkbox);

    // Add the confirm button to the cell
    cellConfirm.appendChild(confirmButton);

    // Show confirm button if checkbox is checked
    checkbox.onchange = () => {
        confirmButton.style.display = checkbox.checked ? "inline" : "none";
    };

    // Display the table
    document.querySelector(".table-container").style.display = "block";

    // Clear input fields
    itemNameInput.value = "";
    quantityInput.value = "";
    priceInput.value = "";

    // Update total amounts
    updateTotals(quantity, price);
}

function toggleEdit(row, checkbox) {
    // Enable/disable editing based on checkbox state
    const itemNameCell = row.cells[1];
    const quantityCell = row.cells[2];
    const priceCell = row.cells[3];

    itemNameCell.contentEditable = checkbox.checked;
    quantityCell.contentEditable = checkbox.checked;
    priceCell.contentEditable = checkbox.checked;

    // If the checkbox is checked, prevent showing blank input initially
    if (checkbox.checked) {
        // Clear input areas only when they are selected later
        quantityCell.addEventListener('focus', function () {
            if (quantityCell.innerText === '0') {
                quantityCell.innerText = ""; // Clear on focus if it was 0
            }
        });

        priceCell.addEventListener('focus', function () {
            if (priceCell.innerText === '0.00') {
                priceCell.innerText = ""; // Clear on focus if it was 0
            }
        });
    }
}

function confirmChanges(row, confirmButton, checkbox) {
    // Get the new values from the row
    const quantityCell = row.cells[2];
    const priceCell = row.cells[3];
    
    let quantity = parseInt(quantityCell.innerText);
    let price = parseFloat(priceCell.innerText);

    // Set to 0 if the input is empty after confirmation
    if (isNaN(quantity) || quantity === 0) {
        quantity = 0;
        quantityCell.innerText = quantity;
    }
    
    if (isNaN(price) || price === 0) {
        price = 0;
        priceCell.innerText = price.toFixed(2);
    } else {
        priceCell.innerText = price.toFixed(2);
    }
    
    // Update total and discounted prices
    updatePriceDetails(row.cells[4], row.cells[5], quantity, price);
    
    // Disable editing after confirmation
    itemNameCell.contentEditable = false;
    quantityCell.contentEditable = false;
    priceCell.contentEditable = false;

    // Hide confirm button after confirmation
    confirmButton.style.display = "none";

    // Uncheck the checkbox
    checkbox.checked = false;

    // Update total amounts based on new values
    updateTotalsAfterEdit(quantity, price);
}

function updatePriceDetails(cellTotal, cellDiscounted, quantity, price) {
    // Calculate total and discount
    const total = quantity * price;
    const discount = total * 0.10;
    const discountedPrice = discount;

    // Update the cells
    cellTotal.innerText = total.toFixed(2);
    cellDiscounted.innerText = discountedPrice.toFixed(2);
}

// Update total amounts based on added items
function updateTotals(quantity, price) {
    const total = quantity * price;
    grossAmount += total;
    const discount = total * 0.10;
    totalDiscount += discount;
    netAmount += (total - discount);

    // Update the displayed totals
    document.getElementById("grossAmount").innerText = `Gross Amount: Rs ${grossAmount.toFixed(2)}`;
    document.getElementById("totalDiscount").innerText = `Total Discount: Rs ${totalDiscount.toFixed(2)}`;
    document.getElementById("netAmount").innerText = `Net Amount: Rs ${netAmount.toFixed(2)}`;
}

// Update totals after editing an item
function updateTotalsAfterEdit(quantity, price) {
    // Recalculate totals
    grossAmount = 0; 
    totalDiscount = 0;
    netAmount = 0;

    // Iterate through each row to recalculate the totals
    const rows = document.querySelectorAll("#cartTable tbody tr");
    rows.forEach(row => {
        const quantity = parseInt(row.cells[2].innerText);
        const price = parseFloat(row.cells[3].innerText);
        const total = quantity * price;
        const discount = total * 0.10;

        grossAmount += total;
        totalDiscount += discount;
        netAmount += (total - discount);
    });

    // Update the displayed totals
    document.getElementById("grossAmount").innerText = `Gross Amount: Rs ${grossAmount.toFixed(2)}`;
    document.getElementById("totalDiscount").innerText = `Total Discount: Rs ${totalDiscount.toFixed(2)}`;
    document.getElementById("netAmount").innerText = `Net Amount: Rs ${netAmount.toFixed(2)}`;
}

// Save function to save cart details as JSON and redirect to cart.html
function saveCartDetails() {
    const cartDetails = {
        items: [],
    };

    const rows = document.querySelectorAll("#cartTable tbody tr");
    rows.forEach(row => {
        const itemName = row.cells[1].innerText;
        const quantity = parseInt(row.cells[2].innerText);
        const price = parseFloat(row.cells[3].innerText);
        const total = parseFloat(row.cells[4].innerText);
        const discount = parseFloat(row.cells[5].innerText);

        cartDetails.items.push({ itemName, quantity, price, total, discount });
    });

    // Save cart details to local storage
    localStorage.setItem("cartDetails", JSON.stringify(cartDetails));

    // Redirect to cart.html
    location.href = "cart.html";
}

// Attach saveCartDetails to the save button
document.getElementById("saveButton").onclick = saveCartDetails;
