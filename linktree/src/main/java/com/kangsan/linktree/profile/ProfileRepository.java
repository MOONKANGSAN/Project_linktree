package com.kangsan.linktree.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByMemberIdx(Long memberIdx);

    boolean existsByMemberIdx(Long memberIdx);
}
