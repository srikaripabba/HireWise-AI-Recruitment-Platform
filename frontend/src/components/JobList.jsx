function JobList({
    jobs,
}) {
    return (
        <div className="card">

            <h3>
                My Jobs
            </h3>

            {jobs.length === 0 ? (

                <p>
                    No jobs created yet.
                </p>

            ) : (

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Job Title
                                </th>

                                <th>
                                    Required Skills
                                </th>

                                <th>
                                    Created
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {jobs.map((job) => (

                                <tr
                                    key={job.id}
                                >

                                    <td>
                                        {job.title}
                                    </td>

                                    <td>
                                        {job.required_skills}
                                    </td>

                                    <td>
                                        {new Date(
                                            job.created_at
                                        ).toLocaleDateString()}
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

export default JobList;