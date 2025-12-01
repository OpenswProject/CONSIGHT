package com.mysite.sbb.user;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SocialService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final BlockRepository blockRepository;
    private final ReportRepository reportRepository;

    // ======== 팔로우 토글 ========
    public boolean toggleFollow(SiteUser me, SiteUser target) {
        var opt = followRepository.findByFollowerAndFollowing(me, target);
        if (opt.isPresent()) {
            followRepository.delete(opt.get());
            return false; // 언팔로우
        } else {
            Follow f = new Follow(null, me, target);
            followRepository.save(f);
            return true; // 팔로우
        }
    }

    // 팔로잉 목록
    public List<Follow> getFollowing(SiteUser user) {
        return followRepository.findByFollower(user);
    }

    // 팔로워 목록
    public List<Follow> getFollowers(SiteUser user) {
        return followRepository.findByFollowing(user);
    }

    // ======== 차단 토글 ========
    public boolean toggleBlock(SiteUser me, SiteUser target) {
        var opt = blockRepository.findByBlockerAndBlocked(me, target);
        if (opt.isPresent()) {
            blockRepository.delete(opt.get());
            return false; // 차단 해제
        } else {
            Block b = new Block();
            b.setBlocker(me);
            b.setBlocked(target);
            blockRepository.save(b);
            return true; // 차단
        }
    }

    // 차단 목록
    public List<Block> getBlockedUsers(SiteUser user) {
        return blockRepository.findByBlocker(user);
    }

    // ======== 신고하기 ========
    public void reportUser(SiteUser reporter, SiteUser target, String reason) {
        Report r = new Report();
        r.setReporter(reporter);
        r.setReported(target);
        r.setReason(reason);
        reportRepository.save(r);
    }

    public List<Report> getMyReports(SiteUser user) {
        return reportRepository.findByReporter(user);
    }
}
