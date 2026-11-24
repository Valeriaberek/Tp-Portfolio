-- Export en lecture seule de la structure et des droits des tables du portfolio.
-- Le resultat est un seul bloc de texte JSON a copier, sans contenu des lignes.

with portfolio_tables as (
  select c.oid, c.relname, c.relrowsecurity
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p')
    and c.relname in ('articles', 'pages', 'projects', 'skills', 'project_skills')
)
select jsonb_pretty(
  coalesce(jsonb_agg(
    jsonb_build_object(
      'table', t.relname,
      'rls_enabled', t.relrowsecurity,
      'columns', (
        select jsonb_agg(jsonb_build_object(
          'name', col.column_name,
          'type', col.data_type,
          'postgres_type', col.udt_name,
          'nullable', col.is_nullable,
          'default', col.column_default
        ) order by col.ordinal_position)
        from information_schema.columns col
        where col.table_schema = 'public' and col.table_name = t.relname
      ),
      'constraints', coalesce((
        select jsonb_agg(jsonb_build_object(
          'name', k.conname,
          'definition', pg_get_constraintdef(k.oid)
        ) order by k.conname)
        from pg_constraint k
        where k.conrelid = t.oid and k.contype in ('p', 'u', 'f', 'c')
      ), '[]'::jsonb),
      'policies', coalesce((
        select jsonb_agg(jsonb_build_object(
          'name', p.policyname,
          'roles', p.roles,
          'command', p.cmd,
          'permissive', p.permissive,
          'using', p.qual,
          'with_check', p.with_check
        ) order by p.policyname)
        from pg_policies p
        where p.schemaname = 'public' and p.tablename = t.relname
      ), '[]'::jsonb),
      'grants', coalesce((
        select jsonb_agg(jsonb_build_object(
          'role', g.grantee,
          'privilege', g.privilege_type
        ) order by g.grantee, g.privilege_type)
        from information_schema.table_privileges g
        where g.table_schema = 'public' and g.table_name = t.relname
          and g.grantee in ('anon', 'authenticated', 'PUBLIC')
      ), '[]'::jsonb)
    ) order by t.relname
  ), '[]'::jsonb)
) as schema_portfolio
from portfolio_tables t;
