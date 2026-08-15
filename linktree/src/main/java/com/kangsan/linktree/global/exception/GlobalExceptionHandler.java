package com.kangsan.linktree.global.exception;

import com.kangsan.linktree.member.exception.DuplicateIdException;
import com.kangsan.linktree.member.exception.InvalidCredentialsException;
import com.kangsan.linktree.global.exception.UnauthorizedException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

// 모든 컨트롤러에 공통으로 적용되는 예외 처리
@RestControllerAdvice
public class GlobalExceptionHandler {

    // @Valid 검증 실패 시 (아이디 길이 초과, 비밀번호 형식 오류 등) 400 응답
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        List<ErrorResponse.FieldError> fieldErrors = e.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ErrorResponse.FieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();

        ErrorResponse response = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "입력값 검증에 실패했습니다.",
                fieldErrors
        );
        return ResponseEntity.badRequest().body(response);
    }

    // 아이디 중복 시 409 응답
    @ExceptionHandler(DuplicateIdException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateId(DuplicateIdException e) {
        ErrorResponse response = ErrorResponse.of(HttpStatus.CONFLICT.value(), e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // 아이디/비밀번호 불일치 시 401 응답
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException e) {
        ErrorResponse response = ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // 비로그인 상태로 인증 필요 API 접근 시 401 응답
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException e) {
        ErrorResponse response = ErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // 업로드 파일 크기 초과 시 413 응답 (기본 동작은 연결 강제 종료라 프론트에서 abort로 보임)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSize(MaxUploadSizeExceededException e) {
        ErrorResponse response = ErrorResponse.of(
                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                "파일 크기가 제한을 초과했습니다. 최대 20MB까지 업로드 가능합니다."
        );
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
    }
}
