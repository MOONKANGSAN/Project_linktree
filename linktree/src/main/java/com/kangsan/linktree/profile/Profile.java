package com.kangsan.linktree.profile;

import com.kangsan.linktree.global.enums.CommonState;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

/**
 * 프로필 엔티티 (DB 테이블: profile)
 * 회원 1명당 프로필 1개, 소개글 최대 3줄, 프로필 사진 경로 보관
 */
@Entity
@Table(name = "profile")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long idx;

    // 프로필 상태 (ACTIVE: 정상, INACTIVE: 비활성) — 기본값 ACTIVE
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, columnDefinition = "VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'")
    private CommonState state;

    // 연결된 회원 고유번호 (member.idx 참조)
    @Column(name = "member_idx", nullable = false, unique = true)
    private Long memberIdx;

    // 프로필 사진 파일 경로 (uploads/{memberIdx}/photo.확장자)
    @Column(name = "photo_path", length = 500)
    private String photoPath;

    // 공유 링크용 UUID — loginId를 URL에 노출하지 않고 프로필 공유 시 사용
    @Column(name = "share_token", unique = true, length = 36)
    private String shareToken;

    // 공개여부 (1:나만보기 / 2:전체공개(기본) / 3:링크받은사람만) — DB TINYINT
    @Convert(converter = ShareTypeConverter.class)
    @Column(name = "visibility", nullable = false, columnDefinition = "TINYINT NOT NULL DEFAULT 2")
    private ShareType visibility = ShareType.PUBLIC;

    // 닉네임 (선택 입력, 공개 프로필 카드에 표시)
    @Column(name = "nickname", length = 50)
    private String nickname;

    // 소개글 1~3 (선택 입력)
    @Column(name = "bio1", length = 200)
    private String bio1;

    @Column(name = "bio2", length = 200)
    private String bio2;

    @Column(name = "bio3", length = 200)
    private String bio3;

    @Builder
    public Profile(Long memberIdx, String photoPath, ShareType visibility, String nickname, String bio1, String bio2, String bio3) {
        this.memberIdx = memberIdx;
        this.photoPath = photoPath;
        this.shareToken = UUID.randomUUID().toString();
        this.visibility = visibility != null ? visibility : ShareType.PUBLIC;
        this.nickname = nickname;
        this.bio1 = bio1;
        this.bio2 = bio2;
        this.bio3 = bio3;
        this.state = CommonState.ACTIVE;
    }

    // 공개여부 + 닉네임 + 소개글 업데이트 (저장 시 함께 처리)
    // shareToken이 없는 기존 데이터도 이 시점에 자동 생성 (마이그레이션)
    public void updateProfile(ShareType visibility, String nickname, String bio1, String bio2, String bio3) {
        if (this.shareToken == null) this.shareToken = UUID.randomUUID().toString();
        this.visibility = visibility != null ? visibility : ShareType.PUBLIC;
        this.nickname = nickname;
        this.bio1 = bio1;
        this.bio2 = bio2;
        this.bio3 = bio3;
    }

    public void updatePhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }
}
