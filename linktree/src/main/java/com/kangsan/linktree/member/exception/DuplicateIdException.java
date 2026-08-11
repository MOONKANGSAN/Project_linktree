package com.kangsan.linktree.member.exception;

// 이미 존재하는 로그인 아이디로 회원가입을 시도할 때 발생하는 예외
public class DuplicateIdException extends RuntimeException {
    public DuplicateIdException(String id) {
        super("이미 사용 중인 아이디입니다: " + id);
    }
}
