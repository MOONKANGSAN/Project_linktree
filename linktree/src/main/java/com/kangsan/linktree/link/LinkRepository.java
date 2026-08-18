package com.kangsan.linktree.link;

import com.kangsan.linktree.global.enums.CommonState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LinkRepository extends JpaRepository<Link, Long> {

    // 관리 목적 — 상태 무관 전체 조회 (등록/수정 화면)
    List<Link> findByProfileIdxOrderBySortOrder(Long profileIdx);

    // 공개 뷰 목적 — ACTIVE 상태 링크만 조회
    List<Link> findByProfileIdxAndStateOrderBySortOrder(Long profileIdx, CommonState state);

    void deleteByProfileIdx(Long profileIdx);
}
