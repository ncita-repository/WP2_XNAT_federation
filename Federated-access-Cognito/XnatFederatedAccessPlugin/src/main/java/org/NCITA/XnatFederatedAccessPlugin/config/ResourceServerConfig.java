/*
 * ResourceServerConfig, extension of ResourceServerConfigurerAdapter
 * Created by Chris Rookyard (NCITA and King's College London)
 */

package org.NCITA.XnatFederatedAccessPlugin.config;

import org.NCITA.XnatFederatedAccessPlugin.tokens.CustomTokenServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

@Configuration // includes component scanning
@EnableResourceServer // for enabling a Spring Security filter that authenticates requests via an incoming OAuth2 token
@EnableWebSecurity // for extending the WebSecurityConfigurerAdapter base class
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    // make reference to CustomTokenServices here to use in the resource server config, below
    @Autowired
    CustomTokenServices customTokenServices;

    // sets up the resource server to use the token services linked above
    @Override
    public void configure(final ResourceServerSecurityConfigurer config) {
        config.tokenServices(customTokenServices.tokenServices());
    }
}
