const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Send JSON response with formatted books data
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    
    if (isbn){
        let book = books[isbn];
        if (book){
            res.send(book);
        }else{
            res.send("No book found with this ISBN.")
        }        
    }else{
        res.send("No ISBN Specified")
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
