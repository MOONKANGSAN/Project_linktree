package com.kangsan.linktree.profile;

import com.kangsan.linktree.global.exception.UnauthorizedException;
import com.kangsan.linktree.global.session.SessionConst;
import com.kangsan.linktree.profile.dto.ProfileResponse;
import com.kangsan.linktree.profile.dto.ProfileSaveRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

// 프로필 관련 REST API
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // GET /api/profile/me — 내 프로필 조회
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(HttpServletRequest request) {
        Long memberIdx = getLoginMemberIdx(request);
        return ResponseEntity.ok(profileService.getMyProfile(memberIdx));
    }

    // PUT /api/profile/me — 소개글 저장
    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> saveBio(
            @RequestBody ProfileSaveRequest body,
            HttpServletRequest request) {
        Long memberIdx = getLoginMemberIdx(request);
        return ResponseEntity.ok(profileService.saveBio(memberIdx, body));
    }

    // POST /api/profile/me/photo — 프로필 사진 업로드
    @PostMapping("/me/photo")
    public ResponseEntity<ProfileResponse> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        Long memberIdx = getLoginMemberIdx(request);
        return ResponseEntity.ok(profileService.uploadPhoto(memberIdx, file));
    }

    // 세션에서 로그인 회원 idx 추출 — 없으면 401
    private Long getLoginMemberIdx(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) throw new UnauthorizedException();
        Long memberIdx = (Long) session.getAttribute(SessionConst.LOGIN_MEMBER);
        if (memberIdx == null) throw new UnauthorizedException();
        return memberIdx;
    }
}
