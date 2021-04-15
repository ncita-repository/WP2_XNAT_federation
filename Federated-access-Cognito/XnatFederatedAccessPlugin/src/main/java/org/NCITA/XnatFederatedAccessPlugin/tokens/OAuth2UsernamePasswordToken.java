/*
 * OAuth2UsernamePasswordToken, extension of AbstractXnatAuthenticationToken
 * Created by Chris Rookyard (NCITA and King's College London)
 */

package org.NCITA.XnatFederatedAccessPlugin.tokens;

import org.nrg.xft.security.UserI;
import org.nrg.xnat.security.tokens.AbstractXnatAuthenticationToken;

// This class extends AbstractXnatAuthenticationToken, which itself extends Spring's UsernamePasswordAuthenticationToken
// An Authentication implementation that is designed for simple presentation of a username and password.
public class OAuth2UsernamePasswordToken extends AbstractXnatAuthenticationToken {
    public OAuth2UsernamePasswordToken(final UserI details, final String providerId) {
        super(providerId, details, null, details.getAuthorities());
    }

    // in the method below, getPrincipal comes from Spring's UsernamePasswordAuthenticationToken
    public String toString() {
        return getPrincipal() + ": " + getProviderId();
    }

}
