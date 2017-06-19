package gec.scf.tp.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller

public class TradingPartnerController {
	private static final String SUPPLIER_CREDIT_INFORMATION = "supplier-credit-information/supplier-credit-information";
	private static final String TRADING_PARTNER = "trading-partner/trading-partners";

	@RequestMapping(method = RequestMethod.GET, path = "/supplier-credit-information")
	public String supplierCreditInformation(
			@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SUPPLIER_CREDIT_INFORMATION.concat(" :: content");
		}
		return SUPPLIER_CREDIT_INFORMATION;

	}

	@RequestMapping(method = RequestMethod.GET, path = "/trading-partners")
	public String tradingPartner(
			@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TRADING_PARTNER.concat(" :: content");
		}
		return TRADING_PARTNER;

	}
}
