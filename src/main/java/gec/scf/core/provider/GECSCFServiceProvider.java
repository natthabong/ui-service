package gec.scf.core.provider;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

@Configuration
public class GECSCFServiceProvider {

	@Value("${scf.services.api.host}")
	String host;

	@Value("${scf.services.api.port}")
	String port;

	@Value("${scf.services.api.scheme:https}")
	String scheme;

	@Value("${scf.services.api.context-path}")
	String contextPath;

	private static final Logger log = Logger.getLogger(GECSCFServiceProvider.class);

	public UriComponentsBuilder getServiceURIBuilder(String uri) {
		int port = 443;
		if (!StringUtils.isEmpty(this.port)) {
			try {
				port = Integer.valueOf(this.port);
			}
			catch (NumberFormatException ex) {
				log.warn("Can't convert port");
			}
		}
		return ServletUriComponentsBuilder.fromCurrentContextPath()
				.path(contextPath + "/" + uri).host(host).scheme(scheme).port(port);
	}
}
