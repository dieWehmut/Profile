<script setup>
import { ref, onMounted, onBeforeUnmount, h } from "vue";
import Home from "./components/Home.vue";

// 自动导入 music 文件夹下的所有音乐文件
const musicModules = import.meta.glob('./assets/music/*.{mp3,flac,m4a,wav,ogg}', { eager: true });

// 将导入的音乐文件转换为歌曲列表
const songs = ref(
  Object.entries(musicModules).map(([path, module]) => {
    // 从路径中提取文件名（不含扩展名）
    const fileName = path.split('/').pop().replace(/\.(mp3|flac|m4a|wav|ogg)$/, '');
    return {
      title: fileName,
      src: module.default
    };
  })
);
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
const volume = ref(0.3); // 默认音量30%

const playSong = (index) => {
  currentSongIndex.value = index;

  try {
    // 使用 preload 属性加速加载
    audioPlayer.value.preload = 'auto';
    audioPlayer.value.src = songs.value[index].src;
    
    // 立即开始加载，不等待 load() 事件
    audioPlayer.value.load();

    const playPromise = audioPlayer.value.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying.value = true;
          // 预加载下一首歌曲
          preloadNextSong();
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

// 预加载下一首歌曲
const preloadNextSong = () => {
  const nextIndex = (currentSongIndex.value + 1) % songs.value.length;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = songs.value[nextIndex].src;
  link.as = 'audio';
  document.head.appendChild(link);
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
    // 设置预加载策略
    audioPlayer.value.preload = 'metadata'; // 只预加载元数据，节省带宽
    audioPlayer.value.src = songs.value[0].src;
    audioPlayer.value.volume = volume.value; // 设置初始音量
    audioPlayer.value.load();
    
    // 预加载第一首歌曲的音频数据
    setTimeout(() => {
      if (!isPlaying.value) {
        audioPlayer.value.preload = 'auto';
        audioPlayer.value.load();
      }
    }, 1000);
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
    
    // 添加 canplay 事件监听，优化加载体验
    audioPlayer.value.addEventListener("canplay", () => {
      console.log("音频已准备好播放");
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
    <!-- 回到顶部按钮：固定在右下角 -->
    <button
      class="back-to-top-button"
      @click="scrollToTop"
      title="回到顶部"
      aria-label="回到顶部"
    >
      <i class="back-to-top-icon" aria-hidden="true">⬆️</i>
    </button>

    <main>
      <Home />
    </main>

    <footer ref="footer" class="footer">
      <div class="site-timer">
        Uptime:{{ elapsedTime.days }}d{{ elapsedTime.hours }}h{{
          elapsedTime.minutes
        }}m{{ elapsedTime.seconds }}s🕒
      </div>

      <div class="social-buttons">
        <a
          href="https://git.nju.edu.cn/dieWehmut"
          target="_blank"
          class="social-button gitlab"
          title="dieWehmutのGitLab"
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
      <div class="copyright">© 2025 hc-dsw</div>
    </footer>

    <!-- 音乐播放器：固定在左下角 -->
    <div class="music-player" :class="{ collapsed: !isPlayerExpanded }">
      <div class="player-header">
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
          <button @click="prevSong" title="last song">
            <i class="fas fa-step-backward"></i>
          </button>
          <button @click="playPause">
            <i v-if="isPlaying" class="fas fa-pause"></i>
            <i v-else class="fas fa-play"></i>
          </button>
          <button @click="nextSong" title="next song">
            <i class="fas fa-step-forward"></i>
          </button>

          <button @click="toggleSongList" title="song list">
            <i class="fas fa-list"></i>
          </button>
          
          <span class="song-progress">
            {{ currentSongIndex + 1 }}/{{ songs.length }}
          </span>
        </div>

        <!-- 音量控制 -->
        <div class="volume-control">
          <i class="fas fa-volume-down"></i>
          <input
            type="range"
            class="volume-slider"
            v-model="volume"
            @input="audioPlayer.volume = volume"
            min="0"
            max="1"
            step="0.01"
          />
          <i class="fas fa-volume-up"></i>
          <span class="volume-percentage">{{ Math.round(volume * 100) }}%</span>
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
        preload="auto"
        crossorigin="anonymous"
      ></audio>
    </div>

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
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ebef 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

/* 添加微妙的背景图案 */
.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(200, 200, 200, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(180, 180, 180, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(190, 190, 190, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 添加细微的网格背景 */
.app-container::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

main {
  flex: 1;
  padding-bottom: 80px;
  position: relative;
  z-index: 1;
}

.footer {
  text-align: center;
  padding: 30px 20px;
  margin-top: 50px;
  border-top: 1px solid #e8e8e8;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
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
  width: 12px;
  height: 12px;
  background-color: #666;
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
  border-color: #555;
  color: #555;
}

.github:hover {
  background-color: #555;
  color: white;
}

.gitlab {
  border-color: #555;
  color: #555;
}

.gitlab:hover {
  background-color: #555;
  color: white;
}

.social-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.copyright {
  color: #666;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  text-align: center;
}

.site-timer {
  color: #555;
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
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 8px;
  min-width: 300px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10100;
}

.music-player.collapsed {
  min-width: auto;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
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
  border: 1px solid #666;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 18px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-icon:hover {
  background-color: #666;
  color: white;
  transform: scale(1.05);
}

.player-controls button {
  background: none;
  border: 1px solid #666;
  color: #666;
  padding: 0.5rem;
  margin: 0 0.3rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.player-controls button:hover {
  background-color: #666;
  color: white;
  transform: scale(1.05);
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.song-list {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 6px;
  position: absolute;
  bottom: 100%;
  left: 0;
  min-width: 150px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  background-color: #f5f5f5;
  color: #333;
}

.song-list .active {
  background-color: #666;
  color: white;
  font-weight: 600;
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
  background: #e0e0e0;
  border-radius: 5px;
  outline: none;
  margin: 0 10px;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #666;
  cursor: pointer;
}

.progress-bar::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #666;
  cursor: pointer;
  border: none;
}

.song-progress {
  color: #555;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 0.8rem;
  display: inline-flex;
  align-items: center;
}

/* 音量控制 */
.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  padding: 0.5rem 0;
}

.volume-control i {
  color: #666;
  font-size: 0.9rem;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
  cursor: pointer;
  border: none;
}

.volume-percentage {
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 102, 102, 0.3);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  color: #666;
}

.back-to-top-button:hover {
  background-color: #666;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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