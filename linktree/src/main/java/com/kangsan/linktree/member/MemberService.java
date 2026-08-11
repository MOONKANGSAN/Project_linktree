package com.kangsan.linktree.member;

import com.kangsan.linktree.member.dto.SignUpRequest;
import com.kangsan.linktree.member.dto.SignUpResponse;
import com.kangsan.linktree.member.exception.DuplicateIdException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 회원 관련 비즈니스 로직
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본은 조회 트랜잭션, 쓰기가 필요한 메서드만 별도로 @Transactional 부여
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입 처리: 아이디 중복 검사 -> 비밀번호 암호화 -> 저장
    @Transactional
    public SignUpResponse signUp(SignUpRequest request) {
        // 1) 아이디 중복 검사
        if (memberRepository.existsByLoginId(request.id())) {
            throw new DuplicateIdException(request.id());
        }

        // 2) 비밀번호는 반드시 암호화하여 저장 (평문 저장 금지)
        String encodedPassword = passwordEncoder.encode(request.password());

        // 3) 엔티티 생성 및 저장
        Member member = Member.builder()
                .id(request.id())
                .password(encodedPassword)
                .phone(request.phone())
                .build();

        Member savedMember = memberRepository.save(member);
        return SignUpResponse.from(savedMember);
    }
}
