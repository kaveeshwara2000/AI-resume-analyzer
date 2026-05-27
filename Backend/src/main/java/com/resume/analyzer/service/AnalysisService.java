package com.resume.analyzer.service;

import com.resume.analyzer.model.ResumeAnalysis;
import com.resume.analyzer.model.User;
import com.resume.analyzer.repository.AnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnalysisService {

    @Autowired
    private AnalysisRepository analysisRepository;

    public ResumeAnalysis saveAnalysis(ResumeAnalysis analysis) {
        return analysisRepository.save(analysis);
    }

    public List<ResumeAnalysis> getAnalysesForUser(User user) {
        return analysisRepository.findByUserIdOrderByAnalyzedAtDesc(user.getId());
    }

    public Optional<ResumeAnalysis> getAnalysisById(Long id) {
        return analysisRepository.findById(id);
    }

    public void deleteAnalysis(Long id) {
        analysisRepository.deleteById(id);
    }
}
