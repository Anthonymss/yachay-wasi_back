import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Volunteer } from 'src/modules/volunteer/entities/volunteer.entity';
import { Schedule, DAY } from 'src/modules/volunteer/entities/schedule.entity';
import {
  TYPE_IDENTIFICATION,
  TYPE_VOLUNTEER,
  InfoSource,
  SchoolGrades,
  QuechuaLevel,
  ProgramsUniversity,
  StatusVolunteer,
} from 'src/modules/volunteer/entities/volunteer.entity';

@Injectable()
export class VolunteerSeeder {
  private readonly log = new Logger(VolunteerSeeder.name);

  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  /**
   * @param quantityStaff
   * @param quantityAdviser
   */
  async seedDynamic(
    quantityStaff: number,
    quantityAdviser: number,
  ): Promise<Volunteer[]> {
    try {
      const staff = await this.createVolunteers(
        quantityStaff,
        TYPE_VOLUNTEER.STAFF,
      );
      const advisers = await this.createVolunteers(
        quantityAdviser,
        TYPE_VOLUNTEER.ADVISER,
      );

      const allVolunteers = [...staff, ...advisers];

      await this.volunteerRepository.save(allVolunteers);
      this.log.log(
        `Se han creado ${staff.length} STAFF y ${advisers.length} ADVISER`,
      );

      return allVolunteers;
    } catch (error) {
      this.log.error('Error al crear los voluntarios', error);
      throw error;
    }
  }

  private async createVolunteers(
    count: number,
    type: TYPE_VOLUNTEER,
  ): Promise<Volunteer[]> {
    const volunteers: Volunteer[] = [];

    for (let i = 0; i < count; i++) {
      const volunteer = new Volunteer();
      volunteer.name = faker.person.firstName();
      volunteer.lastName = faker.person.lastName();
      volunteer.birthDate = new Date(
        faker.date.past({ years: 40 }),
      ).toISOString();
      volunteer.phoneNumber = faker.phone.number();
      volunteer.email = faker.internet.email({
        firstName: volunteer.name,
        lastName: volunteer.lastName,
        provider: 'gmail.com',
        allowSpecialCharacters: true,
      });
      volunteer.typeIdentification = faker.helpers.arrayElement(
        Object.values(TYPE_IDENTIFICATION),
      );
      volunteer.numIdentification =
        volunteer.typeIdentification === TYPE_IDENTIFICATION.DNI
          ? faker.string.numeric(8)
          : faker.string.numeric(10);
      volunteer.isVoluntary = false;
      volunteer.wasVoluntary = false;

      volunteer.cvUrl =
        'https://res.cloudinary.com/dnupey6af/raw/upload/v1751524148/yw/documents/CV_Valeria_Torres_Ramirez.pdf';


      volunteer.datePostulation = faker.date.between({
        from: '2025-01-01',
        to: new Date(),
      });
      volunteer.programsUniversity = faker.helpers.arrayElement(
        Object.values(ProgramsUniversity),
      );
      volunteer.volunteerMotivation = faker.lorem.paragraph();
      volunteer.typeVolunteer = type;
      volunteer.callingPlan = faker.datatype.boolean();
      volunteer.howDidYouFindUs = faker.helpers.arrayElement(
        Object.values(InfoSource),
      );
      
      volunteer.idPostulationArea = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      volunteer.statusVolunteer =  StatusVolunteer.PENDING;
      //      volunteer.statusVolunteer = faker.helpers.arrayElement(Object.values(StatusVolunteer));

      volunteer.isVoluntary = false;

      if (type === TYPE_VOLUNTEER.ADVISER) {
        volunteer.advisoryCapacity = faker.number.int({ min: 1, max: 10 });
        volunteer.schoolGrades = faker.helpers.arrayElement(
          Object.values(SchoolGrades),
        );
        volunteer.quechuaLevel = faker.helpers.arrayElement(
          Object.values(QuechuaLevel),
        );
        volunteer.videoUrl =
        'https://res.cloudinary.com/dnupey6af/video/upload/v1750925681/yw/videos/pr1.mp4';
        volunteer.schedules = this.createSchedules(volunteer, 3);
      }

      volunteers.push(volunteer);
    }

    return volunteers;
  }

  private createSchedules(volunteer: Volunteer, count: number): Schedule[] {
    const schedules: Schedule[] = [];

    for (let i = 0; i < count; i++) {
      const schedule = new Schedule();
      schedule.dayOfWeek = faker.helpers.arrayElement(Object.values(DAY));
      schedule.period_time = '8-12';
      schedule.period_time2 = '13-17';
      schedule.period_time3 = '18-22';
      schedule.volunteer = volunteer;

      schedules.push(schedule);
    }

    return schedules;
  }
}
