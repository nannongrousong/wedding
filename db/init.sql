/* 奖品信息表 */
CREATE TABLE `tbl_award_info` (
  `award_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '奖品ID',
  `name` varchar(50) NOT NULL COMMENT '奖品名称',
  `count` smallint(5) unsigned NOT NULL COMMENT '奖品总数',
  `left` smallint(5) unsigned NOT NULL COMMENT '奖品剩余数量',
  `ratio` float unsigned NOT NULL DEFAULT '0' COMMENT '奖品抽中概率',
  `type` varchar(20) NOT NULL DEFAULT 'local' COMMENT '奖品类型，local表示用户自己抽奖，global表示全局抽奖',
  `icon` varchar(20) NOT NULL DEFAULT 'gift' COMMENT '前台显示图标',
  PRIMARY KEY (`award_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='奖品信息表'

/* 奖品记录表 */
CREATE TABLE `tbl_award_record` (
  `record_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `award_id` int(10) unsigned NOT NULL COMMENT '奖品ID',
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `award_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '奖品获得时间',
  `mark1` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='获奖记录表'

/* 弹幕信息表 */
CREATE TABLE `tbl_barrage_info` (
  `barrage_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '弹幕ID',
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `text` varchar(100) NOT NULL COMMENT '弹幕内容',
  PRIMARY KEY (`barrage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='弹幕信息表'

/* 签到信息表 */
CREATE TABLE `tbl_sign_info` (
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `sign_state` tinyint(4) NOT NULL DEFAULT '-1' COMMENT '签到状态\n-1-无状态\n0-我必须去\n1-我来不了\n2-我在现场',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='签到信息表'

/* 用户信息表 */
CREATE TABLE `tbl_user_info` (
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `nick_name` varchar(50) NOT NULL COMMENT '用户昵称',
  `portrait_url` varchar(500) NOT NULL COMMENT '头像地址',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表'