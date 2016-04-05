package gec.scf.memu.domain;

import java.util.Collection;

import org.springframework.security.core.userdetails.User;

public interface MenuRepositoryCustom {

	Collection<Menu> findAllMenuFor(User user);

}
