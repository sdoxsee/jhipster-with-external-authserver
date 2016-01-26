A "proof-of-concept" using a ui gateway (with jhipster front end) that delegates its authentication/authorization to a separate authserver. This is based on a jhipster project and https://github.com/spring-guides/tut-spring-security-and-angular-js/tree/master/oauth2. 

# Starting the services
* Start each submodule by cd'ing into their respective directories and running "mvn spring-boot:run"
* Sign in with "user/password" -> ROLE_USER + ROLE_ADMIN

#Notes
* "resource" is not necessary at this time but in theory could still allow or deny requests to resources based on the access_token that the gateway places in the http Authorization header. 
* To logout for now, you'll need to go to the authserver (localhost:9999/uaa/login) and clear the cookies from the browser. More discussion is needed on this.
* There is no backend database and the normal jhipster api endpoints don't exist at the moment...so many "normal" functions won't work
* "User Management" is likely something that will need to be removed or moved to the authserver.
* Remembering previous requested state is still not working. I'm trying to remember it in localStorage since the rootScope gets lost during the redirection to the authserver.
