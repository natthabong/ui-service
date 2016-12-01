package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(path = "/configs/displays/document/data-types")
public class ConfigDisplayDataTypeController {

	private static String TEXT_FIELD = "sponsor-configuration/document-displays/dialog-text-field-format";
	private static String DATE_TIME_FIELD = "sponsor-configuration/document-displays/dialog-date-time-field-format";
	private static String NUMERIC_FIELD = "sponsor-configuration/document-displays/dialog-numeric-field-format";

	@RequestMapping(path = "/text", method = RequestMethod.GET)
	public String getTextFieldConfig() {
		return TEXT_FIELD;
	}

	@RequestMapping(path = "/date-time", method = RequestMethod.GET)
	public String getDateTimeFieldConfig() {
		return DATE_TIME_FIELD;
	}

	@RequestMapping(path = "/numeric", method = RequestMethod.GET)
	public String getNumericFieldConfig() {
		return NUMERIC_FIELD;
	}
}
