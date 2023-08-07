# prototype of login-registration-using-JWT-express-and-Mysql-In-Node for educational purpose 

## Reminder
This code will not work as you please for the actual implementation of real-time projects.Instead it will give you some idea about the Implementation of APIs though it's for learning purpose ✌️

# - JWT Authentication -

This is a simple Node.js application that uses JSON Web Tokens (JWT) for authentication. It allows users to register and login, and provides a route to check if the user is authenticated.

## Installation

1. Clone this repository.
2. Install the dependencies by running `npm install`.
3. Create a MySQL database named `jwt` and update the database connection details in the `db` variable.
4. Start the server by running `node index.js`.

## Running the Application

1. Start your MySQL server.
2. Run npm start to start the Node.js server.
3. The server will be running on port 3308, and you can access the endpoints through http://localhost:3308.
   
## Endpoints

POST /register
This endpoint allows users to register by providing their email and password. The password is securely hashed before storing it in the database.

POST /login
Users can log in using their registered email and password. Upon successful login, a JWT token is generated and sent back to the client for authentication.

GET /CheckAuth
This endpoint requires a valid JWT token in the request headers. If the token is valid, it returns the list of users from the database as an authenticated response.

POST /emailverification
This endpoint checks if the provided email exists in the database. If the email is found, it sets the email in the session for future reference.

POST /checkOldPassword
This endpoint requires an email and a password in the request body. It verifies the password against the stored hashed password in the database. If the password matches, it generates an OTP, updates it in the database, and stores it in the session for further verification.

POST /verifyOtp
This endpoint verifies the provided OTP against the OTP stored in the database and associated with the email in the session. If the OTP is valid, it sends a success message; otherwise, it returns an error message.

POST /CreateNewPassword
This endpoint allows users to reset their password using an OTP verification mechanism. It requires an email and a new password in the request body. If the email is found in the session and the new password is unique, the password is updated in the database.

Cron Job for OTP Cleanup
The application includes a cron job that runs every 10 minutes to delete expired OTPs (older than 30 minutes) from the database. This helps keep the OTP database clean and improves security.

## Usage

- To register a new user, send a POST request to the `/register` route with the user's email and password in the request body.
- To login, send a POST request to the `/login` route with the user's email and password in the request body. If the login is successful, a JWT will be returned in the response.
- To check if a user is authenticated, send a GET request to the `/CheckAuth` route with the JWT in the `Authorization` header.
## Password Reset

* The application includes a password reset mechanism using OTP (One-Time Password). To initiate the password reset process, send a POST request to the /emailverification endpoint with the user's email in the request body.

* The server will check if the email exists in the database. If the email is found, an OTP will be generated and associated with the email in the database. The OTP will also be stored in the session for verification.

* To verify the OTP, send a POST request to the /verifyOtp endpoint with the OTP in the request body.
  
* If the OTP is valid and has not expired (30 minutes by default), the server will respond with a message indicating that the OTP is valid. Otherwise, it will return an error message.

* Once the OTP is verified, the user can proceed to set a new password. Send a POST request to the /CreateNewPassword endpoint with the new password in the request body.
  
* The server will update the user's password in the database and respond with a message indicating that the password has been updated.

## NOTE:

=> choose no auth for the token validation instead of bearer token or jwt token in Authorization and enter the header "authorization" in the key field and enter the jwt token which  you want to enter to be in the value field -(if you want to test it in the Postman)

=> If you have problem in hashing the password , try putting your password inside the double or single quotes (in string format),I mean in your client side program or client side testing tool . It may have the possibility to solve the problem ✌️.But remember what kind of problem you are facing.

=> This prototype provides a basic implementation of JWT-based authentication using Express and MySQL. For production use, you should consider implementing additional security measures, such as using HTTPS, securely storing JWT secret keys, and implementing more robust error handling and validation.

=> Please keep in mind that this is a simplified educational prototype and may not be suitable for production use without further improvements and security considerations.

## Dependencies

This application uses the following dependencies:
- `express`: A web framework for Node.js.
- `mysql2`: A MySQL client for Node.js.
- `cors`: A middleware to enable CORS with various options.
- `jsonwebtoken`: An implementation of JSON Web Tokens.
- `bcryptjs`: A library to hash and check passwords.
- `session`: A session middleware for Express.
- `cookie-parser`: A middleware to parse cookies in Express.
- `otp-generator`: A library to generate OTPs (One-Time Passwords).
- `node-cron`: A library to schedule cron jobs.
