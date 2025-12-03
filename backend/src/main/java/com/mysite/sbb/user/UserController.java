package com.mysite.sbb.user;

import com.mysite.sbb.util.JwtUtil;
import com.mysite.sbb.util.APIResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mysite.sbb.user.LoginResponse; // LoginResponse import 추가
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.mysite.sbb.follow.UserDto;
import org.springframework.web.bind.annotation.PathVariable;


@RequiredArgsConstructor
@RestController // @Controller 대신 @RestController 사용 (모든 메서드에 @ResponseBody 적용)
@Slf4j
public class UserController {

	private final UserService userService;
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	private final UserSecurityService userSecurityService; // UserDetailsService 구현체

	@GetMapping("/api/users/{username}")
    public ResponseEntity<APIResponse<UserDto>> getUserProfile(@PathVariable("username") String username) {
        try {
            UserDto userDto = userService.getUserDto(username);
            return ResponseEntity.ok(APIResponse.success("User profile fetched successfully.", userDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error("User not found.", 404));
        }
    }

	@GetMapping("/signup")
	public String signup(UserCreateForm userCreateForm) {
		return "signup_form";
	}

	@PostMapping("/user/signup")
	@ResponseBody // JSON 응답을 위해 추가
	public ResponseEntity<?> signup(@Valid @RequestBody UserCreateForm userCreateForm, BindingResult bindingResult) {
		log.info("회원가입 요청 수신: username={}, email={}", userCreateForm.getUsername(), userCreateForm.getEmail());
		if (bindingResult.hasErrors()) {
			log.warn("회원가입 유효성 검사 실패: {}", bindingResult.getAllErrors());
			return ResponseEntity.badRequest().body(APIResponse.error("", 400, bindingResult.getAllErrors()));
		}

		if (!userCreateForm.getPassword1().equals(userCreateForm.getPassword2())) {
			log.warn("회원가입 실패: 비밀번호 불일치");
			bindingResult.rejectValue("password2", "passwordInCorrect", "2개의 패스워드가 일치하지 않습니다.");
			return ResponseEntity.badRequest().body(APIResponse.error("비밀번호 불일치", 400));
		}

		try {
			userService.create(userCreateForm.getUsername(), userCreateForm.getEmail(), userCreateForm.getPassword1());
			log.info("회원가입 성공: username={}", userCreateForm.getUsername());
			return ResponseEntity.ok(APIResponse.success("회원가입 성공"));
		} catch (DataIntegrityViolationException e) {
			log.error("회원가입 실패: 이미 등록된 사용자입니다. username={}", userCreateForm.getUsername(), e);
			return ResponseEntity.status(HttpStatus.CONFLICT).body(APIResponse.error("이미 등록된 사용자입니다.", 409));
		} catch (Exception e) {
			log.error("회원가입 실패: 예상치 못한 오류 발생. username={}, error={}", userCreateForm.getUsername(), e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("회원가입 실패: " + e.getMessage(), 500));
		}
	}

	@GetMapping("/login")
	public String login() {
		return "login_form";
	}

	// JWT 기반 로그인 API 엔드포인트
	@PostMapping("/api/user/login")
	@ResponseBody // JSON 응답을 위해 필요
	public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
			);
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(APIResponse.error("아이디 또는 비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED.value()));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("로그인 처리 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
		}

		// 인증 성공 후 UserDetails 로드 및 JWT 생성
		final UserDetails userDetails = userSecurityService.loadUserByUsername(loginRequest.username());
		final String jwt = jwtUtil.generateToken(userDetails);
		final SiteUser siteUser = userService.getUser(loginRequest.username()); // Get SiteUser to retrieve email

		return ResponseEntity.ok(new LoginResponse(jwt, siteUser.getUsername(), siteUser.getEmail(), true, "로그인 성공"));
	}
}
