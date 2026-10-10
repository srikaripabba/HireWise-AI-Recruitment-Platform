import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// --------------------------------------------------
// Attach the current access token to API requests
// --------------------------------------------------

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem('access_token');

        if (token) {
            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// --------------------------------------------------
// Automatic JWT refresh
// --------------------------------------------------

let isRefreshing = false;

let refreshSubscribers = [];


// Store requests that are waiting for
// a new access token.
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};


// Send the new token to waiting requests.
const onRefreshed = (token) => {
    refreshSubscribers.forEach(
        (callback) => callback(token)
    );

    refreshSubscribers = [];
};


// Tell waiting requests that refresh failed.
const onRefreshFailed = (error) => {
    refreshSubscribers.forEach(
        (callback) => callback(
            null,
            error
        )
    );

    refreshSubscribers = [];
};


api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest =
            error.config;


        // Only handle 401 Unauthorized errors.
        if (
            error.response?.status !== 401 ||
            originalRequest?._retry ||
            originalRequest?.url?.includes(
                '/token/'
            )
        ) {
            return Promise.reject(error);
        }


        const refreshToken =
            localStorage.getItem(
                'refresh_token'
            );


        // No refresh token means the user
        // must log in again.
        if (!refreshToken) {
            localStorage.removeItem(
                'access_token'
            );

            localStorage.removeItem(
                'refresh_token'
            );

            window.location.reload();

            return Promise.reject(error);
        }


        // --------------------------------------------------
        // Another request is already refreshing the token.
        // Wait for that request to finish.
        // --------------------------------------------------

        if (isRefreshing) {
            return new Promise(
                (resolve, reject) => {

                    subscribeTokenRefresh(
                        (
                            newToken,
                            refreshError
                        ) => {

                            if (
                                refreshError ||
                                !newToken
                            ) {
                                reject(
                                    refreshError ||
                                    error
                                );

                                return;
                            }


                            originalRequest
                                .headers =
                                originalRequest
                                    .headers ||
                                {};

                            originalRequest
                                .headers
                                .Authorization =
                                `Bearer ${newToken}`;


                            resolve(
                                api(
                                    originalRequest
                                )
                            );
                        }
                    );
                }
            );
        }


        // Mark this request so that
        // it cannot retry forever.
        originalRequest._retry = true;

        isRefreshing = true;


        try {

            // Use a separate axios request
            // for refreshing the token.
            const refreshResponse =
                await axios.post(
                    `${API_BASE_URL}/token/refresh/`,
                    {
                        refresh: refreshToken,
                    }
                );


            const newAccessToken =
                refreshResponse.data.access;


            // Save the new access token.
            localStorage.setItem(
                'access_token',
                newAccessToken
            );


            // Release waiting requests.
            onRefreshed(
                newAccessToken
            );


            // Retry the original request
            // using the new token.
            originalRequest.headers =
                originalRequest.headers ||
                {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


            return api(
                originalRequest
            );

        } catch (refreshError) {

            // Refresh failed.
            onRefreshFailed(
                refreshError
            );


            // Clear authentication data.
            localStorage.removeItem(
                'access_token'
            );

            localStorage.removeItem(
                'refresh_token'
            );


            // Return the user to the login screen.
            window.location.reload();


            return Promise.reject(
                refreshError
            );

        } finally {

            isRefreshing = false;
        }
    }
);


export default api;