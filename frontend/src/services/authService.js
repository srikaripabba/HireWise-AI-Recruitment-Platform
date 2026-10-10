import api from '../api';

export async function loginUser(username, password) {
    const response = await api.post('/token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
}

export async function registerUser(username, email, password) {
    return api.post('/accounts/register/', {
        username: username.trim(),
        email: email.trim(),
        password,
    });
}

export async function fetchUserProfile() {
    const response = await api.get('/accounts/profile/');
    return response.data;
}

export function clearAuthSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}
