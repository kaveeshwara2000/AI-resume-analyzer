package com.resume.analyzer.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.analyzer.dto.AnalysisDto;
import com.resume.analyzer.dto.ApiResponse;
import com.resume.analyzer.model.ResumeAnalysis;
import com.resume.analyzer.model.User;
import com.resume.analyzer.security.CustomUserDetails;
import com.resume.analyzer.service.AnalysisService;
import com.resume.analyzer.service.GeminiService;
import com.resume.analyzer.service.PdfService;
import com.resume.analyzer.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private PdfService pdfService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private UserService userService;

    @Autowired
    private AnalysisService analysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("jobDescription") String jobDescription,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Please upload a valid PDF file."));
        }

        try {
            logger.info("Extracting text from uploaded PDF for user: {}", userDetails.getUsername());
            String resumeText = pdfService.extractText(file);

            logger.info("Sending resume and JD to Gemini API...");
            String rawJsonAnalysis = geminiService.analyzeResume(resumeText, jobTitle, jobDescription);

            // Parse raw JSON to map fields securely
            ResumeAnalysis analysis = parseAndBuildAnalysis(rawJsonAnalysis, jobTitle, jobDescription, file.getOriginalFilename());
            
            // Set User
            User user = userService.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Logged in user not found in DB"));
            analysis.setUser(user);

            logger.info("Saving analysis to database...");
            ResumeAnalysis savedAnalysis = analysisService.saveAnalysis(analysis);

            return ResponseEntity.ok(AnalysisDto.fromEntity(savedAnalysis));

        } catch (IOException e) {
            logger.error("Error reading PDF: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to parse PDF file: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error during analysis: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "AI Analysis failed: " + e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userService.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ResumeAnalysis> analyses = analysisService.getAnalysesForUser(user);
        List<AnalysisDto> dtos = new ArrayList<>();
        for (ResumeAnalysis analysis : analyses) {
            dtos.add(AnalysisDto.fromEntity(analysis));
        }

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/analysis/{id}")
    public ResponseEntity<?> getAnalysis(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Optional<ResumeAnalysis> analysisOpt = analysisService.getAnalysisById(id);

        if (analysisOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Analysis report not found."));
        }

        ResumeAnalysis analysis = analysisOpt.get();
        if (!analysis.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(false, "You are not authorized to view this report."));
        }

        return ResponseEntity.ok(AnalysisDto.fromEntity(analysis));
    }

    @DeleteMapping("/analysis/{id}")
    public ResponseEntity<?> deleteAnalysis(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Optional<ResumeAnalysis> analysisOpt = analysisService.getAnalysisById(id);

        if (analysisOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Analysis report not found."));
        }

        ResumeAnalysis analysis = analysisOpt.get();
        if (!analysis.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(false, "You are not authorized to delete this report."));
        }

        analysisService.deleteAnalysis(id);
        return ResponseEntity.ok(new ApiResponse(true, "Analysis report deleted successfully."));
    }

    private ResumeAnalysis parseAndBuildAnalysis(String rawJson, String jobTitle, String jobDescription, String fileName) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            
            // Check variations in key names to ensure robustness
            int skillMatchPercent = 0;
            if (root.has("skillMatchPercentage")) {
                skillMatchPercent = root.get("skillMatchPercentage").asInt();
            } else if (root.has("matchPercentage")) {
                skillMatchPercent = root.get("matchPercentage").asInt();
            } else if (root.has("match_percentage")) {
                skillMatchPercent = root.get("match_percentage").asInt();
            }

            int score = 0;
            if (root.has("resumeScore")) {
                score = root.get("resumeScore").asInt();
            } else if (root.has("score")) {
                score = root.get("score").asInt();
            } else if (root.has("resume_score")) {
                score = root.get("resume_score").asInt();
            }

            String matchedSkills = "[]";
            if (root.has("matchedSkills")) {
                matchedSkills = objectMapper.writeValueAsString(root.get("matchedSkills"));
            } else if (root.has("matched_skills")) {
                matchedSkills = objectMapper.writeValueAsString(root.get("matched_skills"));
            }

            String missingSkills = "[]";
            if (root.has("missingSkills")) {
                missingSkills = objectMapper.writeValueAsString(root.get("missingSkills"));
            } else if (root.has("missing_skills")) {
                missingSkills = objectMapper.writeValueAsString(root.get("missing_skills"));
            }

            String atsFeedback = "";
            if (root.has("atsFeedback")) {
                atsFeedback = root.get("atsFeedback").asText();
            } else if (root.has("feedback")) {
                atsFeedback = root.get("feedback").asText();
            } else if (root.has("ats_feedback")) {
                atsFeedback = root.get("ats_feedback").asText();
            }

            String suggestions = "[]";
            if (root.has("improvementSuggestions")) {
                suggestions = objectMapper.writeValueAsString(root.get("improvementSuggestions"));
            } else if (root.has("suggestions")) {
                suggestions = objectMapper.writeValueAsString(root.get("suggestions"));
            } else if (root.has("improvement_suggestions")) {
                suggestions = objectMapper.writeValueAsString(root.get("improvement_suggestions"));
            }

            return ResumeAnalysis.builder()
                    .jobTitle(jobTitle)
                    .jobDescription(jobDescription)
                    .resumeFileName(fileName)
                    .skillMatchPercentage(skillMatchPercent)
                    .matchedSkills(matchedSkills)
                    .missingSkills(missingSkills)
                    .resumeScore(score)
                    .atsFeedback(atsFeedback)
                    .improvementSuggestions(suggestions)
                    .build();

        } catch (Exception e) {
            logger.warn("Parsing JSON directly failed. Attempting cleanup...", e);
            // Fallback: build a default structure if parsing fails
            return ResumeAnalysis.builder()
                    .jobTitle(jobTitle)
                    .jobDescription(jobDescription)
                    .resumeFileName(fileName)
                    .skillMatchPercentage(50)
                    .matchedSkills("[]")
                    .missingSkills("[]")
                    .resumeScore(50)
                    .atsFeedback("AI returned an unparseable response: " + rawJson)
                    .improvementSuggestions("[]")
                    .build();
        }
    }
}
