package com.kangsan.linktree.member;

import com.kangsan.linktree.member.dto.LoginRequest;
import com.kangsan.linktree.member.dto.LoginResponse;
import com.kangsan.linktree.member.dto.SignUpRequest;
import com.kangsan.linktree.member.dto.SignUpResponse;
import com.kangsan.linktree.member.exception.DuplicateIdException;
import com.kangsan.linktree.member.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 회원 관련 비즈니스 로직
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입: 아이디 중복 검사 → BCrypt 해싱 → 저장
    @Transactional
    public SignUpResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByLoginId(request.id())) {
            throw new DuplicateIdException(request.id());
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        Member member = Member.builder()
                .id(request.id())
                .password(encodedPassword)
                .phone(request.phone())
                .email(request.email())
                .build();

        return SignUpResponse.from(memberRepository.save(member));
    }

    // 세션에 저장된 memberIdx로 회원 조회 — GET /api/members/me 에서 사용
    public LoginResponse findById(Long idx) {
        Member member = memberRepository.findById(idx)
                .orElseThrow(InvalidCredentialsException::new);
        return LoginResponse.from(member);
    }

    // 로그인: 아이디 조회 → BCrypt 비밀번호 검증
    // 보안상 아이디 없음과 비밀번호 불일치를 동일 예외로 처리하여 어느 쪽이 틀렸는지 노출 방지
    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByLoginId(request.id())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return LoginResponse.from(member);
    }
}

