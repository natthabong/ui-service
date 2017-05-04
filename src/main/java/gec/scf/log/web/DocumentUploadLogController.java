package gec.scf.log.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/document-upload-log")
public class DocumentUploadLogController {

	private static final String VIEW_DOCUMENT_UPLOAD_LOG = "document-upload-log/view_log";

	@RequestMapping(path = "/view-log", method = RequestMethod.GET)
	public String viewDocumentUploadLogs(
			@RequestHeader("X-Requested-With") String requestedWith, Model model) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_DOCUMENT_UPLOAD_LOG.concat(" :: content");
		}
		return VIEW_DOCUMENT_UPLOAD_LOG;
	}
}
