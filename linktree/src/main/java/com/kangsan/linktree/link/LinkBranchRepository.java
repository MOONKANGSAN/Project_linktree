package com.kangsan.linktree.link;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LinkBranchRepository extends JpaRepository<LinkBranch, Long> {

    List<LinkBranch> findByLinkIdxOrderBySortOrder(Long linkIdx);

    void deleteByLinkIdx(Long linkIdx);
}
