create table public.pastes (
  id text primary key,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  max_views integer,
  current_views integer default 0 not null
);

alter table public.pastes enable row level security;

create policy "Enable insert for all users" on public.pastes for insert with check (true);
create policy "Enable read for all users" on public.pastes for select using (true);
create policy "Enable update for all users" on public.pastes for update using (true);

create or replace function increment_view_count(row_id text)
returns void as $$
begin
  update pastes
  set current_views = current_views + 1
  where id = row_id;
end;
$$ language plpgsql;
