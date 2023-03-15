| API Endpoint              | Method | Role                                  |
| ------------------------- | ------ | ------------------------------------- |
| /v1/role                  | POST   | -                                     |
| /v1/role                  | GET    | -                                     |
| /v1/auth/signup           | POST   | -                                     |
| /v1/auth/signin           | POST   | -                                     |
| /v1/auth/me               | GET    | -                                     |
| /v1/community             | POST   | -                                     |
| /v1/community             | GET    | -                                     |
| /v1/community/:id/members | GET    | Community Admin / Community Moderator |
| /v1/community/me/owner    | GET    | -                                     |
| /v1/community/me/member   | GET    | -                                     |
| /v1/member                | POST   | Community Admin                       |
| /v1/member/:id            | DELETE | Community Admin / Community Moderator |

| Data Schema           | Fields                                        |
| --------------------- | --------------------------------------------- |
| User (user)           | id, name, email, password, created_at         |
| Community (community) | id, name, slug, owner, created_at, updated_at |
| Role (role)           | id, name, created_at, updated_at              |
| Member (member)       | id, community, user, role, created_at         |

---

---

| Schema    | Field      | Description                                      | Type      | Length |
| --------- | ---------- | ------------------------------------------------ | --------- | ------ |
| User      | id         | Unique identifier for a user                     | Snowflake | 18     |
| User      | name       | Name of the user                                 | Varchar   | 64     |
| User      | email      | Email of the user                                | Varchar   | 128    |
| User      | password   | Password of the user                             | Varchar   | 64     |
| User      | created_at | Timestamp of when the user was created           | Datetime  | -      |
| Community | id         | Unique identifier for a community                | Snowflake | 18     |
| Community | name       | Name of the community                            | Varchar   | 128    |
| Community | slug       | Unique URL-friendly identifier for a community   | Varchar   | 255    |
| Community | owner      | User ID of the owner of the community            | Snowflake | 18     |
| Community | created_at | Timestamp of when the community was created      | Datetime  | -      |
| Community | updated_at | Timestamp of when the community was last updated | Datetime  | -      |
| Role      | id         | Unique identifier for a role                     | Snowflake | 18     |
| Role      | name       | Name of the role                                 | Varchar   | 64     |
| Role      | created_at | Timestamp of when the role was created           | Datetime  | -      |
| Role      | updated_at | Timestamp of when the role was last updated      | Datetime  | -      |
| Member    | id         | Unique identifier for a member                   | Snowflake | 18     |
| Member    | community  | ID of the community the member belongs to        | Snowflake | 18     |
| Member    | user       | ID of the user who is a member                   | Snowflake | 18     |
| Member    | role       | ID of the role of the member                     | Snowflake | 18     |
| Member    | created_at | Timestamp of when the member was created         | Datetime  | -      |

| --------- | ---------- | ------------------------------------------------ | --------- | ------ |
