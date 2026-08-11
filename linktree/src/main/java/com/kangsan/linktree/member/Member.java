package com.kangsan.linktree.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 정보 엔티티 (DB 테이블: member)
 * 요청받은 필드 구성: idx(고유번호), state(상태), id(로그인 아이디), password, phone, profile_idx
 */
@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자는 외부에서 직접 호출하지 못하도록 protected로 제한
public class Member {

    // 회원 고유 번호 (PK, 자동 증가) - 아래 id 필드(로그인 아이디)와는 다른 값이므로 혼동 주의
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long idx;

    // 회원 상태 (ACTIVE: 정상, INACTIVE: 휴면, WITHDRAWN: 탈퇴)
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, length = 20)
    private MemberState state;

    // 로그인 아이디 (최대 20자, 중복 불가) - PK인 idx와 별개의 사용자 입력 아이디
    @Column(name = "id", nullable = false, unique = true, length = 20)
    private String id;

    // 비밀번호 (BCrypt 해시로 암호화되어 저장됨, 평문 저장 금지)
    @Column(name = "password", nullable = false)
    private String password;

    // 휴대폰 번호
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    // 연결된 프로필 고유번호 (프로필 기능이 아직 없으므로 FK 제약조건 없이 컬럼만 보유)
    @Column(name = "profile_idx")
    private Long profileIdx;

    // 회원가입 시 사용하는 생성자 - 비밀번호는 이미 암호화된 값을 전달받는다
    @Builder
    public Member(String id, String password, String phone) {
        this.id = id;
        this.password = password;
        this.phone = phone;
        this.state = MemberState.ACTIVE; // 가입 즉시 정상 상태로 설정
    }
}
