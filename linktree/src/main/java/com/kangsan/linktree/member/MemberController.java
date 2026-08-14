package com.kangsan.linktree.member;

import com.kangsan.linktree.global.session.SessionConst;
import com.kangsan.linktree.member.dto.LoginRequest;
import com.kangsan.linktree.member.dto.LoginResponse;
import com.kangsan.linktree.member.dto.SignUpRequest;
import com.kangsan.linktree.member.dto.SignUpResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 회원 관련 REST API
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 회원가입 API
    // POST /api/members/signup
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        SignUpResponse response = memberService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 로그인 API
    // POST /api/members/login
    // 인증 성공 시 HttpSession에 회원 idx 저장 → 브라우저에 JSESSIONID 쿠키 자동 발급
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {

        // 1) 아이디/비밀번호 검증
        LoginResponse response = memberService.login(request);

        // 2) 기존 세션 있으면 무효화 (세션 고정 공격 방지)
        HttpSession oldSession = servletRequest.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        // 3) 새 세션 생성 후 회원 idx 저장
        HttpSession newSession = servletRequest.getSession(true);
        newSession.setAttribute(SessionConst.LOGIN_MEMBER, response.idx());

        return ResponseEntity.ok(response);
    }
}
