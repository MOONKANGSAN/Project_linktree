package com.kangsan.linktree.member;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 로그인 아이디로 회원 조회
    // 필드명이 "id"라서 Spring Data 메서드명 유추(existsById 등)가 PK(idx)와 헷갈릴 수 있어 JPQL로 명시
    @Query("select m from Member m where m.id = :loginId")
    Optional<Member> findByLoginId(@Param("loginId") String loginId);

    // 로그인 아이디 중복 여부 확인 (회원가입 시 사용)
    @Query("select count(m) > 0 from Member m where m.id = :loginId")
    boolean existsByLoginId(@Param("loginId") String loginId);
}
