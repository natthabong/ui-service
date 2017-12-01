package gec.scf.remittance;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class RemittanceAdviceCustomerController {

	private static final String REMITTANCE_ADVICE_CUSTOMER = "remittance-advice/remittance-advice-customer";

	@RequestMapping(method = RequestMethod.GET, path = "/remittance-advice-customer")
	public String remittanceAdvice(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return REMITTANCE_ADVICE_CUSTOMER.concat(" :: content");
		}
		return REMITTANCE_ADVICE_CUSTOMER;
	}

}
