-- Add 'nao_respondeu' status to client_status enum
alter type client_status add value if not exists 'nao_respondeu' after 'nao_chamado';
