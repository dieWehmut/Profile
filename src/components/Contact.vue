<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'

const form = ref({
  nickname: '',
  message: ''
})

const buttonText = ref('Send Message 💌')
const isSending = ref(false)

const submitForm = async () => {
  if (!form.value.nickname.trim() || !form.value.message.trim()) {
    alert('Please fill in both nickname and message')
    return
  }
  isSending.value = true
  buttonText.value = 'Sending...'
  try {
    const formData = new FormData()
    formData.append('_captcha', 'false')
    formData.append('_subject', 'New Message Notification')
    formData.append('_template', 'table')
    formData.append('nickname', form.value.nickname)
    formData.append('message', form.value.message)
    const response = await fetch('https://formsubmit.co/ajax/75dd5d6dc0e60c7939e96f6a765b9500', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    if (result.success === 'true') {
      buttonText.value = 'Sent ✓'
      form.value.nickname = ''
      form.value.message = ''
    } else {
      buttonText.value = 'Failed ✗'
      throw new Error('Send failed')
    }
  } catch (error) {
    buttonText.value = 'Failed ✗'
    console.error('Submission failed:', error)
  } finally {
    setTimeout(() => {
      buttonText.value = 'Send Message'
      isSending.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="contact-page-wrapper">
    <div class="sidebar-with-index sticky-sidebar">
      <Sidebar />
    </div>
    <div class="contact-container">
      <div class="contact-form">
        <div class="form-header">
          <h1>Leave a Message</h1>
          <div class="decoration-line"></div>
          <p>Feel free to share your thoughts with me</p>
        </div>
        <form @submit.prevent="submitForm">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_subject" value="New Message Notification">
          <input type="hidden" name="_template" value="table">
          <div class="form-group">
            <label for="nickname">Your Nickname:</label>
            <input 
              v-model="form.nickname"
              type="text" 
              id="nickname" 
              name="nickname"
              required
              placeholder="To know who you are"
            >
          </div>
          <div class="form-group">
            <label for="message">Your Message:</label>
            <textarea 
              v-model="form.message"
              id="message" 
              name="message"
              required
              rows="5"
              placeholder="Words for me"
            ></textarea>
          </div>
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isSending"
          >
            {{ buttonText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center; /* 保持水平居中 */
  width: 100%;
  min-height: 100vh;       /* 让容器填满视口高度，以便垂直居中 */
  max-width: 1200px; /* 控制整体最大宽度，可根据需要调整 */
  margin: 0 auto;
  box-sizing: border-box;
  padding: 2rem;           /* 页面内边距，避免贴边 */
  gap: 2rem;               /* 两栏之间的间距 */
}

/* 将两栏设为固定尺寸的块，不再自动拉伸占满剩余空间 */
.sidebar-with-index {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 220px;
  max-width: 350px;
  flex: 0 0 auto; /* 不伸缩 */
  gap: 0;
}

.contact-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 auto;
  min-width: 0;
  margin: 0;
  padding: 0;
}

.contact-form {
  background-color: #e1d8da;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-left: 5px solid rgb(134, 209, 59);
  position: relative;
  overflow: hidden;
}

.contact-form::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(134, 209, 59, 0.1);
}

.contact-form::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 42, 109, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.form-header h1 {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}

.decoration-line {
  width: 50px;
  height: 3px;
  background: rgb(134, 209, 59);
  margin: 0 auto 1rem;
  border-radius: 3px;
}

.form-header p {
  color: #666;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.7);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: rgb(134, 209, 59);
  box-shadow: 0 0 0 3px rgba(134, 209, 59, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background-color: transparent;
  border: 3px solid var(--neon-pink);
  color: var(--neon-pink);
  padding: 0.9rem 1.2rem;
  font-size: 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  width: 100%;
  font-weight: 600;
  letter-spacing: 0.5px;
  z-index: 1;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 42, 109, 0.2), transparent);
  transition: all 0.6s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: rgba(255, 42, 109, 0.1);
  box-shadow: 0 0 15px var(--neon-pink), 0 0 25px var(--neon-pink);
  transform: scale(1.02);
  color: white;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn[disabled] {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
  color: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.submit-btn[disabled][data-failed] {
  background-color: rgba(244, 67, 54, 0.1);
  border-color: #F44336;
  color: #F44336;
  box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
}

@media (max-width: 900px) {
  .contact-page-wrapper {
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
  .contact-container {
    padding: 0;
    flex: 1 1 auto;
  }
}
</style>