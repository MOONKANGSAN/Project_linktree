package com.kangsan.linktree.profile.dto;

// 프로필 저장 요청 DTO (사진은 별도 multipart 요청으로 처리)
public record ProfileSaveRequest(
        Integer visibility,  // 1:나만보기 / 2:전체공개 / 3:링크받은사람만
        String nickname,
        String bio1,
        String bio2,
        String bio3
) {}
