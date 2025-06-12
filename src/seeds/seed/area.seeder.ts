import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreasStaff } from 'src/modules/area/entities/area-volunteer/areas-staff.entity';
import { SubAreas } from 'src/modules/area/entities/area-volunteer/sub-areas.entity';
import { AreasAsesories } from 'src/modules/area/entities/area-beneficiary/areas-asesories.entity';
@Injectable()
export class AreaSeeder {
  private readonly log = new Logger('Seeder');

  constructor(
    @InjectRepository(AreasStaff)
    private readonly areaStaffRepository: Repository<AreasStaff>,
    @InjectRepository(SubAreas)
    private readonly subAreaRepository: Repository<SubAreas>,
    @InjectRepository(AreasAsesories)
    private readonly areaAsesoryRepository: Repository<AreasAsesories>,
  ) {}

  async seed() {
  const areasData = [
      { key: 'area1', name: 'Talento & Desarrollo Organizacional', 
        description: '1' },
      { key: 'area2', name: 'Cultura & Comunicación Interna', description: '2' },
      { key: 'area3', name: 'Imagen Institucional & Relaciones Públicas', description: '2' },
      { key: 'area4', name: 'Alianzas Organizacionales', description: '2' },
      { key: 'area5', name: 'Convenios & Patrocinios Estratégicos', description: '2' },
      { key: 'area6', name: 'Marketing & Contenidos', description: '2' },
      { key: 'area7', name: 'Arte & Cultura', description: '2' },
      { key: 'area8', name: 'Asesoría a Colegios Nacionales', description: '2' },
      { key: 'area9', name: 'Bienestar Psicológicos', description: '2' },
      { key: 'area10', name: 'Gestión de Comunidades', description: '2' },
      { key: 'area11', name: 'Innovación & Calidad', description: '2' },
    ];

    const areaMap: Record<string, AreasStaff> = {};

    for (const { key, name, description } of areasData) {
      let area = await this.areaStaffRepository.findOne({ where: { name } });

      if (area) {
        area.description = description;
        area.isActive = true;
      } else {
        area = this.areaStaffRepository.create({ name, description, isActive: true });
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
      { name: 'Líder de Desarrollo de Productos',description:'agregar descripcion', areaKey: 'area11' },
      { name: 'Desarrollador/a API',description:'agregar descripcion', areaKey: 'area11' },
      { name: 'Desarrollador/a Backend',description:'agregar descripcion', areaKey: 'area11' },
      { name: 'Desarrollador/a Frontend',description:'agregar descripcion', areaKey: 'area11' },
      { name: 'Ingeniero/a de Infraestructura Cloud',description:'agregar descripcion', areaKey: 'area11' },
      { name: 'Analista de Gobierno de Datos',description:'agregar descripcion', areaKey: 'area11' },
      { name: 'Líder de Mejora Continua',description:'agregar descripcion', areaKey: 'area11' },
    ];

    for (const { name,description, areaKey } of subAreasData) {
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
      { name: "Asesorías en Arte y Cultura", isActive: true, description: 'Promover la creatividad, expresión personal, sensibilidad artística y pensamiento crítico.' },
      { name: "Asesorías a Colegios Nacionales", isActive: true, description: 'Fortalecer los hábitos de estudio y desarrollo de competencias básicas de ectura, matemáticas e inglés de nuestros beneficiarios.' },
      { name: "Acompañamiento para el Bienestar Psicológico", isActive: true, description: 'Contribuir con el bienestar psicológico de las/los estudiantes beneficiarios.' },
    ];

    for (const asesory of areaAsesory) {
      let existing = await this.areaAsesoryRepository.findOne({ where: { name: asesory.name } });

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
