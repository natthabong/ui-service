package gec.scf.security.domain;

import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository {

	public User findByEmail(String loginName);

}
