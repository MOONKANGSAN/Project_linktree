package com.kangsan.linktree.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 업로드 파일을 /uploads/** URL로 노출 — 프로필 사진, 포트폴리오 파일 브라우저 접근 허용
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // file: 프로토콜로 절대 경로 지정, 끝 슬래시 필수
        String location = "file:" + uploadDir.replace("\\", "/");
        if (!location.endsWith("/")) location += "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
