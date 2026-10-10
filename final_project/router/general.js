const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });

    // Return true if any user with the same username is found, otherwise false
    return usersWithSameName.length > 0;
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
            return res.status(201).json({message: "User successfully registered; you can now log in."});
        } else {
            return res.status(409).json({message: "Username already exists, please choose a different username!"});
        }
    }
    // Return error if username or password is missing
    return res.status(400).json({message: "Unable to register user - Username or password missing."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({
        message: "Books retrieved successfully.",
        data: books
    });
});

// Get book details based on the ISBN specified in the ISBN parameter
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        return res.status(200).json({
            message: "Book with ISBN of " + isbn + " retrieved successfully.",
            data: book
        });
    } else {
        return res.status(404).json({
            message: "No book found with the ISBN of " + isbn + "."
        });
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
            booksByAuthor[key] = books[key]; // Copy the matching book(s) over to the array containing books by that author
        }
    });

    if (Object.keys(booksByAuthor).length > 0) {
        return res.status(200).json({
            message: "Book with author '" + author + "' retrieved successfully.",
            data: booksByAuthor
        });
    } else {
        return res.status(200).json({
            message: "No books found by the author '" + author + "'.",
            data: {}
        });
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
            booksByTitle[key] = books[key]; // Copy the matching book over to the array containing books with that title
        }
    });

    if (Object.keys(booksByTitle).length > 0) {
        return res.status(200).json({
            message: "Book with title '" + title + "' retrieved successfully.",
            data: booksByTitle
        });
    } else {
        return res.status(200).json({
            message: "No books found by with the title '" + title + "'.",
            data: {}
        });
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
        if (reviews.length > 0) {
            return res.status(200).json({
                message: "Reviews for the book with the ISBN of '" + isbn + "' retrieved successfully.",
                data: reviews
            });
        } else {
            return res.status(200).json({
                message: "This book (ISBN '" + isbn + "') currently has no reviews.",
                data: []
            });
        }
    } else {
        return res.status(200).json({
            message: "No book found with the ISBN '" + isbn + "' to get reviews for.",
            data: {}
        });
    }
});

public_users.get('/test-async-await', function (req, res) {
    getListOfBooks();
});

// Get a list of books available in the bookshop with async-await
async function getListOfBooks() {
    try {
        const response = await axios.get(
            "https://demos.paulalbinson.com/node-demos/express-book-reviews/"
        );
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        console.log("Request completed");
    }
}

module.exports.general = public_users;