package gec.scf.security;

import java.util.Locale;

import gec.scf.domain.Messages;

public interface MessageService {

	public String display(Messages badCredentials, Locale locale);

}
