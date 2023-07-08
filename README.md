# Authorization-Secret Website

This is a secret website built using Node.js, Express.js, Mongoose, EJS, and Passport.js for authentication. The website allows users to register, submit their secrets, and view secrets posted by other users anonymously.

## Authorization Levels

- LEVEL 1: Storing user's Email and Password in database when user registers and checking the if the user exist's or not.
- LEVEL 2: Storing user information in a MongoDB database using encryption techniques provided by the mongoose-encryption library.
- LEVEL 3: Using md5 library for hashing the password.
- LEVEL 4: Using bcrypt library to hash password using a random salt value for each password hash.
- LEVEL 5: Using Passport js Local Authentication. Uses Passport's middleware and helper functions, such as passport.authenticate(), req. isAuthenticated(), and req.user, to handle authentication and access control within your routes.
- LEVEL 6: Implemented Passport.js Google OAuth 2.0 strategy which enables your Node.js application to authenticate users using their Google accounts. By leveraging the Google OAuth 2.0 API, you can allow users to sign in to your application using their Google credentials and access their Google profile information.

## Features

- User Registration:
  - Users can register by providing a unique username and password.
  - The registration process uses Passport.js for local authentication.

- User Login:
  - Registered users can log in with their credentials.
  - Passport.js is used for authentication and session management.

- Authorization check: 
   -The application verifies if the user exists in the database during the login process.

- Access to secrets: 
   -If the login is successful, users are granted access to the "secrets" page.

- Submit Secrets:
  - Authenticated users can submit their secrets through the "Submit a Secret" page.
  - Secrets are stored in the database and associated with the user who submitted them.

- View Secrets:
  - All registered users, whether logged in or not, can view secrets anonymously.
  - The "Secrets" page displays secrets posted by users without revealing their identities.

- Logout:
  - Users can log out from the website using the "Log Out" button.


## Prerequisites

Make sure you have the following installed:

- Node.js
- Express.js
- MongoDB

## Technologies Used

- Node.js: A JavaScript runtime environment.
- Express.js: A web application framework for Node.js.
- Mongoose: An object data modeling library for MongoDB and Node.js.
- EJS: A template engine for generating dynamic HTML pages.
- Passport.js: An authentication middleware for Node.js.


## Routes

- `/`: Renders the home page.
- `/register`: Renders the registration page.
- `/login`: Renders the login page.
- `/register` (POST): Handles the registration form submission. Saves the user's email and password to the database.
- `/login` (POST): Handles the login form submission. Checks if the user exists in the database and verifies the provided password.

## File Structure

- `app.js`: The main entry point of the application.
- `views/`: Contains the EJS templates for rendering the web pages.
- `public/`: Contains static assets such as stylesheets and client-side JavaScript files.

## Dependencies

- Express.js: Web application framework for Node.js.
- Body-parser: Middleware to handle HTTP request bodies.
- EJS: Embedded JavaScript templates for rendering HTML pages.
- Mongoose: MongoDB object modeling tool.

## Installation

1. Clone the repository:

   ```shell
   git clone <repository-url>
   ```

2. Install the dependencies:

   ```shell
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following environment variables in the `.env` file:
   
     ```
     PORT=3000
     MONGODB_URI=<your-mongodb-uri>
     SESSION_SECRET=<session-secret>
     ```

     Replace `<your-mongodb-uri>` with your MongoDB connection string, and `<session-secret>` with a secret key for session encryption.

4. Start the application:

   ```shell
   npm start
   ```

5. Visit `http://localhost:3000` in your browser to access the Secret Website.



