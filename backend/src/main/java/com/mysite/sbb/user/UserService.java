package com.mysite.sbb.user;

import java.util.Optional;
import java.time.LocalDate; // Import LocalDate

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mysite.sbb.DataNotFoundException;
import com.mysite.sbb.follow.UserDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public SiteUser create(String username, String email, String password) {
		SiteUser user = new SiteUser();
		user.setUsername(username);
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(password));
		user.setPoints(0); // Initialize points
		user.setLevel(1); // Initialize level
		user.setLastAttendanceDate(null); // Initialize last attendance date
		this.userRepository.save(user);
		return user;
	}

	public SiteUser getUser(String username) {
		Optional<SiteUser> siteUser = this.userRepository.findByusername(username);
		if (siteUser.isPresent()) {
			return siteUser.get();
		} else {
			throw new DataNotFoundException("siteuser not found");
		}
	}

	public UserDto getUserDto(String username) {
		SiteUser siteUser = getUser(username);
		return new UserDto(siteUser);
	}

	public void attend(String username) {
		SiteUser user = getUser(username);
		LocalDate today = LocalDate.now();

		if (user.getLastAttendanceDate() == null || !user.getLastAttendanceDate().isEqual(today)) {
			user.setLastAttendanceDate(today);
			user.setPoints(user.getPoints() + 10); // Add 10 points for attendance
			updateUserPointsAndLevel(user); // Check for level up
			this.userRepository.save(user);
		} else {
			throw new IllegalStateException("Already attended today.");
		}
	}

	private void updateUserPointsAndLevel(SiteUser user) {
		// Level up logic
		if (user.getLevel() == 1 && user.getPoints() >= 50) {
			user.setLevel(2);
			// Optionally reset points or carry over, depending on game design
		}
		// Add more level conditions as needed
	}
}
