
import { useState } from 'react';

function JobForm({
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    requiredSkills,
    setRequiredSkills,
    handleCreateJob,
    jobMessage,
}) {
    const [isCreating, setIsCreating] = useState(false);

    const handleFormSubmit = async (event) => {
        if (isCreating) {
            event.preventDefault();
            return;
        }

        setIsCreating(true);

        try {
            await handleCreateJob(event);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="card">
            <h3>Create New Job</h3>

            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label>Job Title</label>

                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(event) =>
                            setJobTitle(event.target.value)
                        }
                        placeholder="e.g. Python Django Developer"
                        required
                        disabled={isCreating}
                    />
                </div>

                <div className="form-group">
                    <label>Job Description</label>

                    <textarea
                        value={jobDescription}
                        onChange={(event) =>
                            setJobDescription(event.target.value)
                        }
                        placeholder="Enter the job description..."
                        rows="5"
                        required
                        disabled={isCreating}
                    />
                </div>

                <div className="form-group">
                    <label>Required Skills</label>

                    <input
                        type="text"
                        value={requiredSkills}
                        onChange={(event) =>
                            setRequiredSkills(event.target.value)
                        }
                        placeholder="Python, Django, PostgreSQL, Git"
                        required
                        disabled={isCreating}
                    />
                </div>

                <button
                    type="submit"
                    className="login-button"
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating Job...' : 'Create Job'}
                </button>
            </form>

            <p className="message" role="status" aria-live="polite">
                {jobMessage}
            </p>
        </div>
    );
}

export default JobForm;
