package gec.scf.tp.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller

public class TradingPartnerController {
	private static final String BUYER_CREDIT_INFORMATION = "buyer-credit-information/buyer-credit-information";
	private static final String SUPPLIER_CREDIT_INFORMATION = "supplier-credit-information/supplier-credit-information";
	private static final String TRADING_PARTNER = "trading-partner/trading-partners";
	private static final String TRADING_PARTNER_MGNT = "trading-partner/new";

	@RequestMapping(method = RequestMethod.GET, path = "/supplier-credit-information")
	public String supplierCreditInformation(
			@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return SUPPLIER_CREDIT_INFORMATION.concat(" :: content");
		}
		return SUPPLIER_CREDIT_INFORMATION;

	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/buyer-credit-information")
	public String buyerCreditInformation(
			@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return BUYER_CREDIT_INFORMATION.concat(" :: content");
		}
		return BUYER_CREDIT_INFORMATION;

	}

	@RequestMapping(method = RequestMethod.GET, path = "/trading-partners")
	public String tradingPartner(
			@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TRADING_PARTNER.concat(" :: content");
		}
		return TRADING_PARTNER;

	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/trading-partners/new")
	public String tradingPartnerMgnt(@RequestHeader("X-Requested-With") String requestedWith) {
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return TRADING_PARTNER_MGNT.concat(" :: content");
		}
		return TRADING_PARTNER_MGNT;
	}
}
