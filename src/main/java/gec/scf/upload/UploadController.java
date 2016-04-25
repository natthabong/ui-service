package gec.scf.upload;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class UploadController {
	private String UPLOAD_DOCUMENT_URL = "upload/upload_document";
	private String UPLOAD_DOCUMENT_HISTORY = "upload/document_upload_history";
	
	//@PreAuthorize("isAuthenticated()")
	@RequestMapping(path={"/upload/doc"}, method = RequestMethod.GET)
	public String uploadDoc(HttpServletRequest req){
		String requestedWith = req.getHeader("X-Requested-With");
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return UPLOAD_DOCUMENT_URL.concat(" :: content");
		}
		return UPLOAD_DOCUMENT_URL;
	}
	//@PreAuthorize("isAuthenticated()")	
	@RequestMapping(path="/upload/doc/history", method = RequestMethod.GET)
	public String uploadDocHistory(HttpServletRequest req){
		String requestedWith = req.getHeader("X-Requested-With");
		if(AjaxUtils.isAjaxRequest(requestedWith)){
			return UPLOAD_DOCUMENT_HISTORY.concat(" :: content");
		}
		return UPLOAD_DOCUMENT_HISTORY;
	}
}
