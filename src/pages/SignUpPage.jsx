import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Lock, Loader } from "lucide-react";
import { useState } from "react";
import PasswordStrengthMeter from "../components/PasswordStrength";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { signup, error, isLoading } = useAuthStore();
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			await signup(email, password, name);

			//navigate("/signin");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full bg-sky-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
		>
			<div className="p-8">
				<h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r/srgb from-sky-400 to-indigo-500 text-transparent bg-clip-text">
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					<Input
						name="fullName"
						icon={User}
						type="text"
						placeholder="Full name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						name="emailAddress"
						icon={Mail}
						type="email"
						placeholder="Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						name="password"
						icon={Lock}
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && (
						<p className="text-red-500 font-semibold mt-2">
							{error}
						</p>
					)}

					<PasswordStrengthMeter password={password} />

					<motion.button
						className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-sky-600
						hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader
								className="animate-spin mx-auto"
								size={24}
							/>
						) : (
							"Sign Up"
						)}
					</motion.button>
				</form>
			</div>
			<div className="px-8 py-4 bg-gray-900/50 flex justify-center">
				<p className="text-sm text-gray-400">
					Already have an account?{" "}
					<Link
						to={"/signin"}
						className="text-sky-400 hover:underline"
					>
						Sign in
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default SignUpPage;
