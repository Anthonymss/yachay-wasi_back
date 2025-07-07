import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaStaff } from 'src/modules/area/entities/area-volunteer/area-staff.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
import { QuestionVolunteer, QuestionType } from 'src/modules/area/entities/area-volunteer/question-volunteer.entity';

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

    const subAreasData = [
      { name: 'Subcoordinador/a de Talento & Desarrollo Organizacional', areaKey: 'area1' },
      { name: 'Líder de Atracción de Talento', areaKey: 'area1' },
      { name: 'Analista/Asistente de Atracción de Talento', areaKey: 'area1' },
      { name: 'Líder de Formación & Competencias', areaKey: 'area1' },
      { name: 'Analista/Asistente de Formación & Competencias', areaKey: 'area1' },
      { name: 'Analista/Asistente de Talento & Desempeño ', areaKey: 'area1' },
      { name: 'Subcoordinador/a de Cultura & Comunicación Interna', areaKey: 'area2' },
      { name: 'Líder de Bienestar', areaKey: 'area2' },
      { name: 'Analista/Asistente de Bienestar', areaKey: 'area2' },
      { name: 'Líder de Comunicación Interna', areaKey: 'area2' },
      { name: 'Analista/Asistente de Comunicación Interna', areaKey: 'area2' },
      { name: 'Analista de Imagen y RR.PP.', areaKey: 'area3' },
      { name: 'Líder de Concursos & Fondos', areaKey: 'area4' },
      { name: 'Analista/Asistente de Concursos & Fondos', areaKey: 'area4' },
      { name: 'Líder de Proyectos de Alianzas', areaKey: 'area4' },
      { name: 'Líder de Convenios', areaKey: 'area5' },
      { name: 'Analista/Asistente de Convenios', areaKey: 'area5' },
      { name: 'Líder de Donaciones Individuales', areaKey: 'area5' },
      { name: 'Analista/Asistente de Donaciones Individuales', areaKey: 'area5' },
      { name: 'Community Manager', areaKey: 'area6' },
      { name: 'Diseñador/a Gráfico/a', areaKey: 'area6' },
      { name: 'Editor/a de Contenidos Audiovisuales', areaKey: 'area6' },
      { name: 'Integrante de Clima Interno & Pedagogía', areaKey: 'area7' },
      { name: 'Subcoordinador/a de Asesoría a Colegios Nacionales', areaKey: 'area8' },
      { name: 'Integrante de Análisis de Datos', areaKey: 'area8' },
      { name: 'Líder de Clima Interno & Pedagogía', areaKey: 'area8' },
      { name: 'Integrante de Clima Interno & Pedagogía', areaKey: 'area8' },
      { name: 'Yaku Guía', areaKey: 'area8' },
      { name: 'Líder de Análisis de Datos', areaKey: 'area9' },
      { name: 'Líder de Acompañamiento Continuo', areaKey: 'area9' },
      { name: 'Co-líder de Acompañamiento Continuo', areaKey: 'area9' },
      { name: 'Gestor/a de Casos-Rurus', areaKey: 'area9' },
      { name: 'Líder de Asesorías Psicoeducativas', areaKey: 'area9' },
      { name: 'Co-líder de Asesorías Psicoeducativas', areaKey: 'area9' },
      { name: 'Co-líder de Gestión del Ruru', areaKey: 'area9' },
      { name: 'Facilitador/a Psicoeducativo/a', areaKey: 'area9' },
      { name: 'Yaku Guía-Bienestar', areaKey: 'area9' },
      { name: 'Líder de Escuela a Padres', areaKey: 'area9' },
      { name: 'Co-líder de Escuela a Padres', areaKey: 'area9' },
      { name: 'Facilitador/a de Talleres', areaKey: 'area9' },
      { name: 'Líder de Análisis e Informes', areaKey: 'area10' },
      { name: 'Analista/Asistente de Informes', areaKey: 'area10' },
      { name: 'Líder de Estrategias Comunitarias', areaKey: 'area10' },
      { name: 'Líder de Desarrollo de Productos', description: 'agregar descripcion', areaKey: 'area11' },
      { name: 'Desarrollador/a API', description: 'agregar descripcion', areaKey: 'area11' },
      { name: 'Desarrollador/a Backend', description: 'agregar descripcion', areaKey: 'area11' },
      { name: 'Desarrollador/a Frontend', description: 'agregar descripcion', areaKey: 'area11' },
      { name: 'Ingeniero/a de Infraestructura Cloud', description: 'agregar descripcion', areaKey: 'area11' },
      { name: 'Analista de Gobierno de Datos', description: 'agregar descripcion', areaKey: 'area11' },
      { name: 'Líder de Mejora Continua', description: 'agregar descripcion', areaKey: 'area11' },
      // NUEVAS SUBÁREAS PARA ARTE & CULTURA -> serian enums
      { name: 'Cuenta cuentos', areaKey: 'area7' },
      { name: 'Dibujo y Pintura', areaKey: 'area7' },
      { name: 'Música', areaKey: 'area7' },
      { name: 'Oratoria', areaKey: 'area7' },
      { name: 'Teatro', areaKey: 'area7' },
      { name: 'Danza', areaKey: 'area7' },
      // NUEVAS SUBÁREAS PARA ASESORÍA A COLEGIOS NACIONALES -> serian enums
      { name: 'Comunicación', areaKey: 'area8' },
      { name: 'Inglés', areaKey: 'area8' },
      { name: 'Matemática', areaKey: 'area8' },
      // NUEVAS SUBÁREAS PARA BIENESTAR PSICOLÓGICOS
      { name: '"Yaku bienestar": Facilitador psicoeducativo', areaKey: 'area9' },
      // SUBAREAS DE ASESORIES
      { key: 'subarea61', name: 'Acompañamiento para el Bienestar Psicológico', description: "Área dedicada al apoyo emocional y psicológico de los beneficiarios", areaKey: 'area12' },
      { key: 'subarea62', name: 'Asesorías a Colegios Nacionales', description: "Área enfocada en brindar apoyo académico a estudiantes de colegios nacionales", areaKey: 'area12' },
      { key: 'subarea63', name: 'Asesorías en Arte y Cultura', description: "Área dedicada a promover el desarrollo artístico y cultural", areaKey: 'area12' },
    ];

    const subAreaMap: Record<string, SubArea> = {};

    for (const subAreaData of subAreasData) {
      const { key, name, description, areaKey } = subAreaData;
      const parentArea = areaMap[areaKey];
      if (!parentArea) {
        this.log.warn(`No se encontró el área padre con la clave "${areaKey}" para la sub-área "${name}".`);
        continue;
      }

      let subArea = await this.subAreaRepository.findOne({ where: { name, areaStaff: { id: parentArea.id } } });
      if (!subArea) {
        subArea = this.subAreaRepository.create({
          name,
          description: description ?? '',
          isActive: true,
          areaStaff: parentArea,
        });
      } else {
        subArea.description = description ?? subArea.description;
        subArea.areaStaff = parentArea;
      }

      const savedSubArea = await this.subAreaRepository.save(subArea);

      if (key) {
        subAreaMap[key] = savedSubArea;
      }
    }
    this.log.log('✓ SubAreas sembradas.');



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
        this.log.log(`Creando pregunta: "${questionText}"`);
        question = this.questionsVolunteersRepository.create({
          questionText: questionText,
          SubArea: parentSubArea,
          type: type as QuestionType,
        });
      } else {
        this.log.log(`Actualizando pregunta: "${questionText}"`);
        question.type = type as QuestionType;
      }

      await this.questionsVolunteersRepository.save(question);
    }

    this.log.log('✓ QuestionsVolunteers sembradas.');
  }

}
