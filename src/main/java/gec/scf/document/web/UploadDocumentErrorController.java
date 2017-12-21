package gec.scf.document.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class UploadDocumentErrorController {
	
	private static final String UPLOAD_DOCUMENT_ERROR = "upload-document/upload-document-error";

	@RequestMapping(method = RequestMethod.GET, path = "/upload-document-error")
	public String remittanceAdvice(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return UPLOAD_DOCUMENT_ERROR.concat(" :: content");
		}
		return UPLOAD_DOCUMENT_ERROR;
	}

}
