create table selected_categories (
    category text,
    created_at timestamptz default now()
);

create view v_selected_categories as
    select *
    from (
        select distinct on (category) * from selected_categories
        order by category, created_at desc
    ) c
    order by created_at desc;
