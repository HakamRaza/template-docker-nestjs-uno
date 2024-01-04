import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

// local files
import { UserEntity } from './user.entity';

@Entity('reset_passwords')
export class ResetPasswordEntity {
	constructor(partial: Partial<ResetPasswordEntity>) {
		Object.assign(this, partial);
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'bigint' })
	user_id: number;

	@Column({ type: 'text' })
	hash: string;

	@CreateDateColumn({type: 'timestamptz', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)'})
	cts: Date;

	//--------------------  Relationship  --------------------

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'user_id' })
	userData: UserEntity;
}
