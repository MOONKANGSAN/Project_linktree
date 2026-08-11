package com.kangsan.linktree.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// 회원가입 요청 DTO
public record SignUpRequest(

        // 로그인 아이디: 필수, 최대 20자
        @NotBlank(message = "아이디는 필수 입력값입니다.")
        @Size(max = 20, message = "아이디는 최대 20자까지 가능합니다.")
        String id,

        // 비밀번호: 필수, 8자 이상 + 특수문자 1개 이상 포함
        @NotBlank(message = "비밀번호는 필수 입력값입니다.")
        @Pattern(
                regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>_\\-+=~`\\[\\]/;']).{8,}$",
                message = "비밀번호는 8자 이상이며 특수문자를 1개 이상 포함해야 합니다."
        )
        String password,

        // 휴대폰 번호: 필수, "010-1234-5678" 또는 "01012345678" 형식
        @NotBlank(message = "휴대폰 번호는 필수 입력값입니다.")
        @Pattern(
                regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$",
                message = "휴대폰 번호 형식이 올바르지 않습니다."
        )
        String phone
) {
}
