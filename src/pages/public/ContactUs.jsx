import { useState } from "react";

import { submitContactMessage } from "../../firebase/services/messageService";
import AboutHeroArtwork from "../../components/store/AboutHeroArtwork";

const EmailIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" fill={color} opacity="0.9"/>
    <path d="M2 7l10 7 10-7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const PhoneIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill={color}/>
  </svg>
);

const LocationIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color}/>
    <circle cx="12" cy="9" r="2.5" fill="white"/>
  </svg>
);

const contactMethods = [
  {
    title: "Email Us",
    desc: "We'll respond within 24 hours",
    value: "wavoclothinglk@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=wavoclothinglk@gmail.com",
    bg: "bg-white",
    border: "border-[#DCD2FF]",
    iconBg: "bg-[#CFC1FF]",
    color: "#7E6FE3",
    text: "text-[#5E4EC5]",
    Icon: EmailIcon,
  },
  {
    title: "Call Us",
    desc: "Mon-Sat, 9am to 6pm LKT",
    value: "+94 76 535 8085",
    href: "tel:+94765358085",
    bg: "bg-white",
    border: "border-[#CFDBFF]",
    iconBg: "bg-[#BDD0FF]",
    color: "#4D77DB",
    text: "text-[#345BB8]",
    Icon: PhoneIcon,
  },
  {
    title: "Visit Us",
    desc: "Serving customers online",
    value: "Available online, Sri Lanka.",
    bg: "bg-white",
    border: "border-[#E0D8FF]",
    iconBg: "bg-[#D8CBFF]",
    color: "#8A73E6",
    text: "text-[#6A53CC]",
    Icon: LocationIcon,
  },
];

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3–5 business days.",
  },
  {
    q: "Can I return a product?",
    a: "Yes! We offer returns within 30 days.",
  },
  {
    q: "Where is my order?",
    a: "You'll receive a tracking link via email.",
  },
  {
    q: "How do I cancel my order?",
    a: "Orders can be modified within 1 hour.",
  },
];

export default function ContactUs() {

  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      await submitContactMessage(formData);
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        topic: "",
        message: "",
      });
    } catch (err) {
      setSubmitError(err.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900">

      {/* HERO */}
      <section className="relative text-white py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <AboutHeroArtwork/>
        </div>
        <div className="absolute inset-0 bg-black/15"/>

        <div className="relative">
          <span className="bg-blue-500/20 border border-blue-400/30 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Get in Touch
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-6">
            We'd love to <span className="text-blue-400">hear</span> from you
          </h1>

          <p className="text-gray-300 mt-4 max-w-xl mx-auto">
            Have a question or feedback? Our team is here to help.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {contactMethods.map(({ title, desc, value, href, bg, border, iconBg, color, text, Icon }) => {
            const CardTag = href ? "a" : "div";

            return (
            <CardTag
              key={title}
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
              className={`${bg} ${border} border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 ${href ? "cursor-pointer block" : ""}`}
            >

              <div className={`${iconBg} w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
                <Icon color={color}/>
              </div>

              <h3 className="font-semibold text-lg">{title}</h3>

              <p className="text-gray-500 text-sm mt-1">
                {desc}
              </p>

              <p className={`${text} font-semibold text-sm mt-2`}>
                {value}
              </p>

            </CardTag>
            );
          })}

        </div>
      </section>

      {/* MAIN GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid lg:grid-cols-2 gap-12">

        {/* FORM */}
        <div className="bg-white rounded-2xl border p-8 shadow-sm">

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-semibold">Message sent!</h3>
              <p className="text-gray-500 mt-2">
                Thanks for contacting us.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 border px-6 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
              >
                Send another
              </button>
            </div>
          ) : (

            <>
              <h3 className="text-xl font-semibold mb-6">
                Send a Message
              </h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {submitError && (
                  <p className="text-sm text-red-500">{submitError}</p>
                )}

                <div className="grid sm:grid-cols-2 gap-4">

                  <input
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                  />

                  <input
                    type="email"
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />

                </div>

                <select
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.topic}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  required
                >
                  <option value="">Select topic</option>
                  <option value="Order & Shipping">Order & Shipping</option>
                  <option value="Returns">Returns</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Other">Other</option>
                </select>

                <textarea
                  rows="5"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tell us how we can help"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#3B82F6] text-white py-3 rounded-lg hover:bg-[#2563EB] transition"
                >
                  {submitting ? "Sending..." : "Send Message →"}
                </button>

              </form>
            </>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border p-8 shadow-sm">

          <h3 className="text-xl font-semibold mb-6">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">

            {faqs.map((faq, i) => (

              <div key={i} className="border-b pb-3">

                <button
                  className="w-full flex justify-between text-left font-medium"
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                >
                  {faq.q}
                  <span>{openFaq === i ? "−" : "+"}</span>
                </button>

                {openFaq === i && (
                  <p className="text-gray-500 text-sm mt-2">
                    {faq.a}
                  </p>
                )}

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}