
<script setup>
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="home-page-wrapper">
    <div class="sidebar-with-index sticky-sidebar">
      <Sidebar />
    </div>

    <div class="home-container">
      <div class="home-list">
        <div class="note-card">
          <h2>🌳 Skill Tree</h2>
          <ul>
            <li>· AI-powered learning and project development 🤖</li>
            <li>· Web development with Vue + Vite 🌐</li>
          </ul>
        </div>
        <div class="note-card">
          <h2>🚀 Extracurricular Learning and Exploration</h2>
          <ul>
            <li>· Machine Learning and Deep Learning 🧠</li>
            <li>· Full-stack development, especially Vue web dev 💻</li>
          </ul>
          <p class="novel-prompt">If you're interested, feel free to chat with me! 💬</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0;
  gap: 0;
  min-height: 70vh;
}

.sidebar-with-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  max-width: 350px;
  gap: 0;
  margin-right: 1rem;
}

.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  margin: 0;
  padding: 0;
}

.home-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0;
}

.note-card {
  background-color: #b0ebea;
  border-radius: 10px;
  padding: 1.6rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border-left: 5px solid #d000ff;
  margin-bottom: 1rem;
}

.note-card h2 {
  margin-bottom: 0.6rem;
  color: #000;
  font-weight: bold;
}

.note-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.note-card li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #000;
  font-weight: 600;
}

.novel-prompt {
  margin-top: 0.8rem;
  color: #555;
  font-style: italic;
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .home-page-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  .sidebar-with-index {
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
    max-width: 100vw;
    width: 100%;
    margin-right: 0;
  }
  .sticky-sidebar {
    position: static;
    top: auto;
    z-index: auto;
  }
  .home-container {
    padding: 0;
    flex: 1 1 auto;
  }
}
</style>
