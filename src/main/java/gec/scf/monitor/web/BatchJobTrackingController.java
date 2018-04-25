package gec.scf.monitor.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class BatchJobTrackingController {

	private static final String BATCH_JOB_TRACKING = "monitor/batch-job-tracking";
	private static final String VIEW_BATCH_JOB_TRACKING_DETAIL = "monitor/view-batch-job-tracking-detail";

	@RequestMapping(path = {"/batch-job-tracking"}, method = RequestMethod.GET)
	public String transactionTracking(@RequestHeader("X-Requested-With") String requestedWith) {
					
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return BATCH_JOB_TRACKING.concat(" :: content");
		}
		return BATCH_JOB_TRACKING;

	}
	
	@RequestMapping(path = {"/view-batch-job-tracking-detail"}, method = RequestMethod.GET)
	public String viewBatchJobTrackingDetail(@RequestHeader("X-Requested-With") String requestedWith) {
					
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_BATCH_JOB_TRACKING_DETAIL.concat(" :: content");
		}
		return VIEW_BATCH_JOB_TRACKING_DETAIL;

	}
}
