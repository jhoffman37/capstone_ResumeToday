# Resume Today Description

Resume Today is an online platform designed to simplify the resume-building process for job seekers. Our website offers customizable templates that allow users to showcase their skills and experience in the most effective way possible. Our expert tips and guidance are designed to help users highlight their achievements and make their resumes stand out to potential employers. We understand that job searching can be a stressful process, so our goal is to make creating a resume as easy and stress-free as possible. With Resume Today, job seekers can feel confident that they are presenting themselves in the best possible light to potential employers.

## Installation/Setup
This is a NodeJs/Express application

`npm install [...]` to get the dependencies listed.

`npm start` to deploy the web server

The project uses TypeScript instead of JavaScript. To compile the TypeScript files, run `tsc` in the root directory. or 
just run `npm start` to compile TS files and start the web server.

A .env file will be required to run the webserver. It should contain the following:
- Optional: PORT (defaults to 5163)
- DATABASE_URL (the url to the database)
- JWT_SECRET (the secret used to sign JWTs)
- JWT_EXPIRY (the expiry time for JWTs)
- Optional: SALT_ROUNDS (defaults to 10)

### Dependencies
- express
- dotenv
- pg
- typescript
- express-jwt
- bcryptjs
