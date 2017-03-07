package gec.scf.log.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/activity-log")
public class ActivityLogController {

	private static final String ACTIVITY_LOG = "activity-log/log";

	@RequestMapping(path = { "/bank" }, method = RequestMethod.GET)
	public String activityLogs(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return ACTIVITY_LOG.concat(" :: content");
		}
		return ACTIVITY_LOG;
	}
}
