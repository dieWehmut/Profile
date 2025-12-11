<script setup>
import { defineProps, computed } from 'vue';
import { useContent } from '../data/content';

const props = defineProps({
  query: { type: String, default: '' },
  enterReady: { type: Boolean, default: true },
});

const { pages, githubAnalytics, achievements, contributionGraphUrl, recentActivity, metrics, visitorBadgeUrl, fetchGitHubData } = useContent();
const visiblePages = computed(() => pages.value.slice(0, 6));

import { onMounted, ref, watch } from 'vue';
// derive top languages: prefer metrics.languageDistribution when available, fall back to githubAnalytics
const topLanguages = computed(() => {
  const mlist = (metrics && metrics.value && metrics.value.languageDistribution) || (metrics.languageDistribution || []);
  if (Array.isArray(mlist) && mlist.length) {
    return mlist.map((it) => ({ name: it.name, pct: Math.round(it.pct || it.percentage || it.percent || 0) }));
  }
  const list = (githubAnalytics.value && githubAnalytics.value.topLanguages) || (githubAnalytics.topLanguages || []);
  const total = list.reduce((s, it) => s + (it.count || 0), 0) || 0;
  if (total === 0) return list.map((it) => ({ name: it.name, pct: 0 }));
  return list.map((it) => ({ name: it.name, pct: Math.round(((it.count || 0) / total) * 100) }));
});

// detect whether contribution graph is a local 3D SVG
const is3DContrib = computed(() => {
  try {
    const url = (contributionGraphUrl && contributionGraphUrl.value) || contributionGraphUrl || '';
    return typeof url === 'string' && url.includes('profile-3d-contrib');
  } catch (e) { return false; }
});

onMounted(() => {
  // try to fetch GitHub live data (no token => unauthenticated, limited rate)
  fetchGitHubData && fetchGitHubData('dieWehmut');
  fetchGitHubUser && fetchGitHubUser('dieWehmut');
  // fetch latest commit date for profile repo
  fetchLastRepoCommit && fetchLastRepoCommit('dieWehmut', 'profile');
});

// fetch contribution graph SVG and inline it so we can style text colors
const contribSvg = ref('');
const SVG_CACHE_KEY = 'profile_contrib_svg_v1';
const SVG_CACHE_TTL = 1000 * 60 * 60; // 1h

// GitHub user profile (avatar, bio)
const githubUser = ref(null);
const USER_CACHE_KEY = 'profile_github_user_v1';
const USER_CACHE_TTL = 1000 * 60 * 60; // 1h

async function fetchGitHubUser(owner = 'dieWehmut', token = '') {
  try {
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(USER_CACHE_KEY) || '{}'); } catch (e) { cache = {}; }
    const entry = cache[owner];
    if (entry && (Date.now() - entry.ts) < USER_CACHE_TTL) {
      githubUser.value = entry.data || null;
      return;
    }

    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (token) headers.Authorization = `token ${token}`;
    const res = await fetch(`https://api.github.com/users/${owner}`, { headers });
    if (!res.ok) return;
    const data = await res.json();
    githubUser.value = data;
    try { cache[owner] = { ts: Date.now(), data }; localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* ignore */ }
  } catch (e) {
    // ignore
  }
}

// fetch latest commit date for a specific repo (owner/repo) and cache it
const lastCommitDate = ref('');
const REPO_COMMIT_CACHE_KEY = 'profile_repo_commit_v1';
const REPO_COMMIT_TTL = 1000 * 60 * 60; // 1h

async function fetchLastRepoCommit(owner = 'dieWehmut', repo = 'profile', token = '') {
  try {
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(REPO_COMMIT_CACHE_KEY) || '{}'); } catch (e) { cache = {}; }
    const key = `${owner}/${repo}`;
    const entry = cache[key];
    if (entry && (Date.now() - entry.ts) < REPO_COMMIT_TTL) {
      lastCommitDate.value = entry.date || '';
      return;
    }

    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (token) headers.Authorization = `token ${token}`;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
    if (!res.ok) return;
    const commits = await res.json();
    if (Array.isArray(commits) && commits[0] && commits[0].commit && commits[0].commit.author) {
      const date = commits[0].commit.author.date;
      lastCommitDate.value = date || '';
      try { cache[key] = { ts: Date.now(), date: lastCommitDate.value }; localStorage.setItem(REPO_COMMIT_CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* ignore */ }
    }
  } catch (e) {
    // ignore
  }
}

function formatDate(d) {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleString();
  } catch (e) { return d; }
}

async function fetchAndInlineSvg(url, owner = 'dieWehmut') {
  if (!url) return;
  try {
    // check cache
    let svgCache = null;
    try { svgCache = JSON.parse(localStorage.getItem(SVG_CACHE_KEY) || '{}'); } catch (e) { svgCache = {}; }
    const entry = svgCache[owner];
    if (entry && (Date.now() - entry.ts) < SVG_CACHE_TTL) {
      contribSvg.value = entry.svg || '';
      return;
    }

    const res = await fetch(url);
    if (!res.ok) return;
    let svgText = await res.text();

    // inject small CSS to force text to white (targets text elements inside SVG)
    // if <svg ...> exists, insert <style> after the opening tag
    const svgTagMatch = svgText.match(/<svg[^>]*>/i);
    if (svgTagMatch) {
      const inject = `<style>svg text{fill:#fff!important} svg .month, svg .weekday, svg .legend { fill: #fff !important; }</style>`;
      svgText = svgText.replace(svgTagMatch[0], svgTagMatch[0] + inject);
    }

    contribSvg.value = svgText;

    // cache
    try {
      svgCache[owner] = { ts: Date.now(), svg: svgText };
      localStorage.setItem(SVG_CACHE_KEY, JSON.stringify(svgCache));
    } catch (e) { /* ignore */ }
  } catch (e) {
    // ignore
  }
}

// react to contributionGraphUrl changes
watch(() => contributionGraphUrl, (v) => {
  const url = (v && (v.value || v)) || '';
  if (url) fetchAndInlineSvg(url, 'dieWehmut');
});
</script>

<template>
  <main class="home" :class="{ entering: enterReady }">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-profile">
          <img v-if="githubUser && githubUser.avatar_url" :src="githubUser.avatar_url" :alt="githubUser.login || 'avatar'" class="hero-avatar" />
          <div class="hero-info">
            <div class="hero-name">{{ (githubUser && (githubUser.name || githubUser.login)) || 'dieWehmut' }}</div>
            <div class="hero-login">@{{ (githubUser && githubUser.login) || 'dieWehmut' }}</div>
            <p class="hero-bio" v-if="githubUser && githubUser.bio">{{ githubUser.bio }}</p>
            <div class="repo-meta">
              <div class="meta-item" v-if="githubUser && githubUser.updated_at">{{ $t('github.lastUpdated') }}: {{ formatDate(githubUser.updated_at) }}</div>
              <div class="meta-item" v-else-if="visiblePages && visiblePages.length">{{ $t('github.lastUpdated') }}: {{ visiblePages[0].versions && visiblePages[0].versions[0] && visiblePages[0].versions[0].date ? visiblePages[0].versions[0].date : '' }}</div>
              <div class="meta-item" v-if="lastCommitInfo">
                {{ $t('github.lastCommit') }}:
                <a v-if="lastCommitInfo.url" :href="lastCommitInfo.url" target="_blank" rel="noopener">{{ lastCommitInfo.message || lastCommitInfo.repo }}</a>
                <span v-else>{{ lastCommitInfo.message || lastCommitInfo.repo }}</span>
                <span class="meta-date">{{ lastCommitInfo.date ? ' — ' + formatDate(lastCommitInfo.date) : '' }}</span>
              </div>
            </div>
            <div class="hero-links">
              <a :href="(githubUser && githubUser.html_url) || 'https://github.com/dieWehmut'" target="_blank" rel="noopener" class="btn btn-github">
                <!-- GitHub icon (inline SVG) -->
                <svg class="icon-github" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                <span class="btn-label">GitHub</span>
              </a>
                

              <a href="https://www.hc-dsw-nexus.me" target="_blank" rel="noopener noreferrer" class="btn btn-nexus nexus-btn">
                <span class="icon nexus-icon" aria-hidden="true">
                  <!-- simple globe icon -->
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 11h-2.09A15.9 15.9 0 0112 20.9 15.9 15.9 0 019.09 13H7a8 8 0 0010 0zM7 11h2.09A15.9 15.9 0 0112 3.1 15.9 15.9 0 0114.91 11H17a8 8 0 00-10 0z"/></svg>
                </span>
                <span class="label">Nexus</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="github-overview">
      <div class="section-inner">
  <h2 class="section-title">{{ $t('github.title') }}</h2>
        <div class="gh-grid">
          <div class="gh-card">
            <div class="gh-value">{{ githubAnalytics.stars || githubAnalytics.value?.stars || 0 }}</div>
            <div class="gh-label">{{ $t('github.stars') }}</div>
          </div>
          <div class="gh-card">
            <div class="gh-value">{{ githubAnalytics.forks || githubAnalytics.value?.forks || 0 }}</div>
            <div class="gh-label">{{ $t('github.forks') }}</div>
          </div>
          <div class="gh-card">
            <div class="gh-value">{{ githubAnalytics.watchers || githubAnalytics.value?.watchers || 0 }}</div>
            <div class="gh-label">{{ $t('github.watchers') }}</div>
          </div>
          <div class="gh-card">
            <div class="gh-value">{{ metrics.commitsLast30Days || metrics.value?.commitsLast30Days || 0 }}</div>
            <div class="gh-label">{{ $t('github.commits30') }}</div>
          </div>
        </div>

        <div class="gh-langs">
          <h3>
            {{ $t('github.topLanguages') }}
            <small v-if="metrics && metrics.value && metrics.value.languageDistribution && metrics.value.languageDistribution.length">(metrics)</small>
          </h3>
          <div class="lang-list">
            <div class="lang-item" v-for="l in topLanguages" :key="l.name">
              <div class="lang-name">{{ l.name }}</div>
              <div class="lang-bar-outer">
                <div class="lang-bar" :style="{ width: (l.pct || 0) + '%' }"></div>
              </div>
              <div class="lang-pct">{{ l.pct }}%</div>
            </div>
          </div>
        </div>

        <div class="contrib-full">
          <h3>
            {{ $t('github.contributionGraph') }}
            <small v-if="is3DContrib">(3D)</small>
          </h3>
          <div class="contrib-img contrib-large" v-if="contribSvg" v-html="contribSvg"></div>
          <img v-else :src="contributionGraphUrl" :alt="$t('github.contributionGraph')" class="contrib-img contrib-large" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* 保留简单的进入动画，避免页面闪烁 */
.home {
  transition: opacity 320ms ease, transform 320ms ease;
}
.home:not(.entering) {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
}
.home.entering {
  opacity: 1;
  transform: translateY(0);
}

/* Hero */
.hero {
  padding: 48px 0 28px;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0));
}
.hero-inner { max-width: 1080px; width: 100%; padding: 18px; text-align: center; background: rgba(0,0,0,0.36); border-radius: 12px; border: 1px solid rgba(255,255,255,0.04) }
.hero-title { font-size: 40px; margin: 0 0 8px; font-weight: 800 }
.hero-sub { margin: 0 0 18px; color: rgba(255,255,255,0.88) }
.hero-ctas { display:flex; gap:12px; justify-content:center; flex-wrap:wrap }
.btn { display:inline-block; padding:10px 14px; border-radius:10px; background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); color: #fff; text-decoration:none }
.btn.primary { background: linear-gradient(90deg,#4f8bff,#6fb7ff); border:none }

/* Hero profile (GitHub avatar + bio) */
.hero-profile { display:flex; gap:18px; align-items:center; justify-content:center; flex-wrap:wrap }
.hero-avatar { width: 140px; height: 140px; object-fit: cover; border-radius: 6px; border:1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.08) }
.hero-info { max-width: 640px; text-align: left }
.hero-name { font-size: 28px; font-weight:800 }
.hero-login { color: rgba(255,255,255,0.7); margin-bottom:6px }
.hero-bio { margin: 8px 0 12px; color: rgba(255,255,255,0.88) }
.hero-links { display:flex; gap:8px; align-items:center }
.btn-github { display:inline-flex; align-items:center; gap:8px;
  background: rgba(0,0,0,0.36);
  border: 1px solid rgba(255,255,255,0.06);
  transition: background 180ms ease, transform 180ms ease, border-color 180ms ease;
}
.btn-github:hover,
.btn-github:focus {
  background: transparent;
  transform: translateY(-6px);
  border-color: rgba(255,255,255,0.12);
}
.icon-github { display:inline-block; vertical-align:middle }
.btn-label { display:inline-block }

/* Nexus button icon alignment */
.nexus-btn { display:inline-flex; align-items:center; gap:8px }
.nexus-icon { display:inline-flex; width:16px; height:16px }
.nexus-icon svg { width:100%; height:100%; display:block }
.nexus-btn .label { display:inline-block }

.repo-meta { margin-top:8px; color: rgba(255,255,255,0.85) }
.repo-meta .meta-item { font-size:13px; margin:4px 0 }
.repo-meta .meta-date { color: rgba(255,255,255,0.68); margin-left:6px }

/* Nexus button: 默认为黑色半透明；悬浮时去色透明并轻微上移 */
.btn-nexus {
  background: rgba(0,0,0,0.36);
  border: 1px solid rgba(255,255,255,0.06);
  transition: background 180ms ease, transform 180ms ease, border-color 180ms ease;
}
.btn-nexus:hover,
.btn-nexus:focus {
  background: transparent;
  transform: translateY(-6px);
  border-color: rgba(255,255,255,0.12);
}

/* GitHub overview styles */
.github-overview { padding: 18px 0 28px; background: rgba(0,0,0,0.36); border-radius: 12px; border: 1px solid rgba(255,255,255,0.04) }
.github-overview .section-inner { padding: 18px }
.gh-grid { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px }
.gh-card { flex:1 1 160px; background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); padding:12px; border-radius:8px; text-align:center }
.gh-value { font-size:20px; font-weight:700 }
.gh-label { font-size:12px; color: rgba(255,255,255,0.82) }

.contrib-full { margin: 18px 0 20px; display:flex; flex-direction:column; align-items:center }
.contrib-img { width:100%; max-width:1000px; height:auto; border-radius:8px; background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04) }
.contrib-large { height: 260px; object-fit: contain }
.contrib-img svg { width: 100%; height: 100%; display:block }
.contrib-img svg text { fill: #fff !important }

/* hide sections we don't want to display */
.achievements { display:none }
.recent-activity { display:none }
.metrics-overview { display:none }

.lang-list { display:flex; flex-direction:column; gap:8px; margin-bottom:12px }
.lang-item { display:flex; gap:10px; align-items:center }
.lang-name { width:120px; font-weight:600 }
.lang-bar-outer { flex:1; height:10px; background: rgba(255,255,255,0.03); border-radius:6px; overflow:hidden }
.lang-bar { height:100%; background: linear-gradient(90deg,#4f8bff,#6fb7ff); border-radius:6px }
.lang-pct { width:48px; text-align:right; font-weight:700 }
.metric-label { font-size:12px; color: rgba(255,255,255,0.78) }
.metric-value { font-weight:700; margin-top:6px }

/* Projects */
.projects { padding: 18px 0 60px }
.section-inner { max-width: 1080px; margin: 0 auto; padding: 0 18px }
.section-title { font-size: 20px; margin-bottom: 12px }
.projects-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:12px }
.project-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); padding:12px; border-radius:8px }
.project-name { font-weight:700; margin-bottom:6px }
.project-desc { font-size:13px; color: rgba(255,255,255,0.88); margin-bottom:8px }
.project-actions { display:flex; gap:8px }
.link { color: #9fc7ff; text-decoration: none; font-weight:600 }

@media (max-width: 900px) {
  .projects-grid { grid-template-columns: repeat(2,1fr) }
  .hero-title { font-size: 32px }
}
@media (max-width: 520px) {
  .projects-grid { grid-template-columns: 1fr }
  .hero-inner { padding: 0 12px }
  .gh-lower { flex-direction: column }
  .gh-grid { flex-direction: column }
  .metrics-grid { flex-direction: column }
  .contrib-large { height: 160px }
}
</style>


