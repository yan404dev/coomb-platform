import { Certification as PrismaCertification } from "@prisma/client";

export interface Certification extends PrismaCertification { }

export class CertificationEntity implements Certification {
  id!: string;
  resume_id!: string;
  name!: string;
  issuer!: string | null;
  date!: string | null;
  expiry_date!: string | null;
  created_at!: Date;
  updated_at!: Date;
}
