package com.kangsan.linktree.profile.dto;

// 프로필 소개글 저장 요청 DTO (사진은 별도 multipart 요청으로 처리)
public record ProfileSaveRequest(
        String bio1,
        String bio2,
        String bio3
) {}
