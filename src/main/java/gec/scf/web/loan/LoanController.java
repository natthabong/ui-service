package gec.scf.web.loan;

import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.webflow.mvc.servlet.MvcExternalContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gec.scf.web.loan.domain.CreateLoanRequest;

@Controller
@RequestMapping("/loan")
public class LoanController {
	
	@Autowired
	private HttpSession session;

	@RequestMapping(path = "/create", method = RequestMethod.GET)
	public String createLoan() {
		return "loans/create";
	}

	@RequestMapping(path = "/create-validate", method = RequestMethod.GET)
	public String createValidateLoan() {
		return "loans/create-validate";
	}

	public CreateLoanRequest createLoanRequest() {
		System.out.println("Create new Loan Request");
		return new CreateLoanRequest();
	}

	public CreateLoanRequest verifyLoanRequest(CreateLoanRequest loanReq) {
		System.out.println(loanReq.getLoanAccountNo());
		System.out.println(loanReq.getLoanReqDate());
		System.out.println(loanReq.getDocumentNos().size());
		System.out.println("Verify LoanRequest");
		return loanReq;
	}

	public void confirmLoanCreate(CreateLoanRequest loanReq, MvcExternalContext mvcExternalContext)
			throws RestClientException, URISyntaxException {
		System.out.println(session.getId());
		RestTemplate resTemplate = new RestTemplate();

		ObjectMapper objMapper = new ObjectMapper();
		String loanRequestJson = null;
		try {
			loanRequestJson = objMapper.writeValueAsString(loanReq);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("x-auth-token", session.getId());
		HttpEntity<String> entity = new HttpEntity<String>(
				loanRequestJson.toString(), headers);

		URI uri = new URI("http://localhost:9002/loan-request/new");
		resTemplate.exchange(uri, HttpMethod.POST, entity, String.class);

	}
}
