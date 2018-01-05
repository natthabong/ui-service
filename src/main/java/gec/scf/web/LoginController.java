package gec.scf.web;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.AsyncRestTemplate;
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
	
	@Value(value = "${scf.application.id:004}")
	private String applicationId;
	
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
			final String refreshToken = params.get("rf")[0];

			UriComponentsBuilder uriBuilder = serviceProvider
					.getServiceURIBuilder("/oauth/revoke-token");
			uriBuilder.queryParam("refreshToken", refreshToken);
			try {
				AsyncRestTemplate restTemplate = provider.getRestTemplate();
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.APPLICATION_JSON);
				headers.set("Authorization", "Bearer " + accessToken);

				HttpEntity<String> entity = new HttpEntity<String>(null, headers);

				ListenableFuture<ResponseEntity<String>> future = restTemplate
						.postForEntity(uriBuilder.toUriString(), entity, String.class);
				future.addCallback(
						new ListenableFutureCallback<ResponseEntity<String>>() {

							@Override
							public void onSuccess(ResponseEntity<String> result) {
								log.info("Logout session success=>  " + result.getBody());

							}

							@Override
							public void onFailure(Throwable ex) {
								log.error(ex.getMessage(), ex);

							}
						});

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

		String funding = req.getHeader("X-Funding");
		Map<String, Object> object = new HashMap<String, Object>();
		object.put("fixedHeader", fixedHeader);
		object.put("browserName", browser.getName());
		object.put("browserVersion", browser.getVersion());
		object.put("funding", Optional.ofNullable(funding).orElse(applicationId));

		return new ModelAndView(view, object);
	}

}
