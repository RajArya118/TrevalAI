import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Database, Shield, Code, CheckCircle, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stackItems = [
    { title: 'Frontend', desc: 'React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React' },
    { title: 'Backend REST API', desc: 'Node.js, Express.js with TypeScript, Zod request validation, Centralized Error Handling' },
    { title: 'Database & ORM', desc: 'PostgreSQL 18 running locally, Prisma ORM with automated migrations & rich seed data' },
    { title: 'Authentication & Security', desc: 'JWT tokens, bcrypt password hashing, Role-Based Access Control (USER/ADMIN)' },
    { title: 'AI Integration', desc: 'Google Gemini API integration with intelligent heuristic fallback demo engine' },
    { title: 'Testing & Quality', desc: 'Vitest, Supertest for backend integration suites, React Testing Library' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md mx-auto mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight mb-4">
          About TravelAI
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          TravelAI is a job-ready, production-grade full-stack travel booking & autonomous AI trip planner designed to showcase modern web engineering practices.
        </p>
      </div>

      {/* Mission & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">Autonomous AI Itineraries</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generates day-by-day travel plans with morning, afternoon, and evening activities, meal suggestions, and realistic INR budget breakdowns.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">Real PostgreSQL Persistence</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No mock arrays or temporary browser storage for core data. All destinations, hotels, users, and saved itineraries are persisted in a real relational database.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">Role-Based Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict user data ownership checks protect personal trip records, while administrator endpoints guard catalog CRUD and database analytics.
          </p>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block mb-1">
            Engineering Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Comprehensive Technology Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stackItems.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sky-600">
                <Code className="w-4 h-4" />
                <h4 className="text-sm font-bold text-navy-900">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Developer CTA */}
      <div className="text-center py-6">
        <Link
          to="/ai-planner"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xl shadow-sky-600/30 transition-all hover:scale-105"
        >
          Try the AI Trip Planner Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
