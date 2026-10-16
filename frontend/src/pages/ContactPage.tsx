import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast('Your message has been sent! We will get back to you shortly.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mb-2">
          Contact & Support
        </h1>
        <p className="text-sm text-slate-500">
          Have questions about your AI trip itinerary, hotel bookings, or platform integration? Reach out to our engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 bg-navy-950 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-8 border border-slate-800">
          <div>
            <h3 className="text-xl font-bold mb-3">Get in Touch</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-8">
              We respond to inquiries within 24 hours. For urgent booking assistance or feedback, reach out through any channel below.
            </p>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>support@travelai.com</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>New Delhi / Bengaluru Innovation Hub, India</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400">
            Platform Status: <strong>All Services Operational</strong>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting TravelAI. Our support team will review your inquiry and follow up via email.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Chandrabhan Sharma"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Inquiry about AI trip planning"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your question or feedback..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
