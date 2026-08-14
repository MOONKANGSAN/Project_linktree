package com.kangsan.linktree.profile.dto;

import com.kangsan.linktree.profile.Profile;

// 프로필 응답 DTO
public record ProfileResponse(
        Long idx,
        String photoPath,
        String bio1,
        String bio2,
        String bio3
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getIdx(),
                profile.getPhotoPath(),
                profile.getBio1(),
                profile.getBio2(),
                profile.getBio3()
        );
    }
}
