// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables

let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || []; // if no value in the first, it goes to the next - if there had been, it would have added first info to an array, but instead it starts with empty array
let lastID = localStorage.getItem("lastID") || 0; // in case there are no items


// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID
const updateStorage = () => {
    localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    localStorage.setItem("lastID", lastID); // don't have to stringify booleans, numbers, strings
};

// 5th: function to render budgetItems on table; each item should be rendered in this format:
// <tr data-id="2"><td>Oct 14, 2019 5:08 PM</td><td>November Rent</td><td>Rent/Mortgage</td><td>1300</td><td>Fill out lease renewal form!</td><td class="delete"><span>x</span></td></tr>
// also, update total amount spent on page (based on selected category):
const renderItems = function(items) {
    // if a different items array is passed in, use that
    // if no items array is passed, default and use the budgetItems
    if (!items) items = budgetItems;
    const tbody = $("#budgetItems tbody");
    tbody.empty();

    let total = 0;

    for (const item of items) {
        // const { id, date, name, category, amount, notes } = item; change ${id}, ${date}...et al <= destructuring
        tbody.append(`<tr data-id=${item.id}><td>${item.date}</td><td>${item.name}</td><td>${item.category}</td><td>$${parseFloat(item.amount).toFixed(2)}</td><td>${item.notes}</td><td class="delete"><span>x</span></td></tr>`);
        total += parseFloat(item.amount);
    }  
    // rewrite the total calculation using an array reduce
    $("#total").text(`$${total.toFixed(2)}`);
};



// ======================
// MAIN PROCESS
// ======================

// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
$("#toggleFormButton, #hideForm").click(function () {
    $("#addItemForm").toggle("slow", function() {
        $("#toggleFormButton").text($(this).is(":visible") ? "Hide Form": "Add New Budget Item");
    });
});



// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array (each item's object should include: id / date / name / category / amount / notes)... then clear the form fields and trigger localStorage update/budgetItems rerender functions, once created

$("#addItem").click(function(event) {
    event.preventDefault();

    const newItem = {
        id: ++lastID, // putting ++ first updates the number the first time
        date: moment().format("lll"),
        name: $("#name").val().trim(),
        category: $("#category").val(),
        amount: $("#amount").val().trim(),
        notes: $("#notes").val().trim()
    }; 
    console.log(newItem);
    // if !newItem.name means if newItem.name is a falsey value; you could also do if newItem.name === "" or empty
    if (!newItem.name || !newItem.category || !newItem.amount) {
        return alert("Each budget item must have a valid name, category, and amount!");
    };
   
    budgetItems.push(newItem);

    // need to empty the form fields
    $("form input, form select").val("");

    // todo: update storage
    updateStorage();
    // todo: rerender items
    renderItems();
});


// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection

$("#categoryFilter").change(function() {
    const category = $(this).val();
    if (category) {
    const filteredItems = budgetItems.filter(item => category === item.category);
    renderItems(filteredItems);
    } else {
        renderItems();
    }  
});


// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem


$("#budgetItems").on("click", ".delete", function() {
    const id = $(this).parents("tr").data("id"); 
    const remainingItems = budgetItems.filter(item => item.id !== id);
    budgetItems = remainingItems;
    updateStorage();
    renderItems();
});

renderItems();