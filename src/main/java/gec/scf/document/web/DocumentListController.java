package gec.scf.document.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path="/document-list")
public class DocumentListController {

	private static final String DOCUMENT_LIST = "document-list/document";
	
	@RequestMapping(path="/sponsor", method = RequestMethod.GET)
	public String documentListSponsor(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DOCUMENT_LIST.concat(" :: content");
		}
		return DOCUMENT_LIST;
	}
	
	@RequestMapping(path="/supplier", method = RequestMethod.GET)
	public String documentListSupplier(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DOCUMENT_LIST.concat(" :: content");
		}
		return DOCUMENT_LIST;
	}
	
	@RequestMapping(path="/bank", method = RequestMethod.GET)
	public String documentListBank(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DOCUMENT_LIST.concat(" :: content");
		}
		return DOCUMENT_LIST;
	}
}
