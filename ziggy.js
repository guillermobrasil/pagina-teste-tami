/* Mascote local: animação visual, sem microfone, rede ou armazenamento. */
(function () {
  const states = {
    idle: {row:0,label:'Estou por aqui.',detail:'Posso ajudar com agenda, financeiro, Marketing e aprovações.'},
    listening: {row:1,label:'Estou acompanhando sua mensagem.',detail:'Pode escrever com calma. Envie quando estiver pronta.'},
    thinking: {row:2,label:'Organizando a resposta…',detail:'Conferindo as informações disponíveis no painel.'},
    speaking: {row:3,label:'Pronto! Veja minha resposta abaixo.',detail:'Se quiser, faça outra pergunta para continuar.'},
    surprised: {row:4,label:'Pode me dar mais uma pista?',detail:'Tente perguntar sobre agenda, financeiro, Marketing ou aprovações.'},
    resting: {row:5,label:'Tirando uma sonequinha…',detail:'Comece a escrever ou faça um carinho para me chamar.'}
  };
  let state='idle', paused=false, root=null, restTimer, reactionTimer;
  const clearTimers = () => { clearTimeout(restTimer); clearTimeout(reactionTimer); };
  function paint() {
    if (!root?.isConnected) return;
    root.dataset.state=state; root.classList.toggle('is-paused',paused);
    root.style.setProperty('--ziggy-row',`${states[state].row*20}%`);
    const label=root.querySelector('.ziggy-status'), detail=root.querySelector('.ziggy-detail');
    if (label.textContent!==states[state].label) label.textContent=states[state].label;
    if (detail.textContent!==states[state].detail) detail.textContent=states[state].detail;
    const motion=root.querySelector('[data-ziggy-action="motion"]');
    motion.setAttribute('aria-pressed',String(paused)); motion.textContent=paused ? 'Retomar animações' : 'Pausar animações';
  }
  function setState(next) {
    if (!states[next]) return;
    clearTimers(); state=next; paint();
    if (next==='idle' && root?.isConnected) restTimer=setTimeout(()=>setState('resting'),45000);
  }
  function render() {
    return `<section class="ziggy-companion" aria-label="Ziggy, seu secretário virtual" data-state="${state}"><div class="ziggy-stage"><button type="button" class="ziggy-pet" data-ziggy-action="pet" aria-label="Fazer carinho no Ziggy"><span class="ziggy-sprite" aria-hidden="true"></span></button><span class="ziggy-nameplate">ZIGGY <span>Seu secretário virtual</span></span></div><div class="ziggy-intro"><p class="eyebrow">UMA COMPANHIA PARA SUA ROTINA</p><h2>Oi, eu sou o Ziggy.</h2><p class="ziggy-status" role="status" aria-live="polite">${states[state].label}</p><p class="ziggy-detail">${states[state].detail}</p><div class="ziggy-actions"><button type="button" class="primary-button" data-ziggy-action="start">Conversar com o Ziggy</button><button type="button" class="secondary-button" data-ziggy-action="motion" aria-pressed="${paused}">${paused ? 'Retomar animações' : 'Pausar animações'}</button></div><small>Carinhas animadas, respostas por regras locais. Sem voz ou IA externa conectada.</small></div></section>`;
  }
  function mount(page) {
    clearTimers(); root=page==='secretaria' ? document.querySelector('.ziggy-companion') : null;
    if (!root) { state='idle'; return; }
    paint();
    if (state==='idle') restTimer=setTimeout(()=>setState('resting'),45000);
  }
  function react(response) {
    const unknown=/não consegui identificar|pode reformular|módulo.*não carregou/i.test(response);
    setState(unknown ? 'surprised' : 'speaking');
    reactionTimer=setTimeout(()=>setState('idle'),unknown ? 6500 : 5000);
  }
  document.addEventListener('input',event=>{
    if (event.target.id==='chat-input' && state!=='thinking') setState(event.target.value.trim() ? 'listening' : 'idle');
  });
  document.addEventListener('focusin',event=>{
    if (event.target.id==='chat-input' && !['thinking','speaking','surprised'].includes(state)) setState(event.target.value.trim() ? 'listening' : 'idle');
  });
  document.addEventListener('click',event=>{
    const action=event.target.closest('[data-ziggy-action]')?.dataset.ziggyAction;
    if (!action) return;
    if (action==='motion') { paused=!paused; paint(); return; }
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
