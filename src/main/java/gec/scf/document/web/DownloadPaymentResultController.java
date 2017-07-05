package gec.scf.document.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
public class DownloadPaymentResultController {
	
	private static String DOWNLOAD_PAYMENT_RESULT_URL = "download-payment-result/download-payment-result"; 

	@RequestMapping(path = "/download-payment-result/supplier", method=RequestMethod.GET)
	public String downloadPaymentResult(@RequestHeader("X-Requested-With") String requestedWith){
		if (AjaxUtils.isAjaxRequest(requestedWith)) {
			return DOWNLOAD_PAYMENT_RESULT_URL.concat(" :: content");
		}
		return DOWNLOAD_PAYMENT_RESULT_URL;
	}
}
