package gec.scf.security;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

import gec.scf.memu.domain.Menu;
import gec.scf.memu.domain.MenuRepository;

@Service
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
	private static final String HOME_URL = "/home";

	@Autowired
	MenuRepository menuRepository;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {
		User user = (User) authentication.getPrincipal();
		String windowName = user.getUsername() + new Date().getTime();
		HttpSession session = request.getSession();
		session.setAttribute("windowName", windowName);
		session.setAttribute("windowNameToSet", windowName);
		session.setAttribute("menus", getUserMenu(user));

		redirectStrategy.sendRedirect(request, response, HOME_URL);
	}

	public RedirectStrategy getRedirectStrategy() {
		return redirectStrategy;
	}

	public void setRedirectStrategy(RedirectStrategy redirectStrategy) {
		this.redirectStrategy = redirectStrategy;
	}

	public Collection<Menu> getUserMenu(User user) {

		return menuRepository.findAllMenuFor(user);
	}
}
