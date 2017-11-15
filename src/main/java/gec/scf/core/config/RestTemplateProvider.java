package gec.scf.core.config;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

@Component
public class RestTemplateProvider {

	public RestTemplate getRestTemplate() {
		return getRestTemplate(null);
	}

	public RestTemplate getRestTemplate(ResponseErrorHandler responseErrorHandler) {
		SimpleClientHttpRequestFactory requestFactory = new SCFSimpleClientHttpRequestFactory(
				new HostnameVerifier() {

					public boolean verify(String hostname, SSLSession sslSession) {
						return true;
					}
				});
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		if (responseErrorHandler != null) {
			restTemplate.setErrorHandler(responseErrorHandler);
		}
		return restTemplate;

	}

}
