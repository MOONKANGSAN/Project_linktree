package com.kangsan.linktree.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// 보안 설정 - 현재는 회원가입 API만 존재하므로 최소 설정만 구성 (로그인/JWT는 추후 구현)
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 비밀번호 암호화용 인코더 (BCrypt) - MemberService에서 회원가입 시 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // REST API + JWT 방식이므로 세션 기반 CSRF 보호는 불필요
                .csrf(csrf -> csrf.disable())
                // 세션을 사용하지 않음 (추후 JWT 기반 인증으로 전환 예정)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 임시: 로그인/JWT 인증 기능 구현 전까지는 전체 요청 허용
                // 로그인 기능 추가 시 permitAll 대상을 /api/members/signup, /api/members/login 등으로 좁힐 것
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                // H2 콘솔은 iframe을 사용하므로 프레임 옵션 비활성화 (로컬 개발용)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable());

        return http.build();
    }
}
