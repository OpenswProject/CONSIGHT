package com.mysite.sbb;

import org.springframework.http.HttpMethod;
import com.mysite.sbb.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import com.fasterxml.jackson.databind.ObjectMapper; // ObjectMapper import 추가
import com.mysite.sbb.util.APIResponse; // APIResponse import 추가

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 보호 비활성화 (Stateless API에서는 일반적으로 비활성화)
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            
            // 폼 로그인 비활성화
            .formLogin(formLogin -> formLogin.disable()) // 이 줄 추가
            
            // H2 콘솔을 위한 X-Frame-Options 비활성화
            .headers(headers -> headers.addHeaderWriter(
                new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)))
            
            // 세션을 사용하지 않도록 설정
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // HTTP 요청에 대한 인가 설정
            .authorizeHttpRequests(auth -> auth
                // 아래 경로들은 인증 없이 접근 허용
                .requestMatchers(HttpMethod.POST, "/api/user/login").permitAll()
                .requestMatchers("/api/consumption/**").authenticated() // 소비계획 API 인증 명시
                .requestMatchers(HttpMethod.POST, "/api/attendance").authenticated() // 출석 체크 인증 명시
                .requestMatchers("/api/shopping-items/**").authenticated() // 쇼핑 아이템 API 인증 명시
                .requestMatchers(HttpMethod.POST, "/api/reviews/*/view").permitAll() // 조회수 업데이트
                .requestMatchers(HttpMethod.GET, "/api/reviews/me").authenticated() // /me 경로는 인증 필요
                .requestMatchers(HttpMethod.GET, "/api/reviews/liked-by-me").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/reviews/bookmarked-by-me").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll() // 나머지 GET 요청은 허용
                .requestMatchers(HttpMethod.POST, "/api/reviews/*/like").authenticated() // 좋아요 (인증 필요)
                .requestMatchers(HttpMethod.POST, "/api/reviews/*/bookmark").authenticated() // 북마크 (인증 필요)
                .requestMatchers(HttpMethod.POST, "/api/reviews/*/comments").authenticated() // 댓글 작성 (인증 필요)
                .requestMatchers("/api/follow/**").authenticated() // 팔로우 관련 (인증 필요)
                .requestMatchers("/api/test", "/hello", "/", "/h2-console/**", "/user/signup").permitAll()
                // 그 외 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )
            
            // 로그아웃 설정 (필요 시 커스터마이징)
            .logout((logout) -> logout
                    .logoutRequestMatcher(new AntPathRequestMatcher("/user/logout"))
                    .logoutSuccessUrl("/"))
            
            // 우리가 만든 JWT 필터를 Spring Security 필터 체인에 추가
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            // 예외 처리 설정 활성화
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    String jsonResponse = new ObjectMapper().writeValueAsString(APIResponse.error("인증되지 않았습니다.", HttpServletResponse.SC_UNAUTHORIZED));
                    response.getWriter().write(jsonResponse);
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    String jsonResponse = new ObjectMapper().writeValueAsString(APIResponse.error("접근 권한이 없습니다.", HttpServletResponse.SC_FORBIDDEN));
                    response.getWriter().write(jsonResponse);
                }));
            
        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Configuration
    public static class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**") // 모든 경로에 대해
                    .allowedOrigins("http://localhost:3000", "https://consight.vercel.app") // 로컬 및 Vercel 배포 주소 허용
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                    .allowedHeaders("*") // 모든 헤더 허용
                    .allowCredentials(true); // 자격 증명 허용
        }
    }
}
