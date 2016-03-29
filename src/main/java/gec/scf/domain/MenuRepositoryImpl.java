package gec.scf.domain;

import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.ParameterExpression;
import javax.persistence.criteria.Root;

public class MenuRepositoryImpl implements MenuRepositoryCustom {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public Collection<Menu> findAllMenuFor(org.springframework.security.core.userdetails.User user) {
		CriteriaBuilder cb = entityManager.getCriteriaBuilder();

		CriteriaQuery<Menu> q = cb.createQuery(Menu.class);
		Root<Menu> c = q.from(Menu.class);
		Join<Menu, Role> joinRole = c.join("roles");
		Join<Menu, User> joinUser = joinRole.join("users");
		q.select(c);
		ParameterExpression<MenuType> menuTypeParam = cb.parameter(MenuType.class, "menuType");
		ParameterExpression<String> usernameParam = cb.parameter(String.class, "uname");
		q.where(cb.equal(c.get("menuType"), menuTypeParam), cb.equal(joinUser.get("email"), usernameParam));
		TypedQuery<Menu> query = entityManager.createQuery(q);
		query.setParameter("menuType", MenuType.MAIN);
		query.setParameter("uname", user.getUsername());
		List<Menu> results = query.getResultList();

		return results;
	}

}
