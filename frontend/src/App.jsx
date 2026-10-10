import { useEffect, useState } from 'react';

import api from './api';
import { loginUser, registerUser, clearAuthSession } from './services/authService';

import Login from './components/Login';

import Register from './components/Register';

import Dashboard from './components/Dashboard';

import './App.css';

function App() {

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');

    const [showRegister, setShowRegister] = useState(false);
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState('');

    // Login persistence

    const [loggedIn, setLoggedIn] = useState(

        () =>

            Boolean(

                localStorage.getItem(

                    'access_token'

                )

            )

    );

    // Candidates

    const [candidates, setCandidates] =

        useState([]);

    // Rankings

    const [rankings, setRankings] =

        useState([]);

    // Ranking filters

    const [selectedJobFilter, setSelectedJobFilter] =

        useState('');

    const [minimumScore, setMinimumScore] =

        useState('0');

    // Candidate details

    const [selectedCandidate, setSelectedCandidate] =

        useState(null);

    const [

        candidateDetailsMessage,

        setCandidateDetailsMessage,

    ] = useState('');

    // Jobs

    const [jobs, setJobs] =

        useState([]);

    // Job form

    const [jobTitle, setJobTitle] =

        useState('');

    const [jobDescription, setJobDescription] =

        useState('');

    const [requiredSkills, setRequiredSkills] =

        useState('');

    const [jobMessage, setJobMessage] =

        useState('');

    // Candidate form

    const [candidateUsername, setCandidateUsername] =

        useState('');

    const [candidateEmail, setCandidateEmail] =

        useState('');

    const [candidatePassword, setCandidatePassword] =

        useState('');

    const [candidateMessage, setCandidateMessage] =

        useState('');

    // Resume upload

    const [selectedJob, setSelectedJob] =

        useState('');

    const [

        selectedCandidateId,

        setSelectedCandidateId,

    ] = useState('');

    const [resumeFile, setResumeFile] =

        useState(null);

    const [resumeMessage, setResumeMessage] =

        useState('');

    // --------------------------------------------------

    // LOAD DASHBOARD DATA

    // --------------------------------------------------

    const loadDashboardData = async (token) => {
        setDashboardLoading(true);
        setDashboardError('');

        const authHeaders = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const [rankingsResponse, jobsResponse, candidatesResponse] =
                await Promise.all([
                    api.get('/screening/rankings/', authHeaders),
                    api.get('/jobs/', authHeaders),
                    api.get('/accounts/candidates/', authHeaders),
                ]);

            setRankings(rankingsResponse.data);
            setJobs(jobsResponse.data);
            setCandidates(candidatesResponse.data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setDashboardError(
                'Could not load dashboard data. Check your backend connection and try again.'
            );
            throw error;
        } finally {
            setDashboardLoading(false);
        }
    };

    // --------------------------------------------------

    // LOAD AUTHENTICATED USER PROFILE

    // --------------------------------------------------

    const loadUserProfile = async () => {

        try {

            const response = await api.get(

                '/accounts/profile/'

            );

            setUsername(

                response.data.username

            );

        } catch (error) {

            console.error(

                'Failed to load user profile:',

                error

            );

        }

    };

    // --------------------------------------------------

    // RESTORE DASHBOARD AFTER REFRESH

    // --------------------------------------------------

    useEffect(() => {

        const token =

            localStorage.getItem(

                'access_token'

            );

        if (!token) {

            return;

        }

        const restoreDashboard =

            async () => {

                try {

                    await loadUserProfile();

                    await loadDashboardData(

                        token

                    );

                } catch (error) {
                    console.error('Failed to restore dashboard data:', error);
                    setDashboardError(
                        'Could not restore dashboard data. Check that the backend is running, then refresh the page.'
                    );
                }
            };

        restoreDashboard();

    }, []);

    // --------------------------------------------------

    // LOGIN

    // --------------------------------------------------

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const response = await loginUser(username.trim(), password);
            setLoggedIn(true);
            setMessage('Login successful!');
            await loadUserProfile();
            await loadDashboardData(response.access);
        } catch (error) {
            console.error('Login error:', error);
            if (error?.response?.status === 401) {
                setMessage('Invalid username or password.');
            } else {
                setMessage(
                    'Login or dashboard loading failed. Check the backend connection and try again.'
                );
            }
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setMessage('');

        if (registerPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        if (registerPassword.length < 8) {
            setMessage('Password must contain at least 8 characters.');
            return;
        }

        try {
            await registerUser(registerUsername, registerEmail, registerPassword);

            setUsername(registerUsername.trim());
            setPassword('');
            setRegisterUsername('');
            setRegisterEmail('');
            setRegisterPassword('');
            setConfirmPassword('');
            setShowRegister(false);
            setMessage('Account created successfully. Please log in.');
        } catch (error) {
            console.error('Registration error:', error);
            const data = error?.response?.data;

            if (!error.response) {
                setMessage('Could not connect to the backend.');
            } else if (data?.username) {
                setMessage(`Username: ${data.username[0]}`);
            } else if (data?.email) {
                setMessage(`Email: ${data.email[0]}`);
            } else if (data?.password) {
                setMessage(`Password: ${data.password[0]}`);
            } else {
                setMessage('Registration failed. Check your details and try again.');
            }
        }
    };

    // --------------------------------------------------

    // LOGOUT

    // --------------------------------------------------

    const handleLogout = () => {

        clearAuthSession();

        setLoggedIn(false);

        setUsername('');

        setPassword('');

        setMessage('');

        setCandidates([]);

        setRankings([]);

        setJobs([]);

        setSelectedCandidate(null);

        setCandidateDetailsMessage('');

        setSelectedJobFilter('');

        setMinimumScore('0');

        setJobTitle('');

        setJobDescription('');

        setRequiredSkills('');

        setJobMessage('');

        setCandidateUsername('');

        setCandidateEmail('');

        setCandidatePassword('');

        setCandidateMessage('');

        setSelectedJob('');

        setSelectedCandidateId('');

        setResumeFile(null);

        setResumeMessage('');

    };

    // --------------------------------------------------

    // CREATE JOB

    // --------------------------------------------------

    const handleCreateJob = async (

        event

    ) => {

        event.preventDefault();

        setJobMessage('');

        if (!jobTitle.trim()) {

            setJobMessage(

                'Please enter a job title.'

            );

            return;

        }

        if (!jobDescription.trim()) {

            setJobMessage(

                'Please enter a job description.'

            );

            return;

        }

        if (!requiredSkills.trim()) {

            setJobMessage(

                'Please enter required skills.'

            );

            return;

        }

        try {

            const token =

                localStorage.getItem(

                    'access_token'

                );

            const authHeaders = {

                headers: {

                    Authorization:

                        `Bearer ${token}`,

                },

            };

            await api.post(

                '/jobs/',

                {

                    title:

                        jobTitle,

                    description:

                        jobDescription,

                    required_skills:

                        requiredSkills,

                },

                authHeaders

            );

            setJobMessage(

                'Job created successfully!'

            );

            setJobTitle('');

            setJobDescription('');

            setRequiredSkills('');

            const jobsResponse =

                await api.get(

                    '/jobs/',

                    authHeaders

                );

            setJobs(

                jobsResponse.data

            );

        } catch (error) {

            console.error(

                'Job creation error:',

                error

            );

            const data =

                error?.response?.data;

            if (data?.title) {

                setJobMessage(

                    `Job Title: ${

                        Array.isArray(

                            data.title

                        )

                            ? data.title[0]

                            : data.title

                    }`

                );

            } else if (

                data?.description

            ) {

                setJobMessage(

                    `Job Description: ${

                        Array.isArray(

                            data.description

                        )

                            ? data.description[0]

                            : data.description

                    }`

                );

            } else if (

                data?.required_skills

            ) {

                setJobMessage(

                    `Required Skills: ${

                        Array.isArray(

                            data.required_skills

                        )

                            ? data.required_skills[0]

                            : data.required_skills

                    }`

                );

            } else if (

                data?.detail

            ) {

                setJobMessage(

                    data.detail

                );

            } else {

                setJobMessage(

                    'Failed to create job. Please try again.'

                );

            }

        }

    };

    // --------------------------------------------------

    // CREATE CANDIDATE

    // --------------------------------------------------

    const handleCreateCandidate =

        async (event) => {

            event.preventDefault();

            setCandidateMessage('');

            if (

                !candidateUsername.trim()

            ) {

                setCandidateMessage(

                    'Please enter a candidate username.'

                );

                return;

            }

            if (

                !candidateEmail.trim()

            ) {

                setCandidateMessage(

                    'Please enter a candidate email.'

                );

                return;

            }

            if (

                !candidatePassword.trim()

            ) {

                setCandidateMessage(

                    'Please enter a temporary password.'

                );

                return;

            }

            try {

                const token =

                    localStorage.getItem(

                        'access_token'

                    );

                const response =

                    await api.post(

                        '/accounts/candidates/create/',

                        {

                            username:

                                candidateUsername.trim(),

                            email:

                                candidateEmail.trim(),

                            password:

                                candidatePassword,

                        },

                        {

                            headers: {

                                Authorization:

                                    `Bearer ${token}`,

                            },

                        }

                    );

                setCandidateMessage(

                    'Candidate created successfully!'

                );

                setCandidates(

                    (

                        currentCandidates

                    ) => [

                        ...currentCandidates,

                        response.data,

                    ]

                );

                setCandidateUsername('');

                setCandidateEmail('');

                setCandidatePassword('');

            } catch (error) {

                console.error(

                    'Candidate creation error:',

                    error

                );

                const data =

                    error?.response?.data;

                if (data?.username) {

                    const usernameError =

                        Array.isArray(

                            data.username

                        )

                            ? data.username[0]

                            : data.username;

                    setCandidateMessage(

                        `Username: ${usernameError}`

                    );

                    return;

                }

                if (data?.email) {

                    const emailError =

                        Array.isArray(

                            data.email

                        )

                            ? data.email[0]

                            : data.email;

                    setCandidateMessage(

                        `Email: ${emailError}`

                    );

                    return;

                }

                if (data?.password) {

                    const passwordError =

                        Array.isArray(

                            data.password

                        )

                            ? data.password[0]

                            : data.password;

                    setCandidateMessage(

                        `Password: ${passwordError}`

                    );

                    return;

                }

                if (data?.detail) {

                    setCandidateMessage(

                        data.detail

                    );

                    return;

                }

                if (!error.response) {

                    setCandidateMessage(

                        'Could not connect to the backend.'

                    );

                    return;

                }

                setCandidateMessage(

                    'Failed to create candidate. Check the entered details.'

                );

            }

        };

    // --------------------------------------------------

    // RESUME ERROR MESSAGE

    // --------------------------------------------------

    const getResumeErrorMessage =

        (error) => {

            const data =

                error?.response?.data;

            if (!data) {

                return null;

            }

            if (data.file) {

                if (

                    Array.isArray(

                        data.file

                    )

                ) {

                    return data.file[0];

                }

                return data.file;

            }

            if (data.candidate) {

                if (

                    Array.isArray(

                        data.candidate

                    )

                ) {

                    return data.candidate[0];

                }

                return data.candidate;

            }

            if (data.job) {

                if (

                    Array.isArray(

                        data.job

                    )

                ) {

                    return data.job[0];

                }

                return data.job;

            }

            if (data.resume_id) {

                if (

                    Array.isArray(

                        data.resume_id

                    )

                ) {

                    return data.resume_id[0];

                }

                return data.resume_id;

            }

            if (data.detail) {

                return data.detail;

            }

            return null;

        };

    // --------------------------------------------------

    // UPLOAD AND SCREEN RESUME

    // --------------------------------------------------

    const handleResumeUpload =

        async (event) => {

            event.preventDefault();

            setResumeMessage('');

            if (!selectedJob) {

                setResumeMessage(

                    'Please select a job.'

                );

                return;

            }

            if (!selectedCandidateId) {

                setResumeMessage(

                    'Please select a candidate.'

                );

                return;

            }

            if (!resumeFile) {

                setResumeMessage(

                    'Please select a PDF resume.'

                );

                return;

            }

            if (

                !resumeFile.name

                    .toLowerCase()

                    .endsWith('.pdf')

            ) {

                setResumeMessage(

                    'Only PDF resumes are allowed.'

                );

                return;

            }

            try {

                const token =

                    localStorage.getItem(

                        'access_token'

                    );

                const formData =

                    new FormData();

                formData.append(

                    'job',

                    selectedJob

                );

                formData.append(

                    'candidate',

                    selectedCandidateId

                );

                formData.append(

                    'file',

                    resumeFile

                );

                const resumeResponse =

                    await api.post(

                        '/resumes/',

                        formData,

                        {

                            headers: {

                                Authorization:

                                    `Bearer ${token}`,

                                'Content-Type':

                                    'multipart/form-data',

                            },

                        }

                    );

                const resumeId =

                    resumeResponse.data.id;

                await api.post(

                    '/screening/',

                    {

                        resume_id:

                            resumeId,

                    },

                    {

                        headers: {

                            Authorization:

                                `Bearer ${token}`,

                        },

                    }

                );

                const rankingsResponse =

                    await api.get(

                        '/screening/rankings/',

                        {

                            headers: {

                                Authorization:

                                    `Bearer ${token}`,

                            },

                        }

                    );

                setRankings(

                    rankingsResponse.data

                );

                setResumeMessage(

                    'Resume uploaded and screened successfully!'

                );

                setSelectedJob('');

                setSelectedCandidateId('');

                setResumeFile(null);

            } catch (error) {

                console.error(

                    'Resume upload error:',

                    error

                );

                const backendMessage =

                    getResumeErrorMessage(

                        error

                    );

                if (backendMessage) {

                    setResumeMessage(

                        backendMessage

                    );

                } else if (

                    !error.response

                ) {

                    setResumeMessage(

                        'Could not connect to the backend.'

                    );

                } else {

                    setResumeMessage(

                        'Failed to upload or screen resume. Please try again.'

                    );

                }

            }

        };

    // --------------------------------------------------

    // OPEN CANDIDATE DETAILS

    // --------------------------------------------------

    const handleCandidateClick =

        async (rankingId) => {

            try {

                setCandidateDetailsMessage(

                    'Loading candidate details...'

                );

                const token =

                    localStorage.getItem(

                        'access_token'

                    );

                const response =

                    await api.get(

                        `/screening/rankings/${rankingId}/`,

                        {

                            headers: {

                                Authorization:

                                    `Bearer ${token}`,

                            },

                        }

                    );

                setSelectedCandidate(

                    response.data

                );

                setCandidateDetailsMessage(

                    ''

                );

            } catch (error) {

                console.error(

                    'Candidate details error:',

                    error

                );

                setCandidateDetailsMessage(

                    'Failed to load candidate details.'

                );

            }

        };

    // --------------------------------------------------

    // CLOSE CANDIDATE DETAILS

    // --------------------------------------------------

    const handleCloseCandidateDetails =

        () => {

            setSelectedCandidate(null);

            setCandidateDetailsMessage(

                ''

            );

        };

    // --------------------------------------------------

    // DASHBOARD STATISTICS

    // --------------------------------------------------

    const totalCandidates =

        candidates.length;

    const totalJobs =

        jobs.length;

    const averageMatch =

        rankings.length > 0

            ? (

                rankings.reduce(

                    (

                        total,

                        candidate

                    ) =>

                        total +

                        candidate.match_score,

                    0

                ) / rankings.length

            ).toFixed(2)

            : '0.00';

    const topMatch =

        rankings.length > 0

            ? Math.max(

                ...rankings.map(

                    (candidate) =>

                        candidate.match_score

                )

            ).toFixed(2)

            : '0.00';

    // --------------------------------------------------

    // LOGIN AND REGISTRATION SCREENS

    // --------------------------------------------------

    if (!loggedIn) {
        if (showRegister) {
            return (
                <Register
                    registerUsername={registerUsername}
                    setRegisterUsername={setRegisterUsername}
                    registerEmail={registerEmail}
                    setRegisterEmail={setRegisterEmail}
                    registerPassword={registerPassword}
                    setRegisterPassword={setRegisterPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    handleRegister={handleRegister}
                    message={message}
                    onBackToLogin={() => {
                        setShowRegister(false);
                        setMessage('');
                    }}
                />
            );
        }

        return (
            <Login
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                message={message}
                onRegister={() => {
                    setShowRegister(true);
                    setMessage('');
                }}
            />
        );
    }

    // --------------------------------------------------

    // DASHBOARD

    // --------------------------------------------------

    return (

        <Dashboard
            dashboardLoading={dashboardLoading}
            dashboardError={dashboardError}
            onRetryDashboard={() => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    loadDashboardData(token).catch(() => {});
                }
            }}

            username={

                username

            }

            totalCandidates={

                totalCandidates

            }

            totalJobs={

                totalJobs

            }

            averageMatch={

                averageMatch

            }

            topMatch={

                topMatch

            }

            jobTitle={

                jobTitle

            }

            setJobTitle={

                setJobTitle

            }

            jobDescription={

                jobDescription

            }

            setJobDescription={

                setJobDescription

            }

            requiredSkills={

                requiredSkills

            }

            setRequiredSkills={

                setRequiredSkills

            }

            handleCreateJob={

                handleCreateJob

            }

            jobMessage={

                jobMessage

            }

            candidateUsername={

                candidateUsername

            }

            setCandidateUsername={

                setCandidateUsername

            }

            candidateEmail={

                candidateEmail

            }

            setCandidateEmail={

                setCandidateEmail

            }

            candidatePassword={

                candidatePassword

            }

            setCandidatePassword={

                setCandidatePassword

            }

            handleCreateCandidate={

                handleCreateCandidate

            }

            candidateMessage={

                candidateMessage

            }

            jobs={

                jobs

            }

            candidates={

                candidates

            }

            selectedJob={

                selectedJob

            }

            setSelectedJob={

                setSelectedJob

            }

            selectedCandidateId={

                selectedCandidateId

            }

            setSelectedCandidateId={

                setSelectedCandidateId

            }

            resumeFile={

                resumeFile

            }

            setResumeFile={

                setResumeFile

            }

            handleResumeUpload={

                handleResumeUpload

            }

            resumeMessage={

                resumeMessage

            }

            rankings={

                rankings

            }

            selectedJobFilter={

                selectedJobFilter

            }

            setSelectedJobFilter={

                setSelectedJobFilter

            }

            minimumScore={

                minimumScore

            }

            setMinimumScore={

                setMinimumScore

            }

            handleCandidateClick={

                handleCandidateClick

            }

            candidateDetailsMessage={

                candidateDetailsMessage

            }

            selectedCandidate={

                selectedCandidate

            }

            handleCloseCandidateDetails={

                handleCloseCandidateDetails

            }

            handleLogout={

                handleLogout

            }

        />

    );

}

export default App;
