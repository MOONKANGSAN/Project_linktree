package com.kangsan.linktree.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByMemberIdx(Long memberIdx);

    boolean existsByMemberIdx(Long memberIdx);

    // 공유 링크 토큰으로 프로필 조회 (공개 URL 진입 시 사용)
    Optional<Profile> findByShareToken(String shareToken);

    // 메인 페이지 검색(아이디/닉네임) — member와 profile을 조인하는 네이티브 SQL 쿼리
    // 탈퇴/휴면 회원, 비활성 프로필, 전체공개(visibility=2)가 아닌 프로필은 결과에서 제외
    @Query(value = "SELECT m.id AS loginId, p.nickname AS nickname, p.photo_path AS photoPath, p.bio1 AS bio1 " +
                    "FROM profile p " +
                    "JOIN member m ON m.idx = p.member_idx " +
                    "WHERE m.state = 'ACTIVE' " +
                    "AND p.state = 'ACTIVE' " +
                    "AND p.visibility = 2 " +
                    "AND (m.id LIKE CONCAT('%', :keyword, '%') OR p.nickname LIKE CONCAT('%', :keyword, '%')) " +
                    "ORDER BY p.idx DESC " +
                    "LIMIT 50",
            nativeQuery = true)
    List<ProfileSearchResult> searchPublicProfiles(@Param("keyword") String keyword);
}
