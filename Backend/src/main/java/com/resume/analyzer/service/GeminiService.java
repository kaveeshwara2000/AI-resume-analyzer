package com.resume.analyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String analyzeResume(String resumeText, String jobTitle, String jobDescription) throws Exception {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("Gemini API key is missing. Using mock analysis response.");
            return getMockAnalysis();
        }

        String prompt = buildPrompt(resumeText, jobTitle, jobDescription);

        // Build API request payload for Gemini API
        Map<String, Object> requestBody = new HashMap<>();
        
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);
        
        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", Collections.singletonList(textPart));
        
        requestBody.put("contents", Collections.singletonList(parts));

        // Add responseMimeType configuration for structured JSON output
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        String fullUrl = apiUrl + "?key=" + apiKey;
        logger.info("Calling Gemini API for analysis...");
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseGeminiResponse(response.getBody());
            } else {
                throw new RuntimeException("Gemini API returned status code: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error communicating with Gemini API: {}", e.getMessage(), e);
            throw new RuntimeException("AI analysis failed: " + e.getMessage());
        }
    }

    private String buildPrompt(String resumeText, String jobTitle, String jobDescription) {
        return "You are an expert ATS (Applicant Tracking System) recruiter and resume optimization assistant.\n" +
                "Evaluate the Resume Text below against the provided Job Title and Job Description.\n\n" +
                "Generate a JSON response conforming strictly to this schema:\n" +
                "{\n" +
                "  \"skillMatchPercentage\": 75, // integer between 0 and 100\n" +
                "  \"matchedSkills\": [\"Java\", \"Spring Boot\"], // array of strings\n" +
                "  \"missingSkills\": [\"Docker\", \"Kubernetes\"], // array of strings\n" +
                "  \"resumeScore\": 82, // integer between 0 and 100\n" +
                "  \"atsFeedback\": \"Detailed textual ATS compatibility feedback...\", // string\n" +
                "  \"improvementSuggestions\": [\"Tip 1\", \"Tip 2\"] // array of strings\n" +
                "}\n\n" +
                "Resume Text:\n" +
                resumeText + "\n\n" +
                "Target Job Title:\n" +
                jobTitle + "\n\n" +
                "Job Description:\n" +
                jobDescription + "\n\n" +
                "Return only valid JSON. Do not write anything outside the JSON object.";
    }

    private String parseGeminiResponse(String responseBody) throws Exception {
        JsonNode rootNode = objectMapper.readTree(responseBody);
        JsonNode textNode = rootNode
                .path("candidates").get(0)
                .path("content")
                .path("parts").get(0)
                .path("text");
        
        if (textNode.isMissingNode()) {
            throw new RuntimeException("Invalid response structure from Gemini API");
        }
        
        return textNode.asText();
    }

    private String getMockAnalysis() {
        return "{\n" +
                "  \"skillMatchPercentage\": 65,\n" +
                "  \"matchedSkills\": [\"Java\", \"REST APIs\", \"Hibernate\"],\n" +
                "  \"missingSkills\": [\"Spring Security\", \"JWT\", \"Docker\", \"Tailwind CSS\"],\n" +
                "  \"resumeScore\": 70,\n" +
                "  \"atsFeedback\": \"Your resume has a clear layout, but lacks formatting optimization for ATS. Several keywords from the target role are missing, which could cause filtering issues.\",\n" +
                "  \"improvementSuggestions\": [\n" +
                "    \"Add projects implementing secure authentication (Spring Security + JWT).\",\n" +
                "    \"List backend configuration tools like Docker or Kubernetes to align with modern requirements.\",\n" +
                "    \"Quantify achievements under each job experience with specific percentage improvements.\"\n" +
                "  ]\n" +
                "}";
    }
}
