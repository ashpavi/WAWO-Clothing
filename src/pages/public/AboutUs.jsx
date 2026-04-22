import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AboutHeroArtwork from "../../components/store/AboutHeroArtwork";

const aboutSectionsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --purple: #4c1d95;
    --purple-mid: #6d28d9;
    --purple-light: #ede9fe;
    --gold: #6d28d9;
    --gold-light: #ede9fe;
    --editorial-blue: #1f3f9a;
    --dark: #1a0a2e;
    --text: #2d1b69;
    --muted: #6b7280;
    --white: #ffffff;
    --off-white: #fafaf9;
    --border: #e5e7eb;
  }

  .values-section {
    padding: 88px 40px 40px;
    background: var(--white);
    position: relative;
    overflow: hidden;
  }

  .values-section::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%);
  }

  .values-section::after {
    content: '';
    position: absolute;
    bottom: -100px; right: -80px;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%);
  }

  .section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #4DA3FF;
    margin-bottom: 16px;
    display: block;
  }

  .values-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 58px);
    font-weight: 700;
    color: var(--dark);
    line-height: 1.15;
    margin-bottom: 16px;
  }

  .values-title em {
    font-family: 'Playfair Display', serif;
    font-style: normal;
    font-weight: 700;
    color: #4DA3FF;
  }

  .values-subtitle {
    font-size: 16px;
    color: var(--muted);
    max-width: 420px;
    line-height: 1.7;
    margin-bottom: 64px;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2px;
    position: relative;
    z-index: 1;
  }

  .value-card {
    padding: 40px 32px;
    border: 1px solid var(--border);
    background: #faf7ff;
    transition: background 0.3s ease, transform 0.3s ease;
    cursor: default;
    font-family: 'Playfair Display', serif;
  }

  .value-card:hover {
    background: #f3ecff;
    transform: translateY(-4px);
  }

  .value-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(109,40,217,0.12);
    color: var(--purple-mid);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    font-size: 22px;
  }

  .value-name {
    font-size: 22px;
    font-weight: 700;
    color: var(--dark);
    letter-spacing: 0.2px;
    margin-bottom: 12px;
  }

  .value-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #4b5563;
    line-height: 1.75;
  }

  .value-number {
    font-family: 'Playfair Display', serif;
    font-size: clamp(54px, 4.5vw, 68px);
    font-weight: 700;
    font-variant-numeric: oldstyle-nums proportional-nums;
    font-feature-settings: "onum" 1, "pnum" 1;
    letter-spacing: 0.5px;
    color: rgba(109,40,217,0.42);
    position: absolute;
    top: 12px;
    right: 20px;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .how-section {
    padding: 56px 40px 100px;
    background: var(--white);
    position: relative;
  }

  .how-header {
    text-align: center;
    margin-bottom: 80px;
  }

  .how-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 14px;
  }

  .how-title span {
    font-family: 'Playfair Display', serif;
    font-style: normal;
    font-weight: 700;
    color: #4DA3FF;
  }

  .how-sub {
    font-size: 16px;
    color: var(--muted);
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .how-steps {
    display: grid;
    grid-template-columns: 1fr 60px 1fr 60px 1fr;
    align-items: start;
    max-width: 900px;
    margin: 0 auto;
    gap: 0;
  }

  .how-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
    color: var(--purple-light);
    font-size: 28px;
  }

  .how-step {
    text-align: center;
    padding: 0 16px;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .how-step.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step-circle {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: var(--purple-light);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 32px;
    position: relative;
    transition: background 0.3s;
  }

  .step-icon {
    color: var(--purple-mid);
    font-size: 30px;
    line-height: 1;
  }

  .how-step:hover .step-circle {
    background: var(--purple-mid);
  }

  .step-num {
    position: absolute;
    top: -6px; right: -6px;
    width: 26px; height: 26px;
    border-radius: 50%;
    background: var(--purple-mid);
    color: var(--white);
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 10px;
  }

  .step-title .accent-amp {
    color: #4DA3FF;
  }

  .step-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .how-steps {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    .how-arrow { display: none; }
    .values-section { padding: 56px 24px 28px; }
    .how-section { padding: 36px 24px 64px; }
  }
`;

const values = [
  {
    icon: "✦",
    name: "Bold by Design",
    desc: "We don't follow trends - we set them. Every piece is crafted to make you stand out, not blend in.",
  },
  {
    icon: "♻",
    name: "Consciously Made",
    desc: "From fabric to finish, we choose materials and methods that respect both people and the planet.",
  },
  {
    icon: "◈",
    name: "Radically Inclusive",
    desc: "Fashion is for everybody. Our sizing, styling, and storytelling celebrate every shape and identity.",
  },
  {
    icon: "◉",
    name: "Built to Last",
    desc: "Quality over quantity, always. We make clothes you'll reach for again and again, season after season.",
  },
];

const steps = [
  {
    emoji: "✦",
    title: "Discover Your Style",
    desc: "Browse curated collections built around your vibe, season, and budget.",
  },
  {
    emoji: "◈",
    title: "We Pack With Care",
    desc: "Your order is hand-checked and eco-packed before it heads your way.",
  },
  {
    emoji: "✧",
    title: "Wear & Own It",
    desc: "Delivered to your door. Loved from day one. Free returns, always.",
  },
];

function ValuesSection() {
  return (
    <section className="values-section">
      <span className="section-label">What We Stand For</span>
      <h2 className="values-title">
        Clothing with a <em>purpose</em>
      </h2>
      <p className="values-subtitle">
        WAVO was built on four pillars that guide every decision - from the thread we choose to the stories we tell.
      </p>
      <div className="values-grid">
        {values.map((v, i) => (
          <div className="value-card" key={i} style={{ position: "relative" }}>
            <span className="value-number">{String(i + 1).padStart(2, "0")}</span>
            <div className="value-icon">{v.icon}</div>
            <div className="value-name">{v.name}</div>
            <div className="value-desc">{v.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const renderStepTitle = (title) => {
    if (!title.includes("&")) {
      return title;
    }

    const [left, right] = title.split("&");

    return (
      <>
        {left}
        <span className="accent-amp">&</span>
        {right}
      </>
    );
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, []);

  return (
    <section className="how-section" ref={ref}>
      <div className="how-header">
        <span className="section-label" style={{ color: "#4DA3FF" }}>The WAVO Experience</span>
        <h2 className="how-title">
          Shopping made <span>effortless</span>
        </h2>
        <p className="how-sub">Three simple steps from discovery to your door.</p>
      </div>
      <div className="how-steps">
        {steps.map((s, i) => (
          <Fragment key={s.title}>
            <div className={`how-step${visible ? " visible" : ""}`}>
              <div className="step-circle">
                <span className="step-icon">{s.emoji}</span>
                <span className="step-num">{i + 1}</span>
              </div>
              <div className="step-title">{renderStepTitle(s.title)}</div>
              
              <div className="step-desc">{s.desc}</div>
            </div>
            {i < steps.length - 1 && <div className="how-arrow">→</div>}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function AboutSections() {
  return (
    <>
      <style>{aboutSectionsStyles}</style>
      <ValuesSection />
      <HowItWorksSection />
    </>
  );
}

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative bg-[#2A0A4A] text-white px-6 py-24 text-center overflow-hidden">

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <AboutHeroArtwork className="h-full w-full" />
        </div>

        <div className="absolute inset-0 bg-[#2A0A4A]/60" />

        <div className="relative max-w-3xl mx-auto">

          <span className="inline-block text-xs tracking-widest uppercase bg-blue-500/20 border border-blue-400/30 px-4 py-1 rounded-full mb-6">
            Our Story
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Shopping <span className="text-[#4FA8FF]">Reimagined</span>
          </h1>

          <p className="mt-6 text-gray-300 text-base sm:text-lg">
            We believe shopping should feel effortless, transparent,
            and inspiring — not overwhelming.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => navigate("/products")}
              className="bg-[#7B6BEE] px-6 py-3 rounded-xl font-semibold hover:bg-[#8B7CF1] hover:shadow-[0_0_0_3px_rgba(255,255,255,0.14)] transition"
            >
              Explore Our Store
            </button>

          </div>
        </div>
      </section>

      <AboutSections />


      {/* CTA */}
      <section className="bg-[#3d1278]">
        <div className="w-full bg-[#3d1278] text-white text-center px-6 py-12 sm:px-10 sm:py-16 shadow-[0_12px_40px_rgba(61,18,120,0.28)]">
          <h2 className="text-3xl font-bold">
            We're Just Getting Started
          </h2>

          <p className="mt-4 text-white/80">
            Join us on our journey to redefine modern shopping.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 bg-[#7B6BEE] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#8B7CF1] transition"
          >
            Start Shopping →
          </button>
        </div>
      </section>

    </div>
  );
}