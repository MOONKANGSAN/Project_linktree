package com.kangsan.linktree.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// 보안 설정: 세션 기반 인증, CORS, BCrypt 비밀번호 암호화
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 허용할 프론트엔드 Origin 목록 (콤마 구분)
    // 로컬 개발 기본값은 Vite dev 서버(5173) — 운영 배포 시 .env의 CORS_ALLOWED_ORIGINS로 덮어씀
    // (예: http://<서버IP 또는 도메인>:<FRONTEND_PORT>)
    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    // BCrypt 비밀번호 인코더 - MemberService에서 주입받아 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 이 빈이 존재하면 UserDetailsServiceAutoConfiguration이 백오프됨
    // "Using generated security password" 경고 및 기본 HTTP Basic 인증 제거
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> { throw new UsernameNotFoundException(username); };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // REST API 방식이므로 CSRF 비활성화
                // (쿠키 세션이지만 프론트가 별도 Origin이고 SameSite=Lax가 기본 방어를 담당)
                .csrf(csrf -> csrf.disable())
                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 세션 기반 인증: 로그인 시 세션 생성, 이후 쿠키로 유지
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                // 세션 검증은 각 Controller에서 수동으로 수행
                // Spring Security는 경로 허용만 담당
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll())
                // H2 콘솔은 iframe 사용 (로컬 개발 전용)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable());

        return http.build();
    }

    // 프론트엔드에서 오는 요청 허용 + 세션 쿠키 전달 허용
    // 허용 Origin은 app.cors.allowed-origins(=CORS_ALLOWED_ORIGINS 환경변수)로 환경별 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 콤마로 여러 Origin을 지정할 수 있도록 분리 (앞뒤 공백 제거)
        List<String> origins = List.of(allowedOrigins.split(",")).stream()
                .map(String::trim)
                .toList();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        // 세션 쿠키를 프론트에서 받고 보낼 수 있도록 credentials 허용
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
