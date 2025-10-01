<script setup>
import avatar from '@assets/avatar/avatar.jpg'

const openLink = (url) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="sidebar-container">
    <div class="avatar-container">
      <img :src="avatar" alt="My Avatar" class="avatar">
    </div>
    <div class="intro">
      <div class="intro-title">About Me 👤</div>
      <div class="intro-text">
        <div class="intro-line"> Undergraduate in Intelligent Science and Technology, Nanjing University, Suzhou Campus</div>
      </div>
    </div>
    <div class="Website">
      <ul>
        <li><span class="dieSWNexus">Nexus</span>: <button class="link-button" @click="openLink('https://diewehmut.github.io')">Click here</button></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  min-width: 220px;
  max-width: 350px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem 1.2rem;
  margin-right: 0rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-container {
  margin-bottom: 1.5rem;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #666;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}
.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.intro {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  border-left: 3px solid #666;
  margin-bottom: 1rem;
}
.intro-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
}
.intro-text {
  color: #555;
  font-size: 0.95rem;
  font-weight: normal;
  line-height: 1.5;
}
.intro-line {
  margin-bottom: 0.3rem;
}
.Website {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  border-left: 3px solid #666;
  margin-bottom: 0.5rem;
}
.Website ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 0.5rem;
}
.Website li {
  margin-bottom: 0.3rem;
  line-height: 1.5;
  color: #555;
  font-weight: normal;
  font-size: 0.95rem;
}
.Website a {
  color: #333;
  text-decoration: none;
  transition: color 0.2s ease;
}
.Website a:hover {
  color: #666;
  text-decoration: underline;
}
.dieSWNexus {
  font-weight: 600;
  color: #333;
}

.link-button {
  padding: 0.3rem 0.8rem;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.link-button:hover {
  background-color: #888;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
@media (max-width: 900px) {
  .sidebar-container {
    margin-right: 0;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 100vw;
  }
}
</style>