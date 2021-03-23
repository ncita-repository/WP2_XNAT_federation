INSTRUCTIONS FOR USE:

1. Download node (https://nodejs.org/en/) and npm (https://www.npmjs.com/).
2. Alter file "db.json" to suit your purposes: enter master usernames and specific XNAT URLs, usernames, and passwords.
The default password in the db.json file is just "password", hashed, so you need not change this for testing.
3. Install nodemon globally:
```
npm install -g nodemon
```
4. Navigate to "xnat-federation-app" folder in terminal, and type:
```
npm install
```
5. Then navigate to "db" folder in terminal, and type:
```
npm install
```
6. Then start both the db server (on port 5000) from the "db" folder:
```
npm run json:server
````
7. In a new tab in the terminal, start the app server (on 3000):
```
npm run dev:server
```
8. Navigate to localhost:3000, and explore.
