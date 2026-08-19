package com.kangsan.linktree.profile;

// 검색 결과 프로젝션 — ProfileRepository의 네이티브 SQL 검색 쿼리 결과를 매핑
// (컬럼 별칭 loginId / nickname / photoPath / bio1 과 getter 이름이 대소문자 무시하고 일치해야 함)
public interface ProfileSearchResult {
    String getLoginId();
    String getNickname();
    String getPhotoPath();
    String getBio1();
}
