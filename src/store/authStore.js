import { create } from "zustand"; // state management
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;
const FLY_TOKEN = import.meta.env.VITE_FLY_TOKEN;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

const fly = axios.create({
	baseURL: API_URL,
	headers: {
		Authorization: `Bearer ${FLY_TOKEN}`,
		"Content-Type": "application/json",
	},
});

export const useAuthStore = create((set) => ({
	token: FLY_TOKEN,
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, {
				email,
				password,
				name,
			});
			set({
				user: response.data.user,
				isAuthenticated: true,
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.response.data.message || "Error signing up",
				isLoading: false,
			});
			throw error;
		}
	},
	signin: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signin`, {
				email,
				password,
			});
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.response?.data?.message || "Error signing in",
				isLoading: false,
			});
			throw error;
		}
	},

	signout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/signout`);
			set({
				user: null,
				isAuthenticated: false,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: "Error signing out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, {
				code,
			});
			set({
				user: response.data.user,
				isAuthenticated: true,
				isLoading: false,
			});
			return response.data;
		} catch (error) {
			set({
				error: error.response.data.message || "Error verifying email",
				isLoading: false,
			});
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({
				user: response.data.user,
				isAuthenticated: true,
				isCheckingAuth: false,
			});
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, {
				email,
			});
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error:
					error.response.data.message ||
					"Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(
				`${API_URL}/reset-password/${token}`,
				{ password }
			);
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error:
					error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
