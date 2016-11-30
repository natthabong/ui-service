package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(path = "/configs/displays/document/data-types")
public class ConfigDisplayDataTypeController {

	private static String TEXT_FIELD = "sponsor-configuration/document-displays/dialog-text-field-format";

	@RequestMapping(path = "/text", method = RequestMethod.GET)
	public String getTextFieldConfig() {
		return TEXT_FIELD;
	}

}
