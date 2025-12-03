package com.mysite.sbb.follow;

import com.mysite.sbb.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{username}")
    public ResponseEntity<APIResponse<?>> follow(@PathVariable("username") String username, Principal principal) {
        try {
            followService.follow(username, principal.getName());
            return ResponseEntity.ok(APIResponse.success("Followed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(APIResponse.error(e.getMessage(), 400));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{username}")
    public ResponseEntity<APIResponse<?>> unfollow(@PathVariable("username") String username, Principal principal) {
        try {
            followService.unfollow(username, principal.getName());
            return ResponseEntity.ok(APIResponse.success("Unfollowed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(APIResponse.error(e.getMessage(), 400));
        }
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<APIResponse<List<UserDto>>> getFollowers(@PathVariable("username") String username) {
        List<UserDto> followers = followService.getFollowers(username).stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(APIResponse.success("Followers fetched successfully.", followers));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<APIResponse<List<UserDto>>> getFollowing(@PathVariable("username") String username) {
        List<UserDto> following = followService.getFollowing(username).stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(APIResponse.success("Following list fetched successfully.", following));
    }

    @GetMapping("/{username}/counts")
    public ResponseEntity<APIResponse<FollowCountsDto>> getFollowCounts(@PathVariable("username") String username) {
        FollowCountsDto counts = followService.getFollowCounts(username);
        return ResponseEntity.ok(APIResponse.success("Follow counts fetched successfully.", counts));
    }

    @GetMapping("/{username}/status")
    public ResponseEntity<APIResponse<FollowStatusDto>> getFollowStatus(@PathVariable("username") String username, Principal principal) {
        // If the user is not logged in, they are not following anyone.
        String followerUsername = (principal != null) ? principal.getName() : null;
        boolean isFollowing = followService.isFollowing(username, followerUsername);
        return ResponseEntity.ok(APIResponse.success("Follow status fetched successfully.", new FollowStatusDto(isFollowing)));
    }
}
