package com.kangsan.linktree.link.dto;

// 가지치기 하위 항목 저장 요청
public record BranchSaveRequest(
        String label,
        String url,
        String inputType   // "url" or "file"
) {}
