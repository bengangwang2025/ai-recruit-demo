
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}

document.getElementById('startBtn').addEventListener('click', ()=>{
  const jd = document.getElementById('jd').value.trim();
  // show processing
  document.getElementById('processing').style.display = 'flex';
  document.getElementById('processing').setAttribute('aria-hidden','false');
  document.getElementById('result').style.display = 'none';
  document.getElementById('result').setAttribute('aria-hidden','true');
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
  let i=0;
  const iv = setInterval(()=>{
    progress += randInt(8,18);
    if(progress>98) progress=98;
    progElem.style.width = progress + '%';
    progText.innerText = steps[Math.min(i,steps.length-1)].txt + ' · ' + progress + '%';
    i++;
    if(i>steps.length+5){
      clearInterval(iv);
      // finalize
      progElem.style.width = '100%';
      progText.innerText = '完成 100%';
      setTimeout(()=>{ showResult(jd) },500);
    }
  },600);
});

function showResult(jd){
  document.getElementById('processing').style.display = 'none';
  document.getElementById('processing').setAttribute('aria-hidden','true');
  document.getElementById('result').style.display = 'block';
  document.getElementById('result').setAttribute('aria-hidden','false');

  // simulated scoring logic influenced by keywords in JD (demo-only)
  let baseSkill = randInt(75,92);
  let baseSoft = randInt(70,88);
  let baseCulture = randInt(68,85);
  if(jd.toLowerCase().includes('跨部门')||jd.includes('协作')){
    baseSoft = Math.min(95, baseSoft + 4);
  }
  if(jd.toLowerCase().includes('逻辑')){ baseSkill = Math.min(98, baseSkill + 3) }
  const score = Math.round((baseSkill*0.5 + baseSoft*0.3 + baseCulture*0.2));
  document.getElementById('skill').innerText = baseSkill + '%';
  document.getElementById('soft').innerText = baseSoft + '%';
  document.getElementById('culture').innerText = baseCulture + '%';
  document.getElementById('score').innerText = score + ' / 100';

  let advice = '候选人在表达上自信且逻辑清晰。';
  if(baseCulture < 72) advice += ' 文化契合度略低，建议安排团队沟通面试以进一步评估。';
  document.getElementById('advice').innerText = advice;
}

document.getElementById('resetBtn').addEventListener('click', ()=>{
  document.getElementById('processing').style.display = 'none';
  document.getElementById('result').style.display = 'none';
  document.getElementById('jd').value = '';
  document.getElementById('videoFile').value = '';
  document.getElementById('progress').style.width = '0%';
  document.getElementById('progressText').innerText = '等待中';
});
