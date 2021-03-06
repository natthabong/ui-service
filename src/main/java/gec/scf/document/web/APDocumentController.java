package gec.scf.document.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/ap-document-list")
public class APDocumentController {

	private static final String DOCUMENT_LIST = "document-list/ap-document";
	
	@RequestMapping(path = { "/my-organize", "/partner-organize",
			"/customer-organize" }, method = RequestMethod.GET)
	public String documentList(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DOCUMENT_LIST.concat(" :: content");
		}
		return DOCUMENT_LIST;
	}

}
