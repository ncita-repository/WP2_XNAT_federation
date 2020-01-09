# **AUTHENTICATION STRATEGIES REPORT**

### **Introduction**

*XNAT federation*

The XNAT federation we are aiming to create will require some form of authenticating users so that we can control access to the various instances of XNAT at NCITA institutions.  Ideally, and depending on individual XNAT project permissions, a user will be able to access any of the NCITA institution XNAT instances.  Furthermore, the user, once authenticated, should be able to access another XNAT instance without having to be re-authenticated.  The general framework of this process is presented in figure  1.  This general framework requires two main components: some means of checking if the user has been authenticated, and a means by which the user can be authenticated.
