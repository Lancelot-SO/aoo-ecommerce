"use client";

import { useState } from "react";
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Store,
    Mail,
    Globe,
    Lock
} from "lucide-react";
import { motion } from "framer-motion";
import styles from "./settings.module.css";

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("Profile");

    const sections = [
        { id: "Profile", icon: <User size={20} /> },
        { id: "Store Settings", icon: <Store size={20} /> },
        { id: "Notifications", icon: <Bell size={20} /> },
        { id: "Security", icon: <Shield size={20} /> },
    ];

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <header className={styles.header}>
                <h1>Account Settings</h1>
                <p>Manage your account preferences and store configuration.</p>
            </header>

            <div className={styles.grid}>
                <aside className={styles.sidebar}>
                    <nav>
                        {sections.map(section => (
                            <button
                                key={section.id}
                                className={`${styles.navBtn} ${activeSection === section.id ? styles.activeNav : ""}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.icon}
                                {section.id}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className={styles.content}>
                    {activeSection === "Profile" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Profile Information</h2>
                                <div className={styles.formGroup}>
                                    <label>Full Name</label>
                                    <input type="text" defaultValue="Administrator" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email Address</label>
                                    <input type="email" defaultValue="admin@oaa.org.gh" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Bio / Role</label>
                                    <textarea rows={4} defaultValue="Managing the official OAA Store and Alumni Relations." />
                                </div>
                            </div>
                            <button className={styles.saveBtn}>Save Changes</button>
                        </motion.div>
                    )}

                    {activeSection === "Store Settings" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Store Configuration</h2>
                                <div className={styles.formGroup}>
                                    <label>Store Name</label>
                                    <input type="text" defaultValue="OAA Official Store" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Currency</label>
                                    <select defaultValue="GHS">
                                        <option value="GHS">Ghana Cedi (GH₵)</option>
                                        <option value="USD">US Dollar ($)</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Contact Email</label>
                                    <input type="email" defaultValue="shop@oaa.org.gh" />
                                </div>
                            </div>
                            <button className={styles.saveBtn}>Update Store</button>
                        </motion.div>
                    )}

                    {activeSection === "Security" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Security & Password</h2>
                                <div className={styles.formGroup}>
                                    <label>Current Password</label>
                                    <input type="password" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>New Password</label>
                                    <input type="password" />
                                </div>
                            </div>
                            <button className={styles.saveBtn}>Change Password</button>

                            <div className={styles.section} style={{ marginTop: '4rem' }}>
                                <h2 className={styles.sectionTitle} style={{ color: '#ef4444' }}>Danger Zone</h2>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                                    Technically, this will sign you out and deactivate your admin privileges.
                                </p>
                                <button className={styles.dangerBtn}>Deactivate Account</button>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </motion.div>
    );
}
