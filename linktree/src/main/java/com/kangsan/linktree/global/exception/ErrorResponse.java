package com.kangsan.linktree.global.exception;

import java.time.LocalDateTime;
import java.util.List;

// 공통 에러 응답 형식
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String message,
        List<FieldError> errors
) {
    // 필드별 검증 실패 상세 정보
    public record FieldError(String field, String reason) {
    }

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(LocalDateTime.now(), status, message, List.of());
    }

    public static ErrorResponse of(int status, String message, List<FieldError> errors) {
        return new ErrorResponse(LocalDateTime.now(), status, message, errors);
    }
}
