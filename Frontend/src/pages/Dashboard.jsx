import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Plus, Search, Trash2, Eye, FileText, Sparkles, TrendingUp, Award, Clock, ArrowRight, X, ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const Dashboard = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/resume/history')
      setHistory(response.data)
    } catch (err) {
      console.error('Error fetching history', err)
      setError('Could not retrieve analysis history. Make sure the database is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return

    try {
      await axios.delete(`/api/resume/analysis/${id}`)
      setHistory(history.filter((item) => item.id !== id))
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null)
      }
    } catch (err) {
      console.error('Error deleting report', err)
      alert('Failed to delete report.')
    }
  }

  // Calculate statistics
  const totalResumes = history.length
  const avgScore = totalResumes
    ? Math.round(history.reduce((sum, item) => sum + (item.resumeScore || 0), 0) / totalResumes)
    : 0
  const avgMatch = totalResumes
    ? Math.round(history.reduce((sum, item) => sum + (item.skillMatchPercentage || 0), 0) / totalResumes)
    : 0

  // Filter history based on search
  const filteredHistory = history.filter((item) =>
    item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.resumeFileName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const scoreBadgeClass = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
    if (score >= 60) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 flex-1 flex flex-col space-y-6 sm:space-y-8">

      {/* Header and Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.username}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor and refine your resumes against prospective job descriptions.
          </p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors space-x-2 flex-shrink-0 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Analyze Resume</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-3">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Analyzed</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalResumes}</span>
            <span className="ml-2 text-sm text-slate-500">files uploaded</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg ATS Compatibility</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgScore}%</span>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${avgScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Skill Match</span>
            <div className="rounded-lg bg-violet-50 p-2 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgMatch}%</span>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${avgMatch}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-colors flex-1 flex flex-col min-h-[400px]">
        {/* Search & Actions Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analysis History</h2>
          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Loading / Error / Empty / List */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="relative w-10 h-10">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 dark:border-slate-850 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="mt-3 text-sm text-slate-500">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <ShieldAlert className="h-12 w-12 text-rose-500" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Database connection failure</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">{error}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No analysis reports</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              {searchQuery ? 'No results match your query.' : 'Upload and run your first resume analysis report to see details here.'}
            </p>
            {!searchQuery && (
              <Link
                to="/analyze"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-950 transition-colors"
              >
                <span>Upload PDF now</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* ── MOBILE CARD LIST (< md) ── */}
            <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800 flex-1">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAnalysis(item)}
                  className="p-4 flex flex-col gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  {/* Row 1: Title + badges */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight min-w-0 truncate">
                      {item.jobTitle}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${scoreBadgeClass(item.resumeScore)}`}>
                        {item.resumeScore}%
                      </span>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                        {item.skillMatchPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Filename + date + actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{item.resumeFileName || 'resume.pdf'}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(item.analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedAnalysis(item) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── DESKTOP TABLE (md+) ── */}
            <div className="hidden md:block overflow-x-auto flex-1">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Role</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">File Name</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">ATS Score</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Skill Match</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                    <th scope="col" className="relative px-6 py-3.5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedAnalysis(item)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-semibold text-slate-950 dark:text-white text-sm">{item.jobTitle}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {item.resumeFileName || 'resume.pdf'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreBadgeClass(item.resumeScore)}`}>
                          {item.resumeScore}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{item.skillMatchPercentage}%</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDate(item.analyzedAt)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedAnalysis(item) }}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                            title="View analysis details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                            title="Delete report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Analysis Details Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">

            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">Analysis Details</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {selectedAnalysis.jobTitle} • {selectedAnalysis.resumeFileName}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">

              {/* Scores Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-4 sm:p-5 border border-indigo-100/50 dark:border-indigo-900/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-indigo-300">ATS Resume Score</h4>
                    <p className="text-xs text-slate-500 mt-1">General quality and scan readiness</p>
                  </div>
                  <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    {selectedAnalysis.resumeScore}%
                  </div>
                </div>

                <div className="bg-violet-50/50 dark:bg-violet-950/20 rounded-2xl p-4 sm:p-5 border border-violet-100/50 dark:border-violet-900/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-violet-300">Skill Alignment</h4>
                    <p className="text-xs text-slate-500 mt-1">Percentage match with job requirements</p>
                  </div>
                  <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 flex-shrink-0">
                    {selectedAnalysis.skillMatchPercentage}%
                  </div>
                </div>
              </div>

              {/* Feedback Block */}
              <div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-2">ATS Compatibility Feedback</h4>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  {selectedAnalysis.atsFeedback}
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* Matched Skills */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                    <span>Matched Skills ({selectedAnalysis.matchedSkills?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAnalysis.matchedSkills?.length > 0 ? (
                      selectedAnalysis.matchedSkills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs">No matching skills identified.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                    <span>Missing/Weak Skills ({selectedAnalysis.missingSkills?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAnalysis.missingSkills?.length > 0 ? (
                      selectedAnalysis.missingSkills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs">No missing skills identified! Great match.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-3">Improvement Suggestions</h4>
                <ul className="space-y-2">
                  {selectedAnalysis.improvementSuggestions?.length > 0 ? (
                    selectedAnalysis.improvementSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold text-xs mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{suggestion}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 text-xs">No specific suggestions. Resume matches excellently!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
