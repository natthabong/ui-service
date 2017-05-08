package gec.scf.monitor.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/system-integration-monitor")
public class SystemIntegrationMonitorController {

	private static final String SYSTEM_INTEGRATION_MONITOR = "monitor/system-integration-monitor";

	@RequestMapping(path = {"/sponsor", "/bank"}, method = RequestMethod.GET)
	public String systemIntegrationMonitor(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SYSTEM_INTEGRATION_MONITOR.concat(" :: content");
		}
		return SYSTEM_INTEGRATION_MONITOR;

	}
}