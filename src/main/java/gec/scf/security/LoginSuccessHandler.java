package gec.scf.security;

import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Service;


@Service
public class LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {
		User user = (User) authentication.getPrincipal();
		String windowName = user.getUsername() + new Date().getTime();
		HttpSession session = request.getSession();
		session.setAttribute("windowName", windowName);
		session.setAttribute("windowNameToSet", windowName);
		super.onAuthenticationSuccess(request, response, authentication);
	}
}
