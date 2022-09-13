import { Global, Module } from '@nestjs/common';
import { JobsLoci2PathService } from './services/jobs.loci2path.service';
import { JobsLoci2PathController } from './controllers/jobs.loci2path.controller';
import { QueueModule } from '../jobqueue/queue.module';
import { JobsLoci2PathNoauthController } from './controllers/jobs.loci2path.noauth.controller';

@Global()
@Module({
  imports: [QueueModule],
  controllers: [JobsLoci2PathController, JobsLoci2PathNoauthController],
  providers: [JobsLoci2PathService],
  exports: [],
})
export class JobsModule {}
