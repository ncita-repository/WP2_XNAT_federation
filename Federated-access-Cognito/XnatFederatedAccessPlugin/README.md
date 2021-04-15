The job of this plugin is to process OAuth2 access tokens, and return an XNAT session.  This comprises three steps:

1. Verify the access token.
2. Identify the XNAT user presenting this token.
3. Create an XNAT session for that user.

Overall, this process, protecting resources based on access tokens, is the job of resource server.  In Spring security, a resource server is created with the annotation @EnableResourceServer, and it can be configured by creating a ResourceServerConfigurer class, which in turn has the method configure, with which one can use the ResourceServerSecurityConfigurer class.  In this project, the class ResourceServerConfig does this job.  

With a few methods, the ResourceServerSecurityConfigurer class allows one to configure how tokens are dealt with; in this project, this is done in the CustomTokenServices and CustomAccessTokenConverter classes.  This is step 1 above.

At this point, I think we would have an authentication object, from which we can get information about the user (the Cognito access tokens have a username field).  This is step 2 above. Both the LDAP and OpenID plugins have an example of how to link the user information from an access token to an XNAT user; this is yet to be done here.

The next part is step 3, and here, I had planned the class OAuth2UsernamePasswordToken to do this job.  However, I think the XNAT interface XnatAuthenticationProvider, which has a method createToken, will be more appropriate.  In fact, I think this XNAT class may be the most useful: a class could implement XnatAuthenticationProvider, and use the resource server class to process tokens and produce an authentication, and then create an XNAT username/password token. 
