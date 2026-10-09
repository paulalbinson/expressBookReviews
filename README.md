# Express Book Reviews App Example
This is a server-side online book review application that utilises a REST API server with session-based authentication 
using JWT. It was developed as an assessment submission for the Developing Back-End Apps with Node.js and Express course 
within the IBM Full Stack Software Developer Professional Certificate on Coursera. Building on an incomplete skeleton 
code, I developed this into a full application as per the assessment requirements outlined below. 

## Task
Assuming the role of a back-end developer working for an online retailer selling books, the project 
was to develop a server-side application that stores, retrieves, and manages book ratings and reviews.  

The server-side application is required to provide the following features and capabilities to allow 
users to:
 - Retrieve a list of all books available in the bookshop 
 - Search for specific books and retrieve their details based on the book’s ISBN code, author 
names, and titles 
 - Retrieve reviews/comments for specified books 
 - Register as a new user of the application 
 - Login to the application 
 - Add a new review for a book (logged-in users only) 
 - Modify a book review (logged-in users can modify only their own reviews) 
 - Delete a book review (logged-in users can delete only their own reviews) 
 - (Multiple users) Access the application at the same time to view and manage different book 
reviews simultaneously 

This involves:
 1. Creating APIs and performing CRUD operations on an Express server using Session & JWT authentication.
 2. Using Async/Await or Promises with Axios in Node.js.
 3. Creating and testing REST API endpoints

## REST Endpoints
The API is configured to run locally at `http://localhost:3002`. You may change this by modifying the PORT const variable.

### Main Public Facing Endpoints - general.js (No Authentication Needed)
These are defined in a genl_routes router (general.js - routes a general user can access) which is connected to the app 
router with a / prefix so they are contained at the root of the site.

| Method | Endpoint          | Description                                                    | Login required |
|--------|-------------------|----------------------------------------------------------------|----------------|
| GET    | `/`               | Retrieve all books, including their reviews (if present).      | No             |
| GET    | `/isbn/:isbn`     | Retrieve a book using its ISBN identifier.                     | No             |
| GET    | `/author/:author` | Retrieve books whose author exactly matches the supplied name. | No             |
| GET    | `/title/:title`   | Retrieve books whose title exactly matches the supplied title. | No             |
| GET    | `/review/:isbn`   | Retrieve all reviews for the specified book.                   | No             |
| POST   | `/register`       | Register a user with a username and password.                  | No             |

### Authorised User Endpoints - auth_users.js  
These are defined in a customer_routes router (auth_users.js - routes which an authorised user can access) which is 
connected to the app router with a /customer prefix, thus routes within this file/router begin /customer. Any route 
beginning /customer/auth/ is a protected page requiring the user to be authenticated which is handled by middleware 
defined in index.js

| Method | Endpoint                      | Description                                                                          | Login required |
|--------|-------------------------------|--------------------------------------------------------------------------------------|----------------|
| POST   | `/customer/login`             | Log in a registered user and establish an authenticated session.                     | No             |
| PUT    | `/customer/auth/review/:isbn` | Add a review or replace the logged-in user's existing review for the specified book. | Yes            |

Replace parameters such as `:isbn` with actual values. Author and title searches are case-sensitive; URL-encode 
spaces and special characters.

### Request bodies
Registration and login accept JSON:

    {
      "username": "reader1",
      "password": "example-password"
    }

Adding or updating a review accepts JSON:

    {
      "content": "An engaging and enjoyable book."
    }

Send these as request bodies with the `Content-Type: application/json` header.

### Authentication
Login stores a JWT in the server-side session. The client must retain the session cookie returned by the server and 
include it in subsequent requests to protected endpoints. Unauthenticated requests to protected endpoints receive HTTP `401`.

Each user can have one review per book. A PUT request adds their review if none exists, or replaces their existing review.

### Data storage
With this application being a demo of REST operations changes to data are not saved. Users and reviews are stored in 
memory, and, therefore, registrations and review changes are lost when the server restarts. 

The sample dataset uses numeric book identifiers such as 1 and 2 in place of real ISBNs.

## Running the Application
To run the application use `npm install` and then `npm start` from the final_project directory. **Note:** Currently, 
the start command is configured with `nodemon index.js` so that node monitor constantly checks for any changes to the 
project files and restarts the server when anything changes. This is fine in a development environment but in a 
production environment you are advised to change this to `node index.js` to remove this monitoring. Instead, restart on 
demand, such as via a git hook when you push new code to the main branch.

