package com.kangsan.linktree.member.dto;

import jakarta.validation.constraints.NotBlank;

// 로그인 요청 DTO
public record LoginRequest(

        @NotBlank(message = "아이디는 필수 입력값입니다.")
        String id,

        @NotBlank(message = "비밀번호는 필수 입력값입니다.")
        String password
) {}
