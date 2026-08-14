package com.kangsan.linktree.link;

import jakarta.persistence.*;
import lombok.*;

/**
 * 링크 가지치기 하위 항목 엔티티 (DB 테이블: link_branch)
 * 포트폴리오 링크에 가지치기 기능 사용 시 생성
 */
@Entity
@Table(name = "link_branch")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LinkBranch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long idx;

    // 상위 링크 고유번호
    @Column(name = "link_idx", nullable = false)
    private Long linkIdx;

    // 버튼에 표시될 이름 (예: 백오피스, 노션)
    @Column(name = "label", length = 100)
    private String label;

    // 이동할 URL
    @Column(name = "url", length = 500)
    private String url;

    // 입력 방식: 'url' or 'file'
    @Column(name = "input_type", length = 10)
    private String inputType;

    // 파일 방식일 때 저장 경로
    @Column(name = "file_path", length = 500)
    private String filePath;

    // 정렬 순서
    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Builder
    public LinkBranch(Long linkIdx, String label, String url,
                      String inputType, String filePath, int sortOrder) {
        this.linkIdx = linkIdx;
        this.label = label;
        this.url = url;
        this.inputType = inputType;
        this.filePath = filePath;
        this.sortOrder = sortOrder;
    }

    public void updateFilePath(String filePath) {
        this.filePath = filePath;
    }
}
