package gec.scf.domain;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends CrudRepository<Message, MessagePk> {

	public Message findByMessageKeyAndLocale(String messageKey, String locale);
}
