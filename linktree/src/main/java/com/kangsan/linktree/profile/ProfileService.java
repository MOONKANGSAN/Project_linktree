package com.kangsan.linktree.profile;

import com.kangsan.linktree.profile.dto.ProfileResponse;
import com.kangsan.linktree.profile.dto.ProfileSaveRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {

    private final ProfileRepository profileRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // 프로필이 없으면 신규 생성, 있으면 소개글 업데이트
    @Transactional
    public ProfileResponse saveBio(Long memberIdx, ProfileSaveRequest request) {
        Profile profile = profileRepository.findByMemberIdx(memberIdx)
                .orElseGet(() -> profileRepository.save(
                        Profile.builder().memberIdx(memberIdx).build()
                ));

        profile.updateBio(request.bio1(), request.bio2(), request.bio3());
        return ProfileResponse.from(profile);
    }

    // 프로필 사진 업로드: uploads/{memberIdx}/photo.{확장자} 로 저장
    @Transactional
    public ProfileResponse uploadPhoto(Long memberIdx, MultipartFile file) throws IOException {
        Profile profile = profileRepository.findByMemberIdx(memberIdx)
                .orElseGet(() -> profileRepository.save(
                        Profile.builder().memberIdx(memberIdx).build()
                ));

        String ext = getExtension(file.getOriginalFilename());
        Path dir = Paths.get(uploadDir, String.valueOf(memberIdx));
        Files.createDirectories(dir);

        String fileName = "photo_" + UUID.randomUUID() + ext;
        Path dest = dir.resolve(fileName);
        file.transferTo(dest.toFile());

        profile.updatePhotoPath(dest.toString());
        return ProfileResponse.from(profile);
    }

    public ProfileResponse getMyProfile(Long memberIdx) {
        return profileRepository.findByMemberIdx(memberIdx)
                .map(ProfileResponse::from)
                .orElse(new ProfileResponse(null, null, null, null, null));
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
