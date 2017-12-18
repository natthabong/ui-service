package gec.scf.organize.configuration;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(path = "/sponsor-configuration")
public class ProductTypeController {

	private static final String SETTING = "sponsor-configuration/product-types/settings";

	@RequestMapping(path = "/product-types-setup", method = RequestMethod.GET)
	public String getProductTypeSetup() {
		return SETTING;
	}
}
