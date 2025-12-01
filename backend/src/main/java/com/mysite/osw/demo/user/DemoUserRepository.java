package com.mysite.osw.demo.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DemoUserRepository extends JpaRepository<User, Long> {
    // 기본적으로 findById 등이 자동으로 제공됩니다.
}