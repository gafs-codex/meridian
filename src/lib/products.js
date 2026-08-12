import { supabase } from "./supabase";

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

    return data || [];
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

    return data;
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

    return data || [];
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

    return data || [];
}