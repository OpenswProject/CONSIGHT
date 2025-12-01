package com.mysite.sbb.user;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // 내가 신고한 모든 유저
    List<Report> findByReporter(SiteUser reporter);

    // 나를 신고한 모든 유저
    List<Report> findByReported(SiteUser reported);
}
