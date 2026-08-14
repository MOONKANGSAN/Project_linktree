package com.kangsan.linktree.member.exception;

// 아이디가 존재하지 않거나 비밀번호가 일치하지 않을 때 발생
// 보안상 어느 쪽이 틀렸는지 구분하지 않고 동일 메시지 반환
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
}
