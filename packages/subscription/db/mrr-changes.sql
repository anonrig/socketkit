with c as (select t.client_id,
        coalesce(sum(t.base_developer_proceeds)
            filter (where t.event_date < '2020-12-15'), 0)
            as ltotal,
        coalesce(avg(t.base_developer_proceeds / ((t.event_date + s.subscription_duration)::date - t.event_date))
            filter (where t.event_date < '2020-12-15'), 0)
            as ldaily,
        coalesce(sum(t.base_developer_proceeds)
            filter (where t.event_date >= '2020-12-15'), 0)
            as ctotal,
        coalesce(avg(t.base_developer_proceeds / ((t.event_date + s.subscription_duration)::date - t.event_date))
            filter (where t.event_date >= '2020-12-15'), 0)
            as cdaily,
        0.01 as epsilon
    from client_transactions t
        join client_subscriptions s using (integration_id, subscription_package_id, client_id)
    where t.event_date >= '2020-12-01' and t.event_date < '2021-01-01'
    group by t.client_id)
select sum(ctotal)
            filter (where ldaily <= epsilon)
            as new,
        sum(ltotal)
            filter (where cdaily <= epsilon)
            as gone,
        sum(ctotal - ltotal)
            filter (where cdaily > ldaily + epsilon and ldaily > epsilon)
            as upsell,
        sum(ltotal - ctotal)
            filter (where ldaily > cdaily + epsilon and cdaily > epsilon)
            as downsell
    from c;
