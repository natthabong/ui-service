package gec.scf.core.config;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.AsyncListenableTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.ResponseErrorHandler;

@Component
public class RestTemplateProvider {

	@Autowired
	AsyncListenableTaskExecutor asyncListenableTaskExecutor;

	public AsyncRestTemplate getRestTemplate() {
		return getRestTemplate(null);
	}

	public AsyncRestTemplate getRestTemplate(ResponseErrorHandler responseErrorHandler) {
		SCFSimpleClientHttpRequestFactory requestFactory = new SCFSimpleClientHttpRequestFactory(
				new HostnameVerifier() {

					public boolean verify(String hostname, SSLSession sslSession) {
						return true;
					}
				});
		requestFactory.setTaskExecutor(asyncListenableTaskExecutor);

		AsyncRestTemplate restTemplate = new AsyncRestTemplate(requestFactory);
		if (responseErrorHandler != null) {
			restTemplate.setErrorHandler(responseErrorHandler);
		}
		return restTemplate;

	}

}
