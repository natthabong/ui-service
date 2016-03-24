package gec.scf.security;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gec.scf.domain.Message;
import gec.scf.domain.MessageRepository;
import gec.scf.domain.Messages;

@Service
public class MessageServiceImpl implements MessageService {

	private MessageRepository messageRepository;

	@Autowired
	public MessageServiceImpl(MessageRepository messageRepository) {
		this.messageRepository = messageRepository;
	}

	@Override
	public String display(Messages messageKey, Locale locale) {
		Message message = messageRepository.findByMessageKeyAndLocale(messageKey.toString(), locale.getLanguage());
		return message.getMessageDisplay();
	}

}
