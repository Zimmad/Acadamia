# Project Name
This project is a Node.js application that provides APIs for creating, updating, deleting, and getting data related to bootcamps, courses, users, reviews, and more. It uses the following Node.js modules: express, mongoose, nodemon, config, helmet, dotenv, morgan, winston, and bcrypt. For backend purpose, MongoDB Atlas is used as the database.

## Installation
1. Clone the repository
2. Install dependencies using **npm install**
## Usage
1. Run the application using **npm start**
2. Access the APIs using a REST client such as Postman or Insomnia
## Configuration
This project uses the **config** module to manage configuration settings. Configuration files are stored in the config directory. You can create a **default.json** file to store default configuration settings and override them as needed in **development.json** and **production.json** files.

To connect to your own MongoDB database, update the **mongoURI** value in the **default.json** file.

## Logging
This project uses the **winston** module for logging. Log files are stored in the l**ogs** directory. The log level can be set in the **config/default.json** file.

## Security
This project uses the **helmet** module to set various HTTP headers for security purposes. It also uses the **bcrypt** module to hash and compare passwords.

## License
This project is licensed under the MIT License. See the **LICENSE** file for more information.
