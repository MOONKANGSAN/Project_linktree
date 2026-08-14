package com.kangsan.linktree.member.dto;

import com.kangsan.linktree.member.Member;

// 로그인 응답 DTO - 세션 생성 후 클라이언트에 반환할 회원 기본 정보
public record LoginResponse(
        Long idx,
        String id,
        String email
) {
    public static LoginResponse from(Member member) {
        return new LoginResponse(
                member.getIdx(),
                member.getId(),
                member.getEmail()
        );
    }
}
