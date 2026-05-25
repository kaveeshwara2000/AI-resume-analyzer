import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Upload, FileText, Sparkles, ArrowLeft, AlertCircle, Award, CheckCircle, ChevronRight, RefreshCw, X } from 'lucide-react'

const loadingPhrases = [
  "Uploading your resume PDF...",
  "Parsing text from document pages...",
  "Opening secure pipeline to Gemini AI...",
  "Extracting core competencies...",
  "Matching skills with target requirements...",
  "Formulating ATS optimization feedback...",
  "Polishing final suggestions..."
]

const Analyzer = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Cycle loading phrases
  useEffect(() => {
    let interval
    if (loading) {
      interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length)
      }, 2500)
    } else {
      setPhraseIndex(0)
    }
    return () => clearInterval(interval)
  }, [loading])

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile) => {
    setError('')
    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported for resume extraction.')
      setFile(null)
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.')
      setFile(null)
      return
    }
    setFile(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !jobTitle.trim() || !jobDescription.trim()) {
      setError('Please fill in all fields and select a resume PDF.')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    // Form data packaging
    const formData = new FormData()
    formData.append('file', file)
    formData.append('jobTitle', jobTitle)
    formData.append('jobDescription', jobDescription)

    try {
      const response = await axios.post('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setResult(response.data)
    } catch (err) {
      console.error('Error analyzing resume', err)
      setError(err.response?.data?.message || 'AI resume analysis failed. Please verify the backend and Gemini configs.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setJobTitle('')
    setJobDescription('')
    setResult(null)
    setError('')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
      {/* Back to Dashboard link */}
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Workflow Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all flex flex-col md:p-10">
        
        {/* Loading State */}
        {loading && (
          <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in flex-1">
            <div className="relative w-20 h-20 mb-8">
              {/* Outer pulsing ring */}
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600/10 dark:border-indigo-400/10 rounded-full animate-ping"></div>
              {/* Spinning primary dial */}
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <Sparkles className="h-7.5 w-7.5 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Analyzing Resume</h2>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-md h-12 transition-all duration-350">
              {loadingPhrases[phraseIndex]}
            </p>
          </div>
        )}

        {/* Form State */}
        {!loading && !result && (
          <div className="space-y-8 flex-1">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Run Resume Match Analyzer</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Upload your resume PDF and paste the job details. Our Gemini engine will perform an automated ATS compatibility check.
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-4 rounded-xl text-rose-600 dark:text-rose-400 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left: Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Target Job Title
                    </label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-550 transition-all duration-200"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Job Description
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-555 transition-all duration-200 resize-none"
                      placeholder="Paste the key responsibilities, requirements, and preferred qualifications of the job..."
                    />
                  </div>
                </div>

                {/* Right: File Drag-and-Drop */}
                <div className="flex flex-col">
                  <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Upload Resume PDF
                  </span>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20' 
                        : file 
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10'
                        : 'border-slate-200 hover:border-indigo-400 dark:border-slate-800'
                    }`}
                  >
                    {file ? (
                      <div className="space-y-4">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs mx-auto">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="inline-flex items-center text-xs font-semibold text-rose-500 hover:underline space-x-1"
                        >
                          <X className="h-3 w-3" />
                          <span>Remove file</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                          <Upload className="h-7 w-7" />
                        </div>
                        <div>
                          <label className="relative cursor-pointer rounded-md font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              accept=".pdf"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            or drag and drop here
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-550">
                          PDF files up to 5MB are supported
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Action */}
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={!file || !jobTitle.trim() || !jobDescription.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 space-x-2"
                >
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Start AI Match Check</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Results State */}
        {!loading && result && (
          <div className="space-y-8 animate-fade-in flex-1">
            
            {/* Results Title Block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-6 space-y-4 sm:space-y-0">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Analysis Report Generated
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {result.jobTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  File: {result.resumeFileName}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors space-x-1.5"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Analyze New</span>
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* ATS Score Dial Card */}
              <div className="rounded-2xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-950/20 p-6 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">ATS Resume Score</span>
                
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* SVG circular track */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="72" cy="72" r="60" 
                      className="stroke-slate-200 dark:stroke-slate-800 fill-transparent"
                      strokeWidth="10" 
                    />
                    <circle 
                      cx="72" cy="72" r="60" 
                      className={`fill-transparent stroke-current transition-all duration-1000 ${
                        result.resumeScore >= 80 ? 'text-emerald-500' :
                        result.resumeScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                      }`}
                      strokeWidth="10" 
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - result.resumeScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-slate-950 dark:text-white">
                      {result.resumeScore}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      out of 100
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed max-w-[200px]">
                  {result.resumeScore >= 80 ? 'Excellent structure and vocabulary alignment.' :
                   result.resumeScore >= 60 ? 'Satisfactory structure, but requires formatting refinement.' :
                   'Weak layout or key section markers missing. Fix urgently.'}
                </p>
              </div>

              {/* Match Strength Card */}
              <div className="rounded-2xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-950/20 p-6 flex flex-col justify-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Skill Match Percentage</span>
                
                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                    {result.skillMatchPercentage}%
                  </span>
                  <span className="text-sm font-semibold text-slate-500">strength</span>
                </div>

                <div className="mt-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${result.skillMatchPercentage}%` }}
                  ></div>
                </div>

                <div className="mt-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                    <span>Matched skills: {result.matchedSkills?.length || 0} keywords</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                    <span>Missing credentials: {result.missingSkills?.length || 0} critical requirements</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ATS Feedback Block */}
            <div className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">ATS Compatibility Feedback</h3>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-350">
                {result.atsFeedback}
              </div>
            </div>

            {/* Core Skills Chip Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matched */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Matched Skills ({result.matchedSkills?.length || 0})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedSkills?.length > 0 ? (
                    result.matchedSkills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 transition-transform hover:scale-102">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs">No matching credentials found.</span>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Missing/Weak Skills ({result.missingSkills?.length || 0})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills?.length > 0 ? (
                    result.missingSkills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30 transition-transform hover:scale-102">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs">No critical gaps! Outstanding alignment.</span>
                  )}
                </div>
              </div>

            </div>

            {/* Improvement Checklist */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Actionable Recommendations</h3>
              <div className="space-y-3">
                {result.improvementSuggestions?.length > 0 ? (
                  result.improvementSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-indigo-50/20 dark:bg-indigo-950/10 p-4 rounded-xl border border-indigo-100/30 dark:border-indigo-900/10">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-350 mt-0.5">{suggestion}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No suggestions needed. Your resume is highly optimized!</div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default Analyzer
