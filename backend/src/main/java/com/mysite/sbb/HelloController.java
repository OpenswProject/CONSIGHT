package com.mysite.sbb;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {
	@GetMapping("/hello")
	@ResponseBody
	public String hello() {
		return "Hello Spring Boot Board";
	}
	
	@GetMapping("/api/test")
	@ResponseBody
	public String testEndpoint() {
		return "안녕하세요! 백엔드(Spring Boot)의 HelloController에서 보낸 메시지입니다.";
	}
}
