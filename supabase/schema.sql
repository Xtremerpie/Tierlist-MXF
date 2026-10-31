create table tiers (code text primary key, sort_order int not null, points int not null default 0);
create table gamemodes (id serial primary key, slug text unique not null, name text not null, sort_order int default 0);
create table players (id uuid primary key default gen_random_uuid(), username text unique not null, uuid text, discord text, created_at timestamptz default now());
create table rankings (
  player_id uuid references players on delete cascade, gamemode_id int references gamemodes on delete cascade,
  tier_code text references tiers(code), region text, updated_at timestamptz default now(),
  primary key (player_id, gamemode_id));
create table tier_history (id bigserial primary key, player_id uuid references players on delete cascade, gamemode_id int references gamemodes on delete cascade,
  old_tier text, new_tier text, changed_at timestamptz default now());
alter table tiers enable row level security; alter table gamemodes enable row level security; alter table players enable row level security;
alter table rankings enable row level security; alter table tier_history enable row level security; -- only the server (service role) reads/writes

insert into tiers values ('HT1',1,60),('LT1',2,44),('HT2',3,32),('LT2',4,20),('HT3',5,10),('LT3',6,6),('HT4',7,4),('LT4',8,3),('HT5',9,2),('LT5',10,1),('Unranked',99,0);
insert into gamemodes (slug,name,sort_order) values ('crystal','Crystal PvP',1),('axe','Axe PvP',2),('sword','Sword PvP',3),('netherite-pot','Netherite Pot',4),('diamond-pot','Diamond Pot',5),('smp','SMP PvP',6),('uhc','UHC',7),('mace','Mace PvP',8);
