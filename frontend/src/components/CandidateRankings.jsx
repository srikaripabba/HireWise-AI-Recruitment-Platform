
import { useState } from 'react';

function CandidateRankings({
    candidates,
    jobs,
    selectedJobFilter,
    setSelectedJobFilter,
    minimumScore,
    setMinimumScore,
    onCandidateClick,
}) {
    const [sortOption, setSortOption] = useState('score-desc');

    const getScoreLabel = (score) => {
        const value = Number(score);
        if (value >= 70) return 'High Match';
        if (value >= 40) return 'Medium Match';
        return 'Low Match';
    };

    const getRecommendation = (score) => {
        const value = Number(score);
        if (value >= 70) return 'Strong Candidate';
        if (value >= 40) return 'Review Candidate';
        return 'Low Match';
    };

    const filteredCandidates = candidates
        .filter((candidate) => (
            (selectedJobFilter === '' ||
                candidate.job === selectedJobFilter) &&
            Number(candidate.match_score) >= Number(minimumScore)
        ))
        .sort((a, b) => {
            if (sortOption === 'score-desc') {
                return Number(b.match_score) - Number(a.match_score);
            }
            if (sortOption === 'score-asc') {
                return Number(a.match_score) - Number(b.match_score);
            }
            if (sortOption === 'name-asc') {
                return a.candidate.localeCompare(b.candidate);
            }
            if (sortOption === 'name-desc') {
                return b.candidate.localeCompare(a.candidate);
            }
            return 0;
        });

    return (
        <div className="card rankings-card">
            <div className="rankings-heading">
                <div>
                    <span className="eyebrow">AI-POWERED EVALUATION</span>
                    <h3>Candidate Rankings</h3>
                    <p>Compare candidates and find your strongest matches.</p>
                </div>
                <span className="ranking-count">
                    🏆 {filteredCandidates.length} matches
                </span>
            </div>

            <div className="ranking-filters">
                <div className="form-group">
                    <label htmlFor="job-filter">Filter by Job</label>
                    <select
                        id="job-filter"
                        value={selectedJobFilter}
                        onChange={(event) =>
                            setSelectedJobFilter(event.target.value)
                        }
                    >
                        <option value="">All Jobs</option>
                        {jobs.map((job) => (
                            <option key={job.id} value={job.title}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="minimum-score">Minimum Match Score</label>
                    <select
                        id="minimum-score"
                        value={minimumScore}
                        onChange={(event) =>
                            setMinimumScore(event.target.value)
                        }
                    >
                        {[0, 20, 40, 50, 60, 70, 80, 90].map((score) => (
                            <option key={score} value={score}>
                                {score}%
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="sort-option">Sort By</label>
                    <select
                        id="sort-option"
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}
                    >
                        <option value="score-desc">Highest Match Score</option>
                        <option value="score-asc">Lowest Match Score</option>
                        <option value="name-asc">Candidate Name A-Z</option>
                        <option value="name-desc">Candidate Name Z-A</option>
                    </select>
                </div>
            </div>

            {filteredCandidates.length === 0 ? (
                <p className="empty-state">
                    No candidates match the selected filters.
                </p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Email</th>
                                <th>Job</th>
                                <th>Match Score</th>
                                <th>Interpretation</th>
                                <th>Recommendation</th>
                                <th>Missing Skills</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map((candidate) => (
                                <tr key={candidate.id}>
                                    <td>
                                        <button
                                            type="button"
                                            className="candidate-link"
                                            onClick={() =>
                                                onCandidateClick(candidate.id)
                                            }
                                        >
                                            {candidate.candidate}
                                        </button>
                                    </td>
                                    <td>{candidate.email}</td>
                                    <td>{candidate.job}</td>
                                    <td>
                                        <div className="score-cell">
                                            <strong>
                                                {Number(
                                                    candidate.match_score
                                                ).toFixed(2)}%
                                            </strong>
                                            <div className="score-bar">
                                                <div
                                                    className="score-fill"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            Math.max(
                                                                0,
                                                                Number(
                                                                    candidate.match_score
                                                                )
                                                            )
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="score-label">
                                            {getScoreLabel(
                                                candidate.match_score
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <strong>
                                            {getRecommendation(
                                                candidate.match_score
                                            )}
                                        </strong>
                                    </td>
                                    <td>
                                        {Array.isArray(
                                            candidate.missing_skills
                                        )
                                            ? candidate.missing_skills.join(', ')
                                            : (candidate.missing_skills || '')
                                                .split(',')
                                                .map((skill) => skill.trim())
                                                .filter(Boolean)
                                                .join(', ') || 'None'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CandidateRankings;
