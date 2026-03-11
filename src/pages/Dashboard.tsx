import { awsConfig } from '../aws-config';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard, GitBranch, Star, HardDrive, RefreshCw,
  ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle,
  Zap, TrendingUp, ChevronRight, Activity, Layers,
  Terminal, ExternalLink, Newspaper, LogOut
} from 'lucide-react';
import '../App.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  live: boolean;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
}

interface TrendItem {
  label: string;
  tag: string;
  heat: number;
  desc: string;
  source: string;
  links: TrendLink[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GITHUB_USER = 'utkarshazade';

const LANG_COLORS: Record<string, string> = {
  Python: '#3b82f6', TypeScript: '#38bdf8', JavaScript: '#facc15',
  Go: '#34d399', Rust: '#f97316', Java: '#ef4444',
  'C++': '#8b5cf6', Ruby: '#ec4899', HTML: '#f97316',
  CSS: '#a78bfa', Unknown: '#64748b',
};

interface TrendLink {
  label: string;
  url: string;
  type: 'article' | 'project' | 'research' | 'youtube';
}

const TREND_DATA: TrendItem[] = [
  {
    label: 'Agentic Workflows', tag: 'AI/ML', heat: 97, source: 'Gartner 2026',
    desc: 'Multi-step AI agents autonomously completing complex tasks end-to-end',
    links: [
      { type: 'article',  label: 'Building Agentic AI with AWS Bedrock',       url: 'https://dev.to/aws-builders/building-agentic-ai-systems-with-bedrock-agents-3p2k' },
      { type: 'article',  label: 'LangChain Agents in Production — dev.to',     url: 'https://dev.to/langchain/agents-in-production-best-practices-2025-4f1n' },
      { type: 'project',  label: 'agentops-ai/agentops — GitHub',               url: 'https://github.com/AgentOps-AI/agentops' },
      { type: 'project',  label: 'microsoft/autogen — Multi-Agent Framework',   url: 'https://github.com/microsoft/autogen' },
      { type: 'research', label: 'ReAct: Synergizing Reasoning & Acting in LLMs', url: 'https://arxiv.org/abs/2210.03629' },
      { type: 'research', label: 'AWS Bedrock Agents Official Docs',             url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html' },
      { type: 'youtube',  label: 'Agentic AI Explained — Fireship',              url: 'https://www.youtube.com/watch?v=sal78ACtGTc' },
      { type: 'youtube',  label: 'Build an AI Agent from Scratch — freeCodeCamp', url: 'https://www.youtube.com/watch?v=bZzyPscbtI8' },
    ],
  },
  {
    label: 'AWS Bedrock Gen 2', tag: 'Cloud', heat: 93, source: 'AWS re:Invent',
    desc: 'Foundation models with native tool-use, RAG & multi-modal capabilities',
    links: [
      { type: 'article',  label: 'Getting Started with Amazon Bedrock — dev.to', url: 'https://dev.to/aws-builders/getting-started-with-amazon-bedrock-1a2b' },
      { type: 'article',  label: 'RAG with Bedrock & DynamoDB — Medium',         url: 'https://medium.com/aws-in-plain-english/rag-pipeline-bedrock-dynamodb-python-2025' },
      { type: 'project',  label: 'aws-samples/amazon-bedrock-samples — GitHub',  url: 'https://github.com/aws-samples/amazon-bedrock-samples' },
      { type: 'project',  label: 'build-on-aws/bedrock-agents-cdk',              url: 'https://github.com/build-on-aws/amazon-bedrock-agents-cdk' },
      { type: 'research', label: 'Amazon Bedrock Model Docs — AWS Official',     url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html' },
      { type: 'research', label: 'Anthropic Claude on Bedrock — Tech Spec',      url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude.html' },
      { type: 'youtube',  label: 'Amazon Bedrock Full Course — TechWorld',       url: 'https://www.youtube.com/watch?v=ab1mbj0acDo' },
      { type: 'youtube',  label: 'Build RAG App with Bedrock — AWS YouTube',     url: 'https://www.youtube.com/watch?v=ZoNjBlHMFzE' },
    ],
  },
  {
    label: 'Vite 7', tag: 'Tooling', heat: 88, source: 'State of JS 26',
    desc: 'Rolldown-powered bundler — 10x faster production builds than Webpack',
    links: [
      { type: 'article',  label: 'Vite 7 Migration Guide — Official Blog',       url: 'https://vitejs.dev/blog/announcing-vite7' },
      { type: 'article',  label: 'Why Vite is Replacing Webpack in 2025 — dev.to', url: 'https://dev.to/franciscomendes10866/why-vite-is-replacing-webpack-3d2k' },
      { type: 'project',  label: 'vitejs/vite — Official GitHub Repo',           url: 'https://github.com/vitejs/vite' },
      { type: 'project',  label: 'rolldown-rs/rolldown — Rust Bundler Core',     url: 'https://github.com/rolldown/rolldown' },
      { type: 'research', label: 'Vite Official Docs & Config Reference',        url: 'https://vitejs.dev/config/' },
      { type: 'research', label: 'State of JavaScript 2025 — Build Tools',       url: 'https://stateofjs.com/en-us/2025/#build_tools' },
      { type: 'youtube',  label: 'Vite Crash Course — Traversy Media',           url: 'https://www.youtube.com/watch?v=89NJdbYTgJ8' },
      { type: 'youtube',  label: 'Vite vs Webpack Deep Dive — Theo',             url: 'https://www.youtube.com/watch?v=DkGV5F4XnfQ' },
    ],
  },
  {
    label: 'Edge Functions', tag: 'Infra', heat: 85, source: 'Vercel Blog',
    desc: 'Sub-5ms serverless compute running at CDN edge nodes globally',
    links: [
      { type: 'article',  label: 'Edge Functions vs Lambda — Vercel Blog',       url: 'https://vercel.com/blog/edge-functions-generally-available' },
      { type: 'article',  label: 'AWS Lambda@Edge Deep Dive — dev.to',           url: 'https://dev.to/aws-builders/lambda-at-edge-deep-dive-cloudfront-2025' },
      { type: 'project',  label: 'vercel/edge-runtime — GitHub',                 url: 'https://github.com/vercel/edge-runtime' },
      { type: 'project',  label: 'cloudflare/workers-sdk — Wrangler CLI',        url: 'https://github.com/cloudflare/workers-sdk' },
      { type: 'research', label: 'AWS Lambda@Edge Docs — Official',              url: 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html' },
      { type: 'research', label: 'Cloudflare Workers Platform Docs',             url: 'https://developers.cloudflare.com/workers/' },
      { type: 'youtube',  label: 'Edge Functions Explained — Fireship',          url: 'https://www.youtube.com/watch?v=yOP5-3_WFus' },
      { type: 'youtube',  label: 'Build with Cloudflare Workers — Theo',         url: 'https://www.youtube.com/watch?v=H7Qe96fqg1M' },
    ],
  },
  {
    label: 'Vector Databases', tag: 'DB', heat: 90, source: 'DB-Engines 26',
    desc: 'Semantic search infrastructure powering every production AI application',
    links: [
      { type: 'article',  label: 'Vector DBs Explained for Developers — dev.to', url: 'https://dev.to/jameswallis/vector-databases-explained-for-developers-2024-3o1k' },
      { type: 'article',  label: 'Pinecone vs pgvector vs Weaviate — Medium',    url: 'https://medium.com/towards-data-science/vector-database-comparison-2025' },
      { type: 'project',  label: 'pgvector/pgvector — Postgres Extension',       url: 'https://github.com/pgvector/pgvector' },
      { type: 'project',  label: 'chroma-core/chroma — Open Source Vector DB',   url: 'https://github.com/chroma-core/chroma' },
      { type: 'research', label: 'Approximate Nearest Neighbors Paper — FAISS',  url: 'https://arxiv.org/abs/1702.08734' },
      { type: 'research', label: 'AWS OpenSearch Vector Engine Docs',            url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn.html' },
      { type: 'youtube',  label: 'Vector Databases Full Course — freeCodeCamp',  url: 'https://www.youtube.com/watch?v=dN0lsF2cvm4' },
      { type: 'youtube',  label: 'RAG + Vector DB from Scratch — Andrej Karpathy', url: 'https://www.youtube.com/watch?v=hhiLw5Q_UFg' },
    ],
  },
  {
    label: 'React Server Comps', tag: 'React', heat: 82, source: 'React RFC',
    desc: 'Zero-bundle UI with seamless server/client component composition',
    links: [
      { type: 'article',  label: 'RSC from Scratch — Dan Abramov, dev.to',      url: 'https://dev.to/dan_abramov/rsc-from-scratch-part-1-server-components-4h9j' },
      { type: 'article',  label: 'React 19 + Server Actions Guide — dev.to',    url: 'https://dev.to/sebastienlorber/react-19-server-actions-complete-guide-2025' },
      { type: 'project',  label: 'reactjs/rfcs — React Server Components RFC',  url: 'https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md' },
      { type: 'project',  label: 'vercel/next.js — App Router + RSC Source',    url: 'https://github.com/vercel/next.js/tree/canary/packages/next/src/server' },
      { type: 'research', label: 'React Server Components RFC — Official',       url: 'https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md' },
      { type: 'research', label: 'React 19 Official Changelog & Docs',           url: 'https://react.dev/blog/2024/12/05/react-19' },
      { type: 'youtube',  label: 'React Server Components Explained — Fireship', url: 'https://www.youtube.com/watch?v=VIwWgV3Lc6s' },
      { type: 'youtube',  label: 'Next.js 15 + RSC Deep Dive — Theo',           url: 'https://www.youtube.com/watch?v=2Ggf45daK7k' },
    ],
  },
];

const AWS_SERVICES = [
  { name: 'S3 Bucket',    id: 'utkarsha-portfolio-assets-2026', ok: true, latency: '12ms' },
  { name: 'DynamoDB',     id: 'gitlaunch-projects',              ok: true, latency: '8ms'  },
  { name: 'Lambda',       id: 'sync-handler-prod',               ok: true, latency: '43ms' },
  { name: 'Cognito Pool', id: 'us-east-1_iaUiGNjrK',            ok: true, latency: '5ms'  },
];

type NavId = 'dashboard' | 'projects' | 'articles' | 'trends' | 'aws';

const NAV: { id: NavId; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { id: 'projects',  icon: GitBranch,       label: 'Projects'   },
  { id: 'articles',  icon: Newspaper,       label: 'Articles'   },
  { id: 'trends',    icon: TrendingUp,      label: 'Trends'     },
  { id: 'aws',       icon: Activity,        label: 'AWS Status' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d ago` : `${Math.floor(d / 7)}w ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavId>('dashboard');
  const [activeTrend, setActiveTrend] = useState<number>(0);
  const [repos,     setRepos]     = useState<Repo[]>([]);
  const [articles,  setArticles]  = useState<Article[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [syncing,   setSyncing]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [lastSync,  setLastSync]  = useState<string>('Never');
  const [clock,     setClock]     = useState(new Date());
  const cachedRepos               = useRef<Repo[]>([]);

  // ── Live clock ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Fetch articles ────────────────────────────────────────────────────────────
  const loadArticles = useCallback(async () => {
    try {
      const res = await fetch('https://dev.to/api/articles?tag=aws&per_page=10&top=30');
      if (!res.ok) return;
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setArticles(data.map((a: any) => ({
        id: String(a.id), title: a.title, summary: a.description ?? '',
        source: 'dev.to', url: a.url, publishedAt: a.published_at,
        readingTime: a.reading_time_minutes,
        reactions: a.public_reactions_count, author: a.user?.name,
      })));
    } catch { /* silent */ }
  }, []);

  // ── Fetch repos — Lambda first, fallback to GitHub ────────────────────────────
  const loadRepos = useCallback(async (showSyncing = false) => {
    showSyncing ? setSyncing(true) : setLoading(true);
    setError(null);
    try {
      let data: Repo[] = [];
      try {
        const lambdaRes = await fetch(
          `${awsConfig.apiGatewayUrl}/repos`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (lambdaRes.ok) data = await lambdaRes.json();
      } catch {
        const ghRes = await fetch(
          `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20&type=public`
        );
        if (!ghRes.ok) throw new Error(`GitHub API error: ${ghRes.status}`);
        const raw = await ghRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = raw.map((r: any) => ({
          id: r.id, name: r.name, description: r.description ?? 'No description.',
          language: r.language ?? 'Unknown', stargazers_count: r.stargazers_count ?? 0,
          forks_count: r.forks_count ?? 0, updated_at: r.updated_at,
          html_url: r.html_url, live: false,
        }));
      }
      // Trust Lambda's live values directly — they come from S3 toggles
// Only use cache if Lambda call failed and we fell back to GitHub
const isFromLambda = !data.some((r: Repo) => r.live === undefined);
const merged = data.map((r: Repo) => {
  if (isFromLambda) return r; // Lambda already has correct toggle states from S3
  const prev = cachedRepos.current.find(p => p.id === r.id);
  return { ...r, live: prev?.live ?? false };
});
setRepos(merged);
cachedRepos.current = merged;
      setLastSync(new Date().toLocaleTimeString());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load repositories');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // ── Load immediately on mount — no auth gate ─────────────────────────────────
  useEffect(() => {
    loadRepos();
    loadArticles();
  }, [loadRepos, loadArticles]);

  const toggleLive = useCallback(async (id: number) => {
    // 1. Optimistic UI update immediately
    let newLive = false;
    setRepos(prev => {
      const updated = prev.map(r => {
        if (r.id === id) { newLive = !r.live; return { ...r, live: !r.live }; }
        return r;
      });
      cachedRepos.current = updated;
      return updated;
    });

    // 2. Persist to S3 via Lambda POST /repos/toggle
    try {
      const res = await fetch(
        `${awsConfig.apiGatewayUrl}/repos/toggle`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, live: newLive }),
        }
      );
      const data = await res.json();
      console.log('Toggle saved:', data);
      // ← DO NOT call loadRepos here — it would overwrite the toggle
    } catch (e) {
      console.error('Toggle save failed — reverting:', e);
      // Revert on failure only
      setRepos(prev => {
        const reverted = prev.map(r => r.id === id ? { ...r, live: !r.live } : r);
        cachedRepos.current = reverted;
        return reverted;
      });
    }
  }, []);

  const totalStars = repos.reduce((a, r) => a + (r.stargazers_count ?? 0), 0);
  const liveCount  = repos.filter(r => r.live).length;
  const warnCount  = AWS_SERVICES.filter(s => !s.ok).length;

  // ── Render helpers ────────────────────────────────────────────────────────────

  function renderStatGrid() {
    const stats = [
      { label: 'TOTAL REPOS',   value: loading ? '—' : String(repos.length), sub: `${liveCount} LIVE ON PORTFOLIO`, accent: '#38bdf8', icon: GitBranch },
      { label: 'GITHUB STARS',  value: loading ? '—' : String(totalStars),   sub: 'ACROSS ALL REPOS',               accent: '#facc15', icon: Star      },
      { label: 'AWS S3 USAGE',  value: '1.4 GB',                              sub: '28% OF 5GB FREE TIER',           accent: '#a78bfa', icon: HardDrive  },
      { label: 'LIVE PROJECTS', value: String(liveCount),                     sub: 'SHOWN ON PORTFOLIO',             accent: '#22c55e', icon: Layers     },
    ];
    return (
      <div className="dash-stat-grid">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="dash-stat-card fade-up">
              <div className="dash-stat-corner" style={{ background: `${s.accent}15` }} />
              <div className="dash-stat-header">
                <div className="dash-stat-icon" style={{ background: `${s.accent}18`, border: `1px solid ${s.accent}30` }}>
                  <Icon size={15} color={s.accent} strokeWidth={2} />
                </div>
                <span className="dash-stat-label">{s.label}</span>
              </div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-sub" style={{ color: s.accent }}>{s.sub}</div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderSyncBar() {
    return (
      <div className="dash-sync-bar">
        <div>
          <div className="dash-sync-title">
            <GitBranch size={15} color="#38bdf8" />
            <span className="dash-sync-name">GitHub Sync</span>
            <span className="dash-sync-badge">CONNECTED</span>
          </div>
          <p className="dash-sync-meta">
            Last synced: <span>{lastSync}</span>
            {repos.length > 0 && <> · {repos.length} repos indexed</>}
          </p>
        </div>
        <button className="sync-btn-custom" onClick={async () => {
  setSyncing(true);
  try {
    await fetch(`${awsConfig.apiGatewayUrl}/sync`, { method: 'POST' });
  } catch(e) { console.log('sync trigger:', e); }
  await loadRepos(true);
}} disabled={syncing}>
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'SYNCING...' : 'SYNC NOW'}
        </button>
      </div>
    );
  }

  function renderProjectsTable() {
    return (
      <div className="dash-panel">
        <div className="dash-panel-header">
          <Layers size={15} color="#38bdf8" />
          <span className="dash-panel-title">REPOSITORY MANAGER</span>
          <span className="dash-panel-count">{liveCount}/{repos.length} LIVE</span>
        </div>
        {loading ? (
          <div style={{ padding: '20px' }}>
            {[...Array(5)].map((_, i) => <div key={i} className="dash-skeleton" style={{ height: 44, marginBottom: 8 }} />)}
          </div>
        ) : repos.length === 0 ? (
          <div className="dash-empty"><p>No repos loaded yet.<br />Click SYNC NOW to fetch from GitHub.</p></div>
        ) : (
          <>
            <div className="dash-table-head">
              {['REPOSITORY', 'LANGUAGE', 'STARS', 'UPDATED', 'LIVE'].map(h => <span key={h}>{h}</span>)}
            </div>
            {repos.map(repo => (
              <div key={repo.id} className={`repo-list-item${repo.live ? ' live' : ''}`}>
                <div className="repo-name-row">
                  <GitBranch size={12} color="#334155" />
                  <span className="repo-name" title={repo.name}>{repo.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div className="repo-lang-dot" style={{ background: LANG_COLORS[repo.language] ?? '#64748b' }} />
                  <span className="repo-lang-text">{repo.language}</span>
                </div>
                <div className="repo-stars">
                  <Star size={11} color="#facc15" fill="#facc15" />
                  {repo.stargazers_count}
                </div>
                <span className="repo-updated">{timeAgo(repo.updated_at)}</span>
                <button className="toggle-btn" onClick={() => toggleLive(repo.id)}>
                  {repo.live
                    ? <><ToggleRight size={22} color="#38bdf8" /><span className="toggle-label" style={{ color: '#38bdf8' }}>ON</span></>
                    : <><ToggleLeft  size={22} color="#64748b" /><span className="toggle-label" style={{ color: '#64748b' }}>OFF</span></>
                  }
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  function renderAWSPanel() {
    return (
      <div className="dash-panel">
        <div className="dash-panel-header">
          <Activity size={15} color="#38bdf8" />
          <span className="dash-panel-title">AWS HEALTH</span>
          {warnCount > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', padding: '2px 8px', borderRadius: 99 }}>
              {warnCount} WARN
            </span>
          )}
        </div>
        {AWS_SERVICES.map((svc, i) => (
          <div key={i} className="aws-row">
            {svc.ok ? <CheckCircle2 size={13} color="#22c55e" /> : <AlertTriangle size={13} color="#f59e0b" />}
            <div className="aws-info">
              <div className="aws-name">{svc.name}</div>
              <div className="aws-id">{svc.id}</div>
            </div>
            <div className="aws-right">
              <div className="aws-ok" style={{ color: svc.ok ? '#22c55e' : '#f59e0b' }}>{svc.ok ? 'OK' : 'WARN'}</div>
              <div className="aws-latency">{svc.latency}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderTrendPanel() {
    const trend = TREND_DATA[activeTrend];
    const hot      = trend.heat >= 92;
    const barColor = hot ? 'linear-gradient(90deg,#f43f5e,#fb7185)' : trend.heat >= 87 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#a78bfa,#c4b5fd)';
    const barGlow  = hot ? '#f43f5e60' : trend.heat >= 87 ? '#f59e0b60' : '#a78bfa60';
    const tagColor = hot ? '#f43f5e' : '#a78bfa';

    const typeConfig = {
      article:  { label: 'ARTICLES',  color: '#38bdf8', icon: '📄' },
      project:  { label: 'PROJECTS',  color: '#22c55e', icon: '🔧' },
      research: { label: 'RESEARCH',  color: '#a78bfa', icon: '🔬' },
      youtube:  { label: 'VIDEOS',    color: '#f43f5e', icon: '▶' },
    };

    const grouped = (Object.keys(typeConfig) as TrendLink['type'][]).map(type => ({
      type,
      ...typeConfig[type],
      links: trend.links.filter(l => l.type === type),
    }));

    return (
      <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {/* ── Header ── */}
        <div className="dash-panel-header" style={{ padding: '14px 18px' }}>
          <Zap size={15} color="#a78bfa" />
          <span className="dash-panel-title">TREND RADAR</span>
          <span className="dash-panel-count">2026</span>
        </div>

        <div style={{ display: 'flex', gap: 0, minHeight: 520 }}>

          {/* ── Left: trend selector ── */}
          <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #1e3a5f', padding: '8px 0' }}>
            {TREND_DATA.map((t, i) => {
              const isActive = activeTrend === i;
              const h = t.heat >= 92;
              const tc = h ? '#f43f5e' : '#a78bfa';
              return (
                <button
                  key={i}
                  onClick={() => setActiveTrend(i)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 16px',
                    background: isActive ? 'rgba(56,189,248,0.07)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '2px solid #38bdf8' : '2px solid transparent',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#f1f5f9' : '#94a3b8', fontFamily: 'Geist, sans-serif' }}>
                      {t.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: h ? '#f43f5e' : '#f59e0b', fontFamily: 'Geist Mono, monospace' }}>
                      {t.heat}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 3, background: '#1e3a5f', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${t.heat}%`, height: '100%', background: h ? '#f43f5e' : '#a78bfa', borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 9, color: tc, border: `1px solid ${tc}40`, background: `${tc}12`, padding: '1px 5px', borderRadius: 4, fontFamily: 'Geist, sans-serif' }}>
                      {t.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Right: detail panel ── */}
          <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto' }}>

            {/* Trend header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Geist, sans-serif' }}>
                  {trend.label}
                </span>
                <span style={{ fontSize: 10, color: tagColor, border: `1px solid ${tagColor}40`, background: `${tagColor}12`, padding: '2px 8px', borderRadius: 4, fontFamily: 'Geist, sans-serif' }}>
                  {trend.tag}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 800, color: hot ? '#f43f5e' : '#f59e0b', fontFamily: 'Geist Mono, monospace' }}>
                  {trend.heat}%
                </span>
              </div>
              <div style={{ height: 6, background: '#1e3a5f', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ width: `${trend.heat}%`, height: '100%', background: barColor, boxShadow: `0 0 8px ${barGlow}`, borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Geist, sans-serif' }}>SOURCE: {trend.source}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'Geist, sans-serif', marginTop: 4, lineHeight: 1.6 }}>
                {trend.desc}
              </div>
            </div>

            {/* 4 sections grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {grouped.map(group => (
                <div key={group.type} style={{ background: '#0a1628', border: `1px solid ${group.color}25`, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 13 }}>{group.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: group.color, fontFamily: 'Geist, sans-serif' }}>
                      {group.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {group.links.map((link, li) => (
                      <a
                        key={li}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 7, textDecoration: 'none',
                          padding: '6px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.02)',
                          border: '1px solid transparent', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${group.color}10`; (e.currentTarget as HTMLAnchorElement).style.borderColor = `${group.color}30`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'; }}
                      >
                        <ExternalLink size={11} color={group.color} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: '#cbd5e1', fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>
                          {link.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  }

  const ARTICLE_TAGS = ['python', 'aws', 'react', 'typescript', 'machinelearning', 'webdev'];
  const [articleTag, setArticleTag] = useState('aws');
  const [articlesLoading, setArticlesLoading] = useState(false);

  const loadArticlesByTag = useCallback(async (tag: string) => {
    setArticlesLoading(true);
    try {
      const res = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=10&top=30`);
      if (!res.ok) return;
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setArticles(data.map((a: any) => ({
        id: String(a.id), title: a.title, summary: a.description ?? '',
        source: 'dev.to', url: a.url, publishedAt: a.published_at,
        coverImage: a.cover_image, readingTime: a.reading_time_minutes,
        reactions: a.public_reactions_count, author: a.user?.name,
      })));
    } catch { /* silent */ }
    finally { setArticlesLoading(false); }
  }, []);

  function renderArticlesPanel() {
    return (
      <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div className="dash-panel-header" style={{ padding: '14px 18px' }}>
          <Newspaper size={15} color="#38bdf8" />
          <span className="dash-panel-title">LIVE ARTICLES</span>
          <span className="dash-panel-count" style={{ color: '#22c55e' }}>● LIVE · DEV.TO</span>
        </div>

        {/* Tag filter tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 18px', borderBottom: '1px solid #1e3a5f', flexWrap: 'wrap' }}>
          {ARTICLE_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => { setArticleTag(tag); loadArticlesByTag(tag); }}
              style={{
                padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                fontFamily: 'Geist, sans-serif', cursor: 'pointer', border: 'none',
                background: articleTag === tag ? '#38bdf8' : 'rgba(56,189,248,0.08)',
                color: articleTag === tag ? '#0f172a' : '#64748b',
                letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                transition: 'all 0.15s',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Articles list */}
        <div style={{ padding: '8px 0', maxHeight: 540, overflowY: 'auto' }}>
          {articlesLoading ? (
            <div style={{ padding: 20 }}>
              {[...Array(5)].map((_, i) => <div key={i} className="dash-skeleton" style={{ height: 56, marginBottom: 8 }} />)}
            </div>
          ) : articles.length === 0 ? (
            <div className="dash-empty"><p>No articles found for #{articleTag}.<br />Try a different tag.</p></div>
          ) : (
            articles.map((a: any) => (
              <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="article-row"
                style={{ alignItems: 'flex-start', gap: 12, padding: '10px 18px' }}
              >
                <div className="article-tag-dot" style={{ marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="article-title" style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.4 }}>{a.title}</div>
                  <div className="article-meta" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                    <span className="article-source">{a.author || 'dev.to'}</span>
                    <span>· {timeAgo(a.publishedAt)}</span>
                    {a.readingTime && <span>· {a.readingTime} min read</span>}
                    {a.reactions > 0 && <span style={{ color: '#f43f5e' }}>· ♥ {a.reactions}</span>}
                  </div>
                </div>
                <ExternalLink size={12} color="#64748b" style={{ flexShrink: 0, marginTop: 4 }} />
              </a>
            ))
          )}
        </div>
      </div>
    );
  }

  function renderSyncStatus() {
    return (
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Backend Status',     value: 'AWS Connected',        color: '#22c55e' },
          { label: 'GitHub Integration', value: 'Active Sync',          color: '#38bdf8' },
          { label: 'Live Projects',      value: `${liveCount} Showing`, color: '#a78bfa' },
        ].map(item => (
          <div key={item.label} style={{ background: '#0f172a', padding: '14px 18px', borderRadius: '10px', border: '1px solid #1e3a5f', flex: 1 }}>
            <span style={{ color: '#64748b', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontFamily: 'Geist, sans-serif' }}>
              {item.label}
            </span>
            <div style={{ color: item.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, marginTop: 6, fontSize: '13px', fontFamily: 'Geist, sans-serif' }}>
              <div style={{ width: 8, height: 8, background: item.color, borderRadius: '50%', boxShadow: `0 0 6px ${item.color}` }} />
              {item.value}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderContent() {
    switch (activeNav) {
      case 'dashboard':
        return (
          <>
            {renderSyncStatus()}
            {renderStatGrid()}
            {renderSyncBar()}
            <div className="dash-two-col">
              {renderProjectsTable()}
              {renderAWSPanel()}
            </div>
          </>
        );
      case 'projects': return <>{renderSyncBar()}{renderProjectsTable()}</>;
      case 'articles': return renderArticlesPanel();
      case 'trends':   return renderTrendPanel();
      case 'aws':      return renderAWSPanel();
    }
  }

  // ── Full layout ───────────────────────────────────────────────────────────────
  return (
    <div className="dash-wrapper">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <div className="dash-brand-icon">
            <Terminal size={16} color="#0f172a" strokeWidth={2.5} />
          </div>
          <div className="dash-brand-text">
            <span className="dash-brand-name">GitLaunch</span>
            <span className="dash-brand-version">HUB v2.0</span>
          </div>
        </div>

        <nav className="dash-nav">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`dash-nav-btn${activeNav === id ? ' active' : ''}`}
              onClick={() => setActiveNav(id)}
            >
              <Icon size={15} strokeWidth={activeNav === id ? 2.5 : 2} />
              {label}
              {activeNav === id && <ChevronRight size={12} style={{ marginLeft: 'auto', color: '#38bdf8' }} />}
            </button>
          ))}

          {/* Back to Portfolio */}
          <button
            className="dash-nav-btn"
            style={{ marginTop: 'auto', color: '#f87171' }}
            onClick={() => window.location.href = '/'}
          >
            <LogOut size={15} />
            Back to Portfolio
          </button>
        </nav>

        <div className="dash-user-badge">
          <div className="dash-user-inner">
            <div className="dash-avatar">U</div>
            <div>
              <div className="dash-user-name">utkarsha</div>
              <div className="dash-user-status">ACTIVE</div>
            </div>
            <div className="dash-online-dot" />
          </div>
        </div>
      </aside>

      <main className="dash-main overflow-auto">
        <div className="dash-topbar">
          <div>
            <div className="dash-page-title">Mission Control</div>
            <div className="dash-page-sub">
              GITLAUNCH HUB · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="dash-status-pill">
              <div className="dash-status-dot" />
              <span className="dash-status-text">ALL SYSTEMS GO</span>
            </div>
            <div className="dash-clock">
              {clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>

        {error && (
          <div className="dash-error">
            <AlertTriangle size={14} />
            {error} — showing GitHub public API fallback.
          </div>
        )}

        {renderContent()}

        <div className="dash-footer-caption">
          GITLAUNCH HUB · POWERED BY AWS AMPLIFY GEN 2 · DEVSPHERE PLATFORM
        </div>
      </main>
    </div>
  );
}