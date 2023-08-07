# prototype of login-registration-using-JWT-express-and-Mysql-In-Node for educational purpose 


# JWT Authentication

This is a simple Node.js application that uses JSON Web Tokens (JWT) for authentication. It allows users to register and login, and provides a route to check if the user is authenticated.

## Installation

1. Clone this repository.
2. Install the dependencies by running `npm install`.
3. Create a MySQL database named `jwt` and update the database connection details in the `db` variable.
4. Start the server by running `node index.js`.

## Usage

- To register a new user, send a POST request to the `/register` route with the user's email and password in the request body.
- To login, send a POST request to the `/login` route with the user's email and password in the request body. If the login is successful, a JWT will be returned in the response.
- To check if a user is authenticated, send a GET request to the `/CheckAuth` route with the JWT in the `Authorization` header.

## NOTE:

 => choose no auth for the token validation instead of bearer token or jwt token in Authorization and enter the header "authorization" in the key field and enter the jwt token which  you want to enter to be in the value field -(if you want to test it in the Postman)

=> If you have problem in hashing the password , try putting your password inside the double or single quotes (in string format),I mean in your client side program or client side testing tool . It may have the possibility to solve the problem ✌️.But remember what kind of problem you are facing.

## Dependencies

This application uses the following dependencies:
- `express`: A web framework for Node.js.
- `mysql2`: A MySQL client for Node.js.
- `cors`: A middleware to enable CORS with various options.
- `jsonwebtoken`: An implementation of JSON Web Tokens.
- `bcryptjs`: A library to hash and check passwords.
