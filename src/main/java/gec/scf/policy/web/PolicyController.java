package gec.scf.policy.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.common.base.CaseFormat;

import gec.scf.util.AjaxUtils;

@Controller
public class PolicyController {

	private static final String POLICY = "policy/policy";

	// @PreAuthorize("hasAuthority('SETUP_POLICY')")
	@RequestMapping(path = { "/policy" }, method = RequestMethod.GET)
	public String index(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return POLICY.concat(" :: content");
		}
		return POLICY;
	}

	@RequestMapping(path = {
			"/policy/{policyType}/{policyTopic}" }, method = RequestMethod.GET)
	public String setting(@RequestHeader("X-Requested-With") String requestedWith,
			@PathVariable("policyType") String policyType,
			@PathVariable("policyTopic") String policyTopic) {

		return "policy/" + policyType + "/"
				+ CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.LOWER_HYPHEN, policyTopic);
	}
}
