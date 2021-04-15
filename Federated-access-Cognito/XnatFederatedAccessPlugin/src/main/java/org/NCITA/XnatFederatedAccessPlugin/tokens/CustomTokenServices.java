/*
 * CustomTokenConverter, configuration of access token processing
 * Created by Chris Rookyard (NCITA and King's College London)
 */

package org.NCITA.XnatFederatedAccessPlugin.tokens;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

import java.io.IOException;

@Configuration
public class CustomTokenServices {

    // get a custom access token converter here
    // (used below for accessTokenConverter, and from class CustomAccessTokenConverter)
    @Autowired
    CustomAccessTokenConverter customAccessTokenConverter;

    // set up default token service to use token store defined above
    @Bean
    public DefaultTokenServices tokenServices() {
        final DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore());
        return defaultTokenServices;
    }

    // set up the token store, to use the custom JWT converter/validator
    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    // set up the custom JWT access token converter
    // uses the autowired dependency defined at the top of this class
    // I will need to create a customAccessTokenConverter class
    // and in that class, I should work out how it will decode and verify tokens,
    // how it will load resources (see my resource server code that was written with newer spring),
    // and how it will link to the XNAT class AbstractXnatAuthenticationToken
    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        final JwtAccessTokenConverter converter = new JwtAccessTokenConverter();

        // set verifying key from file
        // TODO: there are two public keys available from AWS Cognito - how to deal with this?
        final Resource resource = new ClassPathResource("public.txt");
        String publicKey = null;
        try {
            publicKey = IOUtils.toString(resource.getInputStream());
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
        converter.setVerifierKey(publicKey);

        // access token converter that returns authentication object
        converter.setAccessTokenConverter(customAccessTokenConverter);

        return converter;
    }
}
