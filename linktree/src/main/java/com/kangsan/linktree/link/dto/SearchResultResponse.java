package com.kangsan.linktree.link.dto;

import com.kangsan.linktree.profile.ProfileSearchResult;

// 검색 결과 응답 DTO — 메인 페이지 검색(아이디/닉네임)에서 search_list 페이지로 전달되는 항목 하나
public record SearchResultResponse(
        String loginId,
        String nickname,
        String photoPath,
        String bio1
) {
    public static SearchResultResponse from(ProfileSearchResult r) {
        return new SearchResultResponse(r.getLoginId(), r.getNickname(), r.getPhotoPath(), r.getBio1());
    }
}
