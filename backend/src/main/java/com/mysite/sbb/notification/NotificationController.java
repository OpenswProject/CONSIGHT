package com.mysite.sbb.notification;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import com.mysite.sbb.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<APIResponse<List<NotificationDto>>> getNotifications(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        List<NotificationDto> notifications = notificationService.getNotificationsForUser(user);
        return ResponseEntity.ok(APIResponse.success("Notifications fetched successfully.", notifications));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/read")
    public ResponseEntity<APIResponse<?>> markAsRead(@PathVariable("id") Long id, Principal principal) {
        // Optional: Add logic to ensure the notification belongs to the principal user
        notificationService.markAsRead(id);
        return ResponseEntity.ok(APIResponse.success("Notification marked as read."));
    }
}
