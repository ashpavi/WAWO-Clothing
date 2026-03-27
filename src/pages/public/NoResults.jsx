import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../components/store/Navbar";

const productDefs = [
  {
    id: 1, category: "ELECTRONICS", name: "Noise Cancelling Headphones Pro",
    price: 299.0, oldPrice: null,
    prompt: "A pair of premium black over-ear headphones on a light blue-white background. Clean minimalist product illustration SVG with realistic shapes and subtle shadow underneath.",
  },
  {
    id: 2, category: "FASHION", name: "Classic Minimalist Watch",
    price: 159.0, oldPrice: null,
    prompt: "A classic silver wristwatch with white dial and dark leather strap on a cream white background. Elegant product illustration SVG with subtle shadow.",
  },
  {
    id: 3, category: "LIFESTYLE", name: "Analog Film Camera",
    price: 89.0, oldPrice: 120.0,
    prompt: "A vintage 35mm film camera with brown leather body and silver metal lens on a warm light background. Retro product illustration SVG.",
  },
  {
    id: 4, category: "FOOTWEAR", name: "Urban Runners X-1",
    price: 110.0, oldPrice: null,
    prompt: "A pair of bright red and white athletic running sneakers, side view, on a light background. Modern product illustration SVG with subtle ground shadow.",
  },
  {
    id: 5, category: "ELECTRONICS", name: "Wireless Speaker Mini",
    price: 79.0, oldPrice: 99.0,
    prompt: "A compact cylindrical portable bluetooth speaker in charcoal gray with fabric texture, on a light background. Modern product illustration SVG.",
  },
];

const categoryColors = {
  ELECTRONICS: "#3B82F6", FASHION: "#8B5CF6", LIFESTYLE: "#10B981", FOOTWEAR: "#F59E0B",
};
const categoryBg = {
  ELECTRONICS: "#EFF6FF", FASHION: "#F5F3FF", LIFESTYLE: "#ECFDF5", FOOTWEAR: "#FFFBEB",
};

async function generateProductSVG(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `Create a beautiful SVG product illustration for an e-commerce store: ${prompt}

Rules:
- viewBox="0 0 500 300" width="500" height="300"
- Light pastel background matching the product mood
- Realistic, detailed product with proper colors and proportions
- Subtle elliptical drop shadow beneath product
- Center the product in the composition
- No text or labels inside the SVG
- Use gradients and shapes to make it look polished
- Return ONLY valid SVG markup starting with <svg and ending with </svg>`
      }]
    })
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || "";
  const match = text.match(/<svg[\s\S]*?<\/svg>/i);
  return match ? match[0] : null;
}

function ProductCard({ product, wishlist, onWishlist, cartAdded, onCart }) {
  const [svg, setSvg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateProductSVG(product.prompt)
      .then(result => { setSvg(result); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [product.prompt]);

  return (
    <div className="product-card">
      <div style={{ position: "relative" }}>
        <div style={{
          width: "100%", height: 200, overflow: "hidden",
          background: categoryBg[product.category] || "#F9FAFB",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div className="spinner" />
              <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>Generating image…</span>
            </div>
          ) : svg ? (
            <div
              style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
              dangerouslySetInnerHTML={{ __html: svg.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }}
            />
          ) : (
            <div style={{ fontSize: 52, opacity: 0.5 }}>
              {product.id === 1 ? "🎧" : product.id === 2 ? "⌚" : product.id === 3 ? "📷" : product.id === 4 ? "👟" : "🔊"}
            </div>
          )}
        </div>
        <button className="wishlist-btn" onClick={() => onWishlist(product.id)}>
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={wishlist.has(product.id) ? "#EF4444" : "none"}
            stroke={wishlist.has(product.id) ? "#EF4444" : "#9CA3AF"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: categoryColors[product.category], letterSpacing: "0.06em", marginBottom: 6 }}>
          {product.category}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12, lineHeight: 1.4 }}>
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through", marginLeft: 6 }}>${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button className={`add-cart-btn${cartAdded.has(product.id) ? " added" : ""}`} onClick={() => onCart(product.id)}>
            {cartAdded.has(product.id) ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ShopModernFooter() {
  return (
    <footer style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "28px 48px", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 16, color: "#111827", cursor: "pointer" }}>
          <div style={{ background: "#2563EB", borderRadius: 6, padding: 5, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          ShopModern
        </div>

        {/* Copyright */}
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>© 2024 E-commerce Inc.</p>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: 24 }}>
          {["Help Center", "Returns Policy", "Privacy", "Terms"].map((link) => (
            <span
              key={link}
              style={{ fontSize: 13, color: "#6B7280", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#2563EB"}
              onMouseLeave={e => e.target.style.color = "#6B7280"}
            >
              {link}
            </span>
          ))}
        </div>

        {/* Social Icons */}
        <div style={{ display: "flex", gap: 4 }}>
          {/* Person / Community icon */}
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", width: 34, height: 34, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3"/>
              <path d="M12 14s-8 4-8 7h16c0-3-8-7-8-7z"/>
            </svg>
          </button>

          {/* Share icon */}
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", width: 34, height: 34, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>

          {/* Globe icon */}
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", width: 34, height: 34, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
}

export default function NoResults() {
  const [searchParams] = useSearchParams();
  const [wishlist, setWishlist] = useState(new Set());
  const [cartAdded, setCartAdded] = useState(new Set());
  
  // Get search query directly from URL params
  const searchValue = searchParams.get('search') || '';
  const [carouselIndex, setCarouselIndex] = useState(0);

  const visibleCount = 4;
  const maxIndex = productDefs.length - visibleCount;
  const visibleProducts = productDefs.slice(carouselIndex, carouselIndex + visibleCount);

  const toggleWishlist = (id) => setWishlist(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const handleCart = (id) => {
    setCartAdded(prev => new Set(prev).add(id));
    setTimeout(() => setCartAdded(prev => { const n = new Set(prev); n.delete(id); return n; }), 1500);
  };

  return (
    <>
      <Navbar />
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#F3F4F6", color: "#111827" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          .btn-primary { background: #2563EB; color: white; border: none; border-radius: 50px; padding: 12px 24px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s, transform 0.1s; }
          .btn-primary:hover { background: #1D4ED8; transform: translateY(-1px); }
          .btn-secondary { background: white; color: #111827; border: 1.5px solid #D1D5DB; border-radius: 50px; padding: 12px 24px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: border-color 0.2s, background 0.2s, transform 0.1s; }
          .btn-secondary:hover { border-color: #9CA3AF; background: #F9FAFB; transform: translateY(-1px); }
          .product-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
          .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
          .wishlist-btn { position: absolute; top: 12px; right: 12px; background: white; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.15); transition: transform 0.15s; z-index: 2; }
          .wishlist-btn:hover { transform: scale(1.1); }
          .carousel-btn { background: white; border: 1.5px solid #E5E7EB; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, border-color 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          .carousel-btn:hover:not(:disabled) { background: #F9FAFB; border-color: #9CA3AF; }
          .carousel-btn:disabled { opacity: 0.4; cursor: not-allowed; }
          .add-cart-btn { background: #EFF6FF; border: none; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #2563EB; transition: background 0.15s, transform 0.1s; flex-shrink: 0; }
          .add-cart-btn:hover { background: #DBEAFE; transform: scale(1.05); }
          .add-cart-btn.added { background: #D1FAE5; color: #059669; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in { animation: fadeInUp 0.5s ease forwards; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .spinner { width: 28px; height: 28px; border: 3px solid #E5E7EB; border-top-color: #2563EB; border-radius: 50%; animation: spin 0.8s linear infinite; }
        `}</style>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 0" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "18px 0", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280" }}>
          <Link to="/" style={{ cursor: "pointer", textDecoration: "none", color: "#6B7280" }}>Home</Link>
          <span style={{ color: "#D1D5DB" }}>/</span>
          <span style={{ cursor: "pointer" }}>Search Results</span>
          <span style={{ color: "#D1D5DB" }}>/</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>"{searchValue}"</span>
        </div>

        {/* No Results */}
        <div className="fade-in" style={{ textAlign: "center", padding: "60px 0 80px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 100, height: 100, background: "white", borderRadius: "50%", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", marginBottom: 28, position: "relative" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <div style={{ position: "absolute", bottom: 8, right: 4, background: "#EF4444", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <div style={{ position: "absolute", top: 8, right: -2, background: "#2563EB", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>?</div>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 14 }}>No products found</h1>
          <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.6, maxWidth: 400, margin: "0 auto 32px" }}>
            We couldn't find any matches for <strong style={{ color: "#111827" }}>"{searchValue}"</strong>. Try checking your spelling, using more general keywords, or clearing your current filters.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link to="/products" className="btn-primary" style={{ textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Clear All Filters
            </Link>
            <Link to="/" className="btn-secondary" style={{ textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Go to Home
            </Link>
          </div>
        </div>

        <div style={{ height: 1, background: "#E5E7EB", marginBottom: 40 }} />

        {/* Recommendations */}
        <div style={{ paddingBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>You might also like</h2>
              <p style={{ fontSize: 13, color: "#6B7280" }}>Hand-picked trending items for you</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="carousel-btn" disabled={carouselIndex === 0} onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="carousel-btn" disabled={carouselIndex >= maxIndex} onClick={() => setCarouselIndex(i => Math.min(maxIndex, i + 1))}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {visibleProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                cartAdded={cartAdded}
                onCart={handleCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <ShopModernFooter />
    </>
  );
}
