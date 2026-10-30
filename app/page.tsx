"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Sparkles,
  ExternalLink,
  FileText,
  Trophy,
  ArrowRight,
  LogIn,
  LogOut,
  Lock,
  Edit2,
  Save,
  X,
  PlusCircle,
  Trash2,
  Plus,
  Download,
} from "lucide-react";

const DEVELOPER_EMAIL = "ibnusenamhmd@gmail.com";
const PORTFOLIO_DOC_ID = "main_portfolio_data";

export default function ResumePortfolio() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. PROFIL STATE
  const [portfolioData, setPortfolioData] = useState({
    name: "Muhammad Ibnu Sena",
    title: "Food Technology Fresh Graduate",
    description: "Specializing in Halal Assurance, Quality Assurance, & Food Safety. Experienced in SJPH verification, GMP & HACCP implementation, and structured administrative document management.",
    email: "ibnusenamhmd@gmail.com",
    phone: "6285814409513",
    location: "South Jakarta, DKI Jakarta, Indonesia",
    photoUrl: "/docs/Sena.jpg", 
    cvUrl: "/docs/CV_Muhammad_Ibnu_Sena.pdf",
  });
  const [draftProfile, setDraftProfile] = useState({ ...portfolioData });

  const [education, setEducation] = useState({
    degree: "Bachelor of Food Technology",
    university: "Al-Azhar Indonesia University",
    gpa: "GPA: 3.57 / 4.00",
    period: "2022 - 2026",
    courses: "Food Quality Assurance, Supply Chain Systems, Halal Food Certification, Occupational Health & Safety (K3)",
  });
  const [draftEducation, setDraftEducation] = useState({ ...education });

  // 2. EXPERIENCE STATE
  const [experiences, setExperiences] = useState([
    {
      id: "exp_bpjph",
      title: "SJPH Verification Specialist - Self-Declare Halal Certification",
      company: "Halal Product Assurance Organizing Agency (BPJPH)",
      period: "Aug 2025 - Dec 2025 (4 mos)",
      desc: "Verified 5,500+ halal certification applications under the Self-Declare scheme by evaluating business profiles, raw materials, production processes, and supporting SJPH documentation.",
      fileUrls: [{ label: "BPJPH Document", url: "/docs/BPJPH_MIS.pdf" }],
    },
    {
      id: "exp_bem",
      title: "Head of Administration - Student Executive Board (BEM FST)",
      company: "Al-Azhar Indonesia University",
      period: "Mar 2025 - Mar 2026 (1 yr)",
      desc: "Designed and implemented a structured administration and document tracking system from scratch using Google Forms and Spreadsheets, managing 450+ official letters and proposals.",
      fileUrls: [{ label: "BEM Document", url: "/docs/BEM_MIS.pdf" }],
    },
    {
      id: "exp_lab",
      title: "Laboratory Assistant - Food Technology Practicums",
      company: "Al-Azhar Indonesia University",
      period: "Sep 2023 - Jul 2026 (2 yrs 10 mos)",
      desc: "Supported practicum sessions across 4 major Food Technology courses: Chemistry, Food Component Metabolism, Unit Operations 1, and Unit Operations 2. Guided students, maintained safety compliance, and issued lab reports.",
      fileUrls: [
        { label: "Chemistry Lab 1", url: "/docs/CHEM_MIS.pdf" },
        { label: "Chemistry Lab 2", url: "/docs/CHEM2_MIS.pdf" },
        { label: "Metabolism & Food Component", url: "/docs/METKOM_MIS.pdf" },
        { label: "Unit Operations 1", url: "/docs/SATOP_MIS.pdf" },
        { label: "Unit Operations 2", url: "/docs/SATOP2_MIS.pdf" },
      ],
    },
    {
      id: "exp_hrd",
      title: "Head of Human Resources and Development (HIMTEPA)",
      company: "Al-Azhar Indonesia University",
      period: "May 2024 - Apr 2025 (11 mos)",
      desc: "Coordinated a team in planning and executing student development programs, leadership training, member evaluation, and student coordination.",
      fileUrls: [{ label: "HIMTEPA Document", url: "/docs/HIMTEPA_MIS.pdf" }],
    }
  ]);
  const [showAddExpForm, setShowAddExpForm] = useState<boolean>(false);
  const [newExp, setNewExp] = useState({ title: "", company: "", period: "", desc: "", files: [{ label: "", url: "" }] });
  const [draftExperience, setDraftExperience] = useState<any>(null);

  // 3. PROFESSIONAL TRAINING STATE
  const [trainings, setTrainings] = useState([
    {
      id: "tr_1",
      title: "Food Safety Training: HACCP, GMP, FSSC 22000 & ISO 22000",
      organizer: "Makin Ahli Online Training",
      date: "October 2026",
      fileUrls: [
        { label: "FSSC Certificate", url: "/docs/FSSC_MIS.pdf" },
        { label: "GMP Certificate", url: "/docs/GMP_MIS.pdf" },
        { label: "HACCP Certificate", url: "/docs/HACCP_MIS.pdf" },
        { label: "ISO Certificate", url: "/docs/ISO_MIS.pdf" },
      ]
    },
    {
      id: "tr_2",
      title: "QA & QC in Food Industry",
      organizer: "Makin Ahli Online Training",
      date: "September 2026",
      fileUrls: [
        { label: "QA Certificate", url: "/docs/QA_MIS.pdf" },
        { label: "QC Certificate", url: "/docs/QC_MIS.pdf" },
      ]
    },
    {
      id: "tr_3",
      title: "Microsoft Office Proficiency Certificate",
      organizer: "DSAREA",
      date: "October 2026",
      fileUrls: [
        { label: "Office Certificate", url: "/docs/OFFICE_MIS.pdf" },
      ]
    }
  ]);
  const [draftTrainings, setDraftTrainings] = useState<any[]>([]);

  // 4. ACHIEVEMENTS STATE
  const [achievements, setAchievements] = useState([
    {
      id: "ach_1",
      title: "Team Leader - Paper Preparation & Presentation",
      event: "ICIBS 2025 International Conference, Malang, East Java",
      date: "August 28, 2025",
      fileUrls: [{ label: "Conference Certificate", url: "/docs/ICIBS_MIS.pdf" }],
    }
  ]);
  const [showAddAchForm, setShowAddAchForm] = useState<boolean>(false);
  const [newAch, setNewAch] = useState({ title: "", event: "", date: "", files: [{ label: "", url: "" }] });
  const [draftAchievements, setDraftAchievements] = useState<any[]>([]);

  // 5. ACADEMIC PROJECTS STATE
  const [projects, setProjects] = useState([
    {
      id: "proj_halal",
      title: "Halal Certification & Assurance Project",
      date: "Issued: June 10, 2025",
      desc: "Developed a comprehensive SJPH manual, supporting audit documentation, and conducted simulated halal audits for food business certification.",
      badge: "Certificate No: ID31410022876950625",
      fileUrls: [
        { label: "Halal Document", url: "/docs/BPJPH_MIS.pdf" },
        { label: "Sertifikat Halal (SH_YP)", url: "/docs/SH_YP.pdf" }
      ],
    },
    {
      id: "proj_haccp",
      title: "HACCP Documentation Project",
      date: "February 2025",
      desc: "Drafted a complete HACCP system manual for a simulated food industry model, including hazard analysis and critical control point (CCP) limits.",
      badge: "HACCP System Manual",
      fileUrls: [
        { label: "HACCP Manual", url: "/docs/HACCP_MIS.pdf" },
        { label: "HACCP Project File", url: "/docs/HACCP_PROJECT.pdf" }
      ],
    },
    {
      id: "proj_cppob",
      title: "GMP / CPPOB Documentation & Audit Project",
      date: "October - November 2024",
      desc: "Formulated a CPPOB manual compliant with national food safety standards, performed on-site audits for food SMEs, and authored official audit reports.",
      badge: "CPPOB Audit Report",
      fileUrls: [
        { label: "CPPOB Project", url: "/docs/CPPOB_PROJECT.pdf" },
        { label: "SSOP Project", url: "/docs/SSOP_PROJECT.pdf" },
        { label: "Audit GMP", url: "/docs/AUDIT_GMP.pdf" },
        { label: "GMP Manual", url: "/docs/GMP_MIS.pdf" }
      ],
    }
  ]);
  const [showAddProjForm, setShowAddProjForm] = useState<boolean>(false);
  const [newProj, setNewProj] = useState({ title: "", date: "", desc: "", badge: "", files: [{ label: "", url: "" }] });
  const [draftProject, setDraftProject] = useState<any>(null);

  // 6. SKILLS STATE
  const [skills, setSkills] = useState([
    "Halal Assurance & SJPH",
    "Food Safety Management System",
    "GMP & HACCP Implementation",
    "Document Control & Verification",
    "Microsoft Office Suite",
    "English - Intermediate",
  ]);
  const [newSkillInput, setNewSkillInput] = useState<string>("");

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedExp, setExpandedExp] = useState<string | null>("exp_bpjph");
  const [expandedProj, setExpandedProj] = useState<string | null>("proj_halal");

  // Load data from Firestore when component mounts
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const fetchData = async () => {
      try {
        const docRef = doc(db, "portfolios", PORTFOLIO_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.portfolioData) setPortfolioData(data.portfolioData);
          if (data.education) setEducation(data.education);
          if (data.experiences) setExperiences(data.experiences);
          if (data.trainings) setTrainings(data.trainings);
          if (data.achievements) setAchievements(data.achievements);
          if (data.projects) setProjects(data.projects);
          if (data.skills) setSkills(data.skills);
        }
      } catch (error) {
        console.error("Error fetching portfolio from Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === DEVELOPER_EMAIL) {
        setCurrentUser(user);
        setIsDevMode(true);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Helper function to save all states to Firestore safely
  const saveToFirestore = async (updatedData: {
    portfolioData?: any;
    education?: any;
    experiences?: any;
    trainings?: any;
    achievements?: any;
    projects?: any;
    skills?: any;
  }) => {
    try {
      const payload = {
        portfolioData,
        education,
        experiences,
        trainings,
        achievements,
        projects,
        skills,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "portfolios", PORTFOLIO_DOC_ID), payload, { merge: true });
      console.log("Successfully saved to Firestore!");
    } catch (error: any) {
      console.error("Error saving to Firestore:", error);
      alert(`Gagal menyimpan ke Database: ${error.message || "Pastikan Anda sudah login sebagai developer dan Firestore Rules sudah diatur."}`);
    }
  };

  const handleSecretClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 5) {
      setIsDevMode(true);
      setClickCount(0);
      alert("Developer Mode Unlocked! Please sign in to verify your account.");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && user.email === DEVELOPER_EMAIL) {
        setCurrentUser(user);
        setIsDevMode(true);
        alert("Access Granted: Welcome back, Ibnu Sena!");
      } else {
        await signOut(auth);
        setCurrentUser(null);
        setIsDevMode(false);
        alert("Access Denied: This account is not authorized as the portfolio owner.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Google Login failed.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsDevMode(false);
    setEditingSection(null);
    alert("Successfully logged out from Developer Mode.");
  };

  const scrollToCard = (id: string, type: 'exp' | 'proj') => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      if (type === 'exp') setExpandedExp(id);
      if (type === 'proj') setExpandedProj(id);
    }
  };

  const handleAddExperience = async () => {
    if (!newExp.title || !newExp.company) {
      alert("Please fill in at least the Title and Company fields.");
      return;
    }
    const validFiles = newExp.files.filter(f => f.url.trim() !== "");
    const createdItem = {
      id: `exp_custom_${Date.now()}`,
      title: newExp.title,
      company: newExp.company,
      period: newExp.period || "Recent",
      desc: newExp.desc || "Responsibility details...",
      fileUrls: validFiles,
    };
    const updated = [...experiences, createdItem];
    setExperiences(updated);
    setNewExp({ title: "", company: "", period: "", desc: "", files: [{ label: "", url: "" }] });
    setShowAddExpForm(false);
    setExpandedExp(createdItem.id);
    await saveToFirestore({ experiences: updated });
  };

  const handleRemoveExperience = async (id: string) => {
    if (confirm("Move this experience item to trash?")) {
      const updated = experiences.filter(exp => exp.id !== id);
      setExperiences(updated);
      if (editingSection === id) setEditingSection(null);
      await saveToFirestore({ experiences: updated });
    }
  };

  const handleAddAchievement = async () => {
    if (!newAch.title) {
      alert("Please fill in the Achievement Title.");
      return;
    }
    const validFiles = newAch.files.filter(f => f.url.trim() !== "");
    const createdAch = {
      id: `ach_custom_${Date.now()}`,
      title: newAch.title,
      event: newAch.event || "Event",
      date: newAch.date || "2026",
      fileUrls: validFiles,
    };
    const updated = [...achievements, createdAch];
    setAchievements(updated);
    setNewAch({ title: "", event: "", date: "", files: [{ label: "", url: "" }] });
    setShowAddAchForm(false);
    await saveToFirestore({ achievements: updated });
  };

  const handleRemoveAchievement = async (id: string) => {
    if (confirm("Move this achievement item to trash?")) {
      const updated = achievements.filter(ach => ach.id !== id);
      setAchievements(updated);
      await saveToFirestore({ achievements: updated });
    }
  };

  const handleAddProject = async () => {
    if (!newProj.title) {
      alert("Please fill in the Project Title.");
      return;
    }
    const validFiles = newProj.files.filter(f => f.url.trim() !== "");
    const createdProj = {
      id: `proj_custom_${Date.now()}`,
      title: newProj.title,
      date: newProj.date || "Recent",
      desc: newProj.desc || "Project description...",
      badge: newProj.badge || "Project Report",
      fileUrls: validFiles,
    };
    const updated = [...projects, createdProj];
    setProjects(updated);
    setNewProj({ title: "", date: "", desc: "", badge: "", files: [{ label: "", url: "" }] });
    setShowAddProjForm(false);
    setExpandedProj(createdProj.id);
    await saveToFirestore({ projects: updated });
  };

  const handleRemoveProject = async (id: string) => {
    if (confirm("Move this project item to trash?")) {
      const updated = projects.filter(proj => proj.id !== id);
      setProjects(updated);
      if (editingSection === id) setEditingSection(null);
      await saveToFirestore({ projects: updated });
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillInput.trim()) return;
    const updated = [...skills, newSkillInput.trim()];
    setSkills(updated);
    setNewSkillInput("");
    await saveToFirestore({ skills: updated });
  };

  const handleRemoveSkill = async (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    await saveToFirestore({ skills: updated });
  };

  const isDevActive = isDevMode && currentUser && currentUser.email === DEVELOPER_EMAIL;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
        Loading portfolio data from Cloud Database...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white pb-24 sm:pb-28 relative overflow-x-hidden">
      
      {/* 🌟 ANIMATED BACKGROUND SHAPES & GRADIENTS */}
      <div className="absolute top-0 left-0 w-full h-[500px] sm:h-[600px] bg-gradient-to-br from-emerald-100/80 via-teal-50/50 to-indigo-100/40 pointer-events-none -z-10" />
      <div className="absolute top-20 -left-28 sm:-left-32 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-300/25 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[350px] sm:top-[450px] -right-28 sm:-right-32 w-72 sm:w-[450px] h-72 sm:h-[450px] bg-teal-300/20 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none -z-10" />

      <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 sticky top-0 z-50 shadow-md" />

      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 sm:pt-8 relative z-10">
        
        {/* HEADER / PROFILE HERO */}
        <header className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden mb-6 sm:mb-8 group">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5 w-full text-center sm:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-1 shadow-lg shadow-emerald-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-50 rounded-[14px] flex items-center justify-center overflow-hidden">
                  {portfolioData.photoUrl ? (
                    <img src={portfolioData.photoUrl} alt={portfolioData.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="w-10 h-10 text-emerald-600" />
                  )}
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {portfolioData.title}
                  </div>
                  {isDevActive && (
                    <button
                      onClick={() => {
                        if (editingSection === "profile") {
                          setEditingSection(null);
                        } else {
                          setDraftProfile({ ...portfolioData });
                          setEditingSection("profile");
                        }
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> {editingSection === "profile" ? "Cancel" : "Edit Profile"}
                    </button>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {portfolioData.name}
                </h1>
                <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed text-justify max-w-xl mx-auto sm:mx-0">
                  {portfolioData.description}
                </p>
              </div>
            </div>

            {/* KONTAK & TOMBOL DOWNLOAD CV */}
            <div className="flex flex-col gap-2 w-full md:w-auto text-xs">
              <a 
                href={portfolioData.cvUrl} 
                target="_blank" 
                rel="noreferrer" 
                download
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer transform hover:-translate-y-1 hover:scale-105 active:translate-y-0"
              >
                <Download className="w-4 h-4 text-white flex-shrink-0 animate-bounce" />
                <span>Download Curriculum Vitae (CV)</span>
              </a>
              <a href={`mailto:${portfolioData.email}`} className="flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 transition-all text-slate-700 font-medium break-all">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{portfolioData.email}</span>
              </a>
              <a href={`https://wa.me/${portfolioData.phone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 transition-all text-slate-700 font-medium">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>+{portfolioData.phone} (WhatsApp)</span>
              </a>
              <div className="flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-center sm:text-left">{portfolioData.location}</span>
              </div>
            </div>
          </div>

          {editingSection === "profile" && isDevActive && (
            <div className="mt-6 p-4 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs space-y-3 transition-all duration-300">
              <p className="font-bold text-amber-900">⚙️ Edit Profile Details, CV & Photo URL (Saves to Firestore)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name:</label>
                  <input type="text" value={draftProfile.name} onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Professional Title:</label>
                  <input type="text" value={draftProfile.title} onChange={(e) => setDraftProfile({ ...draftProfile, title: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email:</label>
                  <input type="text" value={draftProfile.email} onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">WhatsApp Phone (e.g. 62858...):</label>
                  <input type="text" value={draftProfile.phone} onChange={(e) => setDraftProfile({ ...draftProfile, phone: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Location:</label>
                  <input type="text" value={draftProfile.location} onChange={(e) => setDraftProfile({ ...draftProfile, location: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Profile Photo Path (/docs/Sena.jpg):</label>
                  <input type="text" value={draftProfile.photoUrl} onChange={(e) => setDraftProfile({ ...draftProfile, photoUrl: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">CV File Path (/docs/...pdf):</label>
                  <input type="text" value={draftProfile.cvUrl} onChange={(e) => setDraftProfile({ ...draftProfile, cvUrl: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Summary Description:</label>
                <textarea rows={2} value={draftProfile.description} onChange={(e) => setDraftProfile({ ...draftProfile, description: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                <button
                  onClick={async () => {
                    setPortfolioData({ ...draftProfile });
                    setEditingSection(null);
                    await saveToFirestore({ portfolioData: draftProfile });
                    alert("Profile updated and saved to Firestore!");
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save to Cloud
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          )}
        </header>

        {/* HERO STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div onClick={() => scrollToCard("exp_bpjph", 'exp')} className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-sm sm:shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 group-hover:scale-110 transition-transform">5,500+</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center justify-between">
              Halal Document Submission <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
            </p>
          </div>
          <div onClick={() => scrollToCard("exp_bem", 'exp')} className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-sm sm:shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 group-hover:scale-110 transition-transform">450+</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center justify-between">
              BEM Files & Letters <ArrowRight className="w-3 h-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition" />
            </p>
          </div>
          <div onClick={() => scrollToCard("exp_lab", 'exp')} className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-sm sm:shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 group-hover:scale-110 transition-transform">4 Courses</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center justify-between">
              Lab Assistant <ArrowRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 transition" />
            </p>
          </div>
          <div onClick={() => scrollToCard("proj_halal", 'proj')} className="bg-white/90 backdrop-blur-sm border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-sm sm:shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 group-hover:scale-110 transition-transform">3.57</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center justify-between">
              Bachelor's GPA <ArrowRight className="w-3 h-3 text-teal-600 opacity-0 group-hover:opacity-100 transition" />
            </p>
          </div>
        </section>

        <div className="space-y-6 sm:space-y-8">

          {/* 1. EDUCATION SECTION */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg sm:shadow-xl shadow-slate-200/40 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" /> Education
              </h2>
              {isDevActive && (
                <button
                  onClick={() => {
                    if (editingSection === "edu") {
                      setEditingSection(null);
                    } else {
                      setDraftEducation({ ...education });
                      setEditingSection("edu");
                    }
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> {editingSection === "edu" ? "Cancel" : "Edit"}
                </button>
              )}
            </div>

            {editingSection === "edu" && isDevActive && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-3 mb-4 transition-all duration-300">
                <p className="font-bold text-amber-900">⚙️ Edit Education Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Degree Title:</label>
                    <input type="text" value={draftEducation.degree} onChange={(e) => setDraftEducation({ ...draftEducation, degree: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">University:</label>
                    <input type="text" value={draftEducation.university} onChange={(e) => setDraftEducation({ ...draftEducation, university: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Period:</label>
                    <input type="text" value={draftEducation.period} onChange={(e) => setDraftEducation({ ...draftEducation, period: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">GPA:</label>
                    <input type="text" value={draftEducation.gpa} onChange={(e) => setDraftEducation({ ...draftEducation, gpa: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Relevant Coursework:</label>
                  <input type="text" value={draftEducation.courses} onChange={(e) => setDraftEducation({ ...draftEducation, courses: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                  <button
                    onClick={async () => {
                      setEducation({ ...draftEducation });
                      setEditingSection(null);
                      await saveToFirestore({ education: draftEducation });
                      alert("Education updated and saved to Cloud!");
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="border-l-2 border-emerald-500 pl-3.5 sm:pl-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{education.degree}</h3>
              <p className="text-xs text-slate-600 font-medium">{education.university} • {education.gpa}</p>
              <p className="text-[11px] text-slate-400">{education.period}</p>
              <p className="text-[11px] text-slate-700 font-semibold mt-2">Relevant Coursework:</p>
              <p className="text-[11px] text-slate-500 leading-relaxed text-justify">{education.courses}</p>
            </div>
          </section>

          {/* 2. EXPERIENCE SECTION */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg sm:shadow-xl shadow-slate-200/40 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6 pb-3.5 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                Work & Organizational Experience
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Click for Details
                </span>
                {isDevActive && (
                  <button
                    onClick={() => setShowAddExpForm(!showAddExpForm)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> {showAddExpForm ? "Close" : "+ Add"}
                  </button>
                )}
              </div>
            </div>

            {showAddExpForm && isDevActive && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-3 mb-6 transition-all duration-300">
                <p className="font-bold text-emerald-900">✨ Add New Experience Sub-Point with Multiple Documents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Job Title" value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} className="p-2 bg-white rounded-lg border border-emerald-300" />
                  <input type="text" placeholder="Company / Institution" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} className="p-2 bg-white rounded-lg border border-emerald-300" />
                </div>
                <input type="text" placeholder="Period (e.g., Aug 2025 - Dec 2025)" value={newExp.period} onChange={(e) => setNewExp({ ...newExp, period: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-emerald-300" />
                <textarea rows={2} placeholder="Description..." value={newExp.desc} onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-emerald-300" />

                <div className="space-y-2 pt-2 border-t border-emerald-200">
                  <p className="font-bold text-emerald-900">Public Docs Files:</p>
                  {newExp.files.map((file, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input type="text" placeholder="Label" value={file.label} onChange={(e) => {
                        const updated = [...newExp.files];
                        updated[idx].label = e.target.value;
                        setNewExp({ ...newExp, files: updated });
                      }} className="p-1.5 bg-white rounded-lg border border-emerald-300 flex-1" />
                      <input type="text" placeholder="Path (/docs/file.pdf)" value={file.url} onChange={(e) => {
                        const updated = [...newExp.files];
                        updated[idx].url = e.target.value;
                        setNewExp({ ...newExp, files: updated });
                      }} className="p-1.5 bg-white rounded-lg border border-emerald-300 flex-1" />
                      <button onClick={() => setNewExp({ ...newExp, files: newExp.files.filter((_, i) => i !== idx) })} className="p-1.5 bg-rose-500 text-white rounded flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={() => setNewExp({ ...newExp, files: [...newExp.files, { label: "", url: "" }] })} className="px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-bold rounded flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Document
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button onClick={handleAddExperience} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer shadow-sm">Save Item</button>
                  <button onClick={() => setShowAddExpForm(false)} className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg cursor-pointer shadow-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3.5 sm:space-y-4">
              {experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  id={exp.id} 
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white group/card"
                >
                  <div 
                    onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                    className="w-full p-3.5 sm:p-4 bg-slate-50/80 hover:bg-slate-100/90 flex items-start sm:items-center justify-between transition-colors cursor-pointer gap-2"
                  >
                    <div className="text-left flex-1 pr-2">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mb-1">
                        {exp.period}
                      </span>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-base leading-snug group-hover/card:text-emerald-700 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">{exp.company}</p>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {isDevActive && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (editingSection === exp.id) {
                                setEditingSection(null);
                              } else {
                                setDraftExperience({ ...exp });
                                setEditingSection(exp.id);
                              }
                            }}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveExperience(exp.id);
                            }}
                            className="p-1 bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <div className="p-1 sm:p-1.5 rounded-full bg-white border border-slate-200 shadow-xs group-hover/card:scale-110 transition-transform">
                        {expandedExp === exp.id ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>
                  </div>

                  {editingSection === exp.id && isDevActive && (
                    <div className="p-4 bg-amber-50/70 border-b border-amber-200 text-xs space-y-3 transition-all duration-300">
                      <p className="font-bold text-amber-900">⚙️ Edit Sub-Point Experience & Documents</p>
                      <div>
                        <label className="block font-semibold mb-1">Job Title:</label>
                        <input type="text" value={draftExperience?.title || ""} onChange={(e) => setDraftExperience({ ...draftExperience, title: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Company / Org:</label>
                          <input type="text" value={draftExperience?.company || ""} onChange={(e) => setDraftExperience({ ...draftExperience, company: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Period:</label>
                          <input type="text" value={draftExperience?.period || ""} onChange={(e) => setDraftExperience({ ...draftExperience, period: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Description:</label>
                        <textarea rows={3} value={draftExperience?.desc || ""} onChange={(e) => setDraftExperience({ ...draftExperience, desc: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                        <button
                          onClick={async () => {
                            const updated = experiences.map(item => item.id === exp.id ? { ...draftExperience } : item);
                            setExperiences(updated);
                            setEditingSection(null);
                            await saveToFirestore({ experiences: updated });
                            alert("Experience item saved to Cloud!");
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedExp === exp.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs text-slate-600 space-y-3 leading-relaxed border-l-4 border-l-emerald-500">
                      <p className="font-medium text-slate-700 text-justify">{exp.desc}</p>

                      {exp.fileUrls && exp.fileUrls.length > 0 && (
                        <div className="pt-2">
                          <p className="font-bold text-slate-900 mb-2">Attached Documents / Proofs:</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.fileUrls.map((file: any, idx: number) => (
                              <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="px-3 py-2 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-[11px] sm:text-[10px] transition transform hover:scale-105 flex items-center gap-1.5 shadow-xs">
                                <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> 
                                <span className="break-all">{file.label}</span> 
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. PROFESSIONAL TRAINING */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg sm:shadow-xl shadow-slate-200/40 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" /> Professional Training & Certifications
              </h2>
              {isDevActive && (
                <button
                  onClick={() => {
                    if (editingSection === "train") {
                      setEditingSection(null);
                    } else {
                      setDraftTrainings(JSON.parse(JSON.stringify(trainings)));
                      setEditingSection("train");
                    }
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" /> {editingSection === "train" ? "Cancel" : "Edit"}
                </button>
              )}
            </div>

            {editingSection === "train" && isDevActive && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-3 mb-4 transition-all duration-300">
                <p className="font-bold text-amber-900">⚙️ Edit Training Items</p>
                {draftTrainings.map((tr, index) => (
                  <div key={tr.id} className="p-3 bg-white rounded-lg border border-amber-200 space-y-2 shadow-xs">
                    <input type="text" value={tr.title} onChange={(e) => {
                      const updated = [...draftTrainings];
                      updated[index].title = e.target.value;
                      setDraftTrainings(updated);
                    }} className="w-full p-1.5 border border-slate-300 rounded font-bold" placeholder="Training Title" />
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                  <button onClick={async () => { 
                    setTrainings([...draftTrainings]); 
                    setEditingSection(null); 
                    await saveToFirestore({ trainings: draftTrainings });
                    alert("Training updated and saved to Cloud!"); 
                  }} className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer shadow-sm">Save</button>
                  <button onClick={() => setEditingSection(null)} className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer shadow-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3.5 sm:space-y-4">
              {trainings.map(tr => (
                <div key={tr.id} className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-2 hover:border-emerald-300 hover:shadow-md transition">
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug text-justify">{tr.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{tr.organizer} • {tr.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                    {tr.fileUrls && tr.fileUrls.map((file: any, idx: number) => (
                      <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="px-3 py-2 sm:py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[11px] sm:text-[10px] transition transform hover:scale-105 flex items-center gap-1 shadow-xs">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" /> 
                        <span className="break-all">{file.label}</span> 
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. HONORS & ACHIEVEMENTS */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg sm:shadow-xl shadow-slate-200/40 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Honors & Key Achievements
              </h2>
              <div className="flex items-center gap-2">
                {isDevActive && (
                  <button
                    onClick={() => setShowAddAchForm(!showAddAchForm)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> {showAddAchForm ? "Close" : "+ Add"}
                  </button>
                )}
              </div>
            </div>

            {showAddAchForm && isDevActive && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-3 mb-4 transition-all duration-300">
                <p className="font-bold text-amber-900">✨ Add New Achievement Sub-Point</p>
                <div>
                  <label className="block font-semibold mb-1">Title / Role:</label>
                  <input type="text" placeholder="Title / Role" value={newAch.title} onChange={(e) => setNewAch({ ...newAch, title: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-amber-300" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={handleAddAchievement} className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer shadow-sm">Save Achievement</button>
                  <button onClick={() => setShowAddAchForm(false)} className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer shadow-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3.5 sm:space-y-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="p-3.5 sm:p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl text-xs shadow-xs space-y-3 relative hover:shadow-md transition">
                  <div>
                    <p className="font-bold text-amber-900 text-xs sm:text-sm leading-snug text-justify">{ach.title}</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 text-justify">{ach.event}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{ach.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-200/50 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {ach.fileUrls?.map((file: any, idx: number) => (
                        <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-2 sm:py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] sm:text-[10px] rounded-lg shadow-xs transition transform hover:scale-105">
                          <FileText className="w-3.5 h-3.5 flex-shrink-0" /> 
                          <span className="break-all">{file.label}</span> 
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                    {isDevActive && (
                      <button onClick={() => handleRemoveAchievement(ach.id)} className="p-1.5 bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition cursor-pointer shadow-xs" title="Move to trash">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. ACADEMIC PROJECTS SECTION */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg sm:shadow-xl shadow-slate-200/40 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6 pb-3.5 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Academic Projects & Food Portfolio
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Click for Details
                </span>
                {isDevActive && (
                  <button
                    onClick={() => setShowAddProjForm(!showAddProjForm)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> {showAddProjForm ? "Close" : "+ Add"}
                  </button>
                )}
              </div>
            </div>

            {showAddProjForm && isDevActive && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-3 mb-6 transition-all duration-300">
                <p className="font-bold text-emerald-900">✨ Add New Academic Project</p>
                <input type="text" placeholder="Project Title" value={newProj.title} onChange={(e) => setNewProj({ ...newProj, title: e.target.value })} className="w-full p-2 bg-white rounded-lg border border-emerald-300" />
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={handleAddProject} className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer shadow-sm">Save Project</button>
                  <button onClick={() => setShowAddProjForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer shadow-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3.5 sm:space-y-4">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  id={proj.id} 
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white group/card"
                >
                  <div 
                    onClick={() => setExpandedProj(expandedProj === proj.id ? null : proj.id)}
                    className="w-full p-3.5 sm:p-4 bg-slate-50/80 hover:bg-slate-100/90 flex items-start sm:items-center justify-between transition-colors cursor-pointer gap-2"
                  >
                    <div className="text-left flex-1 pr-2">
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                        {proj.date}
                      </span>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-base leading-snug group-hover/card:text-emerald-700 transition-colors text-justify">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {isDevActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProject(proj.id);
                          }}
                          className="p-1 bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="p-1 sm:p-1.5 rounded-full bg-white border border-slate-200 shadow-xs group-hover/card:scale-110 transition-transform">
                        {expandedProj === proj.id ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>
                  </div>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedProj === proj.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs text-slate-600 space-y-3 leading-relaxed border-l-4 border-l-emerald-500">
                      <p className="font-medium text-slate-700 text-justify">{proj.desc}</p>
                      {proj.badge && (
                        <div className="p-3 sm:p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                          <span className="font-bold text-emerald-900 text-[11px] sm:text-xs">Project Tag / Status</span>
                          <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-300 text-slate-800 font-bold text-[11px] sm:text-xs break-all">{proj.badge}</span>
                        </div>
                      )}

                      {proj.fileUrls && proj.fileUrls.length > 0 && (
                        <div className="pt-2">
                          <p className="font-bold text-slate-900 mb-2">Project Documents Available:</p>
                          <div className="flex flex-wrap gap-2">
                            {proj.fileUrls.map((file: any, idx: number) => (
                              <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="px-3 py-2 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] sm:text-[10px] transition transform hover:scale-105 flex items-center gap-1.5 shadow-xs">
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" /> 
                                <span className="break-all">{file.label}</span> 
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. CORE SKILLS */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg sm:shadow-xl shadow-slate-200/40 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Core Competencies & Skills
              </h2>
            </div>

            {isDevActive && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl transition-all duration-300">
                <input
                  type="text"
                  placeholder="Type new skill name..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  className="flex-1 p-2 bg-white text-xs rounded-lg border border-amber-300 shadow-xs"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {skills.map((sk, idx) => (
                <div
                  key={idx}
                  className="group relative text-[11px] sm:text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-semibold rounded-xl border border-slate-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-1.5 shadow-xs"
                >
                  <span>{sk}</span>
                  {isDevActive && (
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-0.5 bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white rounded transition-all cursor-pointer"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* DEVELOPER LOGIN PANEL */}
        {isDevMode && !currentUser && (
          <div className="mt-10 sm:mt-12 p-5 sm:p-6 bg-slate-900 text-white rounded-2xl sm:rounded-3xl border border-emerald-500/40 text-center shadow-2xl transition-all duration-300">
            <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm mb-1">Developer Mode Unlocked</h3>
            <p className="text-xs text-slate-400 mb-4 break-all">Sign in with your authorized email (`ibnusenamhmd@gmail.com`) to enable editing.</p>
            <button
              onClick={handleGoogleLogin}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Sign In with Google Account
            </button>
          </div>
        )}

        {/* DEVELOPER LOGGED-IN STATUS BAR */}
        {isDevActive && (
          <div className="mt-10 sm:mt-12 p-3.5 sm:p-4 bg-slate-900 text-white rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl">
            <span className="flex items-center gap-2 text-center sm:text-left break-all">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              Authorized Developer Active ({currentUser.email})
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 flex items-center gap-1 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-10 sm:mt-14 text-center text-xs text-slate-400 border-t border-slate-200 pt-6">
          <p className="px-2">
            © {currentYear}{" "}
            <span
              onClick={handleSecretClick}
              className="cursor-pointer select-none font-bold text-slate-700 hover:text-emerald-600 transition-colors"
              title="Muhammad Ibnu Sena Portfolio"
            >
              {portfolioData.name}
            </span>
            . Portfolio & Media Tracker Sennporto.
          </p>
          {clickCount > 0 && clickCount < 5 && (
            <p className="text-[10px] text-emerald-600 font-mono mt-1 animate-pulse">
              ({5 - clickCount} more clicks to unlock Developer Mode)
            </p>
          )}
        </footer>
      </main>
    </div>
  );
}