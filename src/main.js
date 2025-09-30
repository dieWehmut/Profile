import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
const app = createApp(App);

app.use(router);
app.mount("#app");

// 创建一个数组来存储最近的鼠标位置
let mouseTrail = [];
const trailLength = 20;

// 创建一个固定的鼠标跟随圆环
let techRing = null;
let mouseTimer = null;
let isMouseMoving = false;

// 等待DOM完全加载后再添加鼠标效果
document.addEventListener("DOMContentLoaded", () => {
  // 创建科技感旋转锁定环
  techRing = document.createElement("div");
  techRing.classList.add("mouse-tech-ring");
  document.body.appendChild(techRing);

  // 添加鼠标星星跟随效果
  document.addEventListener("mousemove", (e) => {
    // 获取当前滚动位置
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // 鼠标在文档中的绝对位置（用于星星）
    const docMouseX = e.clientX + scrollX;
    const docMouseY = e.clientY + scrollY;
    
    // 鼠标在视口中的位置（用于科技环）
    const viewMouseX = e.clientX;
    const viewMouseY = e.clientY;
    // 更新科技环位置
    if (techRing) {
      techRing.style.left = `${viewMouseX}px`;
      techRing.style.top = `${viewMouseY}px`;

      // 鼠标移动时显示旋转环
      if (!isMouseMoving) {
        isMouseMoving = true;
        techRing.classList.add("active");
      }

      // 重置鼠标移动计时器
      clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        // 鼠标停止移动后隐藏旋转环
        isMouseMoving = false;
        techRing.classList.remove("active");
      }, 4000);
    }

    // 添加当前鼠标位置到轨迹数组
    mouseTrail.push({ x: docMouseX, y: docMouseY });

    // 保持轨迹长度
    if (mouseTrail.length > trailLength) {
      mouseTrail.shift();
    }

    // 清除之前的星星
    const oldStars = document.querySelectorAll(".mouse-star");
    oldStars.forEach((star) => {
      if (!star.classList.contains("removing")) {
        star.classList.add("removing");
        setTimeout(() => star.remove(), 300);
      }
    });

    // 为轨迹中的每个点创建星星
    mouseTrail.forEach((point, index) => {
      const star = document.createElement("div");
      star.classList.add("mouse-star");

      // 根据索引设置大小，越靠近鼠标当前位置的星星越大
      const size = 2 + (index / mouseTrail.length) * 4;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // 设置位置
      star.style.left = `${point.x}px`;
      star.style.top = `${point.y}px`;

      // 添加到文档
      document.body.appendChild(star);

      // 设置自动移除
      setTimeout(() => {
        if (star.parentNode) {
          star.classList.add("fade-out");
          setTimeout(() => star.remove(), 300);
        }
      }, 100 + index * 30);
    });
  });
});

// 在mousemove事件处理中添加动态效果
if (techRing) {
  // 随机颜色变化
  const hue = Math.random() * 360;
  techRing.style.borderColor = `hsl(${hue}, 100%, 50%)`;
  techRing.style.boxShadow = `0 0 15px hsl(${hue}, 100%, 50%),
     0 0 30px hsl(${hue}, 100%, 50%)`;

  // 随机尺寸波动
  const size = 25 + Math.random() * 10;
  techRing.style.width = `${size}px`;
  techRing.style.height = `${size}px`;

  // 添加粒子特效
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.cssText = `
    left: ${e.pageX}px;
    top: ${e.pageY}px;
    background: hsl(${hue}, 100%, 50%);
  `;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 500);
}