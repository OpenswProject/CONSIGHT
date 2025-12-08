package com.mysite.sbb.notification;

import com.mysite.sbb.follow.FollowService;
import com.mysite.sbb.review.Review;
import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // 추가

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j // 추가
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final FollowService followService;
    private final UserService userService;

    @Transactional
    public Notification createNotification(SiteUser recipient, SiteUser sender, String message, String link, NotificationType type) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setRead(false);
        notification.setCreatedDate(LocalDateTime.now());
        notification.setNotificationType(type);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void createNotificationForNewReview(Review review) {
        log.info("Attempting to create notifications for new review by author: {}", review.getAuthor().getUsername());
        SiteUser reviewAuthor = review.getAuthor();
        List<SiteUser> followers = followService.getFollowers(reviewAuthor.getUsername());
        log.info("Found {} followers for author {}: {}", followers.size(), reviewAuthor.getUsername(), followers.stream().map(SiteUser::getUsername).collect(Collectors.joining(", ")));

        for (SiteUser follower : followers) {
            // Prevent users from getting notifications about their own posts
            if (follower.equals(reviewAuthor)) {
                continue;
            }
            String message = String.format("%s님이 새로운 글을 업로드하였습니다.", reviewAuthor.getUsername());
            String link = "/review/" + review.getId(); // Assuming a review detail page
            createNotification(follower, reviewAuthor, message, link, NotificationType.NEW_POST);
            log.info("Notification created for follower {} about new post by {}", follower.getUsername(), reviewAuthor.getUsername());
        }
        if (followers.isEmpty()) {
            log.info("No followers found for author {}. No notifications created.", reviewAuthor.getUsername());
        }
    }

    public List<NotificationDto> getNotificationsForUser(SiteUser user) {
        List<Notification> notifications = notificationRepository.findByRecipientOrderByCreatedDateDesc(user);
        return notifications.stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
}
