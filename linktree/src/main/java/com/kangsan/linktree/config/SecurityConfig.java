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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// 보안 설정: 세션 기반 인증, CORS, BCrypt 비밀번호 암호화
@Configuration
@EnableWebSecurity
public class SecurityConfig {

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

    // 프론트엔드(localhost:5173)에서 오는 요청 허용 + 세션 쿠키 전달 허용
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        // 세션 쿠키를 프론트에서 받고 보낼 수 있도록 credentials 허용
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
