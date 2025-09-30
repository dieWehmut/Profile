<template>
  <div class="notes-page-wrapper">
    <div class="sidebar-with-index sticky-sidebar">
      <Sidebar />
    </div>
    <div class="notes-container">
      <div class="notes-list">
        <div class="note-card">
          <div class="header-container">
            <h2 class="posts-title">My Posts</h2>
            <button class="redirect-button" target="_blank" onclick="window.open('https://diewehmut.github.io/HCBlog', '_blank')">Details</button>
          </div>
          <ul>
            <li>1.<a href="https://diewehmut.github.io/HCBlog/#/article/article2" target="_blank">AI and humans</a></li>
            <li>2.<a href="https://diewehmut.github.io/HCBlog/#/article/article1" target="_blank">Human–AI alignment</a></li>
          </ul>
        </div>
        <div class="note-card">
          <h2>Recently Read Novels</h2>
          <ul>
            <li>1.<a href="https://books.fishhawk.top/novel/kakuyomu/16818792436355768559" target="_blank">きみはもう、思い出になった</a></li>
            <li><a href="" target="_blank"></a></li>
          </ul>
          <p class="novel-prompt">For more amazing novels, feel free to ask me</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.notes-page-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px; /* 控制整体最大宽度，可根据需要调整 */
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0;
  gap: 0;
}

.sidebar-with-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  max-width: 350px;
  /* width: 100%; 这一行删除 */
  gap: 0;
}

.notes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  margin: 0;
  padding: 0;
  /* width: 100%; 这一行删除 */
}

.notes-list {
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
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-left: 5px solid #d000ff;
  margin-bottom: 2rem;
}

.note-card h2 {
  margin-bottom: 0.8rem;
  color: #000;
  font-weight: bold;
}

.note-card ul {
  list-style-type: none;
  padding: 0;
}

.note-card li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #000;
  font-weight: bold;
}

.note-card a {
  text-decoration: none;
  color: #ff001e;
}

.note-card a:hover {
  text-decoration: underline;
}

.header-container {
  display: flex;
  align-items: first baseline;
  margin-bottom: 0.1rem;
}

.posts-title {
  margin-right: 1rem;
  margin-bottom: 0;
}

.redirect-button {
  padding: 0.5rem 0.8rem;
  background-color: #7320bc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.redirect-button:hover {
  background-color: #b30024;
}

.novel-prompt {
  margin-top: 1rem;
  color: #555;
  font-style: italic;
}

@media (max-width: 900px) {
  .notes-page-wrapper {
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
    gap: 0;
  }
  .sticky-sidebar {
    position: static;
    top: auto;
    z-index: auto;
  }
  .notes-container {
    padding: 0;
    flex: 1 1 auto;
  }
}
</style>