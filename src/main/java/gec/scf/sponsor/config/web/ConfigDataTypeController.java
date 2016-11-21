package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/configs/layouts/file/data-types")
public class ConfigDataTypeController {

	private static String TEXT_FIELD = "/sponsor-configuration/file-layouts/dialog-text-field-format";
	
	@RequestMapping(path = "/text", method = RequestMethod.GET)
	public String getProfile(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TEXT_FIELD.concat(" :: content");
		}
		return TEXT_FIELD;
	}
}
