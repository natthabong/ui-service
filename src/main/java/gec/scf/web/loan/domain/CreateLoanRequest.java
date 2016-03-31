package gec.scf.web.loan.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;

public class CreateLoanRequest implements Serializable{
	
	private static final long serialVersionUID = 1L;
	private String sponsorId;
	private String loanReqDate;
	private String instrumentType;
	private String loanAccountNo;
	private List<String> documentNos;

	public String getSponsorId() {
		return sponsorId;
	}

	public void setSponsorId(String sponsorId) {
		this.sponsorId = sponsorId;
	}

	public String getLoanReqDate() {
		return loanReqDate;
	}

	public void setLoanReqDate(String loanReqDate) {
		this.loanReqDate = loanReqDate;
	}

	public String getInstrumentType() {
		return instrumentType;
	}

	public void setInstrumentType(String instrumentType) {
		this.instrumentType = instrumentType;
	}

	public String getLoanAccountNo() {
		return loanAccountNo;
	}

	public void setLoanAccountNo(String loanAccountNo) {
		this.loanAccountNo = loanAccountNo;
	}

	public List<String> getDocumentNos() {
		return documentNos;
	}

	public void setDocumentNos(List<String> documentNos) {
		this.documentNos = documentNos;
	}

}
