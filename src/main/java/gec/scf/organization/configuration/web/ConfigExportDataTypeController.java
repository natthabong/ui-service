package gec.scf.organization.configuration.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(path = "/configs/exports/document/data-types")
public class ConfigExportDataTypeController {

	private static String SPECIFIC_TEXT_FIELD = "sponsor-configuration/export-payments/dialog-specific-text-field-format";
	private static String FILLER_FIELD = "sponsor-configuration/export-payments/dialog-filler-field-format";
	private static String SIGN_FLAG_FIELD = "sponsor-configuration/export-payments/dialog-sign-flag-field-format";
	private static String DATE_TIME_FIELD = "sponsor-configuration/export-payments/dialog-date-time-field-format";
	private static String PAYMENT_TYPE_FIELD = "sponsor-configuration/export-payments/dialog-payment-type-field-format";
	private static String NUMERIC_FIELD = "sponsor-configuration/export-payments/dialog-numeric-field-format";

	@RequestMapping(path = "/specific-text", method = RequestMethod.GET)
	public String getSpecificTextFieldConfig() {
		return SPECIFIC_TEXT_FIELD;
	}

	@RequestMapping(path = "/filler", method = RequestMethod.GET)
	public String getFillerFieldConfig() {
		return FILLER_FIELD;
	}

	@RequestMapping(path = "/sign-flag", method = RequestMethod.GET)
	public String getSignFlagFieldConfig() {
		return SIGN_FLAG_FIELD;
	}

	@RequestMapping(path = "/date-time", method = RequestMethod.GET)
	public String getDateTimeFieldConfig() {
		return DATE_TIME_FIELD;
	}

	@RequestMapping(path = "/payment-type", method = RequestMethod.GET)
	public String getPaymentTypeFieldConfig() {
		return PAYMENT_TYPE_FIELD;
	}

	@RequestMapping(path = "/numeric", method = RequestMethod.GET)
	public String getNumericFieldConfig() {
		return NUMERIC_FIELD;
	}

}
