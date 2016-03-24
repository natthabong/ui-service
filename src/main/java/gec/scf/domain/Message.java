package gec.scf.domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table
@IdClass(MessagePk.class)
public class Message implements Serializable {

	private static final long serialVersionUID = 1432661173781542223L;

	private MessagePk id;

	@Id
	private String messageKey;

	@Id
	private String locale;

	private String messageDisplay;

	public String getMessageKey() {
		return messageKey;
	}

	public void setMessageKey(String messageKey) {
		this.messageKey = messageKey;
	}

	public String getLocale() {
		return locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	public String getMessageDisplay() {
		return messageDisplay;
	}

	public void setMessageDisplay(String messageDisplay) {
		this.messageDisplay = messageDisplay;
	}

	public MessagePk getId() {
		return id;
	}

	public void setId(MessagePk id) {
		this.id = id;
	}

}
