package com.mysite.sbb.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedDateDesc(com.mysite.sbb.user.SiteUser recipient);
}
