import { supabase } from "./supabase";

/**
 * Convert Supabase product format
 * into the format your React components already use.
 */
function formatProduct(product) {
    return {
        ...product,

        // Supabase → React
        reviewCount: product.review_count,
        isNew: product.is_new,

        // Keep these if your database already uses these names
        compareAt: product.compare_at,
    };
}

/**
 * Get all products
 */
export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        throw error;
    }

    return (data || []).map(formatProduct);
}

/**
 * Get one product by slug
 */
export async function getProductBySlug(slug) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        throw error;
    }

    return formatProduct(data);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }

    return (data || []).map(formatProduct);
}

/**
 * Get featured products
 */
export async function getFeaturedProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("rating", { ascending: false });

    if (error) {
        console.error("Error fetching featured products:", error);
        throw error;
    }

    return (data || []).map(formatProduct);
}