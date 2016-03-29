package gec.scf.web;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gec.scf.domain.Menu;

@RestController
@RequestMapping("/menus")
public class MenuController {

	@RequestMapping("/me")
	public Collection<Menu> getMyMenus() {
		Set<Menu> menus = new HashSet<Menu>();
		Menu loan = new Menu();
		loan.setMenuId("loan");
		loan.setIcon("fa-usd");

		Menu cr_loan = new Menu();
		cr_loan.setMenuId("loan-create");
		cr_loan.setParent(loan);
		loan.add(cr_loan);
		menus.add(loan);
		return menus;

	}
}
