package gec.scf.remittance;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class RemittanceAdviceBankController {
	
	private static final String REMITTANCE_ADVICE = "remittance-advice/remittance-advice";
	
	@RequestMapping(method = RequestMethod.GET, path = "/remittance-advice-bank")
	public String remittanceAdvice(
			@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return REMITTANCE_ADVICE.concat(" :: content");
		}
		return REMITTANCE_ADVICE;

	}
}
