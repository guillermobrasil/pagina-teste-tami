-- Estrutura inicial: uma área privada por conta; sem compartilhamento entre contas.
create table public.clinic_documents (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  version bigint not null default 1,
  updated_at timestamptz not null default now()
);
create table public.clinic_backups (
  owner_id uuid not null references auth.users(id) on delete cascade,
  version bigint not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  primary key (owner_id, version)
);
alter table public.clinic_documents enable row level security;
alter table public.clinic_backups enable row level security;
revoke all on public.clinic_documents, public.clinic_backups from anon, authenticated;
grant select, insert, update on public.clinic_documents to authenticated;
grant select, insert, delete on public.clinic_backups to authenticated;
create policy documents_select on public.clinic_documents for select to authenticated using ((select auth.uid()) = owner_id);
create policy documents_insert on public.clinic_documents for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy documents_update on public.clinic_documents for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy backups_select on public.clinic_backups for select to authenticated using ((select auth.uid()) = owner_id);
create policy backups_insert on public.clinic_backups for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy backups_delete on public.clinic_backups for delete to authenticated using ((select auth.uid()) = owner_id);

create function public.save_clinic_document(p_payload jsonb, p_expected_version bigint)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare previous public.clinic_documents%rowtype; user_id uuid := auth.uid();
begin
  if user_id is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(p_payload) <> 'object' or not (p_payload ?& array['clients','clientVisits','appointments','transactions','approvals']) then raise exception 'Invalid document'; end if;
  select * into previous from public.clinic_documents where owner_id = user_id for update;
  if not found then
    if p_expected_version <> 0 then raise exception 'VERSION_CONFLICT'; end if;
    insert into public.clinic_documents(owner_id, payload, version) values(user_id, p_payload, 1);
    return 1;
  end if;
  if previous.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  insert into public.clinic_backups(owner_id, version, payload) values(user_id, previous.version, previous.payload) on conflict do nothing;
  update public.clinic_documents set payload = p_payload, version = previous.version + 1, updated_at = now() where owner_id = user_id;
  delete from public.clinic_backups where owner_id = user_id and version <= previous.version - 20;
  return previous.version + 1;
end;
$$;
revoke all on function public.save_clinic_document(jsonb, bigint) from public, anon;
grant execute on function public.save_clinic_document(jsonb, bigint) to authenticated;
