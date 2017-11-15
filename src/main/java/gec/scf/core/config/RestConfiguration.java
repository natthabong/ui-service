package gec.scf.core.config;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.security.KeyStore;
import java.security.SecureRandom;

import javax.annotation.PostConstruct;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfiguration {

	private Logger log = Logger.getLogger(RestConfiguration.class);

	@Value("${server.ssl.key-store}")
	private Resource keyStore;

	@Value("${server.ssl.key-store-Type}")
	private String keyStoreType;

	@Value("${server.ssl.key-store-password}")
	private String keyStorePassword;

	@PostConstruct
	private void init() {
		try {
			KeyStore clientStore = KeyStore.getInstance(keyStoreType);
			clientStore.load(keyStore.getInputStream(), keyStorePassword.toCharArray());

			KeyManagerFactory kmf = KeyManagerFactory
					.getInstance(KeyManagerFactory.getDefaultAlgorithm());
			kmf.init(clientStore, keyStorePassword.toCharArray());
			KeyManager[] kms = kmf.getKeyManagers();

			KeyStore trustStore = KeyStore.getInstance(keyStoreType);
			trustStore.load(keyStore.getInputStream(), keyStorePassword.toCharArray());

			TrustManagerFactory tmf = TrustManagerFactory
					.getInstance(TrustManagerFactory.getDefaultAlgorithm());
			tmf.init(trustStore);
			TrustManager[] tms = tmf.getTrustManagers();

			SSLContext sslContext = SSLContext.getInstance("TLS");
			sslContext.init(kms, tms, new SecureRandom());

			HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
		}
		catch (Exception e) {
			log.error(e.getMessage(), e);
		}

	}

	@Bean
	public RestTemplate restTemplate() {
		final SCFSimpleClientHttpRequestFactory factory = new SCFSimpleClientHttpRequestFactory(
				new HostnameVerifier() {

					public boolean verify(String hostname, SSLSession sslSession) {
						return true;
					}
				});
		return new RestTemplate(factory);
	}

	public class SCFSimpleClientHttpRequestFactory
			extends SimpleClientHttpRequestFactory {
		private final HostnameVerifier verifier;

		public SCFSimpleClientHttpRequestFactory(final HostnameVerifier verifier) {
			this.verifier = verifier;
		}

		@Override
		protected void prepareConnection(final HttpURLConnection connection,
				final String httpMethod) throws IOException {
			if (connection instanceof HttpsURLConnection) {
				((HttpsURLConnection) connection).setHostnameVerifier(verifier);
			}
			super.prepareConnection(connection, httpMethod);
		}
	}

}
