-- Run AFTER creating a user via Supabase Auth. Replace <USER_ID> with your auth.users id.
-- Example: select id from auth.users limit 1;

do $$
declare
  uid  uuid := '<USER_ID>';  -- replace with your user id
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
  e1 uuid; e2 uuid; e3 uuid;
begin
  -- Editors
  insert into editors (name, initials, avatar_color) values
    ('Ana Lima',   'AL', '#38bdf8'),
    ('Bruno Reis', 'BR', '#9d8bff'),
    ('Carla Neto', 'CN', '#3ddc97')
  returning id into e1;
  select id into e2 from editors where name = 'Bruno Reis';
  select id into e3 from editors where name = 'Carla Neto';

  -- Clients
  insert into clients (user_id,name,company,niche,status,health_score,value_monthly,videos_per_month,contact,edit_style,tags,since,briefing) values
    (uid,'Lucas Mendes','LM Fitness','fitness','fechado',92,3500,12,'@lucasmendes','Dinâmico / rápido','{reels,ugc}','2024-01-15','Cores vibrantes, cortes rápidos. Referências: Alex Hormozi.')
  returning id into c1;
  insert into clients (user_id,name,company,niche,status,health_score,value_monthly,videos_per_month,contact,edit_style,tags,briefing) values
    (uid,'Carla Souza','CS Finanças','finanças','proposta',71,5000,8,'+55 11 99123-4567','Clean / minimalista','{vsl,long-form}','Visual clean, paleta azul e branco.')
  returning id into c2;
  insert into clients (user_id,name,niche,status,health_score,value_monthly,videos_per_month,contact,edit_style,tags) values
    (uid,'Rafael Costa','marketing digital','em_contato',58,2800,16,'@rafaelcosta.mkt','Reels / UGC','{reels}')
  returning id into c3;
  insert into clients (user_id,name,company,niche,status,health_score) values
    (uid,'Juliana Melo','JM Store','e-commerce','nao_chamado',30)
  returning id into c4;
  insert into clients (user_id,name,company,niche,status,health_score,value_monthly,videos_per_month,contact,edit_style,tags,since,briefing) values
    (uid,'Bruno Trader','BT Capital','finanças','fechado',88,4200,6,'@brunotrader','VSL / long-form','{vsl}','2024-02-28','Sóbrio, gráficos animados, seriedade.')
  returning id into c5;
  insert into clients (user_id,name,niche,status,health_score,value_monthly,videos_per_month,contact,edit_style,tags) values
    (uid,'Aline Saúde','saúde e bem-estar','perdido',15,1800,8,'+55 21 98765-4321','Clean / minimalista','{reels}')
  returning id into c6;

  -- Videos
  insert into videos (client_id,title,format,stage,editor_id,deadline) values
    (c1,'Reel Junho #1 — Treino Cardio','reel','editing',e1,'2024-06-14'),
    (c1,'UGC Suplemento — Depoimento','ugc','review',e2,'2024-06-12'),
    (c5,'VSL Curso Trader Pro','vsl','backlog',e1,'2024-06-20'),
    (c5,'Ad Bitcoin — Direto ao ponto','ad','approved',e3,'2024-06-10'),
    (c2,'VSL Renda Variável 2024','vsl','backlog',null,'2024-06-25'),
    (c1,'Reel Dieta Proteica','reel','delivered',e2,'2024-06-08');

  -- Tasks (due today)
  insert into tasks (client_id,title,due_date) values
    (c2,'Ligar para Carla — feedback proposta', current_date),
    (c3,'Enviar briefing para Rafael',          current_date);

  -- Activities
  insert into activities (client_id,type,description,created_at) values
    (c1,'status_change','Status alterado para Fechado',          now() - interval '2 days'),
    (c2,'call',         'Ligação realizada — interesse alto',    now() - interval '3 days'),
    (c5,'note',         'Revisão do VSL aprovada pelo cliente',  now() - interval '4 days'),
    (c3,'message',      'DM enviada no Instagram',               now() - interval '5 days'),
    (c1,'meeting',      'Reunião mensal de alinhamento',         now() - interval '6 days');
end;
$$;
