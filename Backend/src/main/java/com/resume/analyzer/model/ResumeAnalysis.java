package com.resume.analyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Lob
    @Column(name = "job_description", columnDefinition = "TEXT", nullable = false)
    private String jobDescription;

    @Column(name = "resume_file_name")
    private String resumeFileName;

    @Column(name = "skill_match_percentage")
    private Integer skillMatchPercentage;

    @Lob
    @Column(name = "missing_skills", columnDefinition = "TEXT")
    private String missingSkills; // JSON string of list of missing skills

    @Lob
    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills; // JSON string of list of matched skills

    @Column(name = "resume_score")
    private Integer resumeScore;

    @Lob
    @Column(name = "ats_feedback", columnDefinition = "TEXT")
    private String atsFeedback;

    @Lob
    @Column(name = "improvement_suggestions", columnDefinition = "TEXT")
    private String improvementSuggestions; // JSON string of list of suggestions

    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;

    @PrePersist
    protected void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}
