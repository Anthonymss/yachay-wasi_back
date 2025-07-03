import { InjectRepository } from '@nestjs/typeorm';
import { CommunicationPreference } from 'src/modules/beneficiary/entities/communication-preference.entity';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ComunicationPreferenceSeeder {
  private readonly log = new Logger(ComunicationPreferenceSeeder.name);

  constructor(
    @InjectRepository(CommunicationPreference)
    private readonly communicationPreferenceRepository: Repository<CommunicationPreference>,
  ) {}

  async seed() {
    const communicationPreferences = [
      { name: 'Llamada' },
      { name: 'Llamada y WhatsApp' },
      { name: 'Solo WhatsApp (incluye videollamadas)' },
      { name: 'Plataformas virtuales (meet, zoom, teams)' },
      { name: 'Mensaje de texto y WhatsApp' },
    ];

    for (const pref of communicationPreferences) {
      const exists = await this.communicationPreferenceRepository.findOne({
        where: { name: pref.name },
      });

      if (!exists) {
        await this.communicationPreferenceRepository.save(pref);
      }

    }

    this.log.log('Comunicación preferences seed completado');
  }
}
