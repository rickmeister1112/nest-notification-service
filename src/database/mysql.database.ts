import { DataSource } from 'typeorm';
import { UserNotificationMysql } from '../modules/user-notification/user-notification.entity';

export const MySQLDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: +process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'new_password',
  database: process.env.MYSQL_DB || 'sys',
  synchronize: true, // Automatically syncs DB schema
  logging: true,
  entities: [UserNotificationMysql], // Your entities go here
});
