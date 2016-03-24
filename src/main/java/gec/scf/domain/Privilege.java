package gec.scf.domain;

import java.io.Serializable;
import java.util.Collection;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table
public class Privilege implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 9096985984623604049L;

	@Id
	private String privilegeId;

	private String name;

	@ManyToMany(mappedBy = "privileges")
	private Collection<Role> roles;

	public Privilege() {
		// TODO Auto-generated constructor stub
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
