# Authorisation

This is a simple Node.js application that implements authorization. It allows users to register, login, and access secret information if the login is successful.

## Authorization Levels

- LEVEL 1: Storing user's Email and Password in database when user registers and checking the if the user exist's or not.
- LEVEL 2: Storing user information in a MongoDB database using encryption techniques provided by the mongoose-encryption library.
- LEVEL 3: Using md5 library for hashing the password.
- LEVEL 4: Using bcrypt library to hash password using a random salt value for each password hash.
- LEVEL 5: Using Passport js Local Authentication. Uses Passport's middleware and helper functions, such as passport.authenticate(), req. isAuthenticated(), and req.user, to handle authentication and access control within your routes.

## Features

- User registration: Users can register by providing an email and password.
- User login: Users can log in using their registered email and password.
- Authorization check: The application verifies if the user exists in the database during the login process.
- Access to secrets: If the login is successful, users are granted access to the "secrets" page.

## Prerequisites

Make sure you have the following installed:

- Node.js
- Express.js
- MongoDB

## Setup

1. Clone the repository and navigate to the project directory.

2. Install the dependencies by running the following command:
   ```
   npm install
   ```

3. Set up the MongoDB database:
   - In the code, the application is configured to use a local MongoDB database. Make sure you have MongoDB installed and running on your machine.
   - Update the `local_URI` variable in the code with the appropriate MongoDB connection string for your local environment.
   - Alternatively, you can set the `MONGODB_URI` environment variable to use a different MongoDB connection.

4. Start the application by running the following command:
   ```
   npm start
   ```

5. Access the application in your browser at `http://localhost:3000`.

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
