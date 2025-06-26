import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaStaff } from 'src/modules/area/entities/area-volunteer/area-staff.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
import { AreaAsesory } from 'src/modules/area/entities/area-beneficiary/area-asesory.entity';
@Injectable()
export class AreaSeeder {
  private readonly log = new Logger('Seeder');

  constructor(
    @InjectRepository(AreaStaff)
    private readonly areaStaffRepository: Repository<AreaStaff>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository: Repository<SubArea>,
    @InjectRepository(AreaAsesory)
    private readonly areaAsesoryRepository: Repository<AreaAsesory>,
  ) {}

  async seed() {
    const areasData = [
      {
        key: 'area1',
        name: 'Talento & Desarrollo Organizacional',
        imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955835/talento-humano-exito-organizacional-min_a5tf4m.jpg',
        description: '1',
      },
      {
        key: 'area2',
        name: 'Cultura & Comunicación Interna',
        imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955920/post-ayrton-1024x512_k0melf.png',
        description: '2',
      },
      {
        key: 'area3',
        name: 'Imagen Institucional & Relaciones Públicas',
        imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955465/2e7c148c-cecc-4c60-8ca2-91107ea2d572.png',
        description: '2',
      },
      { key: 'area4', name: 'Alianzas Organizacionales',imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955333/ff7ce3f6-d375-4e9f-9aee-5fc018ff71aa.png', description: '2' },
      {
        key: 'area5',
        name: 'Convenios & Patrocinios Estratégicos',
        imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955384/4c521674-b5fe-4a04-b55a-a0bdbbc92478.png',
        description: '2',
      },
      { key: 'area6', name: 'Marketing & Contenidos',imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955432/28e147cb-86b2-4181-85ce-15f82ac6a144.png', description: '2' },
      { key: 'area7', name: 'Arte & Cultura',imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955345/529d6cd7-69fd-49b4-ba77-bff8431ea233.png', description: '2' },
      {
        key: 'area8',
        name: 'Asesoría a Colegios Nacionales',
        imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955339/d669e3dd-7d80-4ea0-89b2-7771dbe0bbd6.png',
        description: '2',
      },
      { key: 'area9', name: 'Bienestar Psicológicos', imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955379/7a59f593-ef46-4ea4-b942-58a8afb5948b.png', description: '2' },
      { key: 'area10', name: 'Gestión de Comunidades', imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955418/39528eb3-211a-4bdd-b69f-07d177d00d68.png', description: '2' },
      { key: 'area11', name: 'Innovación & Calidad', imageUrl:'https://res.cloudinary.com/dnupey6af/image/upload/v1750955350/0cee7a1e-267a-47a6-9beb-bf807d65c5e1.png', description: '2' },
    ];

    const areaMap: Record<string, AreaStaff> = {};

    for (const { key, name,description,imageUrl } of areasData) {
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
      {
        name: 'Subcoordinador/a de Talento & Desarrollo Organizacional',
        areaKey: 'area1',
      },
      { name: 'Líder de Atracción de Talento', areaKey: 'area1' },
      { name: 'Analista/Asistente de Atracción de Talento', areaKey: 'area1' },
      { name: 'Líder de Formación & Competencias', areaKey: 'area1' },
      {
        name: 'Analista/Asistente de Formación & Competencias',
        areaKey: 'area1',
      },
      { name: 'Analista/Asistente de Talento & Desempeño ', areaKey: 'area1' },
      {
        name: 'Subcoordinador/a de Cultura & Comunicación Interna',
        areaKey: 'area2',
      },
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
      {
        name: 'Analista/Asistente de Donaciones Individuales',
        areaKey: 'area5',
      },
      { name: 'Community Manager', areaKey: 'area6' },
      { name: 'Diseñador/a Gráfico/a', areaKey: 'area6' },
      { name: 'Editor/a de Contenidos Audiovisuales', areaKey: 'area6' },
      { name: 'Integrante de Clima Interno & Pedagogía', areaKey: 'area7' },
      {
        name: 'Subcoordinador/a de Asesoría a Colegios Nacionales',
        areaKey: 'area8',
      },
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
      {
        name: 'Líder de Desarrollo de Productos',
        description: 'agregar descripcion',
        areaKey: 'area11',
      },
      {
        name: 'Desarrollador/a API',
        description: 'agregar descripcion',
        areaKey: 'area11',
      },
      {
        name: 'Desarrollador/a Backend',
        description: 'agregar descripcion',
        areaKey: 'area11',
      },
      {
        name: 'Desarrollador/a Frontend',
        description: 'agregar descripcion',
        areaKey: 'area11',
      },
      {
        name: 'Ingeniero/a de Infraestructura Cloud',
        description: 'agregar descripcion',
        areaKey: 'area11',
      },
      {
        name: 'Analista de Gobierno de Datos',
        description: 'agregar descripcion',
        areaKey: 'area11',
      },
      {
        name: 'Líder de Mejora Continua',
        description: 'agregar descripcion',
        areaKey: 'area11',
      },
    ];

    for (const { name, description, areaKey } of subAreasData) {
      let subArea = await this.subAreaRepository.findOne({ where: { name } });

      if (subArea) {
        subArea.areaStaff = areaMap[areaKey];
        subArea.isActive = true;
        subArea.description = description ?? '';
      } else {
        subArea = this.subAreaRepository.create({
          name,
          description: description,
          isActive: true,
          areaStaff: areaMap[areaKey],
        });
      }

      await this.subAreaRepository.save(subArea);
    }

    const areaAsesory = [
      {
        name: 'Asesorías en Arte y Cultura',
        isActive: true,
        description:
          'Promover la creatividad, expresión personal, sensibilidad artística y pensamiento crítico.',
      },
      {
        name: 'Asesorías a Colegios Nacionales',
        isActive: true,
        description:
          'Fortalecer los hábitos de estudio y desarrollo de competencias básicas de ectura, matemáticas e inglés de nuestros beneficiarios.',
      },
      {
        name: 'Acompañamiento para el Bienestar Psicológico',
        isActive: true,
        description:
          'Contribuir con el bienestar psicológico de las/los estudiantes beneficiarios.',
      },
    ];

    for (const asesory of areaAsesory) {
      let existing = await this.areaAsesoryRepository.findOne({
        where: { name: asesory.name },
      });

      if (existing) {
        existing.isActive = true;
        existing.description = asesory.description;
      } else {
        existing = this.areaAsesoryRepository.create(asesory);
      }

      await this.areaAsesoryRepository.save(existing);
    }
  }
}
