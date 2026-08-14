package com.kangsan.linktree.link;

import com.kangsan.linktree.global.exception.UnauthorizedException;
import com.kangsan.linktree.global.session.SessionConst;
import com.kangsan.linktree.link.dto.BranchResponse;
import com.kangsan.linktree.link.dto.LinkResponse;
import com.kangsan.linktree.link.dto.LinkSaveRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

// 링크 관련 REST API
@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class LinkController {

    private final LinkService linkService;

    // GET /api/links/me — 내 링크 전체 조회
    @GetMapping("/me")
    public ResponseEntity<List<LinkResponse>> getMyLinks(HttpServletRequest request) {
        return ResponseEntity.ok(linkService.getMyLinks(getLoginMemberIdx(request)));
    }

    // PUT /api/links/me — 링크 전체 저장 (기존 데이터 교체)
    @PutMapping("/me")
    public ResponseEntity<List<LinkResponse>> saveLinks(
            @RequestBody List<LinkSaveRequest> body,
            HttpServletRequest request) {
        return ResponseEntity.ok(linkService.saveLinks(getLoginMemberIdx(request), body));
    }

    // POST /api/links/{linkIdx}/file — 포트폴리오 파일 업로드
    @PostMapping("/{linkIdx}/file")
    public ResponseEntity<LinkResponse> uploadLinkFile(
            @PathVariable Long linkIdx,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        return ResponseEntity.ok(linkService.uploadLinkFile(getLoginMemberIdx(request), linkIdx, file));
    }

    // POST /api/links/branches/{branchIdx}/file — 가지치기 파일 업로드
    @PostMapping("/branches/{branchIdx}/file")
    public ResponseEntity<BranchResponse> uploadBranchFile(
            @PathVariable Long branchIdx,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        return ResponseEntity.ok(linkService.uploadBranchFile(getLoginMemberIdx(request), branchIdx, file));
    }

    private Long getLoginMemberIdx(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) throw new UnauthorizedException();
        Long memberIdx = (Long) session.getAttribute(SessionConst.LOGIN_MEMBER);
        if (memberIdx == null) throw new UnauthorizedException();
        return memberIdx;
    }
}
