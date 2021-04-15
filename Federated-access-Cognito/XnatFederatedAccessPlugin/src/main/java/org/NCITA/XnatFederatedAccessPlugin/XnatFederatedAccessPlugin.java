/*
 * XnatFederatedAccessPlugin, XnatPlugin
 * Created by Chris Rookyard (NCITA and King's College London)
 */

package org.NCITA.XnatFederatedAccessPlugin;

import lombok.extern.slf4j.Slf4j;
import org.nrg.framework.annotations.XnatPlugin;
import org.springframework.context.annotation.ComponentScan;

@XnatPlugin(value = "XnatFederatedAccessPlugin", name = "XNAT Federated Access Plugin") // includes @configuration
@ComponentScan
@Slf4j
public class XnatFederatedAccessPlugin {
    public XnatFederatedAccessPlugin() {
        log.info("Creating the XnatFederatedAccessPlugin configuration class");
    }
}
