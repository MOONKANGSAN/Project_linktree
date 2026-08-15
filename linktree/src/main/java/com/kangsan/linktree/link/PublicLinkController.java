package com.kangsan.linktree.link;

import com.kangsan.linktree.link.dto.PublicProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 세션 없이 접근 가능한 공개 API
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicLinkController {

    private final LinkService linkService;

    // GET /api/public/{loginId} — loginId에 해당하는 공개 프로필 + 링크 조회
    // 없거나 링크가 없으면 404 반환 → 프론트에서 데모 페이지로 폴백
    @GetMapping("/{loginId}")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(@PathVariable String loginId) {
        return linkService.getPublicProfile(loginId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
