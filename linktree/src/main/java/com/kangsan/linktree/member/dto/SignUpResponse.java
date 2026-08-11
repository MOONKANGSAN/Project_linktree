package com.kangsan.linktree.member.dto;

import com.kangsan.linktree.member.Member;
import com.kangsan.linktree.member.MemberState;

// 회원가입 응답 DTO - 비밀번호는 절대 포함하지 않음
public record SignUpResponse(
        Long idx,
        String id,
        String phone,
        MemberState state
) {
    // Member 엔티티를 응답 DTO로 변환
    public static SignUpResponse from(Member member) {
        return new SignUpResponse(
                member.getIdx(),
                member.getId(),
                member.getPhone(),
                member.getState()
        );
    }
}
