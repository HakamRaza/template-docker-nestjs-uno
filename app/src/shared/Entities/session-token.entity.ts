import {
	Entity,
	Column,
	CreateDateColumn,
	OneToOne,
	JoinColumn,
	PrimaryColumn,
} from 'typeorm';

// Local files
import { UserEntity } from './user.entity';

@Entity('session_tokens')
export class SessionTokenEntity {
	constructor(partial: Partial<SessionTokenEntity>) {
		Object.assign(this, partial);
	}

	@PrimaryColumn({ type: 'char', length: 20 })
	token: string;

	@Column({ type: 'bigint', unique: true })
	user_id: number;

	@Column({ type: 'timestamptz', precision: 3, nullable: true })
	last_use_at: Date;

	@CreateDateColumn({type: 'timestamptz', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)'})
	created_at: Date;

	//--------------------  Relationship  --------------------

	@OneToOne(() => UserEntity, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	userData: UserEntity;
}
