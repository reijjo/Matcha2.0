<img src='https://github.com/reijjo/Matcha2.0/assets/95418273/06bbba41-e347-4058-b01a-9566e11dbb18' />
with TypeScript

# About:
* Matcha is a dating app like Tinder but better.
* There is 500 fake profiles you to browse.
  * Profiles are done with Mockaroo.com that makes profiles in a .csv file and then added to database.

## What I used
* TypeScript
* React
* Node.js with Express.js
* Docker
* PostgreSQL
* pgAdmin
* Socket.io for notifications and chat
* OpenCage API and IPAPI to get locations
* JSON Web Token for authentication

# Features:
## Registration / Login / Profile
* Two-step registration with email verification
* Profile page for every user
* Possibility to change your information on settings page
* Upload images
* On your profile page, you can see the profiles you visited and the users who visited your profile

  GIFFIA TAHAN

## Match making
* Match or pass
* Lots of sortin and filtering options
* Live notifications when someone looks your profile / likes you / sends you a message
* Live chat

  GIFFIA TAHAN

## How to run
* in the projects root folder ```docker-compose up```
* frontend => ```localhost:3000```
* backend => ```localhost:3001```
* pgAdmin => ```localhost:8080```

### Todo:
* pictures overflowing on settings
* at least some security
* more sockets
* last message on chat
* mobile for chat
* filter for feed
* .envfile stuff
