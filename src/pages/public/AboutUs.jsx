import { useState } from "react";
import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Visionary behind our mission to simplify and elevate modern shopping.",
  },
  {
    name: "Marcus Rivera",
    role: "Head of Design",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Designing seamless experiences that delight millions of shoppers.",
  },
  {
    name: "Priya Nair",
    role: "CTO",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Building the technology powering our lightning-fast platform.",
  },
  {
    name: "James Okafor",
    role: "Head of Operations",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Ensuring every order arrives smoothly and on time.",
  },
];

const stats = [
  { value: "2.4M+", label: "Happy Customers" },
  { value: "180+", label: "Countries Served" },
  { value: "50K+", label: "Products Listed" },
  { value: "99.2%", label: "Satisfaction Rate" },
];

export default function AboutUs() {

  const [activeTeam, setActiveTeam] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 text-white px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">

          <span className="inline-block text-xs tracking-widest uppercase bg-blue-500/20 border border-blue-400/30 px-4 py-1 rounded-full mb-6">
            Our Story
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Shopping <span className="text-blue-400">Reimagined</span>
          </h1>

          <p className="mt-6 text-gray-300 text-base sm:text-lg">
            We believe shopping should feel effortless, transparent,
            and inspiring — not overwhelming.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Explore Our Store
            </button>

            <button
              onClick={() =>
                document.getElementById("team")
                .scrollIntoView({ behavior: "smooth" })
              }
              className="border border-white/40 px-6 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Meet the Team
            </button>

          </div>
        </div>
      </section>


      {/* STATS */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">
              Trusted by Millions
            </h2>
            <p className="text-gray-500 mt-3">
              Our impact in numbers speaks for itself.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {stats.map((stat) => (

              <div
                key={stat.label}
                className="group bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >

                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>

                <div className="w-12 h-1 bg-blue-600 mx-auto my-4 rounded-full group-hover:w-20 transition-all duration-300"/>

                <p className="text-gray-500 text-sm tracking-wide">
                  {stat.label}
                </p>

              </div>

            ))}

          </div>
        </div>
      </section>


      {/* STORY */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">

        <div>

          <h2 className="text-3xl font-bold mb-6">
            From Startup to Global Marketplace
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            What began as a small idea among friends has grown into
            a trusted global platform serving millions worldwide.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Our goal has always been simple:
            make quality products accessible with clarity and trust.
          </p>

        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">

          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
            alt="Store"
            className="w-full h-72 object-cover"
          />

        </div>

      </section>


      {/* TEAM */}
      <section id="team" className="bg-gray-50 py-20 px-6">

        <div className="max-w-6xl mx-auto text-center mb-12">

          <h2 className="text-3xl font-bold">
            Meet Our Team
          </h2>

          <p className="text-gray-500 mt-4">
            Passionate builders, designers, and thinkers behind the brand.
          </p>

        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {teamMembers.map((member) => (

            <div
              key={member.name}
              onClick={() =>
                setActiveTeam(activeTeam === member.name ? null : member.name)
              }
              className="bg-white border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
            >

              <div className="flex justify-center mb-4">

                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border"
                />

              </div>

              <h3 className="font-semibold text-lg text-center">
                {member.name}
              </h3>

              <p className="text-sm text-gray-500 text-center">
                {member.role}
              </p>

              {activeTeam === member.name && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  {member.bio}
                </p>
              )}

            </div>

          ))}

        </div>

      </section>


      {/* CTA */}
      <section className="bg-blue-600 text-white py-20 text-center px-6">

        <h2 className="text-3xl font-bold">
          We're Just Getting Started
        </h2>

        <p className="mt-4 opacity-90">
          Join us on our journey to redefine modern shopping.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Start Shopping →
        </button>

      </section>

    </div>
  );
}