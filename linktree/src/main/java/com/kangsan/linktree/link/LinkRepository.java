package com.kangsan.linktree.link;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LinkRepository extends JpaRepository<Link, Long> {

    List<Link> findByProfileIdxOrderBySortOrder(Long profileIdx);

    void deleteByProfileIdx(Long profileIdx);
}
