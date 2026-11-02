/* A demonstração e a conta privada mantêm dados separados. */
function emptyAccountData() {
  return {...makeInitialData(), clients: [], clientVisits: [], transactions: [], appointments: [], occurrences: [], approvals: [], drafts: [], strategyPlans: [], whatsappDrafts: [], chat: []};
}
function validAccountPayload(value) {
  return value && ['clients','clientVisits','transactions','appointments','occurrences','approvals','drafts'].every(k => Array.isArray(value[k]));
}
function refreshAccountLabel() {
  const button = document.querySelector('#account-button');
  button.textContent = window.CloudStore.active ? 'Minha conta' : 'Entrar na conta';
  const status = document.querySelector('#account-status');
  status.textContent = window.CloudStore.active ? 'Conta privada · dados na nuvem' : 'Demonstração · dados neste navegador';
}
async function activateAccount(payload) {
  if (payload && !validAccountPayload(payload)) throw new Error('O documento da conta não tem o formato esperado.');
  data = payload || emptyAccountData(); data.settings ||= defaultSettings(); data.identity = normalizeIdentity(data.identity || defaultIdentity); data.chat = [];
  identityWorking = JSON.parse(JSON.stringify(data.identity)); crmActiveClientId = null; activeDraftId = null;
  unsavedChanges = false; document.querySelector('#modal-host').innerHTML = '';
  updateCounts(); refreshAccountLabel(); setPage('inicio');
}
window.openAccount = function () {
  if (!window.CloudStore) return showToast('Conexão privada indisponível.', 'error');
  if (window.CloudStore.active) {
    openModal('Minha conta', `<p>Você está na sua área privada. A demonstração fica separada.</p><p><strong>${escapeHTML(window.CloudStore.email)}</strong></p><p>As últimas 20 versões anteriores ficam no mesmo banco. Elas ajudam a desfazer alterações, mas não substituem um backup externo.</p><div class="record-actions"><button class="secondary-button" data-action="cloud-backups">Ver versões anteriores</button><button class="secondary-button" data-action="export-local-backup">Exportar meus dados</button><button class="secondary-button" data-action="cloud-reload">Recarregar da conta</button><button class="secondary-button" data-action="cloud-signout">Sair da conta</button></div><div id="cloud-versions"></div><p id="cloud-message" role="status"></p>`);
  } else {
    openModal('Entrar na conta privada', `<p>A conta sincroniza seus registros entre dispositivos. Os exemplos da demonstração não são enviados automaticamente.</p><form id="cloud-login-form" class="modal-form"><label>E-mail<input name="email" type="email" autocomplete="username" required></label><label>Senha<input name="password" type="password" autocomplete="current-password" minlength="8" required></label><button class="primary-button">Entrar</button><button type="submit" class="secondary-button" name="intent" value="signup">Criar conta</button><button type="button" class="secondary-button" data-action="cloud-resume">Retomar sessão neste navegador</button><p id="cloud-message" role="status"></p></form>`);
  }
};
window.CloudStore?.onStatus(({status, message}) => {
  const element = document.querySelector('#account-status');
  if (status === 'saving') { unsavedChanges = true; element.textContent = 'Enviando alterações à conta…'; }
  if (status === 'saved') { unsavedChanges = false; element.textContent = 'Alterações salvas na conta'; }
  if (status === 'error') { unsavedChanges = true; element.textContent = 'Alterações não enviadas · exporte uma cópia'; showToast(message, 'error'); }
  if (status === 'signed-out') {
    data = loadData(); data.settings ||= defaultSettings(); data.identity = normalizeIdentity(data.identity || defaultIdentity);
    identityWorking = JSON.parse(JSON.stringify(data.identity)); crmActiveClientId = null; activeDraftId = null;
    unsavedChanges = false; document.querySelector('#modal-host').innerHTML = ''; refreshAccountLabel(); updateCounts(); setPage('inicio');
  }
});
document.addEventListener('submit', async event => {
  if (event.target.id !== 'cloud-login-form') return;
  event.preventDefault();
  const form = event.target; const values = Object.fromEntries(new FormData(form));
  const message = form.querySelector('#cloud-message');
  const buttons = [...form.querySelectorAll('button')]; buttons.forEach(b => b.disabled = true);
  try {
    if (event.submitter?.value === 'signup') {
      await window.CloudStore.signUp(values.email, values.password);
      message.textContent = 'Se o cadastro estiver disponível, confirme seu e-mail e depois entre com sua senha.';
    } else await activateAccount(await window.CloudStore.signIn(values.email, values.password));
  } catch (error) { message.textContent = error.message; }
  finally { buttons.forEach(b => b.disabled = false); }
});
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-action]');
  if (!button?.dataset.action.startsWith('cloud-')) return;
  const action = button.dataset.action;
  button.disabled = true;
  try {
    if (action === 'cloud-resume') await activateAccount(await window.CloudStore.load());
    if (action === 'cloud-signout') {
      if (unsavedChanges) throw new Error('Exporte ou salve suas alterações antes de sair.');
      await window.CloudStore.signOut();
    }
    if (action === 'cloud-reload') {
      if (window.CloudStore.pending) throw new Error('Aguarde o envio das alterações.');
      if (!unsavedChanges || window.confirm('Recarregar os registros da conta? Alterações não enviadas serão descartadas. Exporte uma cópia antes de confirmar.')) await activateAccount(await window.CloudStore.load());
    }
    if (action === 'cloud-backups') {
      const versions = await window.CloudStore.backups();
      document.querySelector('#cloud-versions').innerHTML = versions.length ? versions.map(v => `<div class="task-row"><span>Versão ${Number(v.version)} · ${new Date(v.created_at).toLocaleString('pt-BR')}</span><button class="secondary-button" data-action="cloud-restore" data-version="${Number(v.version)}">Restaurar</button></div>`).join('') : '<p>As versões anteriores aparecem após salvar alterações na conta.</p>';
    }
    if (action === 'cloud-restore') {
      if (window.CloudStore.pending || unsavedChanges) throw new Error('Salve ou exporte as alterações atuais antes de restaurar.');
      if (window.confirm('Substituir os registros atuais por esta versão? A versão atual também será preservada no histórico.')) {
        const payload = await window.CloudStore.backupPayload(Number(button.dataset.version));
        if (!validAccountPayload(payload)) throw new Error('Versão incompatível.');
        data = payload; data.chat = []; save(); updateCounts(); document.querySelector('#modal-host').innerHTML = ''; setPage('inicio');
      }
    }
  } catch (error) { showToast(error.message, 'error'); const message = document.querySelector('#cloud-message'); if (message) message.textContent = error.message; }
  finally { button.disabled = false; }
});
refreshAccountLabel();
