## Generate ACCESS TOKEN secret
Run the following command in the terminal to generate a random string of 64 characters. Copy the string and paste it in the .env file as the value of ACCESS_TOKEN_SECRET.
Repeat for REFRESH_TOKEN_SECRET.
````bash
node 
require('crypto').randomBytes(64).toString('hex')
````