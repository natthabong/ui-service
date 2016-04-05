package gec.scf.security.domain;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class UserRepositoryImpl implements UserRepository {

	private Logger log = Logger.getLogger(UserRepositoryImpl.class);

	@Override
	public User findByEmail(String loginName) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
		headers.set("X-Requested-With", "XMLHttpRequest");
		HttpClient httpClient = HttpClientBuilder.create().build();
		ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
		RestTemplate restTemplate = new RestTemplate(requestFactory);

		MultiValueMap<String, String> urlVariables = new LinkedMultiValueMap<String, String>();
		urlVariables.add("username", loginName);
		log.info("http://127.0.0.1:9002/api/users");
		User user = restTemplate.getForObject("http://127.0.0.1:9002/api/users", User.class, urlVariables);

		return user;
	}

}
