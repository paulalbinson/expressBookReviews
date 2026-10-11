const express = require('express');
let books = require("./booksdb.js");
let commonFunctions = require("../common_functions.js");
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
    /* Check the ISBN looks valid.
    As we're using a number to represent an ISBN number checking the input is a number is sufficient for now but were
    we to use real ISBN numbers, this is not a suitable check as full ISBN validation is different: ISBN-10 can end in
    X, and real ISBNs have length and checksum requirements. Create a proper ISBN checker function to use wherever
    ISBN needs checking in that case. */
    if (!commonFunctions.isNumeric(isbn)){
        return res.status(400).json({
            message: "The ISBN provided is invalid."
        });
    }

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

// Some demonstrations of how you could use the API with async functions and await calls. IMPORTANT: Change the URL to
// match your server rather than my demonstration server instance.

// Get a list of books available in the bookshop with async-await
async function getListOfBooks() {
    try {
        const response = await axios.get(
            "https://demos.paulalbinson.com/node-demos/express-book-reviews/"
        );
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error("Error fetching data: ", error);
        /* Note: the error returned by axios is too detailed for outputting directly to the user, containing full debug
        details (file paths, line numbers, etc.), so keep it only for internal debugging. When you wish to use the error
        for output to the user, you should use a specific aspect of it that contains the error data returned, not the
        full debug details. In this instance, you'd want to access error.response.data, which is the JSON body returned
        by the API in the axios response. If you need a specific aspect of the JSON body, such as the message returned,
        target that property, e.g., error.response.data.message */
    } finally {
        console.log("Request completed");
    }
}

// Get book details based on ISBN with async-await
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(
            `https://demos.paulalbinson.com/node-demos/express-book-reviews/isbn/${isbn}`
        );
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        console.log("Request completed");
    }
}

// Get book details based on author with async-await
async function getBookByAuthor(author) {
    try {
        const response = await axios.get(
            `https://demos.paulalbinson.com/node-demos/express-book-reviews/author/${author}`
        );
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        console.log("Request completed");
    }
}

// Get book details based on title with async-await
async function getBookByTitle(title) {
    try {
        const response = await axios.get(
            `https://demos.paulalbinson.com/node-demos/express-book-reviews/title/${title}`
        );
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        console.log("Request completed");
    }
}

module.exports.general = public_users;