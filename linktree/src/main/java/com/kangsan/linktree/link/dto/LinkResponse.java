package com.kangsan.linktree.link.dto;

import com.kangsan.linktree.link.Link;
import java.util.List;

public record LinkResponse(
        Long idx,
        String linkType,
        String label,
        String url,
        String portfolioInputType,
        String filePath,
        boolean hasBranch,
        int sortOrder,
        List<BranchResponse> branches
) {
    public static LinkResponse from(Link link, List<BranchResponse> branches) {
        return new LinkResponse(
                link.getIdx(), link.getLinkType(), link.getLabel(),
                link.getUrl(), link.getPortfolioInputType(), link.getFilePath(),
                link.isHasBranch(), link.getSortOrder(), branches
        );
    }
}
