import config from '../config/bullmq.config';
import appConfig from '../config/app.config';
import { WorkerJob } from '../jobqueue/queue/loci2path.queue';
import { Job, QueueScheduler, Worker } from 'bullmq';
import { JobStatus, Loci2PathJobsModel } from '../jobs/models/loci2path.jobs.model';
import * as path from 'path';
import { Loci2PathModel } from '../jobs/models/loci2path.model';
import { JobCompletedPublisher } from '../nats/publishers/job-completed-publisher';

let scheduler;

const createScheduler = () => {
  scheduler = new QueueScheduler(config.queueName, {
    connection: config.connection,
    // maxStalledCount: 10,
    // stalledInterval: 15000,
  });
};

const processorFile = path.join(__dirname, 'loci2path.worker.js');

export const createWorkers = async (
  jobCompletedPublisher: JobCompletedPublisher,
) => {
  createScheduler();

  for (let i = 0; i < config.numWorkers; i++) {
    console.log('Creating worker ' + i);

    const worker = new Worker<WorkerJob>(config.queueName, processorFile, {
      connection: config.connection,
      // concurrency: config.concurrency,
      limiter: config.limiter,
    });

    worker.on('completed', async (job: Job, returnvalue: any) => {
      console.log('worker ' + i + ' completed ' + returnvalue);

      // save in mongo database
      // job is complete
      const parameters = await Loci2PathModel.findOne({
        job: job.data.jobId,
      }).exec();

      const pathToOutputDir = `/pv/analysis/${job.data.jobUID}/${appConfig.appName}/output`;

      const resultsFile = `${pathToOutputDir}/annotation_path2loci.txt`;

      //update db with result files
      const finishedJob = await Loci2PathJobsModel.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.COMPLETED,
          resultsFile: resultsFile,
          completionTime: new Date(),
        },
        { new: true },
      );

      //send email if its a long job
      if (finishedJob.longJob) {
        await jobCompletedPublisher.publish({
          type: 'jobStatus',
          recipient: {
            email: job.data.email,
          },
          payload: {
            comments: `${job.data.jobName} has completed successfully`,
            jobID: job.data.jobId,
            jobName: job.data.jobName,
            status: finishedJob.status,
            username: job.data.username,
            link: `tools/${appConfig.appName}/result_view/${finishedJob._id}`,
          },
        });
      }
    });

    worker.on('failed', async (job: Job) => {
      console.log('worker ' + i + ' failed');
      //update job in database as failed
      //save in mongo database
      const finishedJob = await Loci2PathJobsModel.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.FAILED,
          failed_reason: job.failedReason,
          completionTime: new Date(),
        },
        { new: true },
      );

      if (finishedJob.longJob) {
        await jobCompletedPublisher.publish({
          type: 'jobStatus',
          recipient: {
            email: job.data.email,
          },
          payload: {
            comments: `${job.data.jobName} has failed to complete`,
            jobID: job.data.jobId,
            jobName: job.data.jobName,
            status: finishedJob.status,
            username: job.data.username,
            link: `tools/${appConfig.appName}/result_view/${finishedJob._id}`,
          },
        });
      }
    });

    // worker.on('close', () => {
    //   console.log('worker ' + i + ' closed');
    // });

    process.on('SIGINT', () => {
      worker.close();
      console.log('worker ' + i + ' closed');
    });

    process.on('SIGTERM', () => {
      worker.close();
      console.log('worker ' + i + ' closed');
    });

    process.on('SIGBREAK', () => {
      worker.close();
      console.log('worker ' + i + ' closed');
    });

    console.log('Worker ' + i + ' created');
  }
};
