package com.kangsan.linktree.global.exception;

// 세션 없이 인증이 필요한 API에 접근할 때 발생
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException() {
        super("로그인이 필요한 서비스입니다.");
    }
}
