
import { useState } from 'react';

function ResumeUpload({
    jobs,
    candidates,
    selectedJob,
    setSelectedJob,
    selectedCandidate,
    setSelectedCandidate,
    resumeFile,
    setResumeFile,
    handleResumeUpload,
    resumeMessage,
}) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFormSubmit = async (event) => {
        if (isUploading) {
            event.preventDefault();
            return;
        }

        setIsUploading(true);

        try {
            await handleResumeUpload(event);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="card">
            <h3>Upload Candidate Resume</h3>

            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label>Select Job</label>

                    <select
                        value={selectedJob}
                        onChange={(event) =>
                            setSelectedJob(event.target.value)
                        }
                        required
                        disabled={isUploading}
                    >
                        <option value="">Select a job</option>

                        {jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Select Candidate</label>

                    <select
                        value={selectedCandidate}
                        onChange={(event) =>
                            setSelectedCandidate(event.target.value)
                        }
                        required
                        disabled={isUploading}
                    >
                        <option value="">Select a candidate</option>

                        {candidates.map((candidate) => (
                            <option
                                key={candidate.id}
                                value={candidate.id}
                            >
                                {candidate.username} - {candidate.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Resume PDF</label>

                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(event) =>
                            setResumeFile(event.target.files[0])
                        }
                        required
                        disabled={isUploading}
                    />
                </div>

                <button
                    type="submit"
                    className="login-button"
                    disabled={isUploading}
                >
                    {isUploading
                        ? 'Uploading and screening...'
                        : 'Upload Resume'}
                </button>
            </form>

            <p
                className="message"
                role="status"
                aria-live="polite"
            >
                {resumeMessage}
            </p>
        </div>
    );
}

export default ResumeUpload;
