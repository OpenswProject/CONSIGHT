package com.mysite.sbb.user;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://devtest-theta-six.vercel.app"})
public class SocialController {

    private final UserService userService;
    private final SocialService socialService;

    // ===== 팔로우 토글 =====
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/follow/{username}")
    public ResponseEntity<FollowResponse> follow(
            @PathVariable("username") String username,
            Principal principal
    ) {
        SiteUser me = userService.getUser(principal.getName());
        SiteUser target = userService.getUser(username);
        boolean following = socialService.toggleFollow(me, target);
        return ResponseEntity.ok(new FollowResponse(following));
    }

    // 팔로잉 조회
    @GetMapping("/following")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Follow>> following(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        return ResponseEntity.ok(socialService.getFollowing(user));
    }

    // 팔로워 조회
    @GetMapping("/followers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Follow>> followers(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        return ResponseEntity.ok(socialService.getFollowers(user));
    }

    // ===== 차단 토글 =====
    @PostMapping("/block/{username}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BlockResponse> block(
            @PathVariable("username") String username,
            Principal principal
    ) {
        SiteUser me = userService.getUser(principal.getName());
        SiteUser target = userService.getUser(username);
        boolean blocked = socialService.toggleBlock(me, target);
        return ResponseEntity.ok(new BlockResponse(blocked));
    }

    // 차단 리스트
    @GetMapping("/blocked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Block>> blockedUsers(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        return ResponseEntity.ok(socialService.getBlockedUsers(user));
    }

    // ===== 신고하기 =====
    @PostMapping("/report/{username}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReportResponse> report(
            @PathVariable("username") String username,
            @RequestBody ReportRequest req,
            Principal principal
    ) {
        SiteUser me = userService.getUser(principal.getName());
        SiteUser target = userService.getUser(username);
        socialService.reportUser(me, target, req.getReason());
        return ResponseEntity.ok(new ReportResponse(true));
    }

    // 내가 신고한 목록
    @GetMapping("/reports")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Report>> myReports(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        return ResponseEntity.ok(socialService.getMyReports(user));
    }
}
