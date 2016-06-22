package gec.scf;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class CorsFilter implements Filter {

	
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		HttpServletResponse response = (HttpServletResponse) res;
		HttpServletRequest request = (HttpServletRequest) req;
		response.setHeader("Server", "GECSCF Server");
//		response.setHeader("X-Frame-Options", "DENY");
		response.setHeader("X-XSS-Protection", "1; mode=block");
//		response.setHeader("X-Content-Type-Options", "nosniff");
//		response.setHeader("Content-Security-Policy", "default-src 'self'"); // Chrome 25+, Firefox 23+, safari 7+, ie Edge 12 build 10240+
		response.setHeader("X-Content-Security-Policy", "default-src 'self'"); //Firefox 4+, ie 10+ Limited
//		response.setHeader("X-Webkit-CSP", "default-src 'self'"); //Chrome 14+, safari 6+
		if (request.getMethod() != "OPTIONS") {
			chain.doFilter(req, res);
		} else {
		}
	}

	public void init(FilterConfig filterConfig) {
	}

	public void destroy() {
	}
}
