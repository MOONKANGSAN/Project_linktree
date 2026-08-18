package com.kangsan.linktree.link;

import com.kangsan.linktree.global.enums.CommonState;
import com.kangsan.linktree.link.dto.*;
import com.kangsan.linktree.member.Member;
import com.kangsan.linktree.member.MemberRepository;
import com.kangsan.linktree.profile.Profile;
import com.kangsan.linktree.profile.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LinkService {

    private final LinkRepository linkRepository;
    private final LinkBranchRepository branchRepository;
    private final ProfileRepository profileRepository;
    private final MemberRepository memberRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // 내 링크 목록 조회
    public List<LinkResponse> getMyLinks(Long memberIdx) {
        Long profileIdx = getProfileIdx(memberIdx);
        return linkRepository.findByProfileIdxOrderBySortOrder(profileIdx).stream()
                .map(link -> {
                    List<BranchResponse> branches = branchRepository
                            .findByLinkIdxOrderBySortOrder(link.getIdx()).stream()
                            .map(BranchResponse::from).toList();
                    return LinkResponse.from(link, branches);
                }).toList();
    }

    // 공개 프로필 조회 — loginId 또는 shareToken 둘 다 허용
    // 1) loginId로 먼저 시도, 없으면 2) shareToken으로 재시도
    // 링크가 없으면 Optional.empty() 반환 → 프론트에서 데모 페이지 사용
    public Optional<PublicProfileResponse> getPublicProfile(String param) {
        Profile profile;
        String loginId;

        Optional<Member> memberOpt = memberRepository.findByLoginId(param);
        if (memberOpt.isPresent()) {
            // loginId로 진입한 경우
            Optional<Profile> profileOpt = profileRepository.findByMemberIdx(memberOpt.get().getIdx());
            if (profileOpt.isEmpty()) return Optional.empty();
            profile = profileOpt.get();
            loginId = memberOpt.get().getId();
        } else {
            // shareToken으로 진입한 경우 — loginId가 URL에 드러나지 않음
            Optional<Profile> profileByToken = profileRepository.findByShareToken(param);
            if (profileByToken.isEmpty()) return Optional.empty();
            profile = profileByToken.get();
            Optional<Member> memberByIdx = memberRepository.findById(profile.getMemberIdx());
            if (memberByIdx.isEmpty()) return Optional.empty();
            loginId = memberByIdx.get().getId();
        }

        // 공개 뷰에서는 ACTIVE 상태인 링크만 노출
        List<Link> links = linkRepository.findByProfileIdxAndStateOrderBySortOrder(profile.getIdx(), CommonState.ACTIVE);
        if (links.isEmpty()) return Optional.empty();

        List<LinkResponse> linkResponses = links.stream().map(link -> {
            // 공개 뷰에서는 ACTIVE 상태인 가지치기만 노출
            List<BranchResponse> branches = branchRepository
                    .findByLinkIdxAndStateOrderBySortOrder(link.getIdx(), CommonState.ACTIVE).stream()
                    .map(BranchResponse::from).toList();
            return LinkResponse.from(link, branches);
        }).toList();

        return Optional.of(new PublicProfileResponse(
                loginId,
                profile.getShareToken(),
                profile.getNickname(),
                profile.getBio1(),
                profile.getBio2(),
                profile.getBio3(),
                profile.getPhotoPath(),
                linkResponses
        ));
    }

    // 링크 전체 저장 (기존 데이터 교체 방식)
    @Transactional
    public List<LinkResponse> saveLinks(Long memberIdx, List<LinkSaveRequest> requests) {
        Long profileIdx = getOrCreateProfile(memberIdx);

        // 기존 링크와 가지 전부 삭제 후 재등록
        List<Link> existing = linkRepository.findByProfileIdxOrderBySortOrder(profileIdx);
        existing.forEach(link -> branchRepository.deleteByLinkIdx(link.getIdx()));
        linkRepository.deleteByProfileIdx(profileIdx);

        // 새 링크 순서대로 저장
        return requests.stream().map((req) -> {
            int order = requests.indexOf(req);
            Link link = linkRepository.save(Link.builder()
                    .profileIdx(profileIdx)
                    .linkType(req.linkType())
                    .label(req.label())
                    .url(req.url())
                    .portfolioInputType(req.portfolioInputType())
                    // 수정 시 새 파일을 올리지 않으면 기존 파일 경로 유지
                    .filePath(req.existingFilePath())
                    .hasBranch(req.hasBranch())
                    .sortOrder(order)
                    .build());

            List<BranchResponse> branches = List.of();
            if (req.hasBranch() && req.branches() != null) {
                branches = req.branches().stream().map((br) -> {
                    int brOrder = req.branches().indexOf(br);
                    LinkBranch branch = branchRepository.save(LinkBranch.builder()
                            .linkIdx(link.getIdx())
                            .label(br.label())
                            .url(br.url())
                            .inputType(br.inputType() != null ? br.inputType() : "url")
                            .filePath(br.existingFilePath())
                            .sortOrder(brOrder)
                            .build());
                    return BranchResponse.from(branch);
                }).toList();
            }
            return LinkResponse.from(link, branches);
        }).toList();
    }

    // 링크 포트폴리오 파일 업로드
    @Transactional
    public LinkResponse uploadLinkFile(Long memberIdx, Long linkIdx, MultipartFile file) throws IOException {
        Link link = linkRepository.findById(linkIdx)
                .orElseThrow(() -> new IllegalArgumentException("링크를 찾을 수 없습니다."));

        String path = saveFile(memberIdx, "link_" + linkIdx, file);
        link.updateFilePath(path);

        List<BranchResponse> branches = branchRepository.findByLinkIdxOrderBySortOrder(linkIdx)
                .stream().map(BranchResponse::from).toList();
        return LinkResponse.from(link, branches);
    }

    // 가지치기 항목 파일 업로드
    @Transactional
    public BranchResponse uploadBranchFile(Long memberIdx, Long branchIdx, MultipartFile file) throws IOException {
        LinkBranch branch = branchRepository.findById(branchIdx)
                .orElseThrow(() -> new IllegalArgumentException("가지 항목을 찾을 수 없습니다."));

        String path = saveFile(memberIdx, "branch_" + branchIdx, file);
        branch.updateFilePath(path);
        return BranchResponse.from(branch);
    }

    // ── 내부 헬퍼 ──────────────────────────────────────────────

    private String saveFile(Long memberIdx, String prefix, MultipartFile file) throws IOException {
        String ext = getExtension(file.getOriginalFilename());
        Path dir = Paths.get(uploadDir, String.valueOf(memberIdx));
        Files.createDirectories(dir);
        String fileName = prefix + "_" + UUID.randomUUID() + ext;
        Path dest = dir.resolve(fileName);
        // transferTo(File)는 Tomcat 임시 경로 기준으로 해석되어 FileNotFoundException 유발
        // InputStream에서 직접 복사하면 경로 문제 없이 동작함
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        return dest.toString();
    }

    private Long getProfileIdx(Long memberIdx) {
        return profileRepository.findByMemberIdx(memberIdx)
                .map(Profile::getIdx)
                .orElseThrow(() -> new IllegalStateException("프로필이 없습니다. 먼저 프로필을 저장하세요."));
    }

    private Long getOrCreateProfile(Long memberIdx) {
        return profileRepository.findByMemberIdx(memberIdx)
                .map(Profile::getIdx)
                .orElseGet(() -> profileRepository.save(
                        com.kangsan.linktree.profile.Profile.builder()
                                .memberIdx(memberIdx).build()).getIdx());
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
