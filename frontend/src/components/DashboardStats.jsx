function DashboardStats({
    totalCandidates,
    totalJobs,
    averageMatch,
    topMatch,
}) {
    return (
        <div className="stats-grid">

            <div className="stat-card">

                <h3>
                    Total Candidates
                </h3>

                <p>
                    {totalCandidates}
                </p>

            </div>

            <div className="stat-card">

                <h3>
                    Total Jobs
                </h3>

                <p>
                    {totalJobs}
                </p>

            </div>

            <div className="stat-card">

                <h3>
                    Average Match
                </h3>

                <p>
                    {averageMatch}%
                </p>

            </div>

            <div className="stat-card">

                <h3>
                    Top Match
                </h3>

                <p>
                    {topMatch}%
                </p>

            </div>

        </div>
    );
}

export default DashboardStats;