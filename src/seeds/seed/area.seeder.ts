import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaStaff } from 'src/modules/area/entities/area-volunteer/area-staff.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer, QuestionType } from 'src/modules/area/entities/area-volunteer/question-volunteer.entity';
import { AreaAdviser } from 'src/modules/area/entities/area-beneficiary/area-adviser.entity';

@Injectable()
export class AreaSeeder {
  private readonly log = new Logger('Seeder');

  constructor(
    @InjectRepository(AreaStaff)
    private readonly areaStaffRepository: Repository<AreaStaff>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository: Repository<SubArea>,
    @InjectRepository(QuestionVolunteer)
    private readonly questionsVolunteersRepository: Repository<QuestionVolunteer>,
    @InjectRepository(AreaAdviser)
    private readonly areaAdviserRepository: Repository<AreaAdviser>,
  ) { }

  async seed() {
    const areasData = [
      {
        key: 'area1',
        name: 'Talento & Desarrollo Organizacional',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955835/talento-humano-exito-organizacional-min_a5tf4m.jpg',
        description:
          'Fomentamos el crecimiento profesional y humano dentro de la organización, a través del desarrollo de habilidades, liderazgo y cultura de aprendizaje continuo.',
      },
      {
        key: 'area2',
        name: 'Cultura & Comunicación Interna',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955920/post-ayrton-1024x512_k0melf.png',
        description:
          'Promovemos una comunicación efectiva y una cultura organizacional sólida, donde cada voz es escuchada y valorada.',
      },
      {
        key: 'area3',
        name: 'Imagen Institucional & Relaciones Públicas',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955465/2e7c148c-cecc-4c60-8ca2-91107ea2d572.png',
        description:
          'Gestionamos la identidad y reputación de la organización, generando vínculos estratégicos con el entorno y proyectando una imagen coherente y positiva.',
      },
      {
        key: 'area4',
        name: 'Alianzas Organizacionales',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955333/ff7ce3f6-d375-4e9f-9aee-5fc018ff71aa.png',
        description:
          'Construimos redes de colaboración que potencian el impacto de nuestras acciones a través de relaciones institucionales sólidas y sinérgicas.',
      },
      {
        key: 'area5',
        name: 'Convenios & Patrocinios Estratégicos',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955384/4c521674-b5fe-4a04-b55a-a0bdbbc92478.png',
        description:
          'Impulsamos el desarrollo de proyectos mediante convenios y patrocinios que aportan valor compartido y fortalecen nuestra sostenibilidad.',
      },
      {
        key: 'area6',
        name: 'Marketing & Contenidos',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955432/28e147cb-86b2-4181-85ce-15f82ac6a144.png',
        description:
          'Creamos estrategias y contenidos creativos que conectan con nuestra comunidad, generando impacto e identidad de marca.',
      },
      {
        key: 'area7',
        name: 'Arte & Cultura',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955345/529d6cd7-69fd-49b4-ba77-bff8431ea233.png',
        description:
          'Promovemos el arte y la cultura como medios de expresión, inclusión y transformación social en nuestras comunidades.',
      },
      {
        key: 'area8',
        name: 'Asesoría a Colegios Nacionales',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955339/d669e3dd-7d80-4ea0-89b2-7771dbe0bbd6.png',
        description:
          'Acompañamos a instituciones educativas en la mejora de sus procesos pedagógicos y organizacionales, contribuyendo a una educación más equitativa y de calidad.',
      },
      {
        key: 'area9',
        name: 'Bienestar Psicológicos',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955379/7a59f593-ef46-4ea4-b942-58a8afb5948b.png',
        description:
          'Cuidamos la salud mental y emocional de nuestra comunidad a través de estrategias de acompañamiento, prevención y orientación psicológica.',
      },
      {
        key: 'area10',
        name: 'Gestión de Comunidades',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955418/39528eb3-211a-4bdd-b69f-07d177d00d68.png',
        description:
          'Fortalecemos el vínculo con nuestras comunidades mediante el trabajo participativo, el diálogo y la co-creación de soluciones sostenibles.',
      },
      {
        key: 'area11',
        name: 'Innovación & Calidad',
        imageUrl:
          'https://res.cloudinary.com/dnupey6af/image/upload/v1750955350/0cee7a1e-267a-47a6-9beb-bf807d65c5e1.png',
        description:
          'Impulsamos la mejora continua, la creatividad y la innovación en cada uno de nuestros procesos para lograr un impacto significativo y medible.',
      },
      {
        key: 'area12',
        name: 'ASESORIES',
        description: 'Contiene Áreas de asesoría especializadas que brindan soporte a instituciones y comunidades educativas.',
      },
    ];


    const areaMap: Record<string, AreaStaff> = {};

    for (const { key, name, description, imageUrl } of areasData) {
      let area = await this.areaStaffRepository.findOne({ where: { name } });

      if (area) {
        area.description = description;
        area.isActive = true;
      } else {
        area = this.areaStaffRepository.create({
          name,
          description,
          isActive: true,
          imageUrl,
        });
      }

      areaMap[key] = await this.areaStaffRepository.save(area);
    }

    // 2. Sembrar SubAreas y mapear las que tienen 'key'
    const subAreasData = [
      {
        "name": "Subcoordinador/a de Talento & Desarrollo Organizacional",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area1"
      },
      {
        "name": "Líder de Atracción de Talento",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area1"
      },
      {
        "name": "Analista/Asistente de Atracción de Talento",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area1"
      },
      {
        "name": "Líder de Formación & Competencias",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area1"
      },
      {
        "name": "Analista/Asistente de Formación & Competencias",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area1"
      },
      {
        "name": "Analista/Asistente de Talento & Desempeño ",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area1"
      },
      {
        "name": "Subcoordinador/a de Cultura & Comunicación Interna",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area2"
      },
      {
        "name": "Líder de Bienestar",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area2"
      },
      {
        "name": "Analista/Asistente de Bienestar",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area2"
      },
      {
        "name": "Líder de Comunicación Interna",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area2"
      },
      {
        "name": "Analista/Asistente de Comunicación Interna",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area2"
      },
      {
        "name": "Analista de Imagen y RR.PP.",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area3"
      },
      {
        "name": "Líder de Concursos & Fondos",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area4"
      },
      {
        "name": "Analista/Asistente de Concursos & Fondos",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area4"
      },
      {
        "name": "Líder de Proyectos de Alianzas",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area4"
      },
      {
        "name": "Líder de Convenios",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area5"
      },
      {
        "name": "Analista/Asistente de Convenios",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area5"
      },
      {
        "name": "Líder de Donaciones Individuales",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area5"
      },
      {
        "name": "Analista/Asistente de Donaciones Individuales",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area5"
      },
      {
        "name": "Community Manager",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area6"
      },
      {
        "name": "Diseñador/a Gráfico/a",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area6"
      },
      {
        "name": "Editor/a de Contenidos Audiovisuales",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area6"
      },
      {
        "name": "Integrante de Clima Interno & Pedagogía",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area7"
      },
      {
        "name": "Subcoordinador/a de Asesoría a Colegios Nacionales",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area8"
      },
      {
        "name": "Integrante de Análisis de Datos",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area8"
      },
      {
        "name": "Líder de Clima Interno & Pedagogía",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area8"
      },
      {
        "name": "Integrante de Clima Interno & Pedagogía",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area8"
      },
      {
        "name": "Yaku Guía",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area8"
      },
      {
        "name": "Líder de Análisis de Datos",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Líder de Acompañamiento Continuo",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Co-líder de Acompañamiento Continuo",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Gestor/a de Casos-Rurus",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Líder de Asesorías Psicoeducativas",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Co-líder de Asesorías Psicoeducativas",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Co-líder de Gestión del Ruru",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Facilitador/a Psicoeducativo/a",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Yaku Guía-Bienestar",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Líder de Escuela a Padres",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Co-líder de Escuela a Padres",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Facilitador/a de Talleres",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "name": "Líder de Análisis e Informes",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area10"
      },
      {
        "name": "Analista/Asistente de Informes",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area10"
      },
      {
        "name": "Líder de Estrategias Comunitarias",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area10"
      },
      {
        "name": "Líder de Desarrollo de Productos",
        "description": "agregar descripcion",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area11"
      },
      {
        "name": "Desarrollador/a API",
        "description": "agregar descripcion",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area11"
      },
      {
        "name": "Desarrollador/a Backend",
        "description": "agregar descripcion",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area11"
      },
      {
        "name": "Desarrollador/a Frontend",
        "description": "agregar descripcion",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area11"
      },
      {
        "name": "Ingeniero/a de Infraestructura Cloud",
        "description": "agregar descripcion",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area11"
      },
      {
        "name": "Analista de Gobierno de Datos",
        "description": "agregar descripcion",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area11"
      },
      {
        "name": "Líder de Mejora Continua",
        "description": "agregar descripcion",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area11"
      },
      {
        "name": "\"Yaku bienestar\": Facilitador psicoeducativo",
        "description": "Por definir",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area9"
      },
      {
        "key": "subarea61",
        "name": "Acompañamiento para el Bienestar Psicológico",
        "description": "Área dedicada al apoyo emocional y psicológico de los beneficiarios",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area12"
      },
      {
        "key": "subarea62",
        "name": "Asesorías a Colegios Nacionales",
        "description": "Área enfocada en brindar apoyo académico a estudiantes de colegios nacionales",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area12"
      },
      {
        "key": "subarea63",
        "name": "Asesorías en Arte y Cultura",
        "description": "Área dedicada a promover el desarrollo artístico y cultural",
        "is_active": true,
        "volunteerTime": "6 a 10 horas semanales",
        "functions": "Apoyar en las funciones principales del área respectiva.",
        "knowledgeAndStudies": "Estudios universitarios o técnicos relacionados al área.",
        "technologicalSkills": "Google Workspace, herramientas colaborativas.",
        "additionalKnowledge": "Conocimientos complementarios en el área asignada.",
        "communicationSkills": "Trabajo en equipo, comunicación efectiva, proactividad.",
        "experience": "Deseable experiencia previa en funciones similares.",
        "area_staff_id": "area12"
      }
    ]

    const subAreaMap: Record<string, SubArea> = {};
    for (const data of subAreasData) {
      // Usamos el `area_staff_id` de tus datos para encontrar el padre
      const parentArea = areaMap[data.area_staff_id];
      if (!parentArea) {
        this.log.warn(`No se encontró el área padre con la clave "${data.area_staff_id}" para la sub-área "${data.name}".`);
        continue;
      }
      
      // Creamos el objeto de datos para la sub-área, excluyendo la clave de relación
      const { area_staff_id, key, ...subAreaData } = data;

      // Convertimos el campo 'experience' a booleano
      const experienceAsBoolean = typeof subAreaData.experience === 'string' && subAreaData.experience.toLowerCase().includes('deseable');

      let subArea = await this.subAreaRepository.findOne({ where: { name: subAreaData.name, areaStaff: { id: parentArea.id } } });
      
      const dataToSave = {
        ...subAreaData,
        areaStaff: parentArea,
      };

      if (subArea) {
        // Si existe, lo actualizamos
        Object.assign(subArea, dataToSave);
      } else {
        // Si no existe, lo creamos
        subArea = this.subAreaRepository.create(dataToSave);
      }

      const savedSubArea = await this.subAreaRepository.save(subArea);

      // Si la sub-área tiene una 'key', la guardamos para usarla después
      if (key) {
        subAreaMap[key] = savedSubArea;
      }
    }
    this.log.log('✓ Sub-Áreas sembradas.');



    this.log.log('🌱 Sembrando Preguntas Específicas (QuestionsVolunteers)...');

    const questionsData = [
      { questionText: '¿Cuántos beneficiarios puedes asesorar considerando que cada uno requiere 2-3 horas a la semana de dedicación?', type: 'RADIO', subareaKey: 'subarea63' },
      { questionText: 'Video Postulación (máx. 2 minutos)', type: 'FILE_UPLOAD', subareaKey: 'subarea63' },
      { questionText: '¿En qué taller dentro del área te gustaría colaborar?', type: 'SELECT', subareaKey: 'subarea63' },
      { questionText: '¿Tienes formación académica o experiencia en psicología o áreas afines?', type: 'RADIO', subareaKey: 'subarea61' },
      { questionText: 'Video Postulación (máx. 2 minutos)', type: 'FILE_UPLOAD', subareaKey: 'subarea61' },
      { questionText: '¿En qué puesto dentro del área te gustaría colaborar?', type: 'RADIO', subareaKey: 'subarea61' },
      { questionText: 'Video o Carta de Motivación', type: 'FILE_UPLOAD', subareaKey: 'subarea62' },
      { questionText: '¿En qué asignaturas te gustaría colaborar como asesor/a?', type: 'CHECKBOX', subareaKey: 'subarea62' },
    ];

    for (const questionItem of questionsData) {
      const { questionText, type, subareaKey } = questionItem;

      const parentSubArea = subAreaMap[subareaKey];
      if (!parentSubArea) {
        this.log.warn(`No se encontró la sub-área con clave "${subareaKey}" para la pregunta "${questionText}".`);
        continue;
      }

      let question = await this.questionsVolunteersRepository.findOne({
        where: { questionText, SubArea: { id: parentSubArea.id } }
      });

      if (!question) {
        //this.log.log(`Creando pregunta: "${questionText}"`);
        question = this.questionsVolunteersRepository.create({
          questionText: questionText,
          SubArea: parentSubArea,
          type: type as QuestionType,
        });
      } else {
        //this.log.log(`Actualizando pregunta: "${questionText}"`);
        question.type = type as QuestionType;
      }

      await this.questionsVolunteersRepository.save(question);
    }

    this.log.log('✓ QuestionsVolunteers sembradas.');
    const areaAdvisersData = [
      { name: 'Acompañamiento para el Bienestar Psicológico', description: "Área dedicada al apoyo emocional y psicológico de los beneficiarios" },
      { name: 'Asesorías a Colegios Nacionales', description: "Área enfocada en brindar apoyo académico a estudiantes de colegios nacionales" },
      { name: 'Asesorías en Arte y Cultura', description: "Área dedicada a promover el desarrollo artístico y cultural" },
    ];

    for (const { name, description } of areaAdvisersData) {
      let areaAdviser = await this.areaAdviserRepository.findOne({ where: { name } });

      if (!areaAdviser) {
        this.log.log(`Creando área de asesoría: "${name}"`);
        areaAdviser = this.areaAdviserRepository.create({
          name,
          description,
          isActive: true,
        });
      } else {
        this.log.log(`Actualizando área de asesoría: "${name}"`);
        areaAdviser.description = description;
      }

      await this.areaAdviserRepository.save(areaAdviser);
    }

    this.log.log('✓ AreaAdviser sembradas.');
  }



}
