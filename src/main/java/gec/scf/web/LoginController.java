package gec.scf.web;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.UriComponentsBuilder;

import gec.scf.core.config.BrowserInfo;
import gec.scf.core.config.RestTemplateProvider;
import gec.scf.core.provider.GECSCFServiceProvider;

@Controller
public class LoginController {

	private String LOGIN_VIEW_NAME = "login";
	private String UNSUPPORT_BROWSER_VIEW_NAME = "unsupport-browser";
	@Value(value = "${scf.ui.header.fixed:true}")
	private boolean fixedHeader;
	@Autowired
	GECSCFServiceProvider serviceProvider;

	@Autowired
	private RestTemplateProvider provider;

	private static final Logger log = Logger.getLogger(LoginController.class);

	public static boolean isAuthenticated() {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();

			return auth.isAuthenticated();
		}
		catch (Exception e) {
			return false;
		}
	}

	@RequestMapping(path = { "/login" }, method = RequestMethod.GET)
	public ModelAndView login(HttpServletRequest req, BrowserInfo browser,
			Principal principal) {

		Map<String, String[]> params = req.getParameterMap();
		String view = null;
		if (params.get("logout_at") != null && params.get("rf") != null) {
			String accessToken = params.get("logout_at")[0];
			String refreshToken = params.get("rf")[0];

			UriComponentsBuilder uriBuilder = serviceProvider
					.getServiceURIBuilder("/oauth/revoke-token");
			uriBuilder.queryParam("refreshToken", refreshToken);
			try {
				RestTemplate restTemplate = provider.getRestTemplate();
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.APPLICATION_JSON);
				headers.set("Authorization", "Bearer " + accessToken);

				HttpEntity<String> entity = new HttpEntity<String>(null, headers);
				ResponseEntity<String> response = restTemplate
						.postForEntity(uriBuilder.toUriString(), entity, String.class);
				log.info("Logout session success=> " + refreshToken + " response => "
						+ response);
			}
			catch (Exception e) {
				log.error(e.getMessage(), e);
			}

		}
		if (browser.getName().contains("CHROME") && (browser.getVersion() >= 53)) {
			view = LOGIN_VIEW_NAME;
		}
		else if (browser.getName().contains("IE") && (browser.getVersion() >= 11)) {
			view = LOGIN_VIEW_NAME;
		}
		else if (browser.getName().contains("FIREFOX") && (browser.getVersion() >= 45)) {
			view = LOGIN_VIEW_NAME;
		}
		else if (browser.getName().contains("EDGE")) {
			view = LOGIN_VIEW_NAME;
		}
		else {
			view = UNSUPPORT_BROWSER_VIEW_NAME;
		}

		Map<String, Object> object = new HashMap<String, Object>();
		object.put("fixedHeader", fixedHeader);
		object.put("browserName", browser.getName());
		object.put("browserVersion", browser.getVersion());

		return new ModelAndView(view, object);
	}

}
