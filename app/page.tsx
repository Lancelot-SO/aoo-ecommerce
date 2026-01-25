import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Hero />

      <section className="section">
        <div className="container">
          <div className={styles.categoryGrid}>
            <div className={`${styles.categoryCard} premium-card`}>
              <div className={styles.categoryImage}>
                <Image src="/centenary_blazer_1769187792564.png" alt="Apparel" fill className={styles.img} />
                <div className={styles.categoryOverlay}>
                  <span>Apparel</span>
                  <h3>The Centenary Collection</h3>
                </div>
              </div>
            </div>
            <div className={`${styles.categoryCard} premium-card`}>
              <div className={styles.categoryImage}>
                <Image src="/luxury_watch_gold_1769187808007.png" alt="Accessories" fill className={styles.img} />
                <div className={styles.categoryOverlay}>
                  <span>Accessories</span>
                  <h3>Timeless Elegance</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* Legacy Story Section */}
      <section className={styles.legacySection}>
        <div className="container">
          <div className={styles.legacyGrid}>
            <div className={styles.legacyContent}>
              <span className="section-title">A CENTURY OF EXCELLENCE</span>
              <h2 className="section-heading">Heritage & Leadership</h2>
              <p className={styles.legacyText}>
                Founded in 1927, Achimota School was established to provide the finest education in Africa.
                As we approach our centenary, we celebrate the "Achimota Spirit"—a legacy of leadership,
                unity, and excellence that continues to shape the future of our continent.
              </p>
              <div className={styles.legacyStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>1927</span>
                  <span className={styles.statLabel}>Founded</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>100</span>
                  <span className={styles.statLabel}>Years</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>50k+</span>
                  <span className={styles.statLabel}>Akora Members</span>
                </div>
              </div>
              <button className={styles.outlineBtn}>Explore Our Story</button>
            </div>
            <div className={styles.legacyImageWrapper}>
              <div className={styles.imageMain}>
                <Image src="/hero-bg.png" alt="Heritage" fill className={styles.img} />
              </div>
              <div className={styles.imageFloating}>
                <Image src="/logo.png" alt="Seal" width={150} height={150} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Join Section */}
      <section className={styles.newsletterSection}>
        <div className="container">
          <div className={`${styles.newsletterCard} glass-morphism`}>
            <h2 className={styles.newsletterTitle}>Join the Celebration</h2>
            <p className={styles.newsletterSub}>Subscribe for exclusive access to centenary events and limited-edition releases.</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Email Address" className={styles.input} />
              <button type="submit" className={styles.submitBtn}>Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <h3>OAA Store</h3>
              <p>The official marketplace for the Achimota Old Students Association Centenary.</p>
            </div>
            <div className={styles.footerLinks}>
              <div>
                <h4>Shop</h4>
                <ul>
                  <li>Apparel</li>
                  <li>Accessories</li>
                  <li>Collectibles</li>
                </ul>
              </div>
              <div>
                <h4>Legacy</h4>
                <ul>
                  <li>Our Story</li>
                  <li>Centenary Events</li>
                  <li>Foundation</li>
                </ul>
              </div>
              <div>
                <h4>Support</h4>
                <ul>
                  <li>Shipping</li>
                  <li>Inquiries</li>
                  <li>Terms</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.copyright}>
            <p>&copy; 2027 Achimota School Centenary. <span className="premium-gold-text">UT OMNES UNUM SINT</span></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
