import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
} from 'typeorm';
import * as argon2 from 'argon2';

// Local files
import { ProfileEntity } from './profile.entity';
import { NoteEntity } from './note.entity';
import { RolesEnum } from '../Enums/roles.enums';
import { SessionTokenEntity } from './session-token.entity';
import { ResetPasswordEntity } from './reset-password.entity';

@Entity('users')
export class UserEntity {
	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'string', length: 80, unique: true })
	email: string;

	@Column({ type: 'text' })
	password: string;

	@Column({ type: 'enum', enum: Object.values(RolesEnum) })
	role: RolesEnum;

	@Column({ type: 'boolean', default: false })
	is_banned: boolean;

	@Column({ type: 'date', nullable: true })
	last_login: Date;

	@CreateDateColumn('date')
	created_at: Date;

	@UpdateDateColumn('date')
	updated_at: Date;

	@BeforeInsert()
	async hashPassword() {
		this.password = await argon2.hash(this.password);
	}

	//--------------------  Relationship  --------------------

	@OneToOne(() => ProfileEntity, (profile) => profile.userData)
	profileData?: ProfileEntity;

	@OneToMany(() => NoteEntity, (note) => note.userData)
	noteData?: NoteEntity[];

	@OneToOne(() => SessionTokenEntity, (session) => session.userData)
	sessionTokenData?: SessionTokenEntity;

	@OneToMany(() => ResetPasswordEntity, (reset) => reset.userData)
	resetPasswordData?: ResetPasswordEntity[];
}
