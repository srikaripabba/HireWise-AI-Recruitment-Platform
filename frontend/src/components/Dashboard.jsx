
import { useState } from 'react';
import DashboardStats from './DashboardStats';
import JobForm from './JobForm';
import CandidateForm from './CandidateForm';
import ResumeUpload from './ResumeUpload';
import JobList from './JobList';
import CandidateRankings from './CandidateRankings';
import CandidateDetails from './CandidateDetails';
import './Dashboard.css';

const pages = [
    { id: 'overview', icon: '✨', label: 'Overview' },
    { id: 'jobs', icon: '💼', label: 'Jobs' },
    { id: 'candidates', icon: '👥', label: 'Candidates' },
    { id: 'screening', icon: '📄', label: 'Resume Screening' },
    { id: 'rankings', icon: '🏆', label: 'AI Rankings' },
];

function Dashboard(props) {
    const [activePage, setActivePage] = useState('overview');

    const {
        username, dashboardLoading, dashboardError,
        onRetryDashboard, totalCandidates, totalJobs,
        averageMatch, topMatch, jobTitle, setJobTitle,
        jobDescription, setJobDescription, requiredSkills,
        setRequiredSkills, handleCreateJob, jobMessage,
        candidateUsername, setCandidateUsername,
        candidateEmail, setCandidateEmail,
        candidatePassword, setCandidatePassword,
        handleCreateCandidate, candidateMessage, jobs,
        candidates, selectedJob, setSelectedJob,
        selectedCandidateId, setSelectedCandidateId,
        resumeFile, setResumeFile, handleResumeUpload,
        resumeMessage, rankings, selectedJobFilter,
        setSelectedJobFilter, minimumScore, setMinimumScore,
        handleCandidateClick, candidateDetailsMessage,
        selectedCandidate, handleCloseCandidateDetails,
        handleLogout,
    } = props;

    const goTo = (page) => setActivePage(page);

    return (
        <div className="recruit-app">
            <aside className="recruit-sidebar">
                <div className="brand-mark">
                    <span className="brand-icon">✦</span>
                    <div>
                        <strong>HireWise</strong>
                        <small>AI RECRUITMENT</small>
                    </div>
                </div>

                <p className="nav-caption">WORKSPACE</p>

                <nav className="side-nav" aria-label="Main navigation">
                    {pages.map((page) => (
                        <button
                            key={page.id}
                            className={`nav-item ${
                                activePage === page.id ? 'active' : ''
                            }`}
                            onClick={() => goTo(page.id)}
                        >
                            <span>{page.icon}</span>
                            {page.label}
                            {activePage === page.id && <i>›</i>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-tip">
                    <span>💡</span>
                    <strong>Smart hiring starts here</strong>
                    <p>Let AI help you find the right talent faster.</p>
                </div>

                <button className="sidebar-logout" onClick={handleLogout}>
                    ↪ &nbsp; Sign out
                </button>
            </aside>

            <main className="recruit-main">
                <header className="topbar">
                    <div>
                        <span className="eyebrow">RECRUITER WORKSPACE</span>
                        <h1>
                            {pages.find(
                                (page) => page.id === activePage
                            )?.label}
                        </h1>
                    </div>

                    <div className="profile-chip">
                        <span className="profile-avatar">
                            {username?.charAt(0)?.toUpperCase() || 'R'}
                        </span>
                        <div>
                            <strong>{username || 'Recruiter'}</strong>
                            <small>Recruiter account</small>
                        </div>
                        <span className="online-dot" />
                    </div>
                </header>

                {dashboardLoading && (
                    <div className="notice">
                        ⏳ Loading your hiring workspace…
                    </div>
                )}

                {dashboardError && (
                    <div className="notice error" role="alert">
                        {dashboardError}
                        <button
                            onClick={onRetryDashboard}
                            disabled={dashboardLoading}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {activePage === 'overview' && (
                    <section className="page-content">
                        <div className="welcome-banner">
                            <div>
                                <span className="welcome-tag">
                                    YOUR HIRING COMMAND CENTER
                                </span>
                                <h2>Find your next great hire. 🚀</h2>
                                <p>
                                    Manage roles, discover talent, and let AI
                                    surface your strongest matches.
                                </p>
                                <button
                                    className="banner-button"
                                    onClick={() => goTo('screening')}
                                >
                                    Start screening <span>→</span>
                                </button>
                            </div>
                            <div className="banner-art" aria-hidden="true">
                                <span>✦</span>
                                <span>◎</span>
                                <span>✧</span>
                                <b>AI</b>
                            </div>
                        </div>

                        <DashboardStats
                            totalCandidates={totalCandidates}
                            totalJobs={totalJobs}
                            averageMatch={averageMatch}
                            topMatch={topMatch}
                        />

                        <div className="section-heading">
                            <div>
                                <span className="eyebrow">
                                    KEEP THE MOMENTUM
                                </span>
                                <h2>Quick actions</h2>
                            </div>
                        </div>

                        <div className="quick-grid">
                            <button onClick={() => goTo('jobs')}>
                                <span>💼</span>
                                <strong>Create a job</strong>
                                <small>Define a role and required skills</small>
                                <b>→</b>
                            </button>
                            <button onClick={() => goTo('candidates')}>
                                <span>👥</span>
                                <strong>Add a candidate</strong>
                                <small>Build your candidate pool</small>
                                <b>→</b>
                            </button>
                            <button onClick={() => goTo('screening')}>
                                <span>📄</span>
                                <strong>Screen a resume</strong>
                                <small>Upload a PDF and match skills</small>
                                <b>→</b>
                            </button>
                            <button onClick={() => goTo('rankings')}>
                                <span>🏆</span>
                                <strong>View AI rankings</strong>
                                <small>See the strongest job matches</small>
                                <b>→</b>
                            </button>
                        </div>
                    </section>
                )}

                {activePage === 'jobs' && (
                    <section className="page-content">
                        <div className="page-intro">
                            <span>💼</span>
                            <div>
                                <h2>Jobs workspace</h2>
                                <p>
                                    Create openings and keep track of the roles
                                    you are hiring for.
                                </p>
                            </div>
                        </div>
                        <JobForm
                            jobTitle={jobTitle}
                            setJobTitle={setJobTitle}
                            jobDescription={jobDescription}
                            setJobDescription={setJobDescription}
                            requiredSkills={requiredSkills}
                            setRequiredSkills={setRequiredSkills}
                            handleCreateJob={handleCreateJob}
                            jobMessage={jobMessage}
                        />
                        <JobList jobs={jobs} />
                    </section>
                )}

                {activePage === 'candidates' && (
                    <section className="page-content">
                        <div className="page-intro">
                            <span>👥</span>
                            <div>
                                <h2>Candidate directory</h2>
                                <p>
                                    Manage the people in your hiring pipeline.
                                </p>
                            </div>
                        </div>

                        <div className="directory-count">
                            👤 <strong>{candidates.length}</strong> candidates
                            in your directory
                        </div>

                        <CandidateForm
                            candidateUsername={candidateUsername}
                            setCandidateUsername={setCandidateUsername}
                            candidateEmail={candidateEmail}
                            setCandidateEmail={setCandidateEmail}
                            candidatePassword={candidatePassword}
                            setCandidatePassword={setCandidatePassword}
                            handleCreateCandidate={handleCreateCandidate}
                            candidateMessage={candidateMessage}
                        />

                        <div className="candidate-directory">
                            <h3>Candidate accounts</h3>
                            {candidates.length === 0 ? (
                                <p className="empty-state">
                                    No candidates yet. Add your first candidate
                                    above. 🌱
                                </p>
                            ) : (
                                candidates.map((candidate) => (
                                    <div
                                        className="directory-row"
                                        key={candidate.id}
                                    >
                                        <span className="candidate-avatar">
                                            {candidate.username
                                                ?.charAt(0)
                                                ?.toUpperCase() || 'C'}
                                        </span>
                                        <div>
                                            <strong>{candidate.username}</strong>
                                            <small>{candidate.email}</small>
                                        </div>
                                        <span className="directory-status">
                                            Candidate
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {activePage === 'screening' && (
                    <section className="page-content">
                        <div className="page-intro">
                            <span>📄</span>
                            <div>
                                <h2>Resume screening</h2>
                                <p>
                                    Upload a resume PDF and match it against a
                                    job opening.
                                </p>
                            </div>
                        </div>

                        <ResumeUpload
                            jobs={jobs}
                            candidates={candidates}
                            selectedJob={selectedJob}
                            setSelectedJob={setSelectedJob}
                            selectedCandidate={selectedCandidateId}
                            setSelectedCandidate={setSelectedCandidateId}
                            resumeFile={resumeFile}
                            setResumeFile={setResumeFile}
                            handleResumeUpload={handleResumeUpload}
                            resumeMessage={resumeMessage}
                        />
                    </section>
                )}

                {activePage === 'rankings' && (
                    <section className="page-content">
                        <div className="page-intro">
                            <span>🏆</span>
                            <div>
                                <h2>AI candidate rankings</h2>
                                <p>
                                    Compare match scores and open a candidate
                                    to review details.
                                </p>
                            </div>
                        </div>

                        {candidateDetailsMessage && (
                            <div className="notice error">
                                {candidateDetailsMessage}
                            </div>
                        )}

                        <CandidateRankings
                            candidates={rankings}
                            jobs={jobs}
                            selectedJobFilter={selectedJobFilter}
                            setSelectedJobFilter={setSelectedJobFilter}
                            minimumScore={minimumScore}
                            setMinimumScore={setMinimumScore}
                            onCandidateClick={handleCandidateClick}
                        />

                        <CandidateDetails
                            candidate={selectedCandidate}
                            onClose={handleCloseCandidateDetails}
                        />
                    </section>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
