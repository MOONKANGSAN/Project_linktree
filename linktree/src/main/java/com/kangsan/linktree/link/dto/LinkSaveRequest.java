package com.kangsan.linktree.link.dto;

import java.util.List;

// 링크 1개 저장 요청
public record LinkSaveRequest(
        String linkType,           // none, instagram, youtube, naver_blog, notion, github, facebook, portfolio
        String label,
        String url,
        String portfolioInputType, // "url" or "file" (포트폴리오 타입일 때만)
        boolean hasBranch,
        List<BranchSaveRequest> branches
) {}
