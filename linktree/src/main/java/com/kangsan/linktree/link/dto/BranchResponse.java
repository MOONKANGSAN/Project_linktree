package com.kangsan.linktree.link.dto;

import com.kangsan.linktree.link.LinkBranch;

public record BranchResponse(
        Long idx,
        String label,
        String url,
        String inputType,
        String filePath
) {
    public static BranchResponse from(LinkBranch b) {
        return new BranchResponse(b.getIdx(), b.getLabel(), b.getUrl(), b.getInputType(), b.getFilePath());
    }
}
