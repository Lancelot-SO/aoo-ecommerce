import Header from "@/components/Header";
import styles from "./about.module.css";

export default function AboutPage() {
    return (
        <main>
            <Header />
            <div className={styles.hero}>
                <div className="container">
                    <span className="premium-gold-text" style={{ fontWeight: 700, letterSpacing: '0.3em' }}>OUR STORY</span>
                    <h1>A Century of Excellence</h1>
                </div>
            </div>

            <div className="container" style={{ padding: '8rem 1.5rem' }}>
                <div className={styles.contentGrid}>
                    <div className={styles.textContent}>
                        <h2>Achimota School Centenary</h2>
                        <p>
                            Founded in 1927 by Sir Frederick Gordon Guggisberg, Dr. James Emman Kwegyir Aggrey and Rev. Alec Garden Fraser,
                            Achimota School was established as a co-educational secondary boarding school, the first of its kind in Ghana.
                        </p>
                        <p>
                            For 100 years, Achimota has been a beacon of academic excellence, leadership, and national unity.
                            The motto, "Ut Omnes Unum Sint" (That All May Be One), reflected the founders' vision of a school
                            that would train the whole person - body, soul, and spirit.
                        </p>
                        <p>
                            The centenary celebration is a testimony to the resilience and progress of this great institution.
                            The merchandise collection offered here aims to preserve this legacy and support the future of the school.
                        </p>
                    </div>
                    <div className={styles.imageContent}>
                        <div style={{ backgroundColor: '#000', height: '500px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', opacity: 0.3, letterSpacing: '0.2em' }}>HISTORIC IMAGE</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
