package com.kangsan.linktree.link;

import jakarta.persistence.*;
import lombok.*;

/**
 * 링크 엔티티 (DB 테이블: member_link)
 * 테이블명을 member_link로 지정 — 'link'는 MySQL 예약어와 충돌 가능
 */
@Entity
@Table(name = "member_link")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long idx;

    // 연결된 프로필 고유번호
    @Column(name = "profile_idx", nullable = false)
    private Long profileIdx;

    // 플랫폼 종류 (none, instagram, youtube, naver_blog, notion, github, facebook, portfolio)
    @Column(name = "link_type", nullable = false, length = 20)
    private String linkType;

    // 화면에 표시될 이름
    @Column(name = "label", length = 100)
    private String label;

    // URL (포트폴리오 URL 방식 또는 일반 링크)
    @Column(name = "url", length = 500)
    private String url;

    // 포트폴리오 입력 방식: 'url' or 'file' (포트폴리오 타입일 때만 사용)
    @Column(name = "portfolio_input_type", length = 10)
    private String portfolioInputType;

    // 업로드된 파일 경로 (포트폴리오 파일 방식일 때)
    @Column(name = "file_path", length = 500)
    private String filePath;

    // 가지치기 사용 여부 (포트폴리오 타입일 때만 활성화)
    @Column(name = "has_branch", nullable = false)
    private boolean hasBranch;

    // 정렬 순서
    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Builder
    public Link(Long profileIdx, String linkType, String label, String url,
                String portfolioInputType, String filePath, boolean hasBranch, int sortOrder) {
        this.profileIdx = profileIdx;
        this.linkType = linkType;
        this.label = label;
        this.url = url;
        this.portfolioInputType = portfolioInputType;
        this.filePath = filePath;
        this.hasBranch = hasBranch;
        this.sortOrder = sortOrder;
    }

    public void updateFilePath(String filePath) {
        this.filePath = filePath;
    }
}
