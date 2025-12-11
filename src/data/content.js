import { ref } from 'vue';

/**
 * useContent
 * Provides site content and lightweight GitHub-related data holders.
 * Note: fetchGitHubData is optional — unauthenticated requests are rate-limited.
 * For production use, supply a GitHub token (via meta tag or env) and call fetchGitHubData(owner, token).
 */
export function useContent() {
  const pages = ref([
    {
      name: "kotobahitomi",
      repoUrl: "https://github.com/dieWehmut/kotoba-hitomi",
      versions: [
        {
          version: "v1.4",
          date: "2025-06-03",
          log: "nihongo AI web app",
          url: "https://kotoba-hitomi.hc-dsw-nexus.me/",
        },
      ],
    },
    {
      name: "showcase",
      repoUrl: "https://github.com/dieWehmut/Showcase",
      versions: [
        {
          date: "2025-10-01",
          log: "Project and Product Showcase",
          url: "https://showcase.hc-dsw-nexus.me/",
        },
      ],
    },
    {
      name: "notes",
      repoUrl: "https://github.com/dieWehmut/notes/",
      versions: [
        {
          date: "2025-08-20",
          log: "my notes",
          url: "https://notes.hc-dsw-nexus.me/",
        },
      ],
    },
    {
    name: "profile",
    repoUrl: "https://github.com/dieWehmut/profile/",
      versions: [
        {
          date: "2025-08-16",
          log: "personal profile",
          url: "https://profile.hc-dsw-nexus.me/",
        },
      ],
    },
    {
    name: "nexus",
    repoUrl: "https://github.com/dieWehmut/dieWehmut.github.io/",
      versions: [
        {
          date: "2025-08-26",
          log: "nexus(This site)",
          url: "https://www.hc-dsw-nexus.me/",
        },
      ],
    }
  ]);

  const games = ref([
    {
      name: "PhantomGenesis",
      repoUrl: "https://github.com/dieWehmut/PhantomGenesis/",
      versions: [
        {
          version: "v1.3",
          date: "2025-06-30",
          log: "modified game",
          url: "https://github.com/dieWehmut/showcase/releases/download/PhantomGenesis/PhantomGenesis1.3.zip",
        },
        {
          version: "v1.2",
          date: "2025-06-30",
          log: "first version release",
          url: "https://github.com/dieWehmut/showcase/releases/download/PhantomGenesis/PhantomGenesis1.2.zip",
        },
      ],
    },
  ]);

  const apps = ref([
    {
      name: "kotobahitomi_android",
      repoUrl: "https://github.com/dieWehmut/kotoba-hitomi",
      versions: [
        {
          version: "v1.0.0",
          date: "2025-06-03",
          log: "First app release",
          url: "https://github.com/dieWehmut/showcase/releases/download/kotobahitomi/kotobahitomi.apk",
        },
      ],
    },
  ]);

  // Files section no longer needs manual per-file listings.
  // Provide a single entry pointing to the GitHub repo that will be enumerated dynamically by the FileItem component.
  const files = ref([
    {
      name: "Files",
      repoUrl: "https://github.com/dieWehmut/Files",
      description: "Repository listing (fetched from GitHub)",
    },
  ]);

  // --- GitHub related placeholders ---
  const githubAnalytics = ref({
    stars: 0,
    forks: 0,
    watchers: 0,
    openIssues: 0,
    topLanguages: [
      /* { name: 'JavaScript', percent: 54 }, ... */
    ],
  });

  const achievements = ref([
    // example badge entries; real data can be injected via fetchGitHubData or manually
    { id: 'sponsors', title: 'Sponsor', icon: '🏆', date: '2025-06-01', note: 'First sponsor' },
  ]);

  // Contribution graph image URL (3rd party service or generated SVG)
    // Contribution graph image URL: prefer locally generated 3D SVG if available
    const LOCAL_3D_DIR = 'profile-3d-contrib';
    const contributionGraphUrl = ref('');

  const recentActivity = ref([
    // events like { type: 'PushEvent', repo: 'showcase', date: '2025-10-01', msg: 'Released v1.3', url: '...' }
  ]);

  const metrics = ref({
    commitsLast30Days: 0,
    activeDays: 0,
    peakHour: '20:00',
    languageDistribution: [/* { name:'JavaScript', pct: 60 } */],
  });

  // Visitor counter / badge (you can replace with your analytics provider or static badge)
  const visitorBadgeUrl = ref('https://img.shields.io/badge/visitors---gray');

  /**
   * fetchGitHubData(owner, token?)
   * Attempts to fetch summary data from GitHub REST API and populate the refs above.
   * If no token is provided the request will be unauthenticated (low rate limit).
   */
  async function fetchGitHubData(owner = 'dieWehmut', token = '') {
    // caching: avoid frequent API calls. We'll cache results in localStorage per-owner.
    const CACHE_KEY = 'profile_github_cache_v1';
    const CACHE_TTL = 1000 * 60 * 60; // 1 hour

    try {
      // try to read cache first
      let cache = null;
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        cache = raw ? JSON.parse(raw) : {};
      } catch (e) {
        cache = {};
      }

      const ownerCache = cache && cache[owner];
      if (ownerCache && (Date.now() - ownerCache.ts) < CACHE_TTL) {
        // populate from cache
        const d = ownerCache.data;
        githubAnalytics.value = d.githubAnalytics || githubAnalytics.value;
        achievements.value = d.achievements || achievements.value;
        contributionGraphUrl.value = d.contributionGraphUrl || contributionGraphUrl.value;
        recentActivity.value = d.recentActivity || recentActivity.value;
        metrics.value = d.metrics || metrics.value;
        visitorBadgeUrl.value = d.visitorBadgeUrl || visitorBadgeUrl.value;
        return; // skip network
      }

      const headers = { Accept: 'application/vnd.github.v3+json' };
      if (token) headers.Authorization = `token ${token}`;

      // Fetch user repos to compute aggregates (limited to first 100)
      const reposRes = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100`, { headers });
      if (!reposRes.ok) return;
      const repos = await reposRes.json();

      // aggregate counts
      let stars = 0, forks = 0, watchers = 0, openIssues = 0;
      const langMap = {};
      for (const r of repos) {
        stars += r.stargazers_count || 0;
        forks += r.forks_count || 0;
        watchers += r.watchers_count || 0;
        openIssues += r.open_issues_count || 0;
        if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
      }

      // top languages by repo count (approx)
      const topLanguages = Object.keys(langMap)
        .map(k => ({ name: k, count: langMap[k] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      const ghData = { stars, forks, watchers, openIssues, topLanguages };
      githubAnalytics.value = ghData;

      // derive language distribution percentages and populate metrics.languageDistribution
      try {
        const totalCount = topLanguages.reduce((s, it) => s + (it.count || 0), 0) || 0;
        const languageDistribution = topLanguages.map(it => ({ name: it.name, pct: totalCount > 0 ? Math.round(((it.count || 0) / totalCount) * 100) : 0 }));
        metrics.value.languageDistribution = languageDistribution;
      } catch (e) { /* ignore */ }

      // Recent activity (fetch events)
      const eventsRes = await fetch(`https://api.github.com/users/${owner}/events/public`, { headers });
      if (eventsRes.ok) {
        const events = await eventsRes.json();
        recentActivity.value = events.slice(0, 12).map(ev => ({
          id: ev.id,
          type: ev.type,
          repo: ev.repo && ev.repo.name,
          date: ev.created_at,
          payload: ev.payload,
          url: ev.repo ? `https://github.com/${ev.repo.name}` : ''
        }));
      }

      // simple metrics approximation
      metrics.value.commitsLast30Days = recentActivity.value.filter(e => e.type === 'PushEvent').length;
      metrics.value.activeDays = new Set(recentActivity.value.map(e => (new Date(e.date)).toDateString())).size;

      // achievements: placeholder, can be enhanced (e.g., check for verified email, sponsors, stars thresholds)
      achievements.value = [
        { id: 'stars-100', title: '100+ Stars', icon: '🏆', date: '', note: `${stars} total stars` },
      ];

      // contribution graph: keep the existing 3rd-party URL unless you generate SVG yourself
        // contribution graph: prefer locally generated 3D SVG if it exists, otherwise use 3rd-party URL
        const localPath = `/${LOCAL_3D_DIR}/${owner}.svg`;
        try {
          const probe = await fetch(localPath, { method: 'HEAD' });
          if (probe && probe.ok) {
            contributionGraphUrl.value = localPath;
          } else {
            contributionGraphUrl.value = `https://ghchart.rshah.org/${owner}`;
          }
        } catch (e) {
          contributionGraphUrl.value = `https://ghchart.rshah.org/${owner}`;
        }

      // visitor badge could be integrated with your analytics service (placeholder shields.io badge)
      visitorBadgeUrl.value = `https://img.shields.io/badge/visitors--${Math.floor(Math.random()*10000)}-blue`;

      // write to cache
      try {
        cache = cache || {};
        cache[owner] = { ts: Date.now(), data: {
          githubAnalytics: ghData,
          achievements: achievements.value,
          contributionGraphUrl: contributionGraphUrl.value,
          recentActivity: recentActivity.value,
          metrics: metrics.value,
          visitorBadgeUrl: visitorBadgeUrl.value,
        } };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch (e) {
        // ignore cache write errors
      }
    } catch (e) {
      // swallow — keep placeholders
      // console.warn('fetchGitHubData failed', e);
    }
  }

  return { pages, games, apps, files,
    // github related
    githubAnalytics, achievements, contributionGraphUrl, recentActivity, metrics, visitorBadgeUrl,
    fetchGitHubData,
  };
}
