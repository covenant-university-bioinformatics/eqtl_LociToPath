import * as mongoose from 'mongoose';
import { UserDoc } from '../../auth/models/user.model';
import { Loci2PathDoc } from './loci2path.model';

export enum JobStatus {
  COMPLETED = 'completed',
  RUNNING = 'running',
  FAILED = 'failed',
  ABORTED = 'aborted',
  NOTSTARTED = 'not-started',
  QUEUED = 'queued',
}

//Interface that describe the properties that are required to create a new job
interface JobsAttrs {
  jobUID: string;
  job_name: string;
  status: JobStatus;
  user?: string;
  email?: string;
  inputFile: string;
  longJob: boolean;
}

// An interface that describes the extra properties that a model has
//collection level methods
interface JobsModel extends mongoose.Model<Loci2PathJobsDoc> {
  build(attrs: JobsAttrs): Loci2PathJobsDoc;
}

//An interface that describes a properties that a document has
export interface Loci2PathJobsDoc extends mongoose.Document {
  id: string;
  jobUID: string;
  job_name: string;
  inputFile: string;
  status: JobStatus;
  user?: UserDoc;
  email?: string;
  failed_reason: string;
  longJob: boolean;
  loci2path_params: Loci2PathDoc;
  resultsFile: string;
  version: number;
  completionTime: Date;
}

const Loci2PathJobSchema = new mongoose.Schema<Loci2PathJobsDoc, JobsModel>(
  {
    jobUID: {
      type: String,
      required: [true, 'Please add a Job UID'],
      unique: true,
      trim: true,
    },
    job_name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    inputFile: {
      type: String,
      required: [true, 'Please add a input filename'],
      trim: true,
    },
    resultsFile: {
      type: String,
      trim: true,
    },
    failed_reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        JobStatus.COMPLETED,
        JobStatus.NOTSTARTED,
        JobStatus.RUNNING,
        JobStatus.FAILED,
        JobStatus.ABORTED,
        JobStatus.QUEUED,
      ],
      default: JobStatus.NOTSTARTED,
    },
    longJob: {
      type: Boolean,
      default: false,
    },
    completionTime: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    version: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
      },
    },
  },
);

//increments version when document updates
// jobsSchema.set("versionKey", "version");

//collection level methods
Loci2PathJobSchema.statics.build = (attrs: JobsAttrs) => {
  return new Loci2PathJobsModel(attrs);
};

//Cascade delete main job parameters when job is deleted
Loci2PathJobSchema.pre('remove', async function (next) {
  console.log('Job parameters being removed!');
  await this.model('Loci2Path').deleteMany({
    job: this.id,
  });
  next();
});

//reverse populate jobs with main job parameters
Loci2PathJobSchema.virtual('loci2path_params', {
  ref: 'Loci2Path',
  localField: '_id',
  foreignField: 'job',
  required: true,
  justOne: true,
});

Loci2PathJobSchema.set('versionKey', 'version');

//create mongoose model
const Loci2PathJobsModel = mongoose.model<Loci2PathJobsDoc, JobsModel>(
  'Loci2PathJob',
  Loci2PathJobSchema,
  'loci2pathjobs',
);

export { Loci2PathJobsModel };
