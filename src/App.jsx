import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://qytzalwhwtoptxknqrbf.supabase.co";
const SUPABASE_KEY = "sb_publishable_wOYMShmjRqJO7GjJnUbqQw_k_dY_rtD";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_EMAIL = "contact.arcwize@gmail.com";
const WIX_SITE_ID = "455c12fa-d597-4a3e-ba87-1e6c51e493e8";
const WIX_API_KEY = "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjIyMjUxODY5LWQ2MWMtNGY0MS05YzI2LTBkMjQzYjVkNTIzN1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImU4OTFmMzg5LTczNGMtNGM4MS1hNzEzLWZlZDE4MWFkMjQ1ZFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI4ZDczYzY1OC0wYzc2LTQzZjUtYmYzYi02MTdlYjAyMDAwZjdcIn19IiwiaWF0IjoxNzc3MDg3OTQ5fQ.if8Bz_cNjMtLGNVqU1ZADNRuZMXDFq0YxA0sISSAyGuxVFdvo_R638wVseieZTouyk6jmYk03x9zca1hnRDOD9dmSv-L_u__JQh7sLPK7EOWfA0OnZHAO0iWxDEPSnAxKnAaGOpZQXCT3-EakYV-K1xKXUsVZd3OppZIB-umxdQIV5JBP-kxHUkL7c8vqA__gIXWiYLli1AZK27awBJjlbpYErwf7WqBAr8XszLYRbZw-4rm7rqFy1q4kTHMOTEdHjbbmtdna9GeI-wf95QHvTUAkwCPg_VpIeWd0aw96WTucCzGRMc-iJrpB0mhpx4UfB8qZBqcH5pAiqB2qTWUbg";

const FALLBACK_CATEGORIES = [
  { id: "222c471d-1e83-467b-a38e-2d3beec8bde0", label: "US Politics" },
  { id: "da858084-c9b3-44fa-8858-58ac43ee3252", label: "Global Politics & Human Rights" },
  { id: "f8a251cb-06ed-4324-ae56-280e20a5f0f8", label: "Culture, Identity & Society" },
  { id: "6d33e65c-0a09-40d9-8f97-17815b968665", label: "Technology" },
  { id: "5c7ec347-3303-4edb-8d16-ec2bf477c132", label: "Law" },
  { id: "13ce23a1-ea72-452c-a88b-bb0b43c6e268", label: "Style" },
];

const FALLBACK_TAGS = [
  { id: "d3f00668-ec72-45fb-8bb8-b39d807b8e0e", label: "POLITICS" },
  { id: "3d4c293a-be6b-403d-a6ce-418dd03e45df", label: "SOCIETY" },
  { id: "3916742a-ecd2-4887-b7ae-855cfc8accd9", label: "GOVERNMENT" },
  { id: "a040b457-b886-49e0-852b-9082a58dfe95", label: "HUMAN RIGHTS" },
  { id: "3c587042-3def-45b0-9bb0-41b16349d36e", label: "GLOBAL NEWS" },
  { id: "b78da138-289c-42fa-80e7-e84cbef2196c", label: "MORALITY" },
  { id: "82910aab-6587-41a2-890a-1f184978db5a", label: "TECHNOLOGY" },
  { id: "73268a63-5416-4f96-961c-9ed2e2a8c9d8", label: "CULTURE" },
  { id: "c020d445-601e-4243-a31f-da6160c9e329", label: "INTERNATIONAL LAW" },
  { id: "e2b48983-dac8-483e-be22-c0787dc50b9a", label: "FASHION" },
  { id: "bc983581-14ff-4f40-a296-d6d0e96b2c1b", label: "Identity" },
  { id: "55efca97-12f4-4946-8859-14c9a48c1eb1", label: "CIVIL RIGHTS" },
  { id: "03a5e9c3-39f5-4fc4-9b90-5556ff09e74b", label: "POLICY" },
  { id: "e842766c-e46b-43f2-b2be-090b189778b7", label: "AI" },
  { id: "dbcc0e8d-876d-4122-968c-63e55df9c530", label: "PHILOSOPHY" },
  { id: "b1f70096-2c74-45f7-b058-9b5f3303c50a", label: "POLITICAL ECONOMY" },
  { id: "fd77a126-f1b0-4281-9edb-50ec506449b4", label: "Immigration" },
  { id: "f924cc48-8a7f-4156-a4be-3c511a5b3a07", label: "ECONOMY" },
  { id: "0ada36f0-919e-45c7-93c6-fddea095bd18", label: "Human Rights Violations" },
  { id: "5fcf1776-85ce-4225-a4e4-2a652e7e7a18", label: "Trends" },
];

function wc(t) { return t.trim().split(/\s+/).filter(Boolean).length; }
function catLabel(id, cats) { return (cats || FALLBACK_CATEGORIES).find(c => c.id === id)?.label || "Uncategorised"; }
function fmt(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function greeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; }
function firstName(u) { return u?.user_metadata?.full_name?.split(" ")[0] || u?.email?.split("@")[0] || "there"; }

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #f5f0e8;
    --cream-dark: #ede6d6;
    --dark: #1a1410;
    --dark-mid: #2c2318;
    --sidebar-bg: #1c1710;
    --gold: #c4985a;
    --gold-light: #d4aa72;
    --white: #ffffff;
    --text: #2a2018;
    --mid: #7a6e60;
    --light: #b8a898;
    --rule: #ddd5c4;
    --red: #b04040;
    --status-submitted: #2d6a4f;
    --status-review: #8a6020;
    --status-draft: #5a5048;
  }

  html, body, #root { height: 100%; }
  body { font-family: 'Jost', sans-serif; background: var(--cream); color: var(--text); -webkit-font-smoothing: antialiased; }

  /* ── LOGIN ── */
  .login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--cream);
  }

  .login-left {
    background: var(--cream);
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid var(--rule);
  }

  .login-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--dark);
    text-transform: uppercase;
    line-height: 1;
  }

  .login-logo-sub {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--mid);
    margin-top: 0.5rem;
  }

  .login-left-rule {
    width: 40px;
    height: 2px;
    background: var(--gold);
    margin: 2rem 0;
  }

  .login-left-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 4.5rem;
    font-weight: 300;
    line-height: 1.05;
    color: var(--dark);
    letter-spacing: -0.01em;
  }

  .login-left-tagline {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--mid);
    margin-top: 1.5rem;
    line-height: 1.8;
  }

  .login-left-footer {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--light);
  }

  .login-right {
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem;
  }

  .login-form-wrap {
    width: 100%;
    max-width: 420px;
  }

  .login-a-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5rem;
    font-weight: 300;
    color: var(--dark);
    text-align: center;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .login-a-rule {
    width: 60px;
    height: 1px;
    background: var(--dark);
    margin: 0 auto 2rem;
  }

  .login-welcome {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--dark);
    text-align: center;
    margin-bottom: 0.4rem;
  }

  .login-welcome-sub {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--mid);
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .f-label {
    display: block;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--mid);
    margin-bottom: 0.5rem;
  }

  .f-input {
    width: 100%;
    padding: 0.85rem 1rem;
    background: var(--white);
    border: 1px solid var(--rule);
    font-family: 'Jost', sans-serif;
    font-size: 0.95rem;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    border-radius: 2px;
    margin-bottom: 1.25rem;
  }

  .f-input:focus { border-color: var(--gold); }

  .f-input::placeholder { color: var(--light); }

  .btn-login {
    width: 100%;
    padding: 1rem;
    background: var(--dark);
    color: var(--white);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 2px;
    margin-top: 0.5rem;
  }

  .btn-login:hover { background: var(--dark-mid); }
  .btn-login:disabled { opacity: 0.35; cursor: not-allowed; }

  .f-forgot {
    text-align: right;
    margin-bottom: 1rem;
    margin-top: -0.75rem;
  }

  .f-forgot button {
    background: none;
    border: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    font-style: italic;
    color: var(--mid);
    cursor: pointer;
    transition: color 0.15s;
  }

  .f-forgot button:hover { color: var(--dark); }

  .f-error {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    font-style: italic;
    color: var(--red);
    margin-top: 0.75rem;
    text-align: center;
  }

  .reset-sent {
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-style: italic;
    color: var(--mid);
    padding: 1.5rem;
    border: 1px solid var(--rule);
    border-radius: 2px;
    margin-top: 1rem;
    line-height: 1.6;
  }

  .back-link {
    background: none;
    border: none;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--mid);
    cursor: pointer;
    margin-top: 1rem;
    display: block;
    text-align: center;
    transition: color 0.15s;
  }

  .back-link:hover { color: var(--dark); }

  /* ── PORTAL SHELL ── */
  .shell { min-height: 100vh; display: flex; }

  .sidebar {
    width: 260px;
    min-height: 100vh;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    padding: 2.5rem 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
  }

  .sidebar-logo {
    padding: 0 2rem 0;
  }

  .sidebar-wordmark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--white);
    line-height: 1;
  }

  .sidebar-wordmark-sub {
    font-size: 0.55rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-top: 0.3rem;
  }

  .sidebar-gold-rule {
    width: 32px;
    height: 1px;
    background: var(--gold);
    margin: 1.5rem 2rem;
  }

  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0 1rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    transition: all 0.15s;
    position: relative;
  }

  .nav-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.05); }

  .nav-item.active {
    color: var(--white);
    background: rgba(196,152,90,0.15);
  }

  .nav-item.active::before {
    content: '';
    position: absolute;
    left: 0; top: 50%;
    transform: translateY(-50%);
    width: 2px; height: 60%;
    background: var(--gold);
    border-radius: 0 2px 2px 0;
  }

  .nav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }

  .notif-badge {
    margin-left: auto;
    background: var(--gold);
    color: var(--dark);
    font-size: 0.55rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }

  .sidebar-bottom {
    padding: 1.5rem 2rem 0;
    border-top: 1px solid rgba(255,255,255,0.08);
    margin-top: 1rem;
  }

  .sidebar-a-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 300;
    color: rgba(196,152,90,0.3);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .sidebar-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.85rem;
    font-style: italic;
    color: rgba(255,255,255,0.3);
    line-height: 1.5;
  }

  .sidebar-micro {
    font-size: 0.55rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    margin-top: 0.3rem;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    margin: 1rem 1rem 0;
    border-radius: 4px;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    background: none;
    border: none;
    width: calc(100% - 2rem);
    text-align: left;
    transition: all 0.15s;
  }

  .logout-btn:hover { color: rgba(255,255,255,0.7); }

  /* ── MAIN CONTENT ── */
  .main {
    margin-left: 260px;
    flex: 1;
    min-height: 100vh;
    background: var(--cream);
  }

  .topbar {
    background: var(--cream);
    border-bottom: 1px solid var(--rule);
    padding: 1.25rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }

  .topbar-greeting {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    font-style: italic;
    color: var(--mid);
  }

  .topbar-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--dark);
    color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  /* ── DASHBOARD ── */
  .page { padding: 2.5rem; }

  .page-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 400;
    color: var(--dark);
    line-height: 1;
    margin-bottom: 0.4rem;
  }

  .page-subtitle {
    font-size: 0.8rem;
    color: var(--mid);
    font-weight: 400;
  }

  .btn-create {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1.75rem;
    background: var(--dark);
    color: var(--white);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 2px;
    white-space: nowrap;
  }

  .btn-create:hover { background: var(--dark-mid); }

  /* STAT CARDS */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--white);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .stat-icon {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--cream-dark);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .stat-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--mid);
    margin-bottom: 0.3rem;
  }

  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 400;
    color: var(--dark);
    line-height: 1;
    margin-bottom: 0.3rem;
  }

  .stat-link {
    font-size: 0.62rem;
    color: var(--gold);
    font-weight: 500;
    letter-spacing: 0.08em;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    transition: color 0.15s;
  }

  .stat-link:hover { color: var(--gold-light); }

  /* ARTICLE TABLE */
  .table-wrap {
    background: var(--white);
    border: 1px solid var(--rule);
    border-radius: 4px;
  }

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--rule);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .table-tabs {
    display: flex;
    gap: 0;
  }

  .table-tab {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--mid);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .table-tab.active {
    color: var(--dark);
    border-bottom-color: var(--gold);
  }

  .table-search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.85rem;
    border: 1px solid var(--rule);
    border-radius: 2px;
    background: var(--cream);
  }

  .table-search input {
    border: none;
    background: transparent;
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    color: var(--text);
    outline: none;
    width: 180px;
  }

  .table-search input::placeholder { color: var(--light); }

  .table-cols {
    display: grid;
    grid-template-columns: 1fr 120px 160px 120px;
    padding: 0.6rem 1.5rem;
    border-bottom: 1px solid var(--rule);
    background: var(--cream);
  }

  .col-head {
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mid);
  }

  .article-row {
    display: grid;
    grid-template-columns: 1fr 120px 160px 120px;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--rule);
    transition: background 0.15s;
    cursor: pointer;
  }

  .article-row:last-child { border-bottom: none; }
  .article-row:hover { background: var(--cream); }

  .article-thumb-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .article-thumb {
    width: 56px; height: 40px;
    border-radius: 2px;
    object-fit: cover;
    background: var(--cream-dark);
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    color: var(--light);
    font-family: 'Cormorant Garamond', serif;
  }

  .article-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 0.15rem;
    line-height: 1.3;
  }

  .article-cat {
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mid);
  }

  .status-badge {
    display: inline-block;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.3rem 0.7rem;
    border-radius: 2px;
  }

  .badge-submitted { background: #e8f5ee; color: var(--status-submitted); }
  .badge-review    { background: #fdf6e8; color: var(--status-review); }
  .badge-draft     { background: var(--cream-dark); color: var(--status-draft); }

  .date-cell {
    font-size: 0.72rem;
    color: var(--mid);
  }

  .actions-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--light);
    font-size: 1rem;
    transition: color 0.15s;
    padding: 0;
  }

  .action-btn:hover { color: var(--dark); }

  .empty-row {
    padding: 4rem;
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    font-style: italic;
    color: var(--light);
  }

  /* ── NOTIFICATIONS ── */
  .notif-list { display: flex; flex-direction: column; gap: 1rem; }

  .notif-item {
    background: var(--white);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: 1.25rem 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .notif-item.unread { border-left: 3px solid var(--gold); }

  .notif-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--gold);
    margin-top: 5px;
    flex-shrink: 0;
  }

  .notif-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 0.25rem;
  }

  .notif-body {
    font-size: 0.78rem;
    color: var(--mid);
    line-height: 1.5;
    margin-bottom: 0.4rem;
  }

  .notif-time {
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--light);
  }

  /* ── EDITOR ── */
  .editor-wrap { max-width: 820px; margin: 0 auto; }

  .editor-back {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--mid);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.15s;
  }

  .editor-back:hover { color: var(--dark); }

  .editor-title {
    width: 100%;
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 400;
    color: var(--dark);
    border: none;
    border-bottom: 2px solid var(--rule);
    background: transparent;
    padding: 0.5rem 0 1rem;
    outline: none;
    line-height: 1.1;
    transition: border-color 0.2s;
  }

  .editor-title::placeholder { color: var(--rule); }
  .editor-title:focus { border-bottom-color: var(--gold); }

  .editor-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin: 2rem 0;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--rule);
  }

  .meta-label {
    display: block;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mid);
    margin-bottom: 0.6rem;
  }

  .meta-select {
    width: 100%;
    padding: 0.7rem 0.85rem;
    background: var(--white);
    border: 1px solid var(--rule);
    font-family: 'Jost', sans-serif;
    font-size: 0.88rem;
    color: var(--text);
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s;
    border-radius: 2px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237a6e60'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.85rem center;
  }

  .meta-select:focus { border-color: var(--gold); }

  .meta-textarea {
    width: 100%;
    padding: 0.7rem 0.85rem;
    background: var(--white);
    border: 1px solid var(--rule);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    font-style: italic;
    color: var(--text);
    outline: none;
    resize: none;
    min-height: 58px;
    transition: border-color 0.2s;
    line-height: 1.6;
    border-radius: 2px;
  }

  .meta-textarea::placeholder { color: var(--light); }
  .meta-textarea:focus { border-color: var(--gold); }

  /* TAGS */
  .tags-wrap { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--rule); }

  .tags-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.6rem;
  }

  .tag-chip {
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.35rem 0.8rem;
    border: 1px solid var(--rule);
    background: var(--white);
    color: var(--mid);
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 2px;
  }

  .tag-chip:hover { border-color: var(--gold); color: var(--dark); }
  .tag-chip.on { background: var(--dark); color: var(--white); border-color: var(--dark); }

  /* COVER */
  .cover-wrap { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--rule); }

  .cover-drop {
    border: 1px dashed var(--rule);
    border-radius: 4px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
    margin-top: 0.6rem;
    position: relative;
  }

  .cover-drop:hover { border-color: var(--gold); }

  .cover-drop input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .cover-drop-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    font-style: italic;
    color: var(--mid);
    display: block;
  }

  .cover-drop-sub {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--light);
    margin-top: 0.3rem;
    display: block;
  }

  .cover-preview { width: 100%; max-height: 220px; object-fit: cover; border-radius: 2px; display: block; }

  .cover-remove {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mid);
    background: none;
    border: none;
    cursor: pointer;
    margin-top: 0.6rem;
    padding: 0;
    transition: color 0.15s;
  }

  .cover-remove:hover { color: var(--red); }

  /* TOOLBAR */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--rule);
    flex-wrap: wrap;
    row-gap: 0.3rem;
  }

  .tb {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--mid);
    background: none;
    border: none;
    padding: 0.3rem 0.65rem;
    cursor: pointer;
    transition: color 0.15s;
    text-transform: uppercase;
  }

  .tb:hover { color: var(--dark); }
  .tb-sep { width: 1px; height: 14px; background: var(--rule); margin: 0 0.2rem; flex-shrink: 0; }

  .body-field {
    width: 100%;
    min-height: 500px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    color: var(--text);
    line-height: 1.9;
    border: none;
    background: transparent;
    outline: none;
    padding: 1.5rem 0;
  }

  .body-field:empty::before {
    content: attr(data-ph);
    color: var(--light);
    font-style: italic;
    pointer-events: none;
  }

  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.5rem;
    border-top: 1px solid var(--rule);
    margin-top: 1rem;
  }

  .word-count {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--light);
  }

  .editor-actions { display: flex; gap: 0.85rem; align-items: center; }

  .btn-save {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mid);
    background: none;
    border: 1px solid var(--rule);
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.15s;
  }

  .btn-save:hover { border-color: var(--dark); color: var(--dark); }

  .btn-submit {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--white);
    background: var(--dark);
    border: none;
    padding: 0.75rem 1.75rem;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.15s;
  }

  .btn-submit:hover { background: var(--dark-mid); }
  .btn-submit:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ADMIN */
  .admin-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .admin-stat {
    background: var(--white);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: 1.5rem;
  }

  .admin-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 300;
    color: var(--dark);
    line-height: 1;
    margin-bottom: 0.4rem;
  }

  .admin-stat-label {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mid);
  }

  /* LOADING */
  .loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    background: var(--cream);
  }

  .loading-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 300;
    color: var(--dark);
  }

  .loading-sub {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--light);
  }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--dark);
    color: var(--white);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    padding: 1rem 1.5rem;
    border-left: 3px solid var(--gold);
    z-index: 9999;
    animation: fadeUp 0.25s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 360px;
    border-radius: 2px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  }

  .toast.err { border-left-color: var(--red); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .login-page { grid-template-columns: 1fr; }
    .login-left { display: none; }
    .sidebar { display: none; }
    .main { margin-left: 0; }
    .stats-row { grid-template-columns: 1fr; }
    .admin-stats { grid-template-columns: 1fr 1fr; }
    .editor-meta { grid-template-columns: 1fr; }
    .table-cols, .article-row { grid-template-columns: 1fr auto auto; }
  }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4200); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast${type === "err" ? " err" : ""}`}><span>{type === "err" ? "✕" : "✓"}</span>{msg}</div>;
}

function Avatar({ user }) {
  const initials = (user?.user_metadata?.full_name || user?.email || "IN")
    .split(/\s|@/)[0].slice(0, 2).toUpperCase();
  return <div className="topbar-avatar">{initials}</div>;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail]     = useState("");
  const [pw, setPw]           = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);
  const [reset, setReset]     = useState(false);
  const [sent, setSent]       = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message);
    else onLogin(data.user);
    setLoading(false);
  };

  const sendReset = async () => {
    setErr(""); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setErr(error.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div>
          <div className="login-logo">Arcwize</div>
          <div className="login-logo-sub">Portal</div>
        </div>
        <div>
          <div className="login-left-rule" />
          <div className="login-left-headline">Ideas.<br />Stories.<br />Impact.</div>
          <div className="login-left-tagline">WRITE. EDIT. PUBLISH.<br />SHAPE THE NARRATIVE.</div>
        </div>
        <div className="login-left-footer">© {new Date().getFullYear()} Arcwize. All rights reserved.</div>
      </div>
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-a-mark">A</div>
          <div className="login-a-rule" />
          {!reset ? (
            <>
              <div className="login-welcome">Welcome back</div>
              <div className="login-welcome-sub">Log in to your Arcwize Portal</div>
              <label className="f-label">Email</label>
              <input className="f-input" type="email" placeholder="Enter your email" value={email}
                onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
              <label className="f-label">Password</label>
              <input className="f-input" type="password" placeholder="Enter your password" value={pw}
                onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
              <div className="f-forgot">
                <button onClick={() => { setReset(true); setErr(""); }}>Forgot password?</button>
              </div>
              <button className="btn-login" onClick={submit} disabled={loading || !email || !pw}>
                {loading ? "Logging in..." : "Log In"}
              </button>
              {err && <div className="f-error">{err}</div>}
            </>
          ) : (
            <>
              <div className="login-welcome">Reset Password</div>
              <div className="login-welcome-sub">Enter your email to receive a link</div>
              {sent ? (
                <div className="reset-sent">
                  Check your inbox. A reset link has been sent to <strong>{email}</strong>.
                </div>
              ) : (
                <>
                  <label className="f-label">Email</label>
                  <input className="f-input" type="email" placeholder="Enter your email" value={email}
                    onChange={e => setEmail(e.target.value)} />
                  <button className="btn-login" onClick={sendReset} disabled={loading || !email}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                  {err && <div className="f-error">{err}</div>}
                </>
              )}
              <button className="back-link" onClick={() => { setReset(false); setSent(false); }}>← Back to login</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ tab, setTab, user, isAdmin, onLogout, unread }) {
  const internItems = [
    { id: "dashboard",      icon: "⊞", label: "Dashboard" },
    { id: "articles",       icon: "◻", label: "My Articles" },
    { id: "editor",         icon: "⊕", label: "Create New" },
    { id: "notifications",  icon: "◉", label: "Notifications", badge: unread },
  ];
  const adminItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "notifications", icon: "◉", label: "Notifications", badge: unread },
  ];
  const items = isAdmin ? adminItems : internItems;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-wordmark">Arcwize</div>
        <div className="sidebar-wordmark-sub">Intern Portal</div>
      </div>
      <div className="sidebar-gold-rule" />
      <nav className="sidebar-nav">
        {items.map(item => (
          <button key={item.id} className={`nav-item${tab === item.id ? " active" : ""}`}
            onClick={() => setTab(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge > 0 && <span className="notif-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
      <button className="logout-btn" onClick={onLogout}>
        <span className="nav-icon">→</span> Log out
      </button>
      <div className="sidebar-bottom">
        <div className="sidebar-a-mark">A</div>
        <div className="sidebar-tagline">Ideas. Stories. Impact.</div>
        <div className="sidebar-micro">Write. Edit. Publish. Shape the narrative.</div>
      </div>
    </div>
  );
}

// ── ARTICLE TABLE ─────────────────────────────────────────────────────────────
function ArticleTable({ articles, categories, filter, onEdit, onView }) {
  const [search, setSearch] = useState("");
  const filtered = articles
    .filter(a => filter === "all" ? true : filter === "submitted" ? a.status === "submitted" : filter === "review" ? a.status === "review" : a.status === "draft")
    .filter(a => !search || a.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="table-wrap">
      <div className="table-header">
        <div className="table-tabs">
          {[["all","Submitted Articles"],["review","Pending Reviews"],["draft","Drafts"]].map(([val,label]) => (
            <button key={val} className={`table-tab${filter===val?" active":""}`}
              onClick={() => {}}>
              {label}
            </button>
          ))}
        </div>
        <div className="table-search">
          <span style={{color:"var(--light)"}}>🔍</span>
          <input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-cols">
        <div className="col-head">Article</div>
        <div className="col-head">Status</div>
        <div className="col-head">Last Updated</div>
        <div className="col-head">Actions</div>
      </div>
      {filtered.length === 0
        ? <div className="empty-row">No articles here yet.</div>
        : filtered.map(a => (
          <div key={a.id} className="article-row">
            <div className="article-thumb-row">
              <div className="article-thumb">
                {a.coverPreview
                  ? <img src={a.coverPreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:2}} />
                  : "A"}
              </div>
              <div>
                <div className="article-title">{a.title || "Untitled Draft"}</div>
                <div className="article-cat">{catLabel(a.category, categories)}</div>
              </div>
            </div>
            <div>
              <span className={`status-badge ${a.status==="submitted"?"badge-submitted":a.status==="review"?"badge-review":"badge-draft"}`}>
                {a.status==="submitted"?"Submitted":a.status==="review"?"Pending Review":"Draft"}
              </span>
            </div>
            <div className="date-cell">{a.date || "—"}</div>
            <div className="actions-cell">
              <button className="action-btn" title="View" onClick={() => onView(a)}>👁</button>
              {a.status === "draft" && <button className="action-btn" title="Edit" onClick={() => onEdit(a)}>✏️</button>}
              <button className="action-btn" title="More">···</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ── INTERN DASHBOARD ──────────────────────────────────────────────────────────
function InternDashboard({ user, articles, categories, onNew, onEdit }) {
  const submitted = articles.filter(a => a.status === "submitted" || a.status === "review");
  const pending   = articles.filter(a => a.status === "review");
  const drafts    = articles.filter(a => a.status === "draft");

  return (
    <div className="page">
      <div className="page-title-row">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome back! Here's what's happening with your articles.</div>
        </div>
        <button className="btn-create" onClick={onNew}>+ Create New Article</button>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">↗</div>
          <div>
            <div className="stat-label">Submitted Articles</div>
            <div className="stat-num">{submitted.length}</div>
            <button className="stat-link">View all submitted →</button>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">◷</div>
          <div>
            <div className="stat-label">Pending Reviews</div>
            <div className="stat-num">{pending.length}</div>
            <button className="stat-link">View all pending →</button>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✏</div>
          <div>
            <div className="stat-label">Drafts</div>
            <div className="stat-num">{drafts.length}</div>
            <button className="stat-link">View all drafts →</button>
          </div>
        </div>
      </div>
      <ArticleTable articles={articles} categories={categories} filter="all" onEdit={onEdit} onView={() => {}} />
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard({ articles, categories }) {
  const submitted  = articles.filter(a => a.status === "submitted");
  const pending    = articles.filter(a => a.status === "review");
  const drafts     = articles.filter(a => a.status === "draft");
  const totalWords = articles.reduce((s, a) => s + (a.words || 0), 0);

  return (
    <div className="page">
      <div className="page-title-row">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Managing Editor — Arcwize Editorial Queue</div>
        </div>
      </div>
      <div className="admin-stats">
        <div className="admin-stat"><div className="admin-stat-num">{articles.length}</div><div className="admin-stat-label">Total Pieces</div></div>
        <div className="admin-stat"><div className="admin-stat-num">{submitted.length}</div><div className="admin-stat-label">Submitted</div></div>
        <div className="admin-stat"><div className="admin-stat-num">{pending.length}</div><div className="admin-stat-label">In Review</div></div>
        <div className="admin-stat"><div className="admin-stat-num">{totalWords > 999 ? (totalWords/1000).toFixed(1)+"k" : totalWords}</div><div className="admin-stat-label">Total Words</div></div>
      </div>
      <ArticleTable articles={articles} categories={categories} filter="all" onEdit={()=>{}} onView={()=>{}} />
    </div>
  );
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
function Notifications({ notifications, onRead }) {
  return (
    <div className="page">
      <div className="page-title-row">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-subtitle">Updates on your submitted articles.</div>
        </div>
      </div>
      <div className="notif-list">
        {notifications.length === 0
          ? <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:"var(--light)",fontSize:"1.1rem",padding:"3rem 0",textAlign:"center"}}>No notifications yet.</div>
          : notifications.map(n => (
            <div key={n.id} className={`notif-item${n.unread ? " unread" : ""}`} onClick={() => onRead(n.id)}>
              {n.unread && <div className="notif-dot" />}
              <div>
                <div className="notif-title">{n.title}</div>
                <div className="notif-body">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── EDITOR ────────────────────────────────────────────────────────────────────
function Editor({ user, draft, categories, tags, onSave, onSubmit, onBack }) {
  const [title, setTitle]           = useState(draft?.title || "");
  const [excerpt, setExcerpt]       = useState(draft?.excerpt || "");
  const [category, setCategory]     = useState(draft?.category || "");
  const [selectedTags, setTags]     = useState(draft?.tags || []);
  const [coverPreview, setCover]    = useState(draft?.coverPreview || null);
  const [bodyText, setBody]         = useState(draft?.body || "");
  const [submitting, setSubmitting] = useState(false);
  const bodyRef = useRef(null);
  const words = wc(bodyText);
  const exec  = (cmd, val = null) => { document.execCommand(cmd, false, val); bodyRef.current?.focus(); };

  const toggleTag = id => setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : prev.length < 5 ? [...prev, id] : prev);

  const handleCover = e => {
    const f = e.target.files[0];
    if (f) setCover(URL.createObjectURL(f));
  };

  const doSubmit = async () => {
    if (!title.trim() || !bodyText.trim() || !category) return;
    setSubmitting(true);
    try {
      const nodes = bodyText.trim().split(/\n\n+/).filter(Boolean).map(p => ({
        type: "PARAGRAPH", nodes: [{ type: "TEXT", textData: { text: p.replace(/<[^>]+>/g,"") } }]
      }));
      const res = await fetch("https://www.wixapis.com/blog/v3/draft-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": WIX_API_KEY, "wix-site-id": WIX_SITE_ID },
        body: JSON.stringify({ draftPost: { title: title.trim(), excerpt: excerpt.trim(), categoryIds: [category], tagIds: selectedTags, richContent: { nodes }, status: "IN_REVIEW" } })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onSubmit({ ...draft, title, excerpt, category, tags: selectedTags, body: bodyText, coverPreview, wixId: data?.draftPost?.id, status: "submitted" });
    } catch {
      onSubmit({ ...draft, title, excerpt, category, tags: selectedTags, body: bodyText, coverPreview, status: "submitted" });
    }
    setSubmitting(false);
  };

  return (
    <div className="page">
      <div className="editor-wrap">
        <button className="editor-back" onClick={onBack}>← Back to Dashboard</button>
        <input className="editor-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Article title" />

        <div className="editor-meta">
          <div>
            <label className="meta-label">Category</label>
            <select className="meta-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="meta-label">Excerpt</label>
            <textarea className="meta-textarea" rows={2} value={excerpt}
              onChange={e => setExcerpt(e.target.value)} placeholder="One sentence that introduces your piece..." />
          </div>
        </div>

        <div className="tags-wrap">
          <label className="meta-label">Tags — select up to 5</label>
          <div className="tags-chips">
            {tags.map(t => (
              <button key={t.id} className={`tag-chip${selectedTags.includes(t.id) ? " on" : ""}`}
                onClick={() => toggleTag(t.id)} type="button">{t.label}</button>
            ))}
          </div>
        </div>

        <div className="cover-wrap">
          <label className="meta-label">Cover Image</label>
          {coverPreview
            ? <div><img src={coverPreview} alt="Cover" className="cover-preview" /><button className="cover-remove" onClick={() => setCover(null)}>Remove image</button></div>
            : <div className="cover-drop">
                <input type="file" accept="image/*" onChange={handleCover} />
                <span className="cover-drop-label">Click to upload a cover image</span>
                <span className="cover-drop-sub">JPG, PNG, WEBP — recommended 1200 × 630px</span>
              </div>
          }
        </div>

        <div className="toolbar">
          <button className="tb" onMouseDown={e=>{e.preventDefault();exec("bold");}}>B</button>
          <button className="tb" style={{fontStyle:"italic"}} onMouseDown={e=>{e.preventDefault();exec("italic");}}>I</button>
          <button className="tb" style={{textDecoration:"underline"}} onMouseDown={e=>{e.preventDefault();exec("underline");}}>U</button>
          <div className="tb-sep"/>
          <button className="tb" onMouseDown={e=>{e.preventDefault();exec("formatBlock","H2");}}>H2</button>
          <button className="tb" onMouseDown={e=>{e.preventDefault();exec("formatBlock","H3");}}>H3</button>
          <button className="tb" onMouseDown={e=>{e.preventDefault();exec("formatBlock","P");}}>P</button>
          <div className="tb-sep"/>
          <button className="tb" onMouseDown={e=>{e.preventDefault();exec("formatBlock","BLOCKQUOTE");}}>Quote</button>
          <button className="tb" onMouseDown={e=>{e.preventDefault();exec("insertUnorderedList");}}>List</button>
          <div className="tb-sep"/>
          <button className="tb" onMouseDown={e=>{e.preventDefault();const u=prompt("URL:");if(u)exec("createLink",u);}}>Link</button>
        </div>

        <div ref={bodyRef} className="body-field" contentEditable suppressContentEditableWarning
          data-ph="Begin writing. Clear, specific, sourced — the Arcwize standard."
          onInput={e => setBody(e.currentTarget.innerText)} />

        <div className="editor-footer">
          <div className="word-count">{words.toLocaleString()} {words === 1 ? "word" : "words"}</div>
          <div className="editor-actions">
            <button className="btn-save" onClick={() => onSave({title,excerpt,category,tags:selectedTags,body:bodyText,coverPreview,status:"draft"})}>Save Draft</button>
            <button className="btn-submit" onClick={doSubmit} disabled={submitting||!title.trim()||!bodyText.trim()||!category}>
              {submitting ? "Submitting..." : "Submit for Review →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [tags, setTagsData]       = useState(FALLBACK_TAGS);
  const [tab, setTab]             = useState("dashboard");
  const [articles, setArticles]   = useState([]);
  const [draft, setDraft]         = useState(null);
  const [toast, setToast]         = useState(null);
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Welcome to Arcwize Portal", body: "Your account is ready. Start writing your first article.", time: fmt(Date.now()), unread: true },
  ]);

  const unread = notifications.filter(n => n.unread).length;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const h = { "Authorization": WIX_API_KEY, "wix-site-id": WIX_SITE_ID };
    fetch("https://www.wixapis.com/blog/v3/categories?paging.limit=50", { headers: h })
      .then(r => r.json()).then(d => { if (d.categories?.length) setCategories(d.categories.map(c => ({ id: c.id, label: c.label }))); }).catch(() => {});
    fetch("https://www.wixapis.com/blog/v3/tags?paging.limit=50", { headers: h })
      .then(r => r.json()).then(d => { if (d.tags?.length) setTagsData(d.tags.map(t => ({ id: t.id, label: t.label }))); }).catch(() => {});
  }, [user]);

  const isAdmin    = user?.email === ADMIN_EMAIL;
  const notify     = (msg, type="ok") => setToast({ msg, type });
  const myArticles = isAdmin ? articles : articles.filter(a => a.userId === user?.id);

  const signOut = async () => { await supabase.auth.signOut(); setArticles([]); setDraft(null); setTab("dashboard"); };

  const startNew = () => {
    setDraft({ id: Date.now().toString(), title:"", excerpt:"", category:"", tags:[], body:"", coverPreview:null, status:"draft", userId:user.id, authorEmail:user.email });
    setTab("editor");
  };

  const saveDraft = data => {
    const a = { ...draft, ...data, words: wc(data.body), date: fmt(Date.now()) };
    setArticles(prev => { const i=prev.findIndex(x=>x.id===a.id); if(i>=0){const n=[...prev];n[i]=a;return n;} return [a,...prev]; });
    setDraft(a); notify("Draft saved.");
  };

  const submitArticle = data => {
    const a = { ...draft, ...data, words: wc(data.body), date: fmt(Date.now()), status:"submitted" };
    setArticles(prev => { const i=prev.findIndex(x=>x.id===a.id); if(i>=0){const n=[...prev];n[i]=a;return n;} return [a,...prev]; });
    // Add notification
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: "Article Submitted",
      body: `"${a.title || "Your article"}" has been submitted and is now in Triston's review queue.`,
      time: fmt(Date.now()),
      unread: true
    }, ...prev]);
    setDraft(null); setTab("dashboard");
    notify("Submitted. Now in Triston's review queue.");
  };

  const markRead = id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  if (loading) return (
    <><style>{css}</style>
    <div className="loading-screen">
      <div className="loading-mark">A</div>
      <div className="loading-sub">Loading...</div>
    </div></>
  );

  if (!user) return <><style>{css}</style><Login onLogin={setUser} /></>;

  return (
    <><style>{css}</style>
    <div className="shell">
      <Sidebar tab={tab} setTab={t => { if(t==="editor"&&!draft)startNew(); else setTab(t); }} user={user} isAdmin={isAdmin} onLogout={signOut} unread={unread} />
      <div className="main">
        <div className="topbar">
          <div className="topbar-greeting">{greeting()}, {firstName(user)} 👋</div>
          <Avatar user={user} />
        </div>
        {isAdmin  && tab==="dashboard"     && <AdminDashboard articles={articles} categories={categories} />}
        {!isAdmin && tab==="dashboard"     && <InternDashboard user={user} articles={myArticles} categories={categories} onNew={startNew} onEdit={d=>{setDraft(d);setTab("editor");}} />}
        {!isAdmin && tab==="articles"      && <InternDashboard user={user} articles={myArticles} categories={categories} onNew={startNew} onEdit={d=>{setDraft(d);setTab("editor");}} />}
        {!isAdmin && tab==="editor"        && draft && <Editor user={user} draft={draft} categories={categories} tags={tags} onSave={saveDraft} onSubmit={submitArticle} onBack={()=>setTab("dashboard")} />}
        {tab==="notifications"             && <Notifications notifications={isAdmin ? [] : notifications} onRead={markRead} />}
        {isAdmin  && tab==="dashboard"     && null}
      </div>
    </div>
    {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </>
  );
}
