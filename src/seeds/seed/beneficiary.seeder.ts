import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Faker, faker } from '@faker-js/faker';

import {
  Beneficiary,
  Course,
  ModalityStudent,
  Parentesco,
  LearningLevel,
  CoursePriorityReason,
  CallSignalIssue,
  WorkshopPreference,
  Sex,
  EnrollmentStatus,
} from 'src/modules/beneficiary/entities/beneficiary.entity';
import { BeneficiaryLanguage, LANGUAGES } from 'src/modules/beneficiary/entities/beneficiary-languaje.entity';
import { BeneficiaryPreferredCourses, PREFERED_COURSES } from 'src/modules/beneficiary/entities/beneficiary-preferred-courses.entity';
import { AreaAdviser } from 'src/modules/area/entities/area-beneficiary/area-adviser.entity';
import { CommunicationPreference } from 'src/modules/beneficiary/entities/communication-preference.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DAY, Schedule } from 'src/modules/beneficiary/entities/schedule.entity';

@Injectable()
export class BeneficiarySeeder {
  private readonly log = new Logger(BeneficiarySeeder.name);

  constructor(
    @InjectRepository(Beneficiary)
    private readonly beneficiaryRepository: Repository<Beneficiary>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AreaAdviser)
    private readonly areaAdviserRepository: Repository<AreaAdviser>,

    @InjectRepository(CommunicationPreference)
    private readonly communicationPreferenceRepository: Repository<CommunicationPreference>,

    @InjectRepository(BeneficiaryLanguage)
    private readonly beneficiaryLanguageRepository: Repository<BeneficiaryLanguage>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async seedDynamic(quantity: number): Promise<Beneficiary[]> {
    try {
      const beneficiaries = await this.generateBeneficiariesData(quantity);

      const allLanguages = beneficiaries.flatMap(b => b.beneficiaryLanguage);
      const allSchedules = beneficiaries.flatMap(b => b.schedules);
      const allPreferences = beneficiaries.flatMap(b => b.communicationPreferences);
      const allPreferredCourses = beneficiaries.flatMap(b => b.beneficiaryPreferredCourses);

      await this.beneficiaryRepository.save(beneficiaries);
      await this.beneficiaryLanguageRepository.save(allLanguages);
      await this.scheduleRepository.save(allSchedules);
      await this.communicationPreferenceRepository.save(allPreferences);
      await this.beneficiaryRepository.manager.getRepository(BeneficiaryPreferredCourses).save(allPreferredCourses);

      this.log.log(`Se han creado ${beneficiaries.length} beneficiarios`);
      return beneficiaries;
    } catch (error) {
      this.log.error('Error al crear los beneficiarios', error);
      throw error;
    }
  }

  private async generateBeneficiariesData(count: number): Promise<Beneficiary[]> {
    const beneficiaries: Beneficiary[] = [];

    const users = await this.userRepository.find();
    const communicationPreferences = await this.communicationPreferenceRepository.find();
    const areaAdvisers = await this.areaAdviserRepository.findBy({ id: In([1, 2, 3]) });

    const workshopOptions = Object.values(WorkshopPreference);
    const courseOptions = Object.values(Course);
    const languageOptions = Object.values(LANGUAGES);
    const schoolSubjects = [
      "Matemáticas", "Ciencias Naturales", "Lengua y Literatura", "Historia",
      "Geografía", "Biología", "Química", "Física", "Educación Física", "Arte",
      "Música", "Informática", "Inglés", "Francés", "Valores Éticos", "Tecnología"
    ];
    
    for (let i = 0; i < count; i++) {
      const beneficiary = new Beneficiary();
      this.generateBasicInfo(beneficiary, i);

      beneficiary.beneficiaryPreferredCourses = this.createBeneficiaryPreferredCourses(beneficiary, 2, schoolSubjects);
      beneficiary.degree = faker.helpers.arrayElement(Object.values(['1ro Primaria', '2do Primaria', '3ro Primaria', '4to Primaria', '5to Primaria', '6to Primaria', '1ro Secundaria', '2do Secundaria', '3ro Secundaria', '4to Secundaria', '5to Secundaria']));
      beneficiary.areaAdvisers = faker.helpers.arrayElements(areaAdvisers, faker.number.int({ min: 1, max: 3 }));
      beneficiary.communicationPreferences = faker.helpers.arrayElements(communicationPreferences, 2);
      beneficiary.hoursAsesoria = faker.number.int({ min: 1, max: 10 });
      beneficiary.coursePriorityReason = faker.helpers.arrayElement(Object.values(CoursePriorityReason));
      beneficiary.enrollmentStatus = EnrollmentStatus.ENROLLED;
      beneficiary.phoneNumberMain = faker.string.numeric(9);
      beneficiary.cellphoneObservation = faker.lorem.sentence();
      beneficiary.isWhatsApp = faker.datatype.boolean();
      beneficiary.callSignalIssue = faker.helpers.arrayElement(Object.values(CallSignalIssue));
      beneficiary.fullNameContactEmergency = faker.person.fullName();
      beneficiary.phoneNumberContactEmergency = faker.string.numeric(9);
      beneficiary.fullNameContactEmergency2 = faker.person.fullName();
      beneficiary.phoneNumberContactEmergency2 = faker.string.numeric(9);

      beneficiary.allpaAdvisoryConsent = faker.datatype.boolean();
      beneficiary.allpaImageConsent = faker.datatype.boolean();
      beneficiary.ruruAdvisoryConsent = faker.datatype.boolean();
      beneficiary.additionalNotes = faker.lorem.paragraph();

      this.assignAreaLogic(beneficiary, workshopOptions, courseOptions);
      beneficiary.user = faker.helpers.arrayElement(users);
      beneficiary.schedules = this.createSchedules(beneficiary);
      beneficiary.beneficiaryLanguage = this.createLanguages(beneficiary, languageOptions);

      beneficiaries.push(beneficiary);
    }

    return beneficiaries;
  }

  private generateBasicInfo(beneficiary: Beneficiary, index: number): void {
    beneficiary.code = `${faker.helpers.arrayElement(['DI', 'GI', 'PD', 'AC', 'PS'])}${String(index + 1).padStart(3, '0')}`;
    beneficiary.name = faker.person.firstName();
    beneficiary.lastName = faker.person.lastName();
    beneficiary.dni = faker.string.numeric(8);
    beneficiary.institution = faker.company.name();
    beneficiary.modalityStudent = faker.helpers.arrayElement(Object.values(ModalityStudent));
    beneficiary.birthDate = faker.date.past().toISOString().split('T')[0];
    beneficiary.sex = faker.helpers.arrayElement(Object.values(Sex));
    beneficiary.parentesco = faker.helpers.arrayElement(Object.values(Parentesco));
    beneficiary.nameRepresentative = faker.person.firstName();
    beneficiary.lastNameRepresentative = faker.person.lastName();
    beneficiary.isAddGroupWspp = faker.datatype.boolean();
    beneficiary.isAddEquipment = faker.datatype.boolean();
    beneficiary.learningLevel = faker.helpers.arrayElement(Object.values(LearningLevel));
  }

  private assignAreaLogic(beneficiary: Beneficiary, workshopOptions: string[], courseOptions: string[]): void {
    if (beneficiary.areaAdvisers.some(a => a.name === 'Asesorías en Arte y Cultura')) {
      beneficiary.firstWorkshopChoice = faker.helpers.arrayElement(workshopOptions as WorkshopPreference[]);
      beneficiary.secondWorkshopChoice = faker.helpers.arrayElement(workshopOptions as WorkshopPreference[]);
      beneficiary.thirdWorkshopChoice = faker.helpers.arrayElement(workshopOptions as WorkshopPreference[]);
    }
    if (beneficiary.areaAdvisers.some(a => a.name === 'Asesorías a Colegios Nacionales')) {
      const [first, second] = faker.helpers.shuffle(courseOptions).slice(0, 2);
      beneficiary.firstCourseChoice = first as Course;
      beneficiary.secondCourseChoice = second as Course;
    }
  }

  private createSchedules(beneficiary: Beneficiary): Schedule[] {
    const uniqueDays = faker.helpers.shuffle(Object.values(DAY)).slice(0, 3);
    return uniqueDays.map(day => new Schedule({
      dayOfWeek: day,
      period_time: '8-12',
      period_time2: '13-17',
      period_time3: '18-22',
      beneficiary: beneficiary,
    }));
  }

  private createLanguages(beneficiary: Beneficiary, languageOptions: string[]): BeneficiaryLanguage[] {
    const uniqueLanguages = faker.helpers.shuffle(languageOptions).slice(0, 2);
    return uniqueLanguages.map(language => {
      const lang = new BeneficiaryLanguage();
      lang.language = language as LANGUAGES;
      lang.beneficiary = beneficiary;
      if (language === LANGUAGES.OTHER) {
        lang.customLanguageName = faker.helpers.arrayElement([
          'Francés', 'Alemán', 'Italiano', 'Portugues', 'Turco', 'Japonés', 'Coreano', 'Chino'
        ]);
      }
      return lang;
    });
  }

  private createBeneficiaryPreferredCourses(
    beneficiary: Beneficiary,
    count: number,
    schoolSubjects: string[]
  ): BeneficiaryPreferredCourses[] {
    const courses: BeneficiaryPreferredCourses[] = [];
    const courseOptions = Object.values(PREFERED_COURSES);

    for (let i = 0; i < count; i++) {
      const course = new BeneficiaryPreferredCourses();
      course.beneficiary = beneficiary;
      course.name = faker.helpers.arrayElement(courseOptions);
      if (course.name === PREFERED_COURSES.OTROS) {
        course.customCourseName = faker.helpers.arrayElement(schoolSubjects);
      }
      courses.push(course);
    }
    return courses;
  }
}
