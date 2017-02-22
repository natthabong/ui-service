package gec.scf.document.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path="/upload-document")
public class UploadDocumentController {
	private static String UPLOAD_DOCUMENT_URL = "upload-document/upload_document";
	
	@RequestMapping(method=RequestMethod.GET)
	public String uploadDocument(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return UPLOAD_DOCUMENT_URL.concat(" :: content");
		}
		return UPLOAD_DOCUMENT_URL;	
	}
	
	@RequestMapping(method=RequestMethod.GET, path="/bank")
	public String uploadDocumentBank(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return UPLOAD_DOCUMENT_URL.concat(" :: content");
		}
		return UPLOAD_DOCUMENT_URL;	
	}

}
