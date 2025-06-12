import { InfoSource, TYPE_IDENTIFICATION, TYPE_VOLUNTEER } from "../entities/volunteer.entity";
import { Schedule } from '../entities/schedule.entity';

export class VolunteerResponseDto {
  id: number;
  name: string;
  lastName: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  typeVolunteer: TYPE_VOLUNTEER;
  typeIdentification: TYPE_IDENTIFICATION;
  numIdentification: string;
  wasVoluntary: boolean;
  cvUrl: string;
  videoUrl?: string;
  datePostulation: Date;
  volunteerMotivation: string;
  howDidYouFindUs: InfoSource;
  schedules?: Schedule[];
  advisoryCapacity?: number;
  namePostulationArea: string;

}
