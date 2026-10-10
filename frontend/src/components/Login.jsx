
import { useState } from 'react';

function Login({
    username, setUsername, password, setPassword,
    handleLogin, message, onRegister,
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="login-container">
            <section className="login-card">
                <header className="login-brand">
                    <div className="brand-icon">✦</div>
                    <p className="brand-name">HIREWISE</p>
                    <h1>AI Recruitment Platform</h1>
                    <p className="brand-caption">
                        Smarter hiring starts here.
                    </p>
                </header>

                <div className="login-heading">
                    <h2>Welcome back 👋</h2>
                    <p>Sign in to your recruiter workspace.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <div className="password-input-wrap">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A11 11 0 0121 12a12 12 0 01-3 3.9M6.2 6.2A12 12 0 003 12s3 7 9 7a9 9 0 004-.9" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        Sign in <span aria-hidden="true">→</span>
                    </button>
                </form>

                {message && (
                    <p className="message" role="status">{message}</p>
                )}

                <div className="login-register">
                    <span>New to HireWise?</span>
                    <button
                        type="button"
                        className="register-link"
                        onClick={onRegister}
                    >
                        Create your recruiter account →
                    </button>
                </div>

                <footer className="login-footer">
                    Secure access to your hiring workspace
                </footer>
            </section>
        </main>
    );
}

export default Login;
