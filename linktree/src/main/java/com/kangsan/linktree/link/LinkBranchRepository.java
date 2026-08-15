package com.kangsan.linktree.link;

import com.kangsan.linktree.global.enums.CommonState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LinkBranchRepository extends JpaRepository<LinkBranch, Long> {

    // 관리 목적 — 상태 무관 전체 조회
    List<LinkBranch> findByLinkIdxOrderBySortOrder(Long linkIdx);

    // 공개 뷰 목적 — ACTIVE 상태 가지치기만 조회
    List<LinkBranch> findByLinkIdxAndStateOrderBySortOrder(Long linkIdx, CommonState state);

    void deleteByLinkIdx(Long linkIdx);
}
