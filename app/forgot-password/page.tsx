"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import styles from "./forgot-password.module.css";

type Step = "input" | "sent";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<Step>("input");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setStep("sent");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Image src="/logo.png" alt="Achimota Logo" width={70} height={70} />
                    <h1>{step === "sent" ? "Check Your Email" : "Forgot Password?"}</h1>
                    <p>
                        {step === "sent"
                            ? `We've sent a password reset link to ${email}`
                            : "No worries — enter your email and we'll send you a reset link."}
                    </p>
                </div>

                {step === "input" ? (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                            />
                        </div>

                        {error && <p className={styles.errorMsg}>{error}</p>}

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className={styles.successHint}>
                            Didn't receive the email? Check your spam folder or{" "}
                            <button
                                className={styles.resendBtn}
                                onClick={() => setStep("input")}
                            >
                                try again
                            </button>
                            .
                        </p>
                    </div>
                )}

                <div className={styles.footer}>
                    <Link href="/login" className={styles.backLink}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
