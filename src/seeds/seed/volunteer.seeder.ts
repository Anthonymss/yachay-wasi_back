import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Volunteer } from "src/modules/volunteer/entities/volunteer.entity";
import { Repository } from "typeorm";

@Injectable()
export class VolunteerSeeder {
    private readonly log = new Logger('SeederVolunteer');
    constructor(
        @InjectRepository(Volunteer)
        private readonly volunteerRepository: Repository<Volunteer>,
    ) {}
    //STAFF
    
    //ADVISER
}
