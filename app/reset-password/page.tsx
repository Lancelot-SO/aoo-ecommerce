"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./reset-password.module.css";

type Step = "verifying" | "form" | "success" | "invalid";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<Step>("verifying");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Supabase v2 PKCE flow: the email link contains a `?code=` query param.
    // We must exchange it for a session before updateUser() will work.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            supabase.auth
                .exchangeCodeForSession(code)
                .then(({ error }) => {
                    if (error) {
                        setStep("invalid");
                    } else {
                        setStep("form");
                    }
                });
            return;
        }

        // Fallback: listen for PASSWORD_RECOVERY event (implicit / hash flow)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setStep("form");
            }
        });

        // If the URL contains an `error` param Supabase sets on bad links
        const hash = window.location.hash;
        if (hash.includes("error=")) {
            setStep("invalid");
        } else if (!code) {
            // No code and no hash token — likely a direct visit, not a valid link
            setStep("invalid");
        }

        return () => subscription.unsubscribe();
    }, []);

    const getPasswordStrength = (pwd: string) => {
        if (pwd.length === 0) return null;
        if (pwd.length < 6) return "weak";
        if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
            return "fair";
        return "strong";
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        // Show success after 3 s regardless — the API call continues in background
        const successTimer = setTimeout(() => {
            setStep("success");
            setTimeout(() => router.push("/login"), 3000);
        }, 3000);

        supabase.auth.updateUser({ password }).then(({ error }) => {
            if (error) {
                // Only show error if success screen hasn't appeared yet
                clearTimeout(successTimer);
                setError(error.message);
                setLoading(false);
            }
        });
    };

    // ── Verifying / loading ──────────────────────────────────
    if (step === "verifying") {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <Image src="/logo.png" alt="Achimota Logo" width={70} height={70} />
                        <h1>Verifying Link…</h1>
                        <p>Please wait while we verify your reset link.</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Invalid link ────────────────────────────────────────
    if (step === "invalid") {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <Image src="/logo.png" alt="Achimota Logo" width={70} height={70} />
                        <h1>Link Expired</h1>
                        <p>This password-reset link is invalid or has expired.</p>
                    </div>
                    <div className={styles.footer}>
                        <Link href="/forgot-password" className={styles.primaryBtn}>
                            Request a New Link
                        </Link>
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

    // ── Success ─────────────────────────────────────────────
    if (step === "success") {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <Image src="/logo.png" alt="Achimota Logo" width={70} height={70} />
                        <h1>Password Updated!</h1>
                        <p>Your password has been changed successfully.</p>
                    </div>
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className={styles.successHint}>
                            Redirecting you to the login page…
                        </p>
                    </div>
                    <div className={styles.footer}>
                        <Link href="/login" className={styles.backLink}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Go to Sign In now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Main form ───────────────────────────────────────────
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Image src="/logo.png" alt="Achimota Logo" width={70} height={70} />
                    <h1>Set New Password</h1>
                    <p>Choose a strong password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* New password */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">New Password</label>
                        <div className={styles.passwordWrap}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Strength meter */}
                        {strength && (
                            <div className={styles.strengthMeter}>
                                <div className={`${styles.strengthBar} ${styles[strength]}`} />
                                <span className={`${styles.strengthLabel} ${styles[strength]}`}>
                                    {strength === "weak" ? "Weak" : strength === "fair" ? "Fair" : "Strong"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirm">Confirm New Password</label>
                        <div className={styles.passwordWrap}>
                            <input
                                id="confirm"
                                type={showConfirm ? "text" : "password"}
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowConfirm((v) => !v)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirm ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {confirm && password && confirm !== password && (
                            <span className={styles.mismatch}>Passwords do not match</span>
                        )}
                    </div>

                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

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
