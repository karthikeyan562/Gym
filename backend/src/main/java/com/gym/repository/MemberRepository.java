package com.gym.repository;

import com.gym.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    Optional<Member> findByMemberCode(String memberCode);
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByMemberCode(String memberCode);

    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "m.phoneNumber LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(m.memberCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Member> searchMembers(@Param("query") String query);

    long countByMembershipStatus(String membershipStatus);

    List<Member> findTop10ByOrderByCreatedAtDesc();
}
