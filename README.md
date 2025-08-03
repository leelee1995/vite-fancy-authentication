Credits to [@burakorkmez](https://github.com/burakorkmez) for the course.

# DEMO
This is just for show and my own educational and practice purposes.

I've added a timer for unverified accounts (this timer will be displayed in unverified users' dashboard).

I've modified the main color theme.

Demo link: https://mern-fancy-authentication.onrender.com

FYI:

Mailtrap demo domain does not work due to limited mails and time. So you will encounter errors.

The app will, obviously, not send a verification email message to your email so you will never encounter a verification page... however you can navigate to that page "/verify-email" if you'd like to visit that page.

You can still sign up with a random email regarless of errors. **DO NOT sign up with any of your credentials or sensitive credentials because it will be stored in the MongoDB**

Again, this is just for show. If anyone wants to copy this project, you will need to encapsulate \<EmailVerificationPage /\> with \<RedirectAuthenticatedUser\> in the App.jsx.

# Environment variables

Here are the variables for your .env file (if you have created a .env file already) you will need to fill out in order for the app to fully function:

```
PORT=5000
MONGO_URI=yourMongoURI
JWT_SECRET=yourSecretKey
NODE_ENV=development
MAILTRAP_TOKEN=yourMailtrapToken
CLIENT_URL=http://localhost:5173
```
