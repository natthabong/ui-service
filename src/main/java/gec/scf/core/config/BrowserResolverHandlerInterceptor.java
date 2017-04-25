package gec.scf.core.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import eu.bitwalker.useragentutils.UserAgent;
import eu.bitwalker.useragentutils.Version;
import gec.scf.security.domain.BrowserInfo;

public class BrowserResolverHandlerInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler) throws Exception {
		int majVersion;
		String userAgent = request.getHeader("user-agent");
		UserAgent ua = UserAgent.parseUserAgentString(userAgent);

		Version browserVersion = ua.getBrowserVersion();
		String browserName = ua.getBrowser().toString();
		if(browserVersion != null && browserName !=null){
			majVersion = Integer.parseInt(browserVersion.getMajorVersion());
		}else{
			majVersion = 0;
		}
		
		BrowserInfo browser = new BrowserInfo(browserName, majVersion);
		request.setAttribute("browserInfo", browser);
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler, ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
			Object handler, Exception ex) throws Exception {
		// TODO Auto-generated method stub

	}

}
