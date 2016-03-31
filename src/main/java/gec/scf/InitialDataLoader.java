package gec.scf;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import gec.scf.domain.Menu;
import gec.scf.domain.MenuRepository;
import gec.scf.domain.MenuType;
import gec.scf.domain.Privilege;
import gec.scf.domain.PrivilegeRepository;
import gec.scf.domain.Role;
import gec.scf.domain.RoleRepository;
import gec.scf.domain.User;
import gec.scf.domain.UserRepository;

@Component
public class InitialDataLoader implements ApplicationListener<ContextRefreshedEvent> {

	boolean alreadySetup = false;

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private PrivilegeRepository privilegeRepository;
	@Autowired
	private MenuRepository menuRepository;

	@Override
	@Transactional
	public void onApplicationEvent(ContextRefreshedEvent event) {
		if (alreadySetup)
			return;
		Privilege readPrivilege = createPrivilegeIfNotFound("READ_PRIVILEGE");
		Privilege writePrivilege = createPrivilegeIfNotFound("WRITE_PRIVILEGE");
		List<Privilege> adminPrivileges = Arrays.asList(readPrivilege, writePrivilege);
		createRoleIfNotFound("ROLE_ADMIN", adminPrivileges);
		createRoleIfNotFound("ROLE_USER", Arrays.asList(readPrivilege));

		Role adminRole = roleRepository.findByName("ROLE_ADMIN");
		User user = new User();
		user.setFirstName("Test");
		user.setLastName("Test");
		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		user.setPassword(passwordEncoder.encode("password"));
		user.setEmail("user@gec.co.th");
		user.setRoles(Arrays.asList(adminRole));
		user.setEnabled(true);
		userRepository.save(user);

		// Generate Menu
		Menu loanMenu = new Menu();
		loanMenu.setMenuId("loan-request");
		loanMenu.setIcon("fa-usd");
		loanMenu.setRoles(Arrays.asList(adminRole));
		loanMenu.setMenuType(MenuType.MAIN);
		menuRepository.save(loanMenu);

		Menu loanCreateMenu = new Menu();
		loanCreateMenu.setMenuId("loan-request-create");
		loanCreateMenu.setUrl("/loan/create");
		loanCreateMenu.setRoles(Arrays.asList(adminRole));
		loanCreateMenu.setParent(loanMenu);
		loanCreateMenu.setMenuType(MenuType.SUB);
		loanMenu.add(loanCreateMenu);
		
		Menu loanCreateFlowMenu = new Menu();
		loanCreateFlowMenu.setMenuId("loan-request-create-flow");
		loanCreateFlowMenu.setUrl("/loans");
		loanCreateFlowMenu.setRoles(Arrays.asList(adminRole));
		loanCreateFlowMenu.setParent(loanMenu);
		loanCreateFlowMenu.setMenuType(MenuType.SUB);
		loanMenu.add(loanCreateFlowMenu);

		menuRepository.save(loanCreateMenu);
		menuRepository.save(loanCreateFlowMenu);
		alreadySetup = true;
	}

	@Transactional
	private Privilege createPrivilegeIfNotFound(String name) {
		Privilege privilege = privilegeRepository.findByName(name);
		if (privilege == null) {
			privilege = new Privilege(name);
			privilegeRepository.save(privilege);
		}
		return privilege;
	}

	@Transactional
	private Role createRoleIfNotFound(String name, Collection<Privilege> privileges) {
		Role role = roleRepository.findByName(name);
		if (role == null) {
			role = new Role(name);
			role.setPrivileges(privileges);
			roleRepository.save(role);
		}
		return role;
	}
}