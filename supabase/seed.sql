update public.profiles p
set role = 'admin', name = '管理员'
from auth.users u
where p.id = u.id and u.email = 'admin@company.com';

update public.profiles p
set role = 'sales', name = '销售A'
from auth.users u
where p.id = u.id and u.email = 'sales1@company.com';

update public.profiles p
set role = 'sales', name = '销售B'
from auth.users u
where p.id = u.id and u.email = 'sales2@company.com';
