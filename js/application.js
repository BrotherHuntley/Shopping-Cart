// List class, keeps track of all items
class List {
    constructor() {
        this.item = [];
        this.totalCost = 0;
        this.itemsAdded = 0;
    }

    // Updates total cart cost
    updateTotal(val) {
        this.totalCost = (Math.round((val + Number(this.totalCost)) * 100) / 100).toFixed(2);
    }

    // Adds item and displays them
    add(identifier) {

        let thisItem = this.findItem(identifier)[0];

        // Ternary to determine row color
        let color = this.item.length % 2 === 1 ? 'lightRow' : 'darkRow'

        // Build and append parent div
        let rowDiv = $('<div></div>', { 'class': 'row py-2 ' + color + '', 'id': 'itemNum' + thisItem.id });
        $('div#list').append(rowDiv);

        // Append each column to parent
        rowDiv.append($('<div></div>', { html: thisItem.name, 'class': "col-md-2 py-2 py-md-0" })); // Name
        rowDiv.append($('<div></div>', { html: '$' + thisItem.price, 'class': "col-md-2 py-2 py-md-0" })); // Price
        rowDiv.append($('<div class="col-md-3 input-group py-2 py-md-0"><div class="input-group-prepend"><span class="input-group-text">QTY</span></div><input type="number" class="form-control qty" value="1"" id="qty' + thisItem.id + '"></div>')); // Quantity
        rowDiv.append($('<div></div>', { html: '$' + thisItem.totalPrice, 'class': "col-md-2 py-2 py-md-0", "id": "total" + thisItem.id })); // Total Price
        rowDiv.append($('<button></button>', { html: 'Remove', 'class': "col-md-2 btn removeButton py-2 py-md-0 mx-5 mx-md-2", 'onClick': 'removeFunction(' + thisItem.id + ')' })); // Remove Button

        // Calls listener function each time new it is added so changes can be watched
        listener();

        // Updates total cost
        $('#totalCost').html(list.totalCost);
    }

    // Removes items and fixes row colors
    remove(identifier) {

        // Remove html element
        $('div#' + 'itemNum' + identifier).remove();

        // Find and remove item from list array
        let removedItemIndex = this.findItem(identifier)[1]
        this.item.splice(removedItemIndex, 1)

        // Recolors all rows 
        for (let i = 0; i < this.item.length; i++) {
            let currentId = this.item[i][1].id;
            $('div#itemNum' + currentId).removeClass('darkRow lightRow')
            i % 2 === 1 ? $('div#itemNum' + currentId).addClass('darkRow') : $('div#itemNum' + currentId).addClass('lightRow')
        }

        // Updates total cost
        $('#totalCost').html(list.totalCost);
    }

    // Handles when the quantity of an item changes
    changeQty(identifier, newQty) {
        let thisItem = list.findItem(identifier)[0];
        let pastQty = thisItem.qty;
        list.updateTotal((newQty - pastQty) * thisItem.price)
        thisItem.qty = newQty;
        thisItem.calcPrice()
        $('#total' + identifier).html('$' + thisItem.totalPrice)
        $('#totalCost').html(list.totalCost);
    }

    // Function to iterate through list to return the item object and the index of the object 
    findItem(identifier) {
        let thisItem = undefined;
        let index = undefined;
        for (let i = 0; i < this.item.length; i++) {
            if (this.item[i][0] == identifier) {
                thisItem = this.item[i][1];
                index = i;
            };
        }
        return [thisItem, index];
    }
}

// Builds the master list
let list = new List();

// Item class, builds object for a single item
class Item {
    constructor(name, price, qty) {
        this.name = name;
        this.price = price;
        this.qty = qty;
        this.totalPrice = price * qty;
        this.id = list.itemsAdded;
        list.itemsAdded += 1;
    }

    // Updates total item price
    calcPrice() {
        this.totalPrice = (Math.round(this.price * this.qty * 100) / 100).toFixed(2);
    }
}

// Function to handle when a new item is added
let addFunction = function () {

    // Get new item name and cost
    let newItemName = document.getElementById('newItemName').value;
    let newItemPrice = Number(document.getElementById('newItemPrice').value);

    // Error checker, shows error message if missing name or cost 
    if (newItemName === '' || newItemPrice === 0) {
        if (newItemName === '') {
            $('#nameError').removeClass('noError');
            $('#nameError').addClass('error');
        }
        if (newItemPrice === 0) {
            $('#costError').removeClass('noError');
            $('#costError').addClass('error');
        }

    } else { // When no error
        
        //Remove error message 
        $('#nameError').removeClass('error');
        $('#nameError').addClass('noError');
        $('#costError').removeClass('error');
        $('#costError').addClass('noError');

        // Create new item object with a quantity of 1
        let thisItem = new Item(newItemName, newItemPrice, 1)

        // Update total cost of shopping list
        list.updateTotal(newItemPrice);

        // Clear values from new item fields
        document.getElementById('newItemName').value = '';
        document.getElementById('newItemPrice').value = '';

        // Add item to total list
        list.item.push([thisItem.id, thisItem])

        // Display new item
        list.add(thisItem.id);
    }
}

// Function to handle when an item is removed
let removeFunction = function (identifier) {

    // Find item being removed
    let thisItem = list.findItem(identifier)[0]

    // Update total cost of shopping list
    list.updateTotal(thisItem.totalPrice * -1);

    // Remove the item
    list.remove(identifier);
}

// Event listener for changes in quantity of an existing item
let listener = function () {
    $(document).ready(function () {
        $(".qty").change(function () {
            let identifier = this.id.replace('qty', '');
            let newQty = this.value;
            list.changeQty(identifier, newQty)
        });
    });
}
