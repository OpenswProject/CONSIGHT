package com.mysite.sbb.follow;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j // 추가
public class FollowService {

    private final FollowRepository followRepository;
    private final UserService userService;

    @Transactional
    public void follow(String followeeUsername, String followerUsername) {
        SiteUser followee = userService.getUser(followeeUsername);
        SiteUser follower = userService.getUser(followerUsername);

        if (followRepository.findByFollowerAndFollowee(follower, followee).isPresent()) {
            throw new IllegalStateException("Already following this user.");
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowee(followee);
        followRepository.save(follow);
    }

    @Transactional
    public void unfollow(String followeeUsername, String followerUsername) {
        SiteUser followee = userService.getUser(followeeUsername);
        SiteUser follower = userService.getUser(followerUsername);

        Follow follow = followRepository.findByFollowerAndFollowee(follower, followee)
                .orElseThrow(() -> new IllegalStateException("Follow relationship not found."));

        followRepository.delete(follow);
    }

    public List<SiteUser> getFollowers(String username) {
        log.info("Fetching followers for user: {}", username);
        SiteUser user = userService.getUser(username);
        List<SiteUser> followers = followRepository.findByFollowee(user).stream()
                .map(Follow::getFollower)
                .collect(Collectors.toList());
        log.info("Found {} followers for user {}: {}", followers.size(), username, followers.stream().map(SiteUser::getUsername).collect(Collectors.joining(", ")));
        return followers;
    }

    public List<SiteUser> getFollowing(String username) {
        SiteUser user = userService.getUser(username);
        return followRepository.findByFollower(user).stream()
                .map(Follow::getFollowee)
                .collect(Collectors.toList());
    }

    public FollowCountsDto getFollowCounts(String username) {
        SiteUser user = userService.getUser(username);
        long followerCount = followRepository.countByFollowee(user);
        long followingCount = followRepository.countByFollower(user);
        return new FollowCountsDto(followerCount, followingCount);
    }

    public boolean isFollowing(String followeeUsername, String followerUsername) {
        if (followerUsername == null) {
            return false;
        }
        SiteUser followee = userService.getUser(followeeUsername);
        SiteUser follower = userService.getUser(followerUsername);
        return followRepository.findByFollowerAndFollowee(follower, followee).isPresent();
    }
}
