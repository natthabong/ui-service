package gec.scf.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table
public class Menu implements Serializable {

	private static final long serialVersionUID = 5934200035457191381L;

	@Id
	private String menuId;

	private String icon;

	private String url;

	private int sequence;

	@JsonIgnoreProperties
	@ManyToOne
	private Menu parent;

	@OneToMany(mappedBy = "parent", fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST }, orphanRemoval = true)
	private Collection<Menu> children;

	@JsonIgnoreProperties
	@ManyToMany(cascade = { CascadeType.PERSIST })
	@JoinTable(name = "roles_menus", joinColumns = @JoinColumn(name = "menu_id", referencedColumnName = "menuId"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "roleId"))
	private Collection<Role> roles;

	@Enumerated(EnumType.STRING)
	private MenuType menuType;

	public String getMenuId() {
		return menuId;
	}

	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@JsonIgnore
	public Menu getParent() {
		return parent;
	}

	public void setParent(Menu parent) {
		this.parent = parent;
	}

	public Collection<Menu> getChildren() {
		return children;
	}

	public void setChildren(Collection<Menu> children) {
		this.children = children;
	}

	public void add(Menu subMenu) {
		if (this.getChildren() == null) {
			setChildren(new ArrayList<Menu>());
		}
		getChildren().add(subMenu);
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getSequence() {
		return sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public Collection<Role> getRoles() {
		return roles;
	}

	public void setRoles(Collection<Role> roles) {
		this.roles = roles;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((menuId == null) ? 0 : menuId.hashCode());
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
		Menu other = (Menu) obj;
		if (menuId == null) {
			if (other.menuId != null)
				return false;
		} else if (!menuId.equals(other.menuId))
			return false;
		return true;
	}

	public MenuType getMenuType() {
		return menuType;
	}

	public void setMenuType(MenuType menuType) {
		this.menuType = menuType;
	}

}
