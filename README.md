# Resume Today Description

Resume Today is an online platform designed to simplify the resume-building process for job seekers. Our website offers customizable templates that allow users to showcase their skills and experience in the most effective way possible. Our expert tips and guidance are designed to help users highlight their achievements and make their resumes stand out to potential employers. We understand that job searching can be a stressful process, so our goal is to make creating a resume as easy and stress-free as possible. With Resume Today, job seekers can feel confident that they are presenting themselves in the best possible light to potential employers.

## Installation/Setup
This is a NodeJs/Express application

`npm install [...]` to get the dependencies listed.

`npm start` to deploy the web server

The project uses TypeScript instead of JavaScript. To compile the TypeScript files, run `tsc` in the root directory, or 
just run `npm start` to compile TS files and start the web server.

A .env file will be required to run the webserver. It should contain the following:
- Optional: PORT (defaults to 5163)
- Required: DATABASE_URL (the url to the database)
- Required: JWT_SECRET (the secret used to sign JWTs)
- Optional: JWT_EXPIRES_IN (the expiry time for JWTs) (defaults to 1h)
- Optional: BCRYPT_SALT_ROUNDS (the amount of rounds for salt generation for password hashing) (defaults to 10)

## Testing
To run the tests, run `npm test` in the root directory. This will run the tests and generate a coverage report in the
terminal after it's done. The tests currently just test all the routes and some of the database functions to ensure that 
the site is functional.

## How to use
The website will be hosted here at: https://resume-today.onrender.com/. 
This will be the official website for the project. To use, simply go to the website and sign up for an account. Once there 
click on the `New Resume` button to start the process. Once you fill out the form information, you will be shown the 
preview of your resume. If you are satisfied with your resume then you can click the `Donwload PDF` to download it or use 
the `Share` button to show it to others. Other links on the Nav Bar are there for viewing info about how to build a good
resume or for contacting the developers. You can also fork the project and run it locally if you wish by following the
installation/setup guide above.

### Dependencies
- express
- dotenv
- pg
- typescript
- express-jwt
- bcryptjs
- cookie-parser
- jsdom
- html-pdf-node
- jasmine
- showdown

