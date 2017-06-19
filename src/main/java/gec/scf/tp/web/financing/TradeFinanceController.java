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
	
	@RequestMapping(method = RequestMethod.GET, path = "/config")
	public String configTradeFinance(@RequestHeader("X-Requested-With") String requestedWith) {

		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return CONFIG_TRADE_FINANCE.concat(" :: content");
		}

		return CONFIG_TRADE_FINANCE;
	}
}
