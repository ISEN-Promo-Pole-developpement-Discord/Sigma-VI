create table if not exists `guild`
(
    `guild_id` varchar(30) not null primary key,
    `config` json not null
);

create table if not exists `user`
(
    `user_id` varchar(30) not null primary key,
    `name` varchar(64) character set utf8,
    `surname` varchar(64) character set utf8 ,
    `status` int not null,
    `user_data` json not null
);

create table if not exists `form`
(
    `form_id` int not null auto_increment primary key,
    `user_id` varchar(30) not null,
    foreign key (`user_id`) references `user` (`user_id`) on delete cascade on update cascade,
    `guild_id` varchar(30) not null,
    foreign key (`guild_id`) references `guild` (`guild_id`) on delete cascade on update cascade,
    `channel_id` varchar(30) not null,
    `status` int not null
);

create table if not exists `user_guild_status`
(
    `user_id`  varchar(30) not null,
    foreign key (`user_id`) references `user` (`user_id`) on delete cascade on update cascade,
    `guild_id` varchar(30) not null,
    foreign key (`guild_id`) references `guild` (`guild_id`) on delete cascade on update cascade,
    primary key (`user_id`, `guild_id`),
    status int not null,
    `form_id` varchar(30)
);