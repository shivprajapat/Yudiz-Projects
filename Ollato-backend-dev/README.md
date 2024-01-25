# Ollato Backend
> This project provide student examp in Rest API for Admin Panel as well as Users App.

## Requirements  (Prerequisites)
Tools and packages required to successfully install this project.

* Nodejs - 16.13.1 LTS [Install](https://nodejs.org/en/download/)
* NPM - 8.1.2
* Sequelize [Install](https://sequelize.org/)

## Cloning Project
`Clone with HTTPS: `
```sh
git clone https://gitlab.com/yudiz_web_dev/ollato-backend.git
```
or 
`Clone with SSH: `
```sh
git@gitlab.com:yudiz_web_dev/ollato-backend.git
```

## Installation and Setup
A step by step list of commands / guide that informs how to install an instance of this project. 

```sh
cd ./ollato-backend

npm install
```

## Run Project
Now you're done with setup and install please run your project using this command.

In Development Environment
```sh
npm run dev
```

In Production Environment
```sh
npm run start
```

## Folder Structure
This Project follows four main directories

### config
- In this folder all configuration related to this project goes here.
For e.g.- 
  - config.js -> sequelize configuration
  - Etc....

### databases
- In this folder all databases related setup for this project goes here.
For e.g.- 
  - sequelize.js -> sequelize connection establishment
  - Etc....

### helper
- In this folder all reusable and frequently used functions and services for this project goes here according to different file.
For e.g.- 
  - Same for others....

### lang
- In this folder all messages that we send back as response for this project goes here according to different folder.
For e.g.- 
  - en/general.js -> all statements of response goes here
  - en/words.js -> all statement's words of response goes here
  - Same for others....

### middlewares
- In this folder all middleware function and routes defined in this project goes here according to different folder.
For e.g.- 
  - routes.js -> all routes for this project goes here
  - middleware.js -> all middleware functions goes here

### migrations
- In this folder all migrations related to sequelize for this project goes here according to different folder.
For e.g.- 
  - new file that you generated to update particular table will generate inside this folder

### models
- In this folder sql related configuration and connection establishment for this project goes here.

### models-routes-services
- In this folder all module's models, routes and it's services for this project goes here according to different folder.

### services
- In this folder all mail related services for this project goes here.


## To Generate and Run Migration for MySQL
* To generate new migrations for passbooks table
```sh
sequelize migration:create --name add_fields_in_passbooks
``` 

Now, see new file added inside migration folder, add your code inside new generated file named add_fields_in_passbooks according your need

* To run this migration execute this command
```sh
sequelize db:migrate
```

## To Generate and Run Seeder for MySQL
* To generate new seeder for demo-user table
```sh
sequelize seed:generate --name demo-user
``` 

Now, see new file added inside seeders folder, add your code inside new generated file named demo-user according your need

* To run this seeder execute this command
```sh
sequelize db:seed:all
```

## Running the tests
Describe and show how to run the test cases for particular module.
- Add you test cases inside models-routes-services according to your module and make sure your test case file should have named postfix as filename.test.js .
- Then, import this file's path to main test.test.js file.

- To run your test cases simply run this command:
```sh
npm run test
```

## Deployment Notes
Explain how to deploy your project on a live server. To do so include step by step guide will explained in this documentation. 
[While Going Live Docs.](https://docs.google.com/document/d/1rYWbUOfYjYkkCwEM35R65rDFwyy6jLQKQwhcYrMo2mA/edit?usp=sharing)


## POSTMAN Collection Links:

For Admin:
- 

For User:
- 


## Authors
Who have contributed in this project.

* Gordhan Chauhan (TL) - gordhan.c@yudiz.in
* Parth Panchal(D)  – parth.panchal@yudiz.com
* Zarna Patel(D)  – zarna.p@yudiz.in