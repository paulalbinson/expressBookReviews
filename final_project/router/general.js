const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
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
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
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

    if (booksByAuthor) {
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        res.send("No books found by the author specified.");
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Iterate through the books object to find books with the title specified in the title parameter      
    const title = req.params.title;
    let booksByTitle = {};

    // 1. Obtain all the keys for the 'books' object
    let keys = Object.keys(books);

    // 2. Iterate through the keys and check if the title matches
    keys.forEach(key => {
        if (books[key].title === title) {
            booksByTitle[key] = books[key]; // Copy the matching book over
        }
    });

    if (booksByTitle) {
        res.send(JSON.stringify(booksByTitle, null, 4));
    } else {
        res.send("No books found with the title specified.");
    }
});

//  Get book review identified by its ISBN as specified in the isbn parameter
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the isbn parameter from the request URL
    const isbn = req.params.isbn;
    
    // Get the book that matches that ISBN
    let book = books[isbn];
    if (book) {
        // Get the reviews for that book
        let reviews = book.reviews;

        // If the book has reviews send them else report no reviews found.
        if (reviews) {
            res.send(JSON.stringify(reviews, null, 4));
        } else {
            res.send("No reviews found for the book specified.");
        }
    } else {
        res.send("No book found with this ISBN to get reviews for.");
    }
});

module.exports.general = public_users;
