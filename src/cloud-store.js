import { createClient } from '@supabase/supabase-js';

let client, user, version = 0, queue = Promise.resolve(), failed = false;
const listeners = new Set();
let pending = 0;
function emit(status, message = '') { listeners.forEach(fn => fn({status, message, pending})); }
async function init() {
  if (client) return client;
  const response = await fetch('cloud-config.json', {cache: 'no-store'});
  if (!response.ok) throw new Error('Configuração da conta indisponível neste endereço.');
  const config = await response.json();
  if (!config.url || !config.publishableKey) throw new Error('A conexão privada ainda não está configurada neste endereço.');
  client = createClient(config.url, config.publishableKey, {auth: {storage: sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true}});
  client.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') { user = null; emit('signed-out'); }
  });
  return client;
}
async function load() {
  const c = await init();
  const {data: auth, error: authError} = await c.auth.getUser();
  if (authError || !auth.user) throw new Error('Entre na sua conta para continuar.');
  const {data, error} = await c.from('clinic_documents').select('payload,version').eq('owner_id', auth.user.id).maybeSingle();
  if (error) throw new Error('Não foi possível carregar os registros da conta.');
  if (data?.payload && !['clients','clientVisits','transactions','appointments','occurrences','approvals','drafts'].every(k => Array.isArray(data.payload[k]))) throw new Error('Documento da conta incompatível.');
  user = auth.user; version = Number(data?.version || 0); failed = false;
  return data?.payload || null;
}
const store = {
  get active() { return !!user; },
  get email() { return user?.email || ''; },
  get pending() { return pending; },
  onStatus(fn) { listeners.add(fn); },
  async signIn(email, password) {
    const c = await init(); const {error} = await c.auth.signInWithPassword({email, password});
    if (error) throw new Error('Não foi possível entrar. Confira e-mail, senha e confirmação do cadastro.');
    return load();
  },
  async signUp(email, password) {
    const c = await init(); const {error} = await c.auth.signUp({email, password});
    if (error) throw new Error('Não foi possível cadastrar. Confira os dados e tente novamente mais tarde.');
  },
  async signOut() {
    if (pending) throw new Error('Aguarde o envio das alterações antes de sair.');
    const c = await init(); const {error} = await c.auth.signOut({scope: 'local'});
    if (error) throw new Error('Não foi possível encerrar a sessão.');
    user = null;
  },
  load,
  enqueue(payload) {
    if (!user || failed) return false;
    const snapshot = JSON.parse(JSON.stringify({...payload, chat: []}));
    const owner = user.id; pending++; emit('saving');
    queue = queue.then(async () => {
      if (failed || user?.id !== owner) return;
      const {data, error} = await client.rpc('save_clinic_document', {p_payload: snapshot, p_expected_version: version});
      if (error) throw new Error(error.message?.includes('VERSION_CONFLICT') || error.code === '23505' ? 'Outra sessão alterou os registros. Exporte suas alterações e recarregue a conta antes de continuar.' : 'Falha no envio à conta. Exporte uma cópia das alterações antes de sair.');
      version = Number(data);
    }).catch(error => { failed = true; emit('error', error.message); }).finally(() => { pending--; if (!pending && !failed) emit('saved'); });
    return true;
  },
  async backups() {
    const {data, error} = await client.from('clinic_backups').select('version,created_at').eq('owner_id', user.id).order('version', {ascending:false}).limit(20);
    if (error) throw new Error('Não foi possível listar as versões anteriores.');
    return data;
  },
  async backupPayload(selected) {
    const {data, error} = await client.from('clinic_backups').select('payload').eq('owner_id', user.id).eq('version', selected).single();
    if (error) throw new Error('Versão não encontrada.');
    return data.payload;
  }
};
window.CloudStore = store;
