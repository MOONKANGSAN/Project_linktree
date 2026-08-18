package com.kangsan.linktree.profile;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * ShareType enum ↔ DB TINYINT 변환기
 * - 저장: PUBLIC → 2, PRIVATE → 1, LINK_ONLY → 3
 * - 조회: 2 → PUBLIC, 1 → PRIVATE, 3 → LINK_ONLY
 */
@Converter
public class ShareTypeConverter implements AttributeConverter<ShareType, Integer> {

    @Override
    public Integer convertToDatabaseColumn(ShareType attribute) {
        return attribute == null ? ShareType.PUBLIC.getValue() : attribute.getValue();
    }

    @Override
    public ShareType convertToEntityAttribute(Integer dbData) {
        return dbData == null ? ShareType.PUBLIC : ShareType.from(dbData);
    }
}
