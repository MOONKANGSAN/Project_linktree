package com.kangsan.linktree.profile.dto;

import com.kangsan.linktree.profile.Profile;

// 프로필 응답 DTO
public record ProfileResponse(
        Long idx,
        String photoPath,
        Integer visibility,  // 1:나만보기 / 2:전체공개 / 3:링크받은사람만
        String nickname,
        String bio1,
        String bio2,
        String bio3
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getIdx(),
                profile.getPhotoPath(),
                profile.getVisibility() != null ? profile.getVisibility().getValue() : 2,
                profile.getNickname(),
                profile.getBio1(),
                profile.getBio2(),
                profile.getBio3()
        );
    }
}
