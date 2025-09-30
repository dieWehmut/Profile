<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Sidebar from './Sidebar.vue' 
const projects = [
  {
    title: "Kotobahitomi",
    description: `Development Period: April 2025 – June 2025
Technology Stack: Vue + Vite frontend, Python + FastAPI backend
Project Description: A web application that provides a simulated Japanese conversation experience with AI characters`,
    details: `Diverse Characters 🎭
• Each character has a detailed profile 
Multi-Agent Chat Guide 🟢
• Select agents for group chat, default assistant joins if none 
• Unlimited discussions 
• Pause: stops AI output temporarily ⏸
• End: fully stops AI output 
• Flexible input: type to continue or let it run automatically 
• Immersive Group Chat 
• Not just Q&A—observe, interject, interact 
• Realistic multi-agent scenarios 
Parallel Intelligence 🤹‍♂️
• Single input, multiple agent responses 
• Expand/collapse to compare styles 
• Snapshot view—no streaming output yet 
• One input, multiple perspectives 
⚠️ Server Status: AI server offline; outputs appear after restart 🔌`,
    videoId: "BV1W9gSzdEFa",
    linkText: "Visit Website",
    linkUrl: "https://diesehnsucht0.github.io/testCase/#/"
  },
  {
    title: "PhantomGenesis",
    description: `Development Period: 2025.5-2025.6
Technology Stack: Qt/C++
Project Description: This action-adventure game is developed in C++ with the Qt framework, inspired by survivor-like gameplay but expanded with unique mechanics.`,
    details: `Players take on the role of a ghost, battling enemies and collecting intelligence within a mysterious game world
     Gameplay🕹️:
Controls — Move with WASD, shoot with Space, shoot in last move direction 
Save & Load — Progress can be saved, loaded, and even edited externally 
Multiple Endings — Different outcomes based on player actions 
Expanding Vision — View range grows dynamically during exploration `,
    videoId: "BV1c6gDzsELp",
    linkText: "View Source Code",
    linkUrl: "https://git.nju.edu.cn/dieSehnsucht/mygame0"
  },
  {
    title: "Desktop Pet Application",
    description: `Development Period: 2025.7
Technology Stack: Qt/C++
Project Description: A desktop pet application providing personalized virtual pet companionship
It has not been released yet 🚫`,
    details: `• Auto screenshot & screen recording 📸
• Can hide and patrol the desktop automatically 👀
• Set your own screenshot interval ⏱️`,
    videoId: "BV1zh3DzWEzd",
  }
]

// 为每个项目创建折叠状态
const expandedProjects = ref(projects.map(() => false))

const toggleDetails = (index) => {
  expandedProjects.value[index] = !expandedProjects.value[index]
}

// 当前高亮的目录索引
const activeIndex = ref(0)

// 平滑滚动到对应项目
const scrollToProject = (index) => {
  const el = document.getElementById(`project-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeIndex.value = index
  }
}

// 监听滚动，自动高亮目录
const handleScroll = () => {
  let found = false
  for (let i = projects.length - 1; i >= 0; i--) {
    const el = document.getElementById(`project-${i}`)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 120) { // 距离顶部120px以内
        activeIndex.value = i
        found = true
        break
      }
    }
  }
  if (!found) activeIndex.value = 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  nextTick(() => handleScroll())
})

</script>

<template>
  <div class="projects-page-wrapper">
    <div class="sidebar-with-index sticky-sidebar">
      <Sidebar />
      <!-- 项目目录栏 -->
      <div class="project-index">
        <h2>项目目录</h2>
        <ul>
          <li v-for="(p, i) in projects" :key="i">
            <a
              :class="['project-index-link', { active: activeIndex === i }]"
              href="javascript:void(0);"
              @click.prevent="scrollToProject(i)"
            >{{ p.title }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="projects-container">
      <div class="projects-list">
        <div class="project-card" v-for="(project, index) in projects" :key="index" :id="`project-${index}`">
          <h2>{{ project.title }}</h2>
          <div class="project-description-wrapper">
            <p class="project-description">{{ project.description }}</p>
          </div>
          <div class="details-section">
            <button @click="toggleDetails(index)" class="toggle-button">
              {{ expandedProjects[index] ? 'Hide Details ▲' : 'Show Details ▼' }}
            </button>
            <div v-show="expandedProjects[index]" class="details-content">
              <p class="details-text">{{ project.details }}</p>
            </div>
          </div>
          <a v-if="project.linkUrl" :href="project.linkUrl" class="project-link" target="_blank">{{ project.linkText }}</a>
          <div class="video-wrapper">
            <iframe 
              :src="`https://player.bilibili.com/player.html?bvid=${project.videoId}&high_quality=1&autoplay=0`"
              scrolling="no" 
              border="0" 
              frameborder="no" 
              framespacing="0" 
              allowfullscreen="true"
              class="bilibili-video">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center; /* 水平居中两个栏整体 */
  align-items: flex-start;  /* 顶部对齐 */
  gap: 1.2rem; /* 两栏之间的间距，可调整为 0 - 2rem */
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 0; /* 可根据需要调整上下间距 */
}

/* 新增：Sidebar和项目目录的组合容器 */
.sidebar-with-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  max-width: 350px;
  width: 100%;
  gap: 0rem;
}

/* 让左侧栏固定在视口左侧 */
.sticky-sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  z-index: 10;
}

/* 保证 Sidebar 本身没有额外外边距 */
:deep(.sidebar-container) {
  margin: 0 !important;
}

/* 项目目录栏样式 */
.project-index {
  background: #f7f2e6;
  border-radius: 10px;
  padding: 0.9rem;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-left: 5px solid #ffb400;
  margin-bottom: 0.5rem;
}
.project-index h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.05rem;
  font-weight: bold;
  color: #111;
}
.project-index ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.project-index li {
  margin: 0.35rem 0;
}
.project-index-link {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.15rem 0.5rem;
  transition: background 0.2s, color 0.2s;
  display: inline-block;
}
.project-index-link.active,
.project-index-link:hover {
  background: #ffe6b3;
  color: #d000ff;
  font-weight: bold;
  box-shadow: 0 0 0 2px #ffd580;
}

/* 内容容器允许收缩并有基准宽度，保持整体居中时宽度合理 */
.projects-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  flex: 0 1 700px; /* 基准宽度 700px，允许收缩和换行 */
  min-width: 0;
  margin: 0;
}

/* 列表在内容容器内占满可用空间 */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 800px;
  margin: 0;
}

/* 保留原有卡片样式 */
.project-card {
  background-color: #cdf3d2;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-left: 5px solid #d000ff;
  margin-bottom: 2rem;
}

.project-card h2 {
  margin-bottom: 0.8rem;
  color: #000;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.project-description-wrapper {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%);
  border-radius: 20px;
  padding: 0.5rem;
  margin-bottom: 0rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #d1d9e6;
  border-left: 5px solid #d000ff;
}

.project-description {
  line-height: 1.6;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  white-space: pre-line;
  margin: 0;
}

.details-section {
  margin: 1rem 0;
}

.toggle-button {
  background-color: #2b6cce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(200, 29, 29, 0.2);
}

.toggle-button:hover {
  background-color: #ce742b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.toggle-button:active {
  transform: translateY(0);
}

.details-content {
  margin-top: 1rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border-left: 5px solid #007bff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-text {
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
}

.project-link {
  display: inline-block;
  margin-bottom: 0.1rem;
  color: #fc0519;
  text-decoration: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  transition: color 0.3s;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
}

.project-link:hover {
  color: #0056b3;
  text-decoration: underline;
  background-color: rgba(0, 123, 255, 0.1);
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.bilibili-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .projects-page-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0;
  }
  .sidebar-with-index {
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
    max-width: 100vw;
    width: 100%;
    gap: 0rem;
  }
  .sticky-sidebar {
    position: static;
    top: auto;
    z-index: auto;
  }
  .projects-container {
    padding: 0;
    flex: 1 1 auto;
  }
}
</style>