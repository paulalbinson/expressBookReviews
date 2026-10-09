const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid
const isValid = (username) => { //returns boolean
    // Filter the users array for any user with the same username
    let validUsers = users.filter((user) => {
        return (user.username === username);
    });

    // Return true if any valid user is found, otherwise false
    return validUsers.length > 0;
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    // Return true if any valid user is found, otherwise false
    return validUsers.length > 0;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({message: "Error logging in - username or password missing."});
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(401).json({message: "Invalid Login. Check username and password"});
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Retrieve the isbn parameter from the request URL
    const username = req.session.authorization.username; // Get the logged-in user from the session
    const review = req.body.content; // Get submitted review from body of request

    // Check there is a review submitted to process
    if (typeof review == 'string' && review.trim().length !== 0) {
        // Get the book that matches that ISBN
        let book = books[isbn];

        if (book) {
            // Get the reviews for that book
            let reviews = book.reviews;

            // Filter existing reviews to those by the logged-in user (if any).
            let filteredReviews = reviews.filter((review) => review.username === username);

            let newReview = {"username": username, "content": review}; // Create an object of the new or revised review

            // If there is an existing review for this book from the user update it, else add new review
            if (filteredReviews.length > 0) { // Review exists - update it
                // Replace old review entry with updated review by filtering existing book reviews to exclude the one
                // by the user and then add (via push) the new review to the reviews array
                reviews = reviews.filter((review) => review.username !== username);
                reviews.push(newReview);

                // Update the book's reviews in the books object to include the revised item
                books[isbn].reviews = reviews;

                // Send success message indicating the user has been updated
                return res.status(200).json({message: "Review updated for the book with the ISBN of " + isbn + "."});
            } else { // No existing review of this book by the user - add one
                reviews.push(newReview); // Add the new review to the reviews array

                // Update the book's reviews in the books object to include the new item
                books[isbn].reviews = reviews;
                return res.status(201).json({message: "Review added for the book with the ISBN of " + isbn + "."});
            }
        } else {
            return res.status(404).json({message: "No book found with the ISBN '" + isbn + "' to get reviews for."});
        }
    } else {
        return res.status(400).json({message: "No review submitted"});
    }
});

// This function deletes a review for a book with the ISBN number specified in the parameter provided. It filters and
// deletes the reviews based on the session username, so that a user can delete only their reviews and not others' users reviews.
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Retrieve the isbn parameter from the request URL
    const username = req.session.authorization.username; // Get the logged-in user from the session

    // Get the book that matches that ISBN
    let book = books[isbn];

    if (book) {
        // Get the reviews for that book
        let reviews = book.reviews;

        // Filter existing reviews to those by the logged-in user (if any).
        let filteredReviews = reviews.filter((review) => review.username === username);

        if (filteredReviews.length > 0) { // Review exists - delete it
            // Delete the review by filtering existing book reviews to exclude the one by the user, then save that
            // filtered array to the book's review property therefore removing the targeted review.
            reviews = reviews.filter((review) => review.username !== username);

            // Update the book's reviews in the books object to exclude the targeted review
            books[isbn].reviews = reviews;

            // Send success message indicating the user has been updated
            return res.status(200).json({message: "Review deleted for the book with the ISBN of " + isbn + "."});
        } else { // Review doesn't exist - send error message
            return res.status(400).json({message: "Deletion failed as you have not reviewed the book with the ISBN of " + isbn + " to delete."});
        }
    } else {
        return res.status(404).json({message: "No book found with the ISBN '" + isbn + "' to get your review for to delete."});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;