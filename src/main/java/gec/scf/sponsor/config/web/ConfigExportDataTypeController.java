package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(path = "/configs/exports/document/data-types")
public class ConfigExportDataTypeController {

	private static String SPECIFIC_TEXT_FIELD = "sponsor-configuration/export-payments/dialog-specific-text-field-format";
	private static String FILLER_FIELD = "sponsor-configuration/export-payments/dialog-filler-field-format";

	@RequestMapping(path = "/specific-text", method = RequestMethod.GET)
	public String getSpecificTextFieldConfig() {
		return SPECIFIC_TEXT_FIELD;
	}

	@RequestMapping(path = "/filler", method = RequestMethod.GET)
	public String getFillerFieldConfig() {
		return FILLER_FIELD;
	}
}
