package gec.scf.security.domain;

import java.io.Serializable;
import java.util.Collection;
import java.util.UUID;

public class Privilege implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 9096985984623604049L;

	private String privilegeId;

	private String name;

	private Collection<Role> roles;

	public Privilege() {
	}

	public Privilege(String name) {
		UUID uuid = UUID.randomUUID();
		this.privilegeId = uuid.toString();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Collection<Role> getRoles() {
		return roles;
	}

	public void setRoles(Collection<Role> roles) {
		this.roles = roles;
	}

	public String getPrivilegeId() {
		return privilegeId;
	}

	public void setPrivilegeId(String privilegeId) {
		this.privilegeId = privilegeId;
	}

}
