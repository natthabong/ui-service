package gec.scf.holiday.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping(path = "/holidays")
public class BankHolidayController {

	private static final String HOLIDAY = "holidays/index";

	@RequestMapping(method = RequestMethod.GET, path = "/")
	public String newduedateGroup(
			@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return HOLIDAY.concat(" :: content");
		}
		return HOLIDAY;
	}
}
