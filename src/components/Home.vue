
<script setup>
import Sidebar from './Sidebar.vue'

const openLink = (url) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="home-page-wrapper">
    <div class="sidebar-with-index sticky-sidebar">
      <Sidebar />
    </div>

    <div class="home-container">
      <div class="home-list">
        <div class="note-card">
          <h2>🌳Learning...</h2>
          <ul>
            <li>· qt,renpy,unity 🤖</li>
            <li>· vue,cpp,c,py,rpy,js,qml,css,html 🌐</li>
          </ul>
        </div>
        
        <!-- Projects Section -->
        <div class="note-card">
          <div class="header-container">
            <h2>💼Showcase</h2>
            <button class="redirect-button" @click="openLink('https://diewehmut.github.io/Showcase')">click here</button>
          </div>
          <p class="description-text">Project and Products.</p>
        </div>
        
        <!-- Blog/Notes Section -->
        <div class="note-card">
          <div class="header-container">
            <h2>📝Blog</h2>
            <button class="redirect-button" @click="openLink('https://diewehmut.github.io/Blog/')">click here</button>
          </div>
          <p class="description-text">Some notes and thoughts.</p>
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

.sticky-sidebar {
  position: sticky;
  top: 20px;
  align-self: flex-start;
  z-index: 100;
}

.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  margin: 0;
  padding: 2rem 0 0 0;
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
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.6rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-left: 3px solid #666;
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.note-card h2 {
  margin-bottom: 0.8rem;
  color: #333;
  font-weight: 600;
  font-size: 1.3rem;
}

.note-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.note-card li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #555;
  font-weight: normal;
}

.novel-prompt {
  margin-top: 0.8rem;
  color: #555;
  font-style: italic;
  font-size: 0.95rem;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}

.header-container h2 {
  margin-bottom: 0;
  margin-right: 1rem;
}

.redirect-button {
  padding: 0.5rem 1rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.redirect-button:hover {
  background-color: #555;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.description-text {
  margin-top: 0.5rem;
  color: #333;
  line-height: 1.5;
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
