package com.mysite.sbb.notification;

import com.mysite.sbb.user.SiteUser;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private SiteUser recipient; // 알림을 받는 사용자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private SiteUser sender; // 알림을 발생시킨 사용자 (예: 새 글 작성자)

    private String message; // 알림 메시지

    private String link; // 알림 클릭 시 이동할 링크 (예: 새 글의 URL)

    private boolean isRead; // 읽음 여부

    private LocalDateTime createdDate; // 알림 생성일

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType; // 알림 타입
}
