package gec.scf.tp.web.financing;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/trade-finance")
public class TradeFinanceController {
	private static final String CONFIG_TRADE_FINANCE = "trading-partner/financing/config-trade-finance";
	private static final String NEW_TRADE_FINANCE = "trading-partner/financing/trade-finance";
	private static final String EDIT_TRADE_FINANCE = "trading-partner/financing/trade-finance";
	private static final String VIEW_TRADE_FINANCE = "trading-partner/financing/trade-finance";
	
	@RequestMapping(method = RequestMethod.GET, path = "/config")
	public String configTradeFinance(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CONFIG_TRADE_FINANCE.concat(" :: content");
		}

		return CONFIG_TRADE_FINANCE;
	}

	@RequestMapping(method = RequestMethod.GET, path = "/new")
	public String newTradeFinance(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return NEW_TRADE_FINANCE.concat(" :: content");
		}

		return NEW_TRADE_FINANCE;
	}

	@RequestMapping(method = RequestMethod.GET, path = "/edit")
	public String editTradeFinance(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return EDIT_TRADE_FINANCE.concat(" :: content");
		}

		return EDIT_TRADE_FINANCE;
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/view")
	public String viewTradeFinance(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return VIEW_TRADE_FINANCE.concat(" :: content");
		}

		return VIEW_TRADE_FINANCE;
	}
}
