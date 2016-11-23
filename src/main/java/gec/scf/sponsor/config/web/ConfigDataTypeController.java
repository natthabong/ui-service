package gec.scf.sponsor.config.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(path = "/configs/layouts/file/data-types")
public class ConfigDataTypeController {

	private static String TEXT_FIELD = "/sponsor-configuration/file-layouts/dialog-text-field-format";
	private static String CUSTOMER_CODE_FIELD = "/sponsor-configuration/file-layouts/customer-code-group-field-format";
	private static String NEW_CUSTOMER_CODE = "/sponsor-configuration/file-layouts/new-customer-code-group";

	@RequestMapping(path = "/text", method = RequestMethod.GET)
	public String getTextFieldConfig() {
		return TEXT_FIELD;
	}

	@RequestMapping(path = "/customer-code", method = RequestMethod.GET)
	public String getCustomerCodeGroup() {
		return CUSTOMER_CODE_FIELD;
	}
	
	@RequestMapping(path = "/customer-code/new-customer-code", method = RequestMethod.GET)
	public String getNewCustomerCodeGroup() {
		return NEW_CUSTOMER_CODE;
	}
}
