/**
* Databases tables initialization
*/

create table if not exists `association`
(
    `asso_id` SMALLINT not null auto_increment primary key,
    `name` varchar(64) character set utf8 not null,
    `description` varchar(512) character set utf8,
    `icon` varchar(10)
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
    `password` varchar(128) character set utf8,
    `status` TINYINT not null,
    `user_data` json not null
);

create table if not exists `associations_user_role`
(
    `user_id` varchar(30) not null,
    foreign key (`user_id`) references `user`(`user_id`) on delete cascade on update cascade,
    `asso_id` SMALLINT not null,
    foreign key (`asso_id`) references `association`(`asso_id`) on delete cascade on update cascade,
    primary key (`user_id`, `asso_id`),
    `role` TINYINT not null
);

create table if not exists `delegates`
(
    `user_id` varchar(30) not null primary key,
    `class` varchar(10),
    foreign key (`user_id`) references `user`(`user_id`) on delete cascade on update cascade
);

create table if not exists `form`
(
    `form_id` int not null auto_increment primary key,
    `user_id` varchar(30) not null,
    foreign key (`user_id`) references `user` (`user_id`) on delete cascade on update cascade,
    `guild_id` varchar(30) not null,
    foreign key (`guild_id`) references `guild` (`guild_id`) on delete cascade on update cascade,
    `channel_id` varchar(30) not null,
    `status` TINYINT not null,
    `verification_code` varchar(6),
    `fields` json
);

create table if not exists `user_guild_status`
(
    `user_id` varchar(30) not null,
    foreign key (`user_id`) references `user` (`user_id`) on delete cascade on update cascade,
    `guild_id` varchar(30) not null,
    foreign key (`guild_id`) references `guild` (`guild_id`) on delete cascade on update cascade,
    primary key (`user_id`, `guild_id`),
    `status` TINYINT not null,
    `form_id` int,
    foreign key (`form_id`) references `form` (`form_id`) on delete cascade on update cascade
);

create table if not exists `reset`
(
    `user_id` varchar(30) not null,
    primary key (`user_id`)
);

create table if not exists `indexed_channel`
(
    `channel_id` varchar(30) not null primary key,
    `guild_id` varchar(30) not null,
    foreign key (`guild_id`) references `guild` (`guild_id`) on delete cascade on update cascade,
    `indexMessage` varchar(1000) not null
);

drop table if exists `asso_roles`;