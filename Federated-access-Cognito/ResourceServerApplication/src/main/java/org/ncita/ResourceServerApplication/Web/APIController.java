package org.ncita.ResourceServerApplication.Web;

import org.ncita.ResourceServerApplication.Model.Message;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
Handles requests to "/api" endpoints
See the SecurityConfig class for configuration of protection for private endpoint
*/
@RestController
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)

// For simplicity of this sample, allow all origins
// In production, should configure CORS
@CrossOrigin(origins = "*")
public class APIController {

    // public endpoint; no authentication required
    @GetMapping(value = "/public")
    public Message publicEndpoint() {
        return new Message("This endpoint, /api/public, does not require authentication.");
    }

    // private endpoint, requiring authentication via an access token
    @GetMapping(value = "/private")
    public Message privateEndpoint() {
        return new Message("This endpoint, /api/private, requires authentication; you are authenticated.");
    }

}
