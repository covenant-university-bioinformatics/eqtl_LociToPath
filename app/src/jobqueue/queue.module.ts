import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { createWorkers } from '../workers/loci2path.main';
import { Loci2PathJobQueue } from './queue/loci2path.queue';
import { NatsModule } from '../nats/nats.module';
import { JobCompletedPublisher } from '../nats/publishers/job-completed-publisher';

@Module({
  imports: [NatsModule],
  providers: [Loci2PathJobQueue],
  exports: [Loci2PathJobQueue],
})
export class QueueModule implements OnModuleInit {
  @Inject(JobCompletedPublisher) jobCompletedPublisher: JobCompletedPublisher;
  async onModuleInit() {
    await createWorkers(this.jobCompletedPublisher);
  }
}
