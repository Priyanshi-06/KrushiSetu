import React, { useState, useEffect } from "react";
import PasswordToggleIcon from "./PasswordToggleIcon";
import api from "./api";
import { Toaster, toast } from "react-hot-toast";
import { getApiErrorMessage } from "../../utils/apiError";

function ForgotPassword({ onBackToLogin }) {
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotOtp, setForgotOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [forgotPasswordError, setForgotPasswordError] = useState("");
    const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
    const [showForgotConfirmNewPassword, setShowForgotConfirmNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const passwordRestriction = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleForgotSendOtp = async (e) => {
        e.preventDefault();
        if (!forgotEmail || !validateEmail(forgotEmail)) {
            setForgotPasswordError("Enter a valid email address.");
            return;
        }
        setForgotPasswordError("");
        setIsLoading(true);
        try {
            await api.post("/forgot-password/", { email: forgotEmail });
            setForgotStep(2);
            setOtpTimer(30);
            toast.success("OTP sent to your email. Check your inbox.");
        } catch (err) {
            setForgotPasswordError(
                getApiErrorMessage(err, "Failed to send OTP. Please try again.")
            );
        }
        setIsLoading(false);
    };

    const handleResendOtp = async () => {
        if (otpTimer > 0) return;
        setIsLoading(true);
        try {
            await api.post("/forgot-password/", { email: forgotEmail });
            setOtpTimer(30);
            toast.success("OTP resent to your email.");
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to resend OTP."));
        }
        setIsLoading(false);
    };

    const handleForgotVerifyOtp = async (e) => {
        e.preventDefault();
        if (!forgotOtp) {
            setForgotPasswordError("Enter the OTP sent to your email.");
            return;
        }
        setForgotPasswordError("");
        setIsLoading(true);
        try {
            await api.post("/forgot-password/verify-otp/", {
                email: forgotEmail,
                otp: forgotOtp,
            });
            setForgotStep(3);
            toast.success("OTP verified. Enter your new password.");
        } catch (err) {
            setForgotPasswordError(
                getApiErrorMessage(err, "Invalid or expired OTP. Please try again.")
            );
        }
        setIsLoading(false);
    };

    const handleForgotNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        if (value && !passwordRestriction.test(value)) {
            setForgotPasswordError(
                "Password must be at least 8 characters, include 1 letter, 1 digit, and 1 special character."
            );
        } else if (confirmNewPassword && value !== confirmNewPassword) {
            setForgotPasswordError("Passwords do not match.");
        } else {
            setForgotPasswordError("");
        }
    };

    const handleForgotConfirmNewPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmNewPassword(value);
        if (newPassword && value !== newPassword) {
            setForgotPasswordError("Passwords do not match.");
        } else if (value && !passwordRestriction.test(newPassword)) {
            setForgotPasswordError(
                "Password must be at least 8 characters, include 1 letter, 1 digit, and 1 special character."
            );
        } else {
            setForgotPasswordError("");
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmNewPassword) {
            setForgotPasswordError("Please fill both fields.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setForgotPasswordError("Passwords do not match.");
            return;
        }
        setForgotPasswordError("");
        setIsLoading(true);
        try {
            await api.post("/forgot-password/reset-password/", {
                email: forgotEmail,
                new_password: newPassword,
            });
            toast.success("Password reset successfully! You can now log in.");
            setTimeout(() => onBackToLogin(), 1200);
        } catch (err) {
            setForgotPasswordError(
                getApiErrorMessage(err, "Password reset failed. Please try again.")
            );
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div>
                <p className="text-black text-center text-xl font-bold mb-4">Forgot Password</p>

                {forgotStep === 1 && (
                    <form onSubmit={handleForgotSendOtp}>
                        <input
                            className="w-full p-2 mb-3 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                        />
                        {forgotPasswordError && (
                            <p className="text-red-600 text-xs mb-2">{forgotPasswordError}</p>
                        )}
                        <div className="flex items-center justify-center pt-2">
                            <button
                                className="text-black font-bold p-2 mb-3 w-50 rounded-md bg-green-700 hover:bg-green-800 transition duration-200"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send OTP"}
                            </button>
                        </div>
                        <div className="text-center">
                            <span
                                className="text-green-700 cursor-pointer hover:underline"
                                onClick={onBackToLogin}
                            >
                                Back to Login
                            </span>
                        </div>
                    </form>
                )}

                {forgotStep === 2 && (
                    <form onSubmit={handleForgotVerifyOtp}>
                        <input
                            className="w-full p-2 mb-3 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 tracking-widest text-center font-bold"
                            type="text"
                            placeholder="Enter OTP"
                            value={forgotOtp}
                            onChange={(e) =>
                                setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            required
                        />
                        {forgotPasswordError && (
                            <p className="text-red-600 text-xs mb-2">{forgotPasswordError}</p>
                        )}
                        {otpTimer > 0 ? (
                            <p className="text-center text-gray-600 mb-4">
                                Resend in {otpTimer}s
                            </p>
                        ) : (
                            <p
                                className="text-center text-green-700 cursor-pointer mb-4 hover:underline font-semibold"
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </p>
                        )}
                        <div className="flex items-center justify-center pt-2">
                            <button
                                className="text-black font-bold p-2 mb-3 w-50 rounded-md bg-green-700 hover:bg-green-800 transition duration-200"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                        <div className="text-center">
                            <span
                                className="text-green-700 cursor-pointer hover:underline"
                                onClick={() => {
                                    setForgotStep(1);
                                    setForgotOtp("");
                                    setForgotPasswordError("");
                                }}
                            >
                                Back to Email
                            </span>
                        </div>
                    </form>
                )}

                {forgotStep === 3 && (
                    <form onSubmit={handleForgotPasswordSubmit}>
                        <div className="relative">
                            <input
                                className="w-full p-2 mb-3 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                                type={showForgotNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={handleForgotNewPasswordChange}
                                required
                            />
                            <PasswordToggleIcon
                                visible={showForgotNewPassword}
                                onClick={() => setShowForgotNewPassword((prev) => !prev)}
                            />
                        </div>
                        <div className="relative">
                            <input
                                className="w-full p-2 mb-3 rounded-md bg-white border"
                                type={showForgotConfirmNewPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={handleForgotConfirmNewPasswordChange}
                                required
                            />
                            <PasswordToggleIcon
                                visible={showForgotConfirmNewPassword}
                                onClick={() => setShowForgotConfirmNewPassword((prev) => !prev)}
                            />
                        </div>
                        {forgotPasswordError && (
                            <p className="text-red-600 text-xs mb-2">{forgotPasswordError}</p>
                        )}
                        <div className="flex items-center justify-center pt-2">
                            <button
                                className="text-black font-bold p-2 mb-3 w-50 rounded-md bg-green-700 hover:bg-green-800 transition duration-200"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>
                        <div className="text-center">
                            <span
                                className="text-green-700 cursor-pointer hover:underline"
                                onClick={() => {
                                    setForgotStep(1);
                                    setForgotEmail("");
                                    setForgotOtp("");
                                    setNewPassword("");
                                    setConfirmNewPassword("");
                                    setForgotPasswordError("");
                                }}
                            >
                                Back to Email
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export default ForgotPassword;
