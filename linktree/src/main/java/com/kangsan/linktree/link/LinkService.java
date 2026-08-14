package com.kangsan.linktree.link;

import com.kangsan.linktree.link.dto.*;
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
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LinkService {

    private final LinkRepository linkRepository;
    private final LinkBranchRepository branchRepository;
    private final ProfileRepository profileRepository;

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
        file.transferTo(dest.toFile());
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
