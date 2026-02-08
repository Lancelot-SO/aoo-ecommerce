"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Filter, ChevronDown, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./catalog.module.css";

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];

export default function Catalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        let isMounted = true;
        
        async function loadProducts() {
            try {
                setLoading(true);
                let query = supabase
                    .from('products')
                    .select('*, categories!inner(name)')
                    .eq('is_active', true);

                if (activeCategory !== "All") {
                    query = query.eq('categories.name', activeCategory);
                }

                if (searchQuery) {
                    query = query.ilike('name', `%${searchQuery}%`);
                }

                const { data, error } = await query.order('created_at', { ascending: false });

                if (error) throw error;
                if (isMounted) {
                    setProducts(data || []);
                }
            } catch (error: any) {
                if (isMounted) {
                    // Ignore abort errors which are expected when navigating quickly
                    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                        return;
                    }
                    console.error('Error fetching products:', {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code
                    });
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, [activeCategory, searchQuery]);

    async function fetchInitialData() {
        try {
            const { data: catData, error } = await supabase.from('categories').select('*');
            if (error) throw error;
            setCategories(catData || []);
        } catch (error: any) {
            console.error('Error fetching categories:', error.message);
        }
    }


    return (
        <main>
            <Header />
            <div className={styles.hero}>
                <div className="container">
                    <h1>Catalog</h1>
                    <p>Explore the full range of centenary merchandise.</p>
                </div>
            </div>

            <div className="container">
                <div className={styles.controls}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Category</span>
                            <div className={styles.categoryChips}>
                                <button
                                    className={`${styles.chip} ${activeCategory === "All" ? styles.chipActive : ""}`}
                                    onClick={() => setActiveCategory("All")}
                                >
                                    All
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`${styles.chip} ${activeCategory === cat.name ? styles.chipActive : ""}`}
                                        onClick={() => setActiveCategory(cat.name)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.sortWrapper}>
                            <Filter size={18} />
                            <select className={styles.sortSelect}>
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.resultsInfo}>
                    {loading ? "Updating results..." : `Showing ${products.length} products`}
                </div>

                <div className={styles.grid}>
                    {loading && products.length === 0 ? (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>Loading catalog...</div>
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.images?.[0] || "/products/blazer.png"}
                                category={product.categories?.name}
                                stock_quantity={product.stock_quantity}
                            />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '60px', color: '#6b7280' }}>
                            No products found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            <footer className={styles.simpleFooter}>
                <p>&copy; 2027 Achimota Old Students Association</p>
            </footer>
        </main>
    );
}
