package com.kangsan.linktree.profile;

/**
 * 링크업 공개여부 설정
 * DB에는 TINYINT(1/2/3)로 저장 — ShareTypeConverter가 변환 담당
 */
public enum ShareType {
    PRIVATE(1),    // 나만보기
    PUBLIC(2),     // 전체공개 (기본값)
    LINK_ONLY(3);  // 링크를 전달받은 사람만

    private final int value;

    ShareType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    // int → enum 변환 (DB 값 → 엔티티)
    public static ShareType from(int value) {
        for (ShareType type : values()) {
            if (type.value == value) return type;
        }
        throw new IllegalArgumentException("알 수 없는 공개여부 값: " + value);
    }
}
