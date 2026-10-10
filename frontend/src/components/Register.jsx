
import { useState } from 'react';

function Register({
    registerUsername,
    setRegisterUsername,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    message,
    onBackToLogin,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-brand">
                    <span className="brand-icon">✦</span>
                    <p>HIREWISE</p>
                    <h1>Create your</h1>
                    <h1>recruiter account</h1>
                    <span className="brand-caption">
                        Your smarter hiring journey starts here
                    </span>
                </div>

                <h2>Join HireWise 🚀</h2>
                <p className="login-subtitle">
                    Set up your workspace to discover great talent.
                </p>

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="register-username">
                            Username
                        </label>
                        <input
                            id="register-username"
                            type="text"
                            value={registerUsername}
                            onChange={(event) =>
                                setRegisterUsername(event.target.value)
                            }
                            placeholder="Choose a username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">
                            Work email
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            value={registerEmail}
                            onChange={(event) =>
                                setRegisterEmail(event.target.value)
                            }
                            placeholder="you@company.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-password">
                            Password
                        </label>
                        <div className="password-input-wrap">
                            <input
                                id="register-password"
                                type={showPassword ? 'text' : 'password'}
                                value={registerPassword}
                                onChange={(event) =>
                                    setRegisterPassword(event.target.value)
                                }
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">
                            Confirm password
                        </label>
                        <div className="password-input-wrap">
                            <input
                                id="confirm-password"
                                type={
                                    showConfirmPassword ? 'text' : 'password'
                                }
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                placeholder="Enter your password again"
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? 'Hide confirm password'
                                        : 'Show confirm password'
                                }
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        Create Account →
                    </button>
                </form>

                {message && (
                    <p className="message" role="status">
                        {message}
                    </p>
                )}

                <div className="login-register">
                    <span>Already have an account?</span>
                    <button
                        type="button"
                        className="register-link"
                        onClick={onBackToLogin}
                    >
                        Back to Login
                    </button>
                </div>

                <p className="login-footer">
                    🔒 Your account credentials stay protected
                </p>
            </div>
        </div>
    );
}

export default Register;
