import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const previews=sqliteTable('previews',{id:text('id').primaryKey(),owner:text('owner').notNull(),task:text('task'),status:text('status').notNull(),created:integer('created').notNull()});
export const events=sqliteTable('events',{id:text('id').primaryKey(),code:text('code').notNull().unique(),owner:text('owner').notNull(),payload:text('payload').notNull(),version:integer('version').notNull(),created:integer('created').notNull()});
export const media=sqliteTable('media',{id:text('id').primaryKey(),event:text('event').notNull(),owner:text('owner').notNull(),mime:text('mime').notNull()});
