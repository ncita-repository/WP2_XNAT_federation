This app provides federated access to multiple XNAT instances.  

Our federated access web app will have to have, in some form, a list of users, a list of XNAT instances, and some link between the users and XNAT instances to indicate which instances any given user has access to. Also, assuming standard XNAT authentication, we will have to know user credentials for each XNAT.

The simplest federated access process should run as follows:
1. User navigates to this app, and enters their federation credentials.
2. These credentials are verified.
3. Upon verification, the user is presented with their XNAT instances.
4. Once an XNAT is chosen, a session is created with them with that XNAT, and they are redirected to it.  

This app uses passport-local for authentication of users, and currently, I have just made a database of users manually, in the form of a JavaScript array in users.js. This stores the user's federation credentials and the XNAT instances to which they have access; another array, in user-xnats.js, stores specific credentials for those XNATs.  There is also a database of XNAT instances, in xnats.js. Note, I have changed these to just one entry, but I have checked that they work with more than one entry with extra dummy ones.

In testing, I use a local vagrant XNAT, and create users to correspond to entries in the aforementioned lists of users. If you want to try running this, you should do the same.

Currently, the app does not work fully. At the point the user chooses an XNAT, the sever attempts to create a session with that XNAT instance. See server.js, starting from line 137.  I can get a session with a given XNAT; I have checked using curl that the user has an active session after selecting an XNAT instance. I can pass the JSESSIONID string to the user's browser, but my problem, then, is how to send the user to their chosen XNAT, whilst associating them with that session.
