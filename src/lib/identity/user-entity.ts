import { BaseEntity } from "@/lib/shared/base-entity";
import { ValidationError } from "@/lib/shared/validation-error";

export interface UserProps {
  id: number;
  clerkUserId: string;
  name: string;
  age: number;
  email: string;
  createdAt: Date;
}

export class UserEntity extends BaseEntity<number> {
  clerkUserId: string;
  name: string;
  age: number;
  email: string;
  createdAt: Date;

  private constructor(props: UserProps) {
    super(props.id);
    this.clerkUserId = props.clerkUserId;
    this.name = props.name;
    this.age = props.age;
    this.email = props.email;
    this.createdAt = props.createdAt;
  }

  static create(props: UserProps): UserEntity {
    if (!props.clerkUserId.trim()) {
      throw new ValidationError("clerkUserId required");
    }
    if (!props.name.trim()) {
      throw new ValidationError("name required");
    }
    if (props.age < 0) {
      throw new ValidationError("age must be non-negative");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      throw new ValidationError("email invalid");
    }
    return new UserEntity(props);
  }
}
