import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import api from "../../api/apiClient";
import { AxiosError } from "axios";
import { toast } from "sonner";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {}
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: any) => {
        e.preventDefault()
       try {
           if (validateForm()) {
               setIsLoading(true);

               const res = await api.post("/admin/login", {
                   email,
                   password,
               });
               if (res.status === 200) {
                   localStorage.setItem("dhani_admin_token", res.data.token);
                   localStorage.setItem("dhani_admin", JSON.stringify(res.data.user));
                   window.location.href = "/admin/manage-admin";
               }
               console.log(res.data);
         }
         
       } catch (error: any) {
           console.log(error);
           if (error instanceof AxiosError) {
               toast.error(error.response?.data.message || "");
           } else {
               toast.error("something went wrong");
           }
       } finally {
           setIsLoading(false);
       }
    }

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
                    Sign in to your account
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`block w-full pl-10 pr-3 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300 bg-white"
                                    }`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`block w-full pl-10 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300 bg-white"
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-transform duration-200 hover:scale-[1.02]"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
