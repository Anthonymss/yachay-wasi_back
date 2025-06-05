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
    ]);
    /*Sub-area=>Inovacion & Calidad
    Líder de Desarrollo de Productos
    Desarrollador/a API
    Desarrollador/a Backend
    Desarrollador/a Frontend
    Ingeniero/a de Infraestructura Cloud
    Analista de Gobierno de Datos
    Líder de Mejora Continua   
   */
    const subArea1 = this.subAreaRepository.create({
      name: 'sub_Asesoria',
      description: '1',
      isActive: true,
      areaStaff: area1,
    });

    const subArea2 = this.subAreaRepository.create({
      name: 'sub2_Asesoria',
      description: '1',
      isActive: true,
      areaStaff: area2,
    });

    await this.subAreaRepository.save([subArea1, subArea2]);

    this.log.log('Seeding completado correctamente');
  }
}
