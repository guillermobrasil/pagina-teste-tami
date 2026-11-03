/* Mascote local: animação visual, sem microfone, rede ou armazenamento. */
(function () {
  const states = {
    idle: {label:'Estou por aqui.',detail:'Posso ajudar com agenda, financeiro, Marketing e aprovações.'},
    listening: {label:'Estou acompanhando sua mensagem.',detail:'Pode escrever com calma. Envie quando estiver pronta.'},
    thinking: {label:'Organizando a resposta…',detail:'Conferindo as informações disponíveis no painel.'},
    speaking: {label:'Pronto! Veja minha resposta abaixo.',detail:'Se quiser, faça outra pergunta para continuar.'},
    surprised: {label:'Pode me dar mais uma pista?',detail:'Tente perguntar sobre agenda, financeiro, Marketing ou aprovações.'},
    resting: {label:'Tirando uma sonequinha…',detail:'Comece a escrever ou faça um carinho para me chamar.'}
  };
  let state='idle', paused=false, root=null, restTimer, reactionTimer, sequence=0, gazeFrame=0;
  let gaze={x:0,y:0}, target={x:0,y:0};
  let smileTimer=0, smileEndTimer=0, happy=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  function resetGaze() {
    cancelAnimationFrame(gazeFrame); gazeFrame=0; gaze={x:0,y:0}; target={x:0,y:0};
    for (const key of ['eye-x','eye-y','head-x','tilt']) root?.style.removeProperty(`--ziggy-${key}`);
  }
  function canTrack() { return root?.isConnected && !paused && !reduced.matches && pointer.matches && state!=='resting' && !document.hidden; }
  function easeGaze() {
    if (!canTrack()) { resetGaze(); return; }
    gaze.x+=(target.x-gaze.x)*.14; gaze.y+=(target.y-gaze.y)*.14;
    root.style.setProperty('--ziggy-eye-x',`${(gaze.x*3.2).toFixed(3)}px`);
    root.style.setProperty('--ziggy-eye-y',`${(gaze.y*2.4).toFixed(3)}px`);
    root.style.setProperty('--ziggy-head-x',`${(gaze.x*1.8).toFixed(3)}px`);
    root.style.setProperty('--ziggy-tilt',`${(gaze.x*1.6).toFixed(3)}deg`);
    if (Math.abs(target.x-gaze.x)+Math.abs(target.y-gaze.y)>.005) gazeFrame=requestAnimationFrame(easeGaze);
    else gazeFrame=0;
  }
  function aim(x,y) { target={x,y}; if (!gazeFrame) gazeFrame=requestAnimationFrame(easeGaze); }
  function clearSmile() { clearTimeout(smileTimer); clearTimeout(smileEndTimer); smileTimer=0; smileEndTimer=0; happy=false; }
  function canSmile() { return root?.isConnected && !paused && !reduced.matches && !document.hidden && ['idle','speaking'].includes(state); }
  function smileFor(duration=2800) {
    if (!canSmile()) return;
    clearSmile(); happy=true;
    smileEndTimer=setTimeout(()=>{happy=false; smileEndTimer=0; paint();},duration);
    paint();
  }
  const clearTimers = () => { clearTimeout(restTimer); clearTimeout(reactionTimer); clearSmile(); };
  function paint() {
    if (!root?.isConnected) return;
    root.dataset.state=state; root.classList.toggle('is-paused',paused);
    root.classList.toggle('is-happy',happy && canSmile());
    if (state==='idle' && canSmile() && !happy && !smileTimer) smileTimer=setTimeout(()=>{smileTimer=0; smileFor();},10000);
    if (!canTrack()) resetGaze();
    const label=root.querySelector('.ziggy-status'), detail=root.querySelector('.ziggy-detail');
    if (label.textContent!==states[state].label) label.textContent=states[state].label;
    if (detail.textContent!==states[state].detail) detail.textContent=states[state].detail;
    const motion=root.querySelector('[data-ziggy-action="motion"]');
    motion.setAttribute('aria-pressed',String(paused)); motion.textContent=paused ? 'Retomar animações' : 'Pausar animações';
  }
  function setState(next) {
    if (!states[next]) return;
    clearTimers(); state=next; paint();
    if (next==='speaking') smileFor();
    if (next==='idle' && root?.isConnected) restTimer=setTimeout(()=>setState('resting'),45000);
  }
  function render() {
    const uid=`ziggy-eyes-${++sequence}`;
    const eyes=`<svg class="ziggy-eyes" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><defs><radialGradient id="${uid}-fade"><stop offset="75%" stop-color="white"/><stop offset="100%" stop-color="black"/></radialGradient><mask id="${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><ellipse cx="106" cy="96" rx="13" ry="12" fill="url(#${uid}-fade)"/><ellipse cx="165" cy="87" rx="12" ry="12" fill="url(#${uid}-fade)"/></mask></defs><g mask="url(#${uid})"><image class="ziggy-eye-art" href="assets/ziggy-sprites-v1.png" width="1024" height="1536"/><image class="ziggy-blink" href="assets/ziggy-sprites-v1.png" x="-512" width="1024" height="1536"/></g><g class="ziggy-happy-mouth"><defs><radialGradient id="${uid}-mouth-fade"><stop offset="50%" stop-color="white"/><stop offset="100%" stop-color="black"/></radialGradient><mask id="${uid}-mouth" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><ellipse cx="145" cy="158" rx="24" ry="18" fill="url(#${uid}-mouth-fade)"/></mask></defs><g mask="url(#${uid}-mouth)"><image class="ziggy-tongue" href="assets/ziggy-sprites-v1.png" x="-269" y="-770" width="1024" height="1536"/></g></g></svg>`;
    return `<section class="ziggy-companion" aria-label="Ziggy, seu secretário virtual" data-state="${state}"><div class="ziggy-stage"><button type="button" class="ziggy-pet" data-ziggy-action="pet" aria-label="Fazer carinho no Ziggy"><span class="ziggy-motion" aria-hidden="true"><span class="ziggy-sprite">${eyes}</span></span></button><span class="ziggy-nameplate">ZIGGY <span>Seu secretário virtual</span></span></div><div class="ziggy-intro"><p class="eyebrow">UMA COMPANHIA PARA SUA ROTINA</p><h2>Oi, eu sou o Ziggy.</h2><p class="ziggy-status" role="status" aria-live="polite">${states[state].label}</p><p class="ziggy-detail">${states[state].detail}</p><div class="ziggy-actions"><button type="button" class="primary-button" data-ziggy-action="start">Conversar com o Ziggy</button><button type="button" class="secondary-button" data-ziggy-action="motion" aria-pressed="${paused}">${paused ? 'Retomar animações' : 'Pausar animações'}</button></div><small>Movimentos suaves e olhar que acompanha o mouse. Respostas por regras locais, sem voz ou IA externa conectada.</small></div></section>`;
  }
  function mount(page) {
    clearTimers(); resetGaze(); root=page==='secretaria' ? document.querySelector('.ziggy-companion') : null;
    if (!root) { state='idle'; return; }
    paint();
    if (state==='idle') restTimer=setTimeout(()=>setState('resting'),45000);
  }
  function react(response) {
    const unknown=/não consegui identificar|pode reformular|módulo.*não carregou/i.test(response);
    setState(unknown ? 'surprised' : 'speaking');
    reactionTimer=setTimeout(()=>setState('idle'),unknown ? 6500 : 5000);
  }
  document.addEventListener('pointermove',event=>{
    if (event.pointerType==='touch' || !canTrack()) return;
    const rect=root.querySelector('.ziggy-pet').getBoundingClientRect();
    if (rect.bottom<0 || rect.top>innerHeight) { resetGaze(); return; }
    aim(Math.tanh((event.clientX-rect.x-rect.width/2)/260),Math.tanh((event.clientY-rect.y-rect.height/2)/240));
  },{passive:true});
  document.addEventListener('pointerout',event=>{if (!event.relatedTarget && canTrack()) aim(0,0);});
  document.addEventListener('visibilitychange',()=>{if (document.hidden) {resetGaze();clearSmile();} paint();});
  reduced.addEventListener('change',()=>{resetGaze();clearSmile();paint();}); pointer.addEventListener('change',resetGaze);
  document.addEventListener('input',event=>{
    if (event.target.id==='chat-input' && state!=='thinking') setState(event.target.value.trim() ? 'listening' : 'idle');
  });
  document.addEventListener('focusin',event=>{
    if (event.target.id==='chat-input' && !['thinking','speaking','surprised'].includes(state)) setState(event.target.value.trim() ? 'listening' : 'idle');
  });
  document.addEventListener('click',event=>{
    const action=event.target.closest('[data-ziggy-action]')?.dataset.ziggyAction;
    if (!action) return;
    if (action==='motion') { paused=!paused; clearSmile(); paint(); return; }
    if (action==='start') {
      const form=document.querySelector('#chat-form');
      if (!form) return;
      window.SectionDisclosures?.reveal(form);
      form.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'center'});
      document.querySelector('#chat-input')?.focus({preventScroll:true});
      if (state!=='thinking') setState('idle');
      return;
    }
    if (action==='pet' && state!=='thinking') {
      setState('speaking');
      root.querySelector('.ziggy-status').textContent='Au! Um carinho e já estou pronto para ajudar.';
      reactionTimer=setTimeout(()=>setState('idle'),3500);
    }
  });
  window.ZiggyAssistant=Object.freeze({render,mount,setState,react,
    prepareReply() { setState('thinking'); return new Promise(resolve=>setTimeout(resolve,480)); }
  });
})();
