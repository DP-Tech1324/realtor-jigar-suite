-- Admin panel: add staff from the Users page, and show the MLS® sync status to staff.

-- A superadmin adds someone who already has an account (they sign up on the admin /auth
-- page first). auth.users isn't readable from the browser, so this looks the email up here.
create or replace function public.add_staff_member(p_email text, p_role text)
returns text
language plpgsql security definer set search_path = public as $$
declare
  v_user auth.users%rowtype;
begin
  if not public.is_superadmin() then
    raise exception 'Only a superadmin can add staff';
  end if;
  if p_role not in ('superadmin', 'admin', 'editor') then
    raise exception 'Unknown role %', p_role;
  end if;

  select * into v_user from auth.users where lower(email) = lower(trim(p_email));
  if not found then
    raise exception 'No account for %. Ask them to sign up on the admin sign-in page first.', p_email;
  end if;

  insert into public.admin_users (user_id, email, first_name, last_name, role, is_active)
  values (
    v_user.id, v_user.email,
    v_user.raw_user_meta_data ->> 'first_name', v_user.raw_user_meta_data ->> 'last_name',
    p_role, true
  )
  on conflict (user_id) do update set role = excluded.role, is_active = true;

  return v_user.email;
end;
$$;

revoke all on function public.add_staff_member(text, text) from public, anon;
grant execute on function public.add_staff_member(text, text) to authenticated;

-- Staff can see how far the MLS® sync has got (it is written only by the server)
drop policy if exists "sync state staff read" on public.ddf_sync_state;
create policy "sync state staff read" on public.ddf_sync_state for select using (public.is_staff());
grant select on public.ddf_sync_state to authenticated;
