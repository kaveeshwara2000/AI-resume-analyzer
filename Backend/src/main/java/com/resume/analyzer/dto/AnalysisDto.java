package com.resume.analyzer.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.analyzer.model.ResumeAnalysis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisDto {
    private Long id;
    private String jobTitle;
    private String jobDescription;
    private String resumeFileName;
    private Integer skillMatchPercentage;
    private List<String> missingSkills;
    private List<String> matchedSkills;
    private Integer resumeScore;
    private String atsFeedback;
    private List<String> improvementSuggestions;
    private LocalDateTime analyzedAt;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static AnalysisDto fromEntity(ResumeAnalysis entity) {
        if (entity == null) return null;

        List<String> missing = deserializeList(entity.getMissingSkills());
        List<String> matched = deserializeList(entity.getMatchedSkills());
        List<String> suggestions = deserializeList(entity.getImprovementSuggestions());

        return AnalysisDto.builder()
                .id(entity.getId())
                .jobTitle(entity.getJobTitle())
                .jobDescription(entity.getJobDescription())
                .resumeFileName(entity.getResumeFileName())
                .skillMatchPercentage(entity.getSkillMatchPercentage())
                .missingSkills(missing)
                .matchedSkills(matched)
                .resumeScore(entity.getResumeScore())
                .atsFeedback(entity.getAtsFeedback())
                .improvementSuggestions(suggestions)
                .analyzedAt(entity.getAnalyzedAt())
                .build();
    }

    private static List<String> deserializeList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            // Fallback: split by comma if it's not a JSON list
            try {
                if (json.startsWith("[") && json.endsWith("]")) {
                    // It's a JSON array format that failed to parse normally, strip brackets
                    String cleaned = json.substring(1, json.length() - 1).replace("\"", "");
                    return List.of(cleaned.split("\\s*,\\s*"));
                }
            } catch (Exception ignored) {}
            return List.of(json.split("\\s*,\\s*"));
        }
    }
}
