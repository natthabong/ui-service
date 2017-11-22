package gec.scf.remittance;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import gec.scf.core.config.RestTemplateProvider;
import gec.scf.core.provider.GECSCFServiceProvider;
import gec.scf.web.LoginController;

@Controller
public class RemittanceAdviceCustomerController {

	private static final String REMITTANCE_ADVICE_CUSTOMER = "remittance-advice/remittance-advice-customer";
	private static final String REMITTANCE_ADVICE_CUSTOMER_NO_BORROWER_TYPE = "remittance-advice/remittance-advice-customer-no-borrower-type";

	private static final Logger log = Logger.getLogger(LoginController.class);

	@Autowired
	GECSCFServiceProvider serviceProvider;

	@Autowired
	RestTemplateProvider templateProvider;

	@RequestMapping(method = RequestMethod.GET, path = "/remittance-advice-customer")
	public String remittanceAdvice(HttpServletRequest req) {
		String accessToken = req.getHeader("authorization");

		UriComponentsBuilder uriBuilder = serviceProvider.getServiceURIBuilder("/v1/organizes/my/borrower-types");

		try {
			RestTemplate restTemplate = templateProvider.getSynchRestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("Authorization", accessToken);
			headers.set("X-Requested-With", "XMLHttpRequest");

			HttpEntity<String[]> entity = new HttpEntity<String[]>(null, headers);

			@SuppressWarnings("unchecked")
			ResponseEntity<List<String>> future = restTemplate.exchange(uriBuilder.toUriString(), HttpMethod.GET,
					entity, (Class<List<String>>) new ArrayList<String>().getClass());

			List<String> borrowerTypeList = future.getBody();
			if (borrowerTypeList.size() > 0) {
				return REMITTANCE_ADVICE_CUSTOMER;
			} else {
				return REMITTANCE_ADVICE_CUSTOMER_NO_BORROWER_TYPE;
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return "";
		}
	}

}
