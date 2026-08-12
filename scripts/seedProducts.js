import { createClient } from "@supabase/supabase-js"
import products from "../src/data/products/products.json" with { type: "json" }
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compare_at: product.compareAt ?? null,

    category: product.category,
    description: product.description,
    collection: product.collection,

    rating: product.rating ?? null,
    review_count: product.reviewCount ?? 0,
    stock: product.stock ?? 0,
    is_new: product.isNew ?? false,

    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    images: product.images ?? [],
    details: product.details ?? {},
}))

async function seedProducts() {
    console.log(`Uploading ${formattedProducts.length} products...`)

    const { data, error } = await supabase
        .from("products")
        .upsert(formattedProducts, {
            onConflict: "id",
        })

    if (error) {
        console.error("Error uploading products:")
        console.error(error)
        process.exit(1)
    }

    console.log("Products uploaded successfully!")
    console.log(`Uploaded ${formattedProducts.length} products.`)
}

seedProducts()