package com.mysite.sbb.notification;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private String message;
    private String link;
    private boolean read;
    private LocalDateTime createdDate;
    private NotificationType notificationType;

    public static NotificationDto fromEntity(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getMessage(),
                notification.getLink(),
                notification.isRead(),
                notification.getCreatedDate(),
                notification.getNotificationType()
        );
    }
}
