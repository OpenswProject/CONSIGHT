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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user")
public class UserController {

	private final UserService userService;
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	private final UserSecurityService userSecurityService; // UserDetailsService 구현체

	@GetMapping("/signup")
	public String signup(UserCreateForm userCreateForm) {
		return "signup_form";
	}

	@PostMapping("/signup")
	@ResponseBody // JSON 응답을 위해 추가
	public ResponseEntity<?> signup(@Valid @RequestBody UserCreateForm userCreateForm, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return ResponseEntity.badRequest().body(APIResponse.error("", 400, bindingResult.getAllErrors()));
		}

		if (!userCreateForm.getPassword1().equals(userCreateForm.getPassword2())) {
			bindingResult.rejectValue("password2", "passwordInCorrect", "2개의 패스워드가 일치하지 않습니다.");
			return ResponseEntity.badRequest().body(APIResponse.error("비밀번호 불일치", 400));
		}

		try {
			userService.create(userCreateForm.getUsername(), userCreateForm.getEmail(), userCreateForm.getPassword1());
			return ResponseEntity.ok(APIResponse.success("회원가입 성공"));
		} catch (DataIntegrityViolationException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.CONFLICT).body(APIResponse.error("이미 등록된 사용자입니다.", 409));
		} catch (Exception e) {
			e.printStackTrace();
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
        System.out.println("Attempting login for user: " + loginRequest.username()); // 로그 추가
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
			);
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(APIResponse.error("아이디 또는 비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED.value()));
		} catch (Exception e) {
			// 그 외 모든 예외를 잡아서 로그 출력
			e.printStackTrace(); // 스택 트레이스를 출력하여 정확한 예외 확인
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("로그인 처리 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
		}

		// 인증 성공 후 UserDetails 로드 및 JWT 생성
		final UserDetails userDetails = userSecurityService.loadUserByUsername(loginRequest.username());
		final String jwt = jwtUtil.generateToken(userDetails);

		return ResponseEntity.ok(new LoginResponse(jwt));
	}
}
