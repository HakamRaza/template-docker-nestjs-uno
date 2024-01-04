import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
} from 'typeorm';

// Local files
import { UserEntity } from './user.entity';

@Entity('notes')
export class NoteEntity {
	constructor(partial: Partial<NoteEntity>) {
		Object.assign(this, partial);
	}

	@PrimaryColumn({ type: 'bigint' })
	id: number;

	@Column({ type: 'bigint' })
	user_id: number;

	@Column({ type: 'string', length: 100 })
	title: string;

	@Column({ type: 'string' })
	description: string;

	@CreateDateColumn('date')
	created_at: Date;

	@UpdateDateColumn('date')
	updated_at: Date;

	//--------------------  Relationship  --------------------

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'user_id' })
	userData: UserEntity;
}
