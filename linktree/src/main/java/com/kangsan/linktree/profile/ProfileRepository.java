package com.kangsan.linktree.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByMemberIdx(Long memberIdx);

    boolean existsByMemberIdx(Long memberIdx);

    // 공유 링크 토큰으로 프로필 조회 (공개 URL 진입 시 사용)
    Optional<Profile> findByShareToken(String shareToken);
}
