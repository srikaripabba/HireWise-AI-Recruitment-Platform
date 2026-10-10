import { useState } from 'react';

function CandidateForm({
    candidateUsername,
    setCandidateUsername,
    candidateEmail,
    setCandidateEmail,
    candidatePassword,
    setCandidatePassword,
    handleCreateCandidate,
    candidateMessage,
}) {
    const [isCreating, setIsCreating] = useState(false);

    const handleFormSubmit = async (event) => {
        if (isCreating) {
            event.preventDefault();
            return;
        }

        setIsCreating(true);

        try {
            await handleCreateCandidate(event);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="card">
            <h3>Add New Candidate</h3>

            <form
                onSubmit={handleFormSubmit}
                autoComplete="off"
            >
                <div className="form-group">
                    <label htmlFor="new-candidate-username">
                        Candidate Username
                    </label>
                    <input
                        id="new-candidate-username"
                        name="new-candidate-username"
                        type="text"
                        value={candidateUsername}
                        onChange={(event) =>
                            setCandidateUsername(event.target.value)
                        }
                        placeholder="e.g. candidate2"
                        autoComplete="off"
                        required
                        disabled={isCreating}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="new-candidate-email">
                        Candidate Email
                    </label>
                    <input
                        id="new-candidate-email"
                        name="new-candidate-email"
                        type="email"
                        value={candidateEmail}
                        onChange={(event) =>
                            setCandidateEmail(event.target.value)
                        }
                        placeholder="candidate@example.com"
                        autoComplete="off"
                        required
                        disabled={isCreating}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="new-candidate-password">
                        Temporary Password
                    </label>
                    <input
                        id="new-candidate-password"
                        name="new-candidate-password"
                        type="password"
                        value={candidatePassword}
                        onChange={(event) =>
                            setCandidatePassword(event.target.value)
                        }
                        placeholder="Enter temporary password"
                        autoComplete="new-password"
                        required
                        disabled={isCreating}
                    />
                </div>

                <button
                    type="submit"
                    className="login-button"
                    disabled={isCreating}
                >
                    {isCreating
                        ? 'Creating Candidate...'
                        : 'Create Candidate'}
                </button>
            </form>

            <p
                className="message"
                role="status"
                aria-live="polite"
            >
                {candidateMessage}
            </p>
        </div>
    );
}

export default CandidateForm;