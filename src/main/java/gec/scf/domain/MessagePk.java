package gec.scf.domain;

import java.io.Serializable;

public class MessagePk implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -799175188350787204L;
	public String messageKey;
	public String locale;

	public MessagePk(String messageKey, String locale) {
		this.messageKey = messageKey;
		this.locale = locale;
	}

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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((locale == null) ? 0 : locale.hashCode());
		result = prime * result + ((messageKey == null) ? 0 : messageKey.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		MessagePk other = (MessagePk) obj;
		if (locale == null) {
			if (other.locale != null)
				return false;
		} else if (!locale.equals(other.locale))
			return false;
		if (messageKey == null) {
			if (other.messageKey != null)
				return false;
		} else if (!messageKey.equals(other.messageKey))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "MessagePk [messageKey=" + messageKey + ", locale=" + locale + "]";
	}

}