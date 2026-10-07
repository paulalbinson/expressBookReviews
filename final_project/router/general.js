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

// Get book details based on the ISBN specified in the ISBN parameter
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;   

    let book = books[isbn];
    if (book){
        res.send(book);
    }else{
        res.send("No book found with this ISBN.")
    }
});

// Get book details based on the author specified in the author parameter
public_users.get('/author/:author', function (req, res) {
    // Iterate through the books object to find books by the author specified in the author parameter      
    const author = req.params.author;    
    let booksByAuthor = {};

    // 1. Obtain all the keys for the 'books' object
    let keys = Object.keys(books);

    // 2. Iterate through the keys and check if the author matches
    keys.forEach(key => {
        if (books[key].author === author) {
            booksByAuthor[key] = books[key]; // Copy the matching book over
        }
    });
    
    if (booksByAuthor){
        res.send(booksByAuthor);
    }else{
        res.send("No books found by the author specified.");
    } 
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
