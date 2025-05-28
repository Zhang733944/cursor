// 获取DOM元素
const timeDisplay = document.getElementById('time');
const statusDisplay = document.getElementById('status');
const timeButtons = document.querySelectorAll('.time-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const notification = document.getElementById('notification');
const closeNotificationBtn = document.getElementById('close-notification');

// 番茄钟状态变量
let selectedTime = 0; // 选择的时间（分钟）
let timeLeft = 0; // 剩余时间（秒）
let timerInterval = null; // 计时器
let isPaused = false; // 是否暂停
let startTime = 0; // 开始时间戳
let pausedTime = 0; // 暂停时的剩余时间

// 格式化时间显示（将秒转换为 MM:SS 格式）
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 选择时间
timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 移除其他按钮的active类
        timeButtons.forEach(btn => btn.classList.remove('active'));
        
        // 添加当前按钮的active类
        button.classList.add('active');
        
        // 获取选择的时间
        selectedTime = parseInt(button.getAttribute('data-time'));
        timeLeft = selectedTime * 60;
        
        // 更新显示
        timeDisplay.textContent = formatTime(timeLeft);
        statusDisplay.textContent = `已选择 ${selectedTime} 分钟`;
        
        // 启用开始按钮
        startBtn.disabled = false;
    });
});

// 开始计时
startBtn.addEventListener('click', () => {
    if (selectedTime === 0) return;
    
    // 如果是从暂停状态恢复
    if (isPaused) {
        isPaused = false;
        startTime = Date.now() - ((selectedTime * 60 - pausedTime) * 1000);
        statusDisplay.textContent = '计时中...';
    } else {
        // 重新开始计时
        timeLeft = selectedTime * 60;
        startTime = Date.now();
        statusDisplay.textContent = '计时中...';
    }
    
    // 禁用开始按钮和时间选择按钮
    startBtn.disabled = true;
    timeButtons.forEach(btn => btn.disabled = true);
    
    // 启用暂停和重置按钮
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    
    // 开始计时 - 使用基于时间戳的计时方式
    timerInterval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        timeLeft = Math.max(0, selectedTime * 60 - elapsedSeconds);
        timeDisplay.textContent = formatTime(timeLeft);
        
        // 时间到
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTimer();
            showNotification();
        }
    }, 100); // 更新频率提高到100ms，使显示更平滑
});

// 暂停计时
pauseBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isPaused = true;
    pausedTime = timeLeft; // 保存暂停时的剩余时间
    statusDisplay.textContent = '已暂停';
    
    // 启用开始按钮
    startBtn.disabled = false;
});

// 重置计时
resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isPaused = false;
    
    // 重置显示
    timeLeft = selectedTime * 60;
    timeDisplay.textContent = formatTime(timeLeft);
    statusDisplay.textContent = `已选择 ${selectedTime} 分钟`;
    
    // 重置按钮状态
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    timeButtons.forEach(btn => btn.disabled = false);
});

// 结束计时
function endTimer() {
    statusDisplay.textContent = '时间到！';
    
    // 重置按钮状态
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    timeButtons.forEach(btn => btn.disabled = false);
}

// 显示通知
function showNotification() {
    notification.classList.add('show');
    
    // 请求通知权限并显示系统通知
    if (Notification.permission === "granted") {
        new Notification("番茄钟", {
            body: "你的番茄钟时间已结束！",
            icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23ff6347'/%3E%3Cpath d='M32 10 C 20 10, 15 20, 15 32 C 15 44, 22 54, 32 54 C 42 54, 49 44, 49 32 C 49 20, 44 10, 32 10 Z' fill='%23e05a40'/%3E%3Cpath d='M32 5 L 32 10 M 32 54 L 32 59 M 5 32 L 10 32 M 54 32 L 59 32' stroke='%23228b22' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("番茄钟", {
                    body: "你的番茄钟时间已结束！",
                    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23ff6347'/%3E%3Cpath d='M32 10 C 20 10, 15 20, 15 32 C 15 44, 22 54, 32 54 C 42 54, 49 44, 49 32 C 49 20, 44 10, 32 10 Z' fill='%23e05a40'/%3E%3Cpath d='M32 5 L 32 10 M 32 54 L 32 59 M 5 32 L 10 32 M 54 32 L 59 32' stroke='%23228b22' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"
                });
            }
        });
    }
    
    // 播放提示音
    const audio = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    audio.play();
}

// 关闭通知
closeNotificationBtn.addEventListener('click', () => {
    notification.classList.remove('show');
});

// 初始化显示
timeDisplay.textContent = '00:00'; 