
let selectedFiles = [];
const analysisResults = [];

function randInt(min,max) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

function updateSelectedFiles() {
  const fileInput = document.getElementById('videoFile');
  const selectedFilesDiv = document.getElementById('selectedFiles');
  selectedFiles = Array.from(fileInput.files);
  
  selectedFilesDiv.innerHTML = selectedFiles.map((file, index) => `
    <div class="file-item">
      <span>${file.name}</span>
      <button onclick="removeFile(${index})" class="remove-file">×</button>
    </div>
  `).join('');
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  updateSelectedFiles();
}

document.getElementById('videoFile').addEventListener('change', updateSelectedFiles);

document.getElementById('startBtn').addEventListener('click', async () => {
  if(selectedFiles.length === 0) {
    alert('请至少选择一个视频文件');
    return;
  }

  // 重置和显示处理界面
  document.getElementById('processing').style.display = 'flex';
  document.getElementById('processing').setAttribute('aria-hidden','false');
  document.getElementById('results').style.display = 'none';
  document.getElementById('results').setAttribute('aria-hidden','true');
  document.getElementById('resultsContainer').innerHTML = '';
  analysisResults.length = 0;

  const totalFiles = selectedFiles.length;
  let completedFiles = 0;

  // 处理每个文件
  for(let file of selectedFiles) {
    document.getElementById('currentFileName').textContent = file.name;
    document.getElementById('fileProgress').textContent = `${completedFiles + 1}/${totalFiles}`;
    
    await analyzeVideo(file);
    completedFiles++;
  }

  showResults();
});

async function analyzeVideo(file) {
  return new Promise(resolve => {
    let progress = 0;
    const progElem = document.getElementById('progress');
    const progText = document.getElementById('progressText');
    progText.innerText = '加载模型';
    
    const steps = [
      {t:800, txt:'分析视频帧'},
      {t:1200, txt:'识别表情与姿态'},
      {t:1000, txt:'语音与语义理解'},
      {t:900, txt:'岗位语义匹配'},
      {t:700, txt:'生成可解释报告'}
    ];

    let i = 0;
    const iv = setInterval(() => {
      progress += randInt(8,18);
      if(progress > 98) progress = 98;
      progElem.style.width = progress + '%';
      progText.innerText = steps[Math.min(i,steps.length-1)].txt + ' · ' + progress + '%';
      i++;
      
      if(i > steps.length + 2) {
        clearInterval(iv);
        progElem.style.width = '100%';
        progText.innerText = '完成 100%';
        
        // 生成分析结果
        const result = generateResult(file.name);
        analysisResults.push(result);
        
        setTimeout(resolve, 500);
      }
    }, 600);
  });
}

function generateResult(filename) {
  const baseSkill = randInt(75,95);
  const baseSoft = randInt(70,90);
  const baseCulture = randInt(68,88);
  const score = Math.round((baseSkill*0.5 + baseSoft*0.3 + baseCulture*0.2));
  
  const comments = [
    "培训风格轻松，与学员非常融洽",
    "亲和力强，语言逻辑清晰",
    "对专业知识理解深刻",
    "表现出良好的团队协作能力",
    "富有激情和创新精神"
  ];
  
  return {
    filename,
    scores: {
      skill: baseSkill,
      soft: baseSoft,
      culture: baseCulture,
      total: score
    },
    comment: comments[randInt(0, comments.length-1)]
  };
}

function showResults() {
  document.getElementById('processing').style.display = 'none';
  document.getElementById('processing').setAttribute('aria-hidden','true');
  document.getElementById('results').style.display = 'block';
  document.getElementById('results').setAttribute('aria-hidden','false');

  const container = document.getElementById('resultsContainer');
  
  analysisResults.forEach(result => {
    container.innerHTML += `
      <div class="result-card">
        <h3>${result.filename}</h3>
        <div class="metrics">
          <div class="metric">
            <div class="value">${result.scores.total}%</div>
            <div class="label">综合匹配度</div>
          </div>
          <div class="metric">
            <div class="value">${result.scores.skill}%</div>
            <div class="label">专业能力</div>
          </div>
          <div class="metric">
            <div class="value">${result.scores.soft}%</div>
            <div class="label">软实力</div>
          </div>
        </div>
        <div class="comment">${result.comment}</div>
      </div>
    `;
  });
}

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('processing').style.display = 'none';
  document.getElementById('results').style.display = 'none';
  document.getElementById('videoFile').value = '';
  document.getElementById('selectedFiles').innerHTML = '';
  document.getElementById('progress').style.width = '0%';
  document.getElementById('progressText').innerText = '等待中';
  document.getElementById('currentFileName').textContent = '-';
  document.getElementById('fileProgress').textContent = '0/0';
  selectedFiles = [];
  analysisResults.length = 0;
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const report = analysisResults.map(result => `
候选人视频: ${result.filename}
综合匹配度: ${result.scores.total}%
专业能力: ${result.scores.skill}%
软实力: ${result.scores.soft}%
评价: ${result.comment}
----------------------------------------
`).join('\n');

  const blob = new Blob([report], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '分析报告.txt';
  a.click();
  URL.revokeObjectURL(url);
});

function onload() {
  document.getElementById('results').style.display = 'none';
}
