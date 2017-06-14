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

	private static final String WEB_SERVICE_MONITOR = "monitor/web-service-monitor";
	private static final String BATCH_JOB_MONITOR = "monitor/batch-job-monitor";
	private static final String FTP_MONITOR = "monitor/ftp-monitor";

	private static final String GEC_SYSTEM_INTEGRATION_MONITOR_TEMPLATE = "monitor/gec-system-integration-monitor-template";


	@RequestMapping(path = {"/web-service-monitor"}, method = RequestMethod.GET)
	public String webServiceMonitor(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return WEB_SERVICE_MONITOR.concat(" :: content");
		}
		return WEB_SERVICE_MONITOR;
	}

	@RequestMapping(path = {"/batch-job-monitor"}, method = RequestMethod.GET)
	public String batchJobMonitor(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return BATCH_JOB_MONITOR.concat(" :: content");
		}
		return BATCH_JOB_MONITOR;
	}

	@RequestMapping(path = {"/ftp-monitor"}, method = RequestMethod.GET)
	public String ftpMonitor(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return FTP_MONITOR.concat(" :: content");
		}
		return FTP_MONITOR;
	}


	@RequestMapping(path = {"/sponsor", "/bank"}, method = RequestMethod.GET)
	public String systemIntegrationMonitor(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SYSTEM_INTEGRATION_MONITOR.concat(" :: content");
		}
		return SYSTEM_INTEGRATION_MONITOR;

	}

	@RequestMapping(path = {"/gec"}, method = RequestMethod.GET)
	public String gecSystemIntegrationMonitor(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return GEC_SYSTEM_INTEGRATION_MONITOR_TEMPLATE.concat(" :: content");
		}
		return GEC_SYSTEM_INTEGRATION_MONITOR_TEMPLATE;

	}
}