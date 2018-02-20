package gec.scf.organization.configuration.web;

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
	private static String NUMERIC_FIELD = "sponsor-configuration/file-layouts/dialog-numeric-field-format";
	private static String DOCUMENT_TYPE_FIELD = "sponsor-configuration/file-layouts/dialog-document-type-field-format";
	private static String RECORD_TYPE = "sponsor-configuration/file-layouts/dialog-record-type-field-format";
	private static String FILLER = "sponsor-configuration/file-layouts/dialog-filler-field-format";
	private static String SIGN_FLAG = "sponsor-configuration/file-layouts/dialog-sign-flag-field-format";
	private static String DOCUMENT_NO_FIELD = "sponsor-configuration/file-layouts/dialog-document-no-field-format";

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

	@RequestMapping(path = "/numeric", method = RequestMethod.GET)
	public String getNumericFieldConfig() {
		return NUMERIC_FIELD;
	}

	@RequestMapping(path = "/document-type", method = RequestMethod.GET)
	public String getDocumentTypeFieldConfig() {
		return DOCUMENT_TYPE_FIELD;
	}

	@RequestMapping(path = "/record-type", method = RequestMethod.GET)
	public String getRecordTypeConfig() {
		return RECORD_TYPE;
	}

	@RequestMapping(path = "/filler", method = RequestMethod.GET)
	public String getFillerConfig() {
		return FILLER;
	}

	@RequestMapping(path = "/sign-flag", method = RequestMethod.GET)
	public String getSignFlagConfig() {
		return SIGN_FLAG;
	}

	@RequestMapping(path = "/document-no", method = RequestMethod.GET)
	public String getDocumentNoConfig() {
		return DOCUMENT_NO_FIELD;
	}

}
