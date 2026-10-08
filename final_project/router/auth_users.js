const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid
const isValid = (username) => { //returns boolean
    // Filter the users array for any user with the same username
    let validusers = users.filter((user) => {
        return (user.username === username);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
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
        console.log(req.session);
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log(req.session);
    const isbn = req.params.isbn; // Retrieve the isbn parameter from the request URL
    const username = req.session.user; // Get the logged in user from the session
    const review = req.body.review; // Get submitted review from body of request

    // Check there is a review submitted to process
    if (review) {
        // Get the book that matches that ISBN
        let book = books[isbn];
        if (book) {
            // Get the reviews for that book
            let reviews = book.reviews;

            // Filter existing reviews to those by the logged in user (if any).
            let filteredReviews = reviews.filter((review) => review.user === username);
            
            let newReview = { "username": username, "content": review.content };

            // If there is an existing review for this book from the user update it, else add new review
            if (filteredReviews.length > 0) { // Review exists - update it
                // Select the first matching user and update attributes if provided
                let filtered_review = filteredReviews[0];

                filtered_review = newReview;

                // Replace old review entry with updated review
                reviews = reviews.filter((review) => review.username !== username);
                reviews.push(filtered_review);
                
                // Update book details in books object
                books[isbn].reviews = reviews;

                // Send success message indicating the user has been updated
                res.send("Review updated.");
            } else { // No existing review - add one
                
                reviews.push(newReview);
                
                // Update book details in books object
                books[isbn].reviews = reviews;
                res.send("Review added");
            }
        } else {
            res.send("No book found with this ISBN to get reviews for.");
        }
    } else {
        res.send("No review submitted");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
