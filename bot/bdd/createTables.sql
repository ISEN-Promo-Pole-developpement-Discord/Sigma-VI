create table if not exists `association`
(
    `asso_id` int not null auto_increment primary key,
    `name` varchar(64) character set utf8 not null,
    `description` varchar(512) character set utf8
);

create table if not exists `guild`
(
    `guild_id` varchar(30) not null primary key,
    `config` json not null
);

create table if not exists `user`
(
    `user_id` varchar(30) not null primary key,
    `name` varchar(64) character set utf8,
    `surname` varchar(64) character set utf8,
    `email` varchar(128) character set utf8,
    `status` int not null,
    `user_data` json not null
);

create table if not exists `asso_roles`
(
    user_id varchar(30) not null,
    asso_id int not null,
    status int not null,
    primary key (user_id, asso_id),
    constraint asso_roles_ibfk_1 foreign key (user_id) references user(user_id) on delete cascade on update cascade,
    constraint asso_roles_ibfk_2 foreign key (asso_id) references association(asso_id) on delete cascade on update cascade
);

create index if not exists user_id on asso_roles (user_id);
create index if not exists asso_id on asso_roles (asso_id);

create table if not exists delegates
(
    user_id varchar(30) not null primary key,
    class varchar(16) not null character set utf8,
    constraint delegates_ibfk_1 foreign key (user_id) references user (user_id) on delete cascade on update cascade,
);

create index if not exists user_id on delegates (user_id);

create table if not exists `form`
(
    `form_id` int not null auto_increment primary key,
    `user_id` varchar(30) not null,
    constraint `form_ibfk_2` foreign key (`user_id`) references `user` (`user_id`) on delete cascade on update cascade,
    `guild_id` varchar(30) not null,
    constraint `form_ibfk_2` foreign key (`guild_id`) references `guild` (`guild_id`) on delete cascade on update cascade,
    `channel_id` varchar(30) not null,
    `status` int not null
);

create index if not exists user_id on form(user_id);
create index if not exists guild_id on form (guild_id);

create table if not exists `user_guild_status`
(
    `user_id`  varchar(30) not null,
    constraint `user_guild_status_ibfk_1` foreign key (`user_id`) references `user` (`user_id`) on delete cascade on update cascade,
    `guild_id` varchar(30) not null,
    constraint `user_guild_status_ibfk_2` foreign key (`guild_id`) references `guild` (`guild_id`) on delete cascade on update cascade,
    primary key (`user_id`, `guild_id`),
    status int not null,
    `form_id` varchar(30),
    constraint `user_guild_status_ibfk_3` foreign key (`form_id`) references `form` (`form_id`) on delete cascade on update cascade,
);

create index if not exists user_id on user_guild_status (user_id);
create index if not exists guild_id on user_guild_status (guild_id);
create index if not exists form_id on user_guild_status (form_id);