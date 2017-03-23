package gec.scf.transaction.web;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gec.scf.util.AjaxUtils;

@Controller
@RequestMapping("/list-transaction")
public class ListTransactionController {
	private static final String LIST_TRANSACTION = "list-transactions/list";

	@RequestMapping(method = RequestMethod.GET)
	public String listTransaction(
			@RequestHeader("X-Requested-With") String requestedWith) {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth.getAuthorities()
				.contains(new SimpleGrantedAuthority("VIEW_LOANS_OF_MY_ORGANIZE"))
				|| auth.getAuthorities()
						.contains(new SimpleGrantedAuthority("VIEW_ALL_LOANS"))
				|| auth.getAuthorities().contains(
						new SimpleGrantedAuthority("VIEW_LOANS_REFER_TO_MY_ORGANIZE"))) {
			if (AjaxUtils.isAjaxRequest(requestedWith)) {
				return LIST_TRANSACTION.concat(" :: content");
			}
			return LIST_TRANSACTION;
		}
		else {
			throw new AccessDeniedException("No Privileges");
		}

	}
}
