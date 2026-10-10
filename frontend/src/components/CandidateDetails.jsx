
import { useEffect, useState } from 'react';
import api from '../api';

function CandidateDetails({ candidate, onClose }) {
    const [resumeHistory, setResumeHistory] = useState([]);
    const [historyMessage, setHistoryMessage] = useState('');

    useEffect(() => {
        if (!candidate) return;

        const loadResumeHistory = async () => {
            try {
                setHistoryMessage('Loading resume history...');
                const token = localStorage.getItem('access_token');
                const response = await api.get(
                    `/resumes/candidate/${candidate.candidate.id}/history/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setResumeHistory(response.data);
                setHistoryMessage('');
            } catch (error) {
                console.error('Failed to load resume history:', error);
                setResumeHistory([]);
                setHistoryMessage('Failed to load resume history.');
            }
        };

        loadResumeHistory();
    }, [candidate]);

    if (!candidate) return null;

    const matchedSkills = candidate.matched_skills || [];
    const missingSkills = Array.isArray(candidate.missing_skills)
        ? candidate.missing_skills
        : (candidate.missing_skills || '')
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);

    const skillScore = Number(candidate.skill_score ?? 0);
    const similarityScore = Number(candidate.similarity_score ?? 0);
    const finalScore = Number(candidate.match_score ?? 0);

    return (
        <div className="card candidate-details-card">
            <div className="candidate-details-header">
                <div>
                    <span className="eyebrow">CANDIDATE PROFILE</span>
                    <h3>Candidate Details</h3>
                    <p>{candidate.candidate.username}</p>
                </div>
                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                >
                    ✕ Close
                </button>
            </div>

            <div className="candidate-details-grid">
                <div>
                    <strong>Email</strong>
                    <p>{candidate.candidate.email}</p>
                </div>
                <div>
                    <strong>Job</strong>
                    <p>{candidate.job.title}</p>
                </div>
                <div>
                    <strong>Final Match Score</strong>
                    <p className="detail-score">{finalScore.toFixed(2)}%</p>
                </div>
                <div>
                    <strong>Resume</strong>
                    <p>{candidate.resume.filename}</p>
                </div>
                <div>
                    <strong>Skill Match · 60% weight</strong>
                    <p className="detail-score">{skillScore.toFixed(2)}%</p>
                    <small>{(skillScore * 0.6).toFixed(2)} points contributed</small>
                </div>
                <div>
                    <strong>Resume Similarity · 40% weight</strong>
                    <p className="detail-score">{similarityScore.toFixed(2)}%</p>
                    <small>{(similarityScore * 0.4).toFixed(2)} points contributed</small>
                </div>
            </div>

            <div className="skills-section">
                <h4>✅ Matched Skills</h4>
                <div className="skill-list">
                    {matchedSkills.length ? matchedSkills.map((skill) => (
                        <span className="matched-skill" key={skill}>
                            {skill}
                        </span>
                    )) : <span>No matched skills.</span>}
                </div>
            </div>

            <div className="skills-section">
                <h4>📌 Missing Skills</h4>
                <div className="skill-list">
                    {missingSkills.length ? missingSkills.map((skill) => (
                        <span className="missing-skill-tag" key={skill}>
                            {skill}
                        </span>
                    )) : <span>No missing skills.</span>}
                </div>
            </div>

            <div className="resume-section">
                <h4>📂 Resume History</h4>
                {historyMessage && <p>{historyMessage}</p>}
                {!historyMessage && resumeHistory.length === 0 && (
                    <p>No resume history found.</p>
                )}
                {resumeHistory.map((resume) => (
                    <div className="resume-history-item" key={resume.id}>
                        <strong>
                            {resume.filename}
                            {resume.is_latest && (
                                <span className="latest-resume-badge">
                                    Latest
                                </span>
                            )}
                        </strong>
                        <p>Job: {resume.job}</p>
                        <p>
                            Uploaded: {new Date(
                                resume.uploaded_at
                            ).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="resume-section">
                <h4>📄 Extracted Resume Text</h4>
                <div className="resume-text">
                    {candidate.resume.extracted_text}
                </div>
            </div>
        </div>
    );
}

export default CandidateDetails;
