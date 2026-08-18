package com.kangsan.linktree.link.dto;

import java.util.List;

// 공개 프로필 조회 응답 DTO — 세션 없이 loginId로 접근 가능
public record PublicProfileResponse(
        String loginId,
        String nickname,
        String bio1,
        String bio2,
        String bio3,
        String photoPath,
        List<LinkResponse> links
) {}
