package gec.scf.memu.domain;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class MenuRepositoryImpl implements MenuRepository {

	@Autowired
	RestTemplate restTemplate;
	private Logger log = Logger.getLogger(MenuRepositoryImpl.class);

	@Override
	public Collection<Menu> findAllMenuFor(org.springframework.security.core.userdetails.User user) {
		Collection<Menu> menus = null;
		URI urlGETList = null;
		try {
			Map<String, String> urlVariables = new HashMap<String, String>();
			urlVariables.put("username", user.getUsername());
			urlGETList = new URI("http://127.0.0.1:8000/api/menus");
			ResponseEntity<Menu[]> responseEntity = restTemplate.getForEntity(urlGETList, Menu[].class);
			Menu[] results = responseEntity.getBody();
			menus = Arrays.asList(results);
		} catch (URISyntaxException e) {
			log.error(e.getMessage(), e);
		}

		return menus;
	}

}
