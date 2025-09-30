<script setup>
import avatar from '@assets/avatar/avatar.jpg'
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
        <div class="intro-line"> ACGN aficionado & prompt engineering enthusiast ⚡</div>
      </div>
    </div>
    <div class="Website">
      <ul>
        <li><span class="dieSWNexus">dieSWNexus</span>: <a href="https://diewehmut.github.io/dieSWNexus/" target="_blank">Click here</a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  min-width: 220px;
  max-width: 350px;
  background: #e7e7f6;
  border-radius: 20px;
  padding: 2rem 1.2rem;
  margin-right: 0rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-container {
  margin-bottom: 0rem;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgb(37, 210, 198);
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  animation: rotate 10s linear infinite;
  transition: all 0.3s;
}
.avatar:hover {
  transform: scale(1.15);
  box-shadow: 0 0 25px rgba(52,249,105,0.8);
}
.intro {
  background: #e3ecee;
  border-radius: 10px;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-left: 5px solid #dfe0b8;
  margin-bottom: 0rem;
}
.intro-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 0rem;
  font-size: 1.1rem;
}
.intro-text {
  color: #000;
  font-size: 0.98rem;
  font-weight: bold;
}
.intro-line {
  margin-bottom: 0.3rem;
}
.Website {
  background: #a0e5f0;
  border-radius: 10px;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-left: 5px solid #00ff04;
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
  color: #000;
  font-weight: bold;
  font-size: 0.97rem;
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