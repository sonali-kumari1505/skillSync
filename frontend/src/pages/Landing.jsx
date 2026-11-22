import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Brain,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Award,
  Zap,
  Star,
  Layers,
  GraduationCap
} from 'lucide-react';
import Button from '../components/ui/Button';
import CompatibilityBadge from '../components/common/CompatibilityBadge';

const skillsCategories = [
  { name: 'Programming & Tech', count: '48+ Skills', examples: ['Python', 'React.js', 'C++', 'Node.js'] },
  { name: 'Data Science & AI', count: '32+ Skills', examples: ['Machine Learning', 'scikit-learn', 'PyTorch'] },
  { name: 'Design & Creative', count: '24+ Skills', examples: ['UI/UX Design', 'Figma', 'Photoshop'] },
  { name: 'Languages & Global', count: '18+ Skills', examples: ['French', 'Spanish', 'German', 'Japanese'] },
  { name: 'Academics & Science', count: '35+ Skills', examples: ['Algorithms', 'Linear Algebra', 'Physics'] },
  { name: 'Business & Career', count: '20+ Skills', examples: ['Digital Marketing', 'Pitching', 'SEO'] }
];

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-slate-200/60 dark:border-slate-800/60">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Generation AI Peer Learning for Colleges</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Teach What You Know.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
              Learn What You Love.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            SkillSync matches university students who have complementary skills through
            an AI recommendation engine. Exchange programming, design, language, and academic expertise with zero monetary barrier.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Join the Exchange Platform
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="secondary" icon={Users}>
                Explore Peer Directory
              </Button>
            </Link>
          </div>

          {/* Quick Demo Credentials Box for Evaluation */}
          <div className="mt-12 inline-block max-w-xl mx-auto p-4 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                One-Click Test Accounts (SRS Benchmark)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                Active Ready
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <Link to="/login" className="p-2 rounded-lg bg-slate-50 dark:bg-[#1c1f2b] hover:bg-brand-500/10 transition block">
                <span className="font-semibold block text-slate-900 dark:text-white">Aisha Jawed</span>
                <span className="text-[10px] text-slate-400">Python ⇄ UI/UX</span>
              </Link>
              <Link to="/login" className="p-2 rounded-lg bg-slate-50 dark:bg-[#1c1f2b] hover:bg-brand-500/10 transition block">
                <span className="font-semibold block text-slate-900 dark:text-white">Sonali Kumari</span>
                <span className="text-[10px] text-slate-400">UI/UX ⇄ Python</span>
              </Link>
              <Link to="/login" className="p-2 rounded-lg bg-slate-50 dark:bg-[#1c1f2b] hover:bg-brand-500/10 transition block">
                <span className="font-semibold block text-slate-900 dark:text-white">Rahul Sharma</span>
                <span className="text-[10px] text-slate-400">DSA ⇄ AWS Cloud</span>
              </Link>
              <Link to="/login" className="p-2 rounded-lg bg-slate-50 dark:bg-[#1c1f2b] hover:bg-brand-500/10 transition block">
                <span className="font-semibold block text-rose-500">Admin Portal</span>
                <span className="text-[10px] text-slate-400">Platform Moderation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Reciprocal Matching Showcase */}
      <section id="ai-matching" className="py-20 bg-slate-50/50 dark:bg-[#0c0d12]/50 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-3">
              <Brain className="h-3.5 w-3.5" />
              <span>Core Recommendation Innovation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bilateral Reciprocal Skill Matching
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Unlike generic search, our AI engine computes an explainable 0–100 compatibility score using
              TF-IDF semantic vectorization, proficiency equilibrium, and schedule overlap.
            </p>
          </div>

          {/* Interactive Match Visualizer Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-900/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
              {/* Student A */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Aisha"
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
                />
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    Aisha Jawed
                  </h4>
                  <p className="text-xs text-slate-500">Delhi Technological University</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                      Teaches: Python (5/5)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 font-semibold">
                      Wants: UI/UX
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Score Center Badge */}
              <div className="flex flex-col items-center">
                <CompatibilityBadge score={96} size="lg" />
                <span className="text-[11px] font-mono text-emerald-500 mt-1.5 font-bold">
                  Reciprocal Equilibrium: 96%
                </span>
              </div>

              {/* Student B */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                  alt="Sonali"
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    Sonali Kumari
                  </h4>
                  <p className="text-xs text-slate-500">IIT Bombay · Design</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                      Teaches: UI/UX (5/5)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 font-semibold">
                      Wants: Python
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium block">1. Reciprocal Skill Weight</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-1 block">
                  55 / 55 pts (Direct Two-Way Complement)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium block">2. Experience & Proficiency Delta</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-1 block">
                  15 / 15 pts (Target Proficiency Met)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium block">3. Availability & Mode Alignment</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-1 block">
                  26 / 30 pts (Weekend Study Sessions)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              How SkillSync Works
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Four streamlined steps to exchange knowledge and build meaningful campus connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition">
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                Create Student Profile
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Add skills you can teach with proficiency levels (1–5) and specify the skills you want to learn.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                AI Compatibility Matching
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The Python scikit-learn recommendation engine analyzes your needs and surfaces compatible peer partners.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                Coordinate & Chat
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Send an exchange request. Once accepted, real-time Socket.IO chat unlocks to schedule tutoring sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                Roadmaps & Reviews
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Track learning milestones interactively and leave verified 1–5 star reviews upon completing exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Grid */}
      <section id="features" className="py-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/30 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Browse Campus Skill Categories
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Over 200+ academic, technical, creative, and professional topics active today.
              </p>
            </div>
            <Link to="/explore" className="mt-4 md:mt-0 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              <span>View full directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillsCategories.map((c) => (
              <div
                key={c.name}
                className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {c.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">{c.count}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.examples.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ready to exchange skills with peers?
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Create your student profile today, list your skills, and let our AI engine find your ideal learning partner.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Get Started for Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
