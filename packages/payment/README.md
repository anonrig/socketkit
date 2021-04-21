# Socketkit Services - payment

Initialize the database:

    psql < db/globals.sql
    psql -1 store < db/schema/*

Use "npm" to develop::

    npm install
    npm run dev

Packages:

![stripe package response](https://cleanshot-cloud-fra.s3.eu-central-1.amazonaws.com/media/13752/uOx1jO1WMJmrpQp2yfxl4hj9Sqt7MAiehghGuDaq.jpeg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED0aDGV1LWNlbnRyYWwtMSJHMEUCIQDSzru405%2BDKx5jJ6cB8kpzt0jgXWZv7eIxsxU7pB36gAIgcg2Z7s2QZKoVoW0p%2FQmIvb5uBs97zsrURu4rL5sd2N4q4gEIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MTk1MTQ0OTE2NzQiDEwGvoECbxgm5iZ7jSq2AUZLcT0W%2B7MpSNfud1Z8nLhUtoz82GGF9nhS5RYzLrjbwnMUhB6XTpaM7ycIy72sOeBpxH7cqCo3orHil1rKGIfK9deJlTe8taZr%2BHksami%2B6uka%2Bwdhpp%2BkqST50E7aDDXj7%2BGaRgYx1%2F0%2Ftu6LzT8sARzUiutd1ClrxpFABm5Ds%2BmmOkbphrbZe3gnZGvkSIb%2B7b5ynvjPo604ALfPCW6t7n%2FXE%2BLXp1ew9fzpnvP29ExdsYMVMLS3gIQGOuAB5XedeT3ukfj%2FW4CmMYCfDkPH%2Br30V6DV4QrdGMqanYcdMEzN4SPFmpmunxpMn6ZuPDEKlSrF9ZnHtBhOlsAmkbYZf1ijOjWCmBBvo%2BTOGdXV5KQB9M6cu%2BDPwNKj9GDMpU2jFbDOrc%2FY%2B8xB%2BbpYHthb4H6TDRhtDex7vZ5CdDsS%2FBSi%2FLUJGqqevdAnSLa9PoOB9EpRUaW5lCl61KGuO9vt2opID6n0ilxiPlXZxZcn0bR05ZbYHsHxx0SlujeMLZPxP%2B%2FEWeu8Z9k%2BHqp%2Bk35DJo66sqgD7JbZw7N1Wmc%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA5MF2VVMNNUA2GTVU%2F20210421%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20210421T134341Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=7d197510b0857710df659109cefe7bedf2c5715e857d3dbd70d04498a5c9d4b9)

How subscriptions work? https://stripe.com/docs/billing/subscriptions/overview#succeeded
