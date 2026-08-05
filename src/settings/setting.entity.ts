import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export type SettingKey = 'billing' | 'bank';

export const SETTING_KEYS: SettingKey[] = ['billing', 'bank'];

@Entity()
export class Setting {
  @PrimaryColumn()
  key: SettingKey;

  @Column('jsonb')
  data: Record<string, unknown>;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
