import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaStaff } from 'src/modules/area/entities/area-volunteer/area-staff.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
@Injectable()
export class AreaSeeder {
  private readonly log = new Logger('Seeder');

  constructor(
    @InjectRepository(AreaStaff)
    private readonly areaStaffRepository: Repository<AreaStaff>,
    @InjectRepository(SubArea)
    private readonly subAreaRepository: Repository<SubArea>,
  ) {}

  async seed() {
    const area1 = this.areaStaffRepository.create({
      name: 'Talento & Desarrollo Organizacional',
      description: '1',
      isActive: true,
    });
    const area2 = this.areaStaffRepository.create({
      name: 'Cultura & Comunicación Interna',
      description: '2',
      isActive: true,
    });
    const area3 = this.areaStaffRepository.create({
      name: 'Imagen Institucional & Relaciones Públicas',
      description: '2',
      isActive: true,
    });
    const area4 = this.areaStaffRepository.create({
      name: 'Alianzas Organizacionales',
      description: '2',
      isActive: true,
    });
    const area5 = this.areaStaffRepository.create({
      name: 'Convenios & Patrocinios Estratégicos',
      description: '2',
      isActive: true,
    });
    const area6 = this.areaStaffRepository.create({
      name: 'Marketing & Contenidos',
      description: '2',
      isActive: true,
    });
    const area7 = this.areaStaffRepository.create({
      name: 'Arte & Cultura',
      description: '2',
      isActive: true,
    });
    const area8 = this.areaStaffRepository.create({
      name: 'Asesoría a Colegios Nacionales',
      description: '2',
      isActive: true,
    });
    const area9 = this.areaStaffRepository.create({
      name: 'Bienestar Psicológicos',
      description: '2',
      isActive: true,
    });
    const area10 = this.areaStaffRepository.create({
      name: 'Gestión de Comunidades',
      description: '2',
      isActive: true,
    });
    const area11 = this.areaStaffRepository.create({
      name: 'Innovación & Calidad',
      description: '2',
      isActive: true,
    });

    /*AREA
    Talento & Desarrollo Organizacional
    Cultura & Comunicación Interna
    Imagen Institucional & Relaciones Públicas
    Alianzas Organizacionales
    Convenios & Patrocinios Estratégicos
    Marketing & Contenidos   -
    Arte & Cultura
    Asesoría a Colegios Nacionales
    Bienestar Psicológico
    Gestión de Comunidades
    Innovación & Calidad
    */
    await this.areaStaffRepository.save([
      area1,
      area2,
      area3,
      area4,
      area5,
      area6,
      area7,
      area8,
      area9,
      area10,
      area11
    ]);
    /*talento
   Subcoordinador/a de Talento & Desarrollo Organizacional
Líder de Atracción de Talento
Analista/Asistente de Atracción de Talento
Líder de Formación & Competencias
Analista/Asistente de Formación & Competencias
Analista/Asistente de Talento & Desempeño 
   */
/*cultura y comunicacion
Subcoordinador/a de Cultura & Comunicación Interna
Líder de Bienestar
Analista/Asistente de Bienestar
Líder de Comunicación Interna
Analista/Asistente de Comunicación Interna

*/
/**Imagen Institucional & Relaciones Públicas
Analista de Imagen y RR.PP.
 */

/*
Alianzas organizacionales
Líder de Concursos & Fondos
Analista/Asistente de Concursos & Fondos
Líder de Proyectos de Alianzas
*/

/*
Convenios & Patrocinios Estratégicos
Líder de Convenios
Analista/Asistente de Convenios
Líder de Donaciones Individuales
Analista/Asistente de Donaciones Individuales
*/
/*
Marketing & Contenidos
Community Manager
Diseñador/a Gráfico/a
Editor/a de Contenidos Audiovisuales
*/

/*
Arte & Cultura
Integrante de Clima Interno & Pedagogía
*/

/*
Asesoría a Colegios Nacionales
Subcoordinador/a de Asesoría a Colegios Nacionales
Integrante de Análisis de Datos
Líder de Clima Interno & Pedagogía
Integrante de Clima Interno & Pedagogía
Yaku Guía
*/

/*
Bienestar Psicológico
Líder de Análisis de Datos
Líder de Acompañamiento Continuo
Co-líder de Acompañamiento Continuo
Gestor/a de Casos-Rurus
Líder de Asesorías Psicoeducativas
Co-líder de Asesorías Psicoeducativas
Co-líder de Gestión del Ruru
Facilitador/a Psicoeducativo/a
Yaku Guía-Bienestar
Líder de Escuela a Padres
Co-líder de Escuela a Padres
Facilitador/a de Talleres
 */

/*
Gestión de Comunidades
Líder de Análisis e Informes
Analista/Asistente de Informes
Líder de Estrategias Comunitarias
 */
    const subArea1 = this.subAreaRepository.create({
      name: 'Subcoordinador/a de Talento & Desarrollo Organizacional',
      description: '1',
      isActive: true,
      areaStaff: area1,
    });

    const subArea2 = this.subAreaRepository.create({
      name: 'sub2_Asesoria',
      description: '1',
      isActive: true,
      areaStaff: area1,
    });
    //inovacion
    const subArea100 = this.subAreaRepository.create({
      name: 'Líder de Desarrollo de Productos',
      description: '1',
      isActive: true,
      areaStaff: area11,
    });
    const subArea101 = this.subAreaRepository.create({
      name: 'Desarrollador/a API',
      description: '1',
      isActive: true,
      areaStaff: area11,
    });
    const subArea102 = this.subAreaRepository.create({
      name: 'Desarrollador/a Backend',
      description: '1',
      isActive: true,
      areaStaff: area11,
    });
    const subArea103 = this.subAreaRepository.create({
      name: 'Desarrollador/a Frontend',
      description: '1',
      isActive: true,
      areaStaff: area11,
    });
    const subArea104 = this.subAreaRepository.create({
      name: 'Ingeniero/a de Infraestructura Cloud',
      description: '1',
      isActive: true,
      areaStaff: area11,
    });
    const subArea105 = this.subAreaRepository.create({
      name: 'Analista de Gobierno de Datos',
      description: '1',
      isActive: true,
      areaStaff: area11,
    });
    const subArea106 = this.subAreaRepository.create({
      name: 'Líder de Mejora Continua  ',
      description: '1',
      isActive: true,
      areaStaff: area11,
    });
    await this.subAreaRepository.save([
      subArea1, 
      subArea2
      ,subArea100,
      subArea101,
      subArea102,
      subArea103,
      subArea103,
      subArea104,
      subArea105,
      subArea106,
    ]

    );

    this.log.log('Seeding completado correctamente');
  }
}
