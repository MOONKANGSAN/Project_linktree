package com.kangsan.linktree.link;

import com.kangsan.linktree.link.dto.PublicProfileResponse;
import com.kangsan.linktree.link.dto.SearchResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 세션 없이 접근 가능한 공개 API
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicLinkController {

    private final LinkService linkService;

    // GET /api/public/search?keyword=xxx — 메인 페이지 검색창(아이디/닉네임) AJAX 조회
    // "/{loginId}" 패턴보다 리터럴 경로("search")가 우선 매칭되므로 순서와 무관하게 안전하게 동작함
    @GetMapping("/search")
    public ResponseEntity<List<SearchResultResponse>> search(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(linkService.searchProfiles(keyword));
    }

    // GET /api/public/{loginId} — loginId에 해당하는 공개 프로필 + 링크 조회
    // 없거나 링크가 없으면 404 반환 → 프론트에서 데모 페이지로 폴백
    @GetMapping("/{loginId}")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(@PathVariable String loginId) {
        return linkService.getPublicProfile(loginId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
