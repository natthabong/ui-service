package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(path = "/configs/layouts/file/data-types")
public class ConfigDataTypeController {

	private static String TEXT_FIELD = "sponsor-configuration/file-layouts/dialog-text-field-format";
	private static String CUSTOMER_CODE_FIELD = "sponsor-configuration/file-layouts/dialog-customer-code-group-field-format";
	private static String NEW_CUSTOMER_CODE = "sponsor-configuration/file-layouts/dialog-new-customer-code-group";
	private static String DATE_TIME_FIELD = "sponsor-configuration/file-layouts/dialog-date-time-field-format";

	@RequestMapping(path = "/text", method = RequestMethod.GET)
	public String getTextFieldConfig() {
		return TEXT_FIELD;
	}

	@RequestMapping(path = "/customer-code", method = RequestMethod.GET)
	public String getCustomerCodeGroupFieldConfig() {
		return CUSTOMER_CODE_FIELD;
	}
	
	@RequestMapping(path = "/customer-code/new-customer-code", method = RequestMethod.GET)
	public String getNewCustomerCodeGroup() {
		return NEW_CUSTOMER_CODE;
	}
	
	@RequestMapping(path = "/date-time", method = RequestMethod.GET)
	public String getDateTimeFieldConfig() {
		return DATE_TIME_FIELD;
	}
}
