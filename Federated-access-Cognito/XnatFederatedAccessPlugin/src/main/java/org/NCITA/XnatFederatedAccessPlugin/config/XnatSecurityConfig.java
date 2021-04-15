/*
 * XnatSecurityConfig, implementation of XnatSecurityExtension
 * Created by Chris Rookyard (NCITA and King's College London)
 */

package org.NCITA.XnatFederatedAccessPlugin.config;

import org.nrg.xnat.security.XnatSecurityExtension;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.stereotype.Component;

@Component
public class XnatSecurityConfig implements XnatSecurityExtension {

    private static String authId = "OAuth2 resource server";
    private HttpSecurity http;

    // a method from XnatSecurityExtension
    public String getAuthMethod() {
        return authId;
    }

    // a method from XnatSecurityExtension
    // and accessible as a resource server
    public void configure(final HttpSecurity http) throws Exception {
        this.http = http;
    }

    // a method from XnatSecurityExtension
    public void configure(final AuthenticationManagerBuilder builder) throws Exception {
    }
}
