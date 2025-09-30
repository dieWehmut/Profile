<script setup>
import { ref, onMounted, onBeforeUnmount, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import song1 from "@assets/music/1.mp3";
import song2 from "@assets/music/2.flac";
import song3 from "@assets/music/3.flac";

const router = useRouter();
const route = useRoute();

const songs = ref([
  { title: "Song 1", src: song1 },
  { title: "Song 2", src: song2 },
  { title: "Song 3", src: song3 },
]);
const currentSongIndex = ref(0);
const isPlaying = ref(false);
const audioPlayer = ref(null);
const isPlayerExpanded = ref(false);
const isSongListExpanded = ref(false);
const togglePlayer = () => {
  isPlayerExpanded.value = !isPlayerExpanded.value;
};

const toggleSongList = () => {
  isSongListExpanded.value = !isSongListExpanded.value;
};

const selectSong = (index) => {
  playSong(index);
  isSongListExpanded.value = false;
};

const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const playSong = (index) => {
  currentSongIndex.value = index;

  try {
    audioPlayer.value.src = songs.value[index].src;
    audioPlayer.value.load();

    const playPromise = audioPlayer.value.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying.value = true;
        })
        .catch((error) => {
          console.log("播放被阻止:", error);
          isPlaying.value = false;
          alert("请点击页面任意位置后再次尝试播放");
        });
    }
  } catch (error) {
    console.error("播放错误:", error);
    handleAudioError();
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const onProgressChange = (e) => {
  const newProgress = e.target.value;
  progress.value = newProgress;

  if (audioPlayer.value) {
    const newTime = (newProgress / 100) * duration.value;
    audioPlayer.value.currentTime = newTime;
    currentTime.value = newTime;
  }
};

onMounted(() => {
  if (songs.value.length > 0) {
    audioPlayer.value.src = songs.value[0].src;
    audioPlayer.value.load();
  }

  if (audioPlayer.value) {
    audioPlayer.value.addEventListener("timeupdate", () => {
      if (audioPlayer.value) {
        currentTime.value = audioPlayer.value.currentTime;
        duration.value = audioPlayer.value.duration || 0;
        progress.value = duration.value
          ? (currentTime.value / duration.value) * 100
          : 0;
      }
    });
  }
});

onBeforeUnmount(() => {
  if (audioPlayer.value) {
    audioPlayer.value.removeEventListener("timeupdate", () => {});
  }
});

const playPause = () => {
  if (audioPlayer.value.paused) {
    audioPlayer.value
      .play()
      .then(() => {
        isPlaying.value = true;
      })
      .catch((error) => {
        console.log("播放被阻止:", error);
        isPlaying.value = false;
      });
  } else {
    audioPlayer.value.pause();
    isPlaying.value = false;
  }
};

const prevSong = () => {
  currentSongIndex.value =
    (currentSongIndex.value - 1 + songs.value.length) % songs.value.length;
  playSong(currentSongIndex.value);
};

const nextSong = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length;
  playSong(currentSongIndex.value);
};

const handleAudioError = () => {
  console.error("音频错误:", audioPlayer.value.error);
  nextSong();
};

const starContainer = ref(null);
const footer = ref(null);

const siteLaunchTime = ref(new Date("2025-08-15T21:05:00"));
const elapsedTime = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });

const updateTimer = () => {
  const now = new Date();
  const diff = now - siteLaunchTime.value;

  elapsedTime.value = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

onMounted(() => {
  setInterval(updateTimer, 1000);
  updateTimer();
});

const createStar = (x, y) => {
  const star = document.createElement("div");
  star.className = "star";

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  starContainer.value.appendChild(star);

  star.addEventListener("animationend", () => {
    star.remove();
  });
};

const navigateTo = (path) => {
  router.push(path);
};

const isActiveRoute = (path) => {
  return route.path === path;
};

// 回到顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
</script>

<template>
  <div class="app-container">
    <!-- 家的图标：固定在右上角，点击跳转到 Home -->
    <button
      class="home-button"
      @click="navigateTo('/')"
      title="Home"
      aria-label="Home"
    >
      <i class="home-icon" aria-hidden="true">🏠</i>
    </button>
    
    <!-- 回到顶部按钮：固定在右下角 -->
    <button
      class="back-to-top-button"
      @click="scrollToTop"
      title="回到顶部"
      aria-label="回到顶部"
    >
      <i class="back-to-top-icon" aria-hidden="true">⬆️</i>
    </button>
    
    <nav class="navbar">
      <router-link to="/" :class="['nav-link', { active: isActiveRoute('/') }]">
        Home
      </router-link>
      <router-link
        to="/projects"
        :class="['nav-link', { active: isActiveRoute('/projects') }]"
      >
        Projects
      </router-link>
      <router-link
        to="/notes"
        :class="['nav-link', { active: isActiveRoute('/notes') }]"
      >
        Notes
      </router-link>
      <router-link
        to="/contact"
        :class="['nav-link', { active: isActiveRoute('/contact') }]"
      >
        Contact
      </router-link>
    </nav>

<main>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</main>

    <footer ref="footer" class="footer">
      <div class="site-timer">
        Uptime:{{ elapsedTime.days }}d{{ elapsedTime.hours }}h{{
          elapsedTime.minutes
        }}m{{ elapsedTime.seconds }}s🕒
      </div>

      <div class="social-buttons">
        <a
          href="https://github.com/dieSehnsucht0"
          target="_blank"
          class="social-button github"
          title="dieSehnsucht0のGitHub"
        >
          <svg viewBox="0 0 24 24" class="social-icon">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
        <a
          href="https://git.nju.edu.cn/dieSehnsucht"
          target="_blank"
          class="social-button gitlab"
          title="dieSehnsuchtのGitLab"
        >
          <svg viewBox="0 0 24 24" class="social-icon">
            <path
              d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
            ></path>
          </svg>
        </a>
        <a
          href="https://github.com/dieWehmut"
          target="_blank"
          class="social-button github"
          title="dieWehmutのGitHub"
        >
          <svg viewBox="0 0 24 24" class="social-icon">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
      </div>
      <div class="copyright">© 2025 dieSW</div>

      <!-- 音乐播放器：现在在左下角 -->
      <div class="music-player" :class="{ collapsed: !isPlayerExpanded }">
        <div class="player-header">
          <div class="song-progress" v-if="isPlayerExpanded">
            {{ currentSongIndex + 1 }}/{{ songs.length }}
          </div>
          <div class="progress-container" v-if="isPlayerExpanded">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <input
              type="range"
              class="progress-bar"
              :value="progress"
              min="0"
              max="100"
              @input="onProgressChange"
              @change="onProgressChange"
            />
            <span class="duration">{{ formatTime(duration) }}</span>
          </div>
          <button
            @click="togglePlayer"
            class="music-icon"
            :class="{ collapsed: !isPlayerExpanded }"
          >
            <i v-if="isPlayerExpanded" class="fas fa-times"></i>
            <i v-else class="fas fa-music"></i>
          </button>
        </div>

        <div class="player-content" v-if="isPlayerExpanded">
          <div class="player-controls">
            <button @click="prevSong" title="上一首">
              <i class="fas fa-step-backward"></i>
            </button>
            <button @click="playPause">
              <i v-if="isPlaying" class="fas fa-pause"></i>
              <i v-else class="fas fa-play"></i>
            </button>
            <button @click="nextSong" title="下一首">
              <i class="fas fa-step-forward"></i>
            </button>

            <button @click="toggleSongList" title="音乐列表">
              <i class="fas fa-list"></i>
            </button>
          </div>

          <div class="song-list" v-if="isSongListExpanded">
            <div
              v-for="(song, index) in songs"
              :key="index"
              :class="{ active: index === currentSongIndex }"
              @click="selectSong(index)"
            >
              {{ song.title }}
            </div>
          </div>
        </div>
        <audio
          ref="audioPlayer"
          @ended="nextSong"
          @error="handleAudioError"
        ></audio>
      </div>
    </footer>

    <div ref="starContainer" class="star-container"></div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Arial", sans-serif;
}
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  min-height: 100vh;
  height: 100%;
}
.app-container {
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding-bottom: 80px;
}

.footer {
  text-align: center;
  padding: 30px 20px;
  margin-top: 50px;
  border-top: 1px solid #eaeaea;
  background-color: #f9f9f9;
}

.navbar {
  text-align: center;
  padding: 30px 20px;
  border-top: 1px solid #eaeaea;
  background-color: #f9f9f9;
  position: relative;
}

.nav-link {
  background: none;
  border: 2px solid #007bff;
  color: #007bff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  margin: 0 0.5rem;
}

.nav-link:hover {
  background-color: #007bff;
  color: white;
  transform: scale(1.05);
}

.nav-link.active {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.star-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 9999;
}

.star {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: rgb(128, 19, 19);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  animation: twinkle 0.5s forwards;
}

@keyframes twinkle {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 2px solid;
  transition: all 0.3s ease;
}

.social-button:hover {
  transform: scale(1.2);
}

.github {
  border-color: #6f42c1;
  color: #6f42c1;
}

.github:hover {
  background-color: #6f42c1;
  color: white;
}

.gitlab {
  border-color: #dc3545;
  color: #dc3545;
}

.gitlab:hover {
  background-color: #dc3545;
  color: white;
}

.social-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.copyright {
  color: #777;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  text-align: center;
}

.site-timer {
  color: #007bff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

/* 音乐播放器 - 移动到左下角 */
.music-player {
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 10px;
  min-width: 300px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.music-player.collapsed {
  min-width: auto;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  height: 60px;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
}

.music-icon {
  background: none;
  border: 1px solid #007bff;
  color: #007bff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 18px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-icon:hover {
  background-color: #007bff;
  color: white;
  transform: scale(1.1);
}

.player-controls button {
  background: none;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 0.5rem;
  margin: 0 0.3rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.player-controls button:hover {
  background-color: #007bff;
  color: white;
  transform: scale(1.1);
}

.song-list {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 1rem;
  background: rgba(248, 249, 250, 0.9);
  border-radius: 5px;
  position: absolute;
  bottom: 100%;
  left: 0;
  min-width: 150px;
  border: 1px solid #ddd;
}

.song-list div {
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #eee;
}

.song-list div:last-child {
  border-bottom: none;
}

.song-list div:hover {
  background-color: #e9ecef;
  color: #007bff;
}

.song-list .active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.progress-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  flex: 1;
}

.current-time,
.duration {
  color: #666;
  font-size: 0.8rem;
  min-width: 35px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 5px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  margin: 0 10px;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
}

.progress-bar::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  border: none;
}

.song-progress {
  position: absolute;
  left: 0px;
  top: 130%;
  margin-top: 0px;
  color: #dc3545;
  font-size: 1rem;
  font-weight: bold;
  z-index: 1;
}

.home-button {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10050;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #007bff;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #007bff;
}

.home-button:hover {
  background-color: #007bff;
  color: white;
  transform: scale(1.05);
}

.home-icon {
  font-style: normal;
  font-size: 20px;
  line-height: 1;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

/* 回到顶部按钮 - 位于右下角 */
.back-to-top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10050;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #28a745;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  color: #28a745;
}

.back-to-top-button:hover {
  background-color: #28a745;
  color: white;
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.back-to-top-icon {
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
</style>