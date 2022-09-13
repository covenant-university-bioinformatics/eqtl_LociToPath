import * as mongoose from 'mongoose';

export enum TISSUEOptions {
  NONE = 'none',
  Adipose_Subcutaneous = 'Adipose_Subcutaneous',
  Adipose_Visceral_Omentum = 'Adipose_Visceral_Omentum',
  Adrenal_Gland = 'Adrenal_Gland',
  Artery_Aorta = 'Artery_Aorta',
  Artery_Coronary = 'Artery_Coronary',
  Artery_Tibial = 'Artery_Tibial',
  Brain_Amygdala = 'Brain_Amygdala',
  Brain_Anterior_cingulate_cortex_BA24 = 'Brain_Anterior_cingulate_cortex_BA24',
  Brain_Caudate_basal_ganglia = 'Brain_Caudate_basal_ganglia',
  Brain_Cerebellar_Hemisphere = 'Brain_Cerebellar_Hemisphere',
  Brain_Cerebellum = 'Brain_Cerebellum',
  Brain_Cortex = 'Brain_Cortex',
  Brain_Frontal_Cortex_BA9 = 'Brain_Frontal_Cortex_BA9',
  Brain_Hippocampus = 'Brain_Hippocampus',
  Brain_Hypothalamus = 'Brain_Hypothalamus',
  Brain_Nucleus_accumbens_basal_ganglia = 'Brain_Nucleus_accumbens_basal_ganglia',
  Brain_Putamen_basal_ganglia = 'Brain_Putamen_basal_ganglia',
  Brain_Spinal_cord_cervical_c_1 = 'Brain_Spinal_cord_cervical_c-1',
  Brain_Substantia_nigra = 'Brain_Substantia_nigra',
  Breast_Mammary_Tissue = 'Breast_Mammary_Tissue',
  Cells_Cultured_fibroblasts = 'Cells_Cultured_fibroblasts',
  Cells_EBV_transformed_lymphocytes = 'Cells_EBV_transformed_lymphocytes',
  Colon_Sigmoid = 'Colon_Sigmoid',
  Colon_Transverse = 'Colon_Transverse',
  Esophagus_Gastroesophageal_Junction = 'Esophagus_Gastroesophageal_Junction',
  Esophagus_Mucosa = 'Esophagus_Mucosa',
  Esophagus_Muscularis = 'Esophagus_Muscularis',
  Heart_Atrial_Appendage = 'Heart_Atrial_Appendage',
  Heart_Left_Ventricle = 'Heart_Left_Ventricle',
  Kidney_Cortex = 'Kidney_Cortex',
  Liver = 'Liver',
  Lung = 'Lung',
  Minor_Salivary_Gland = 'Minor_Salivary_Gland',
  Muscle_Skeletal = 'Muscle_Skeletal',
  Nerve_Tibial = 'Nerve_Tibial',
  Ovary = 'Ovary',
  Pancreas = 'Pancreas',
  Pituitary = 'Pituitary',
  Prostate = 'Prostate',
  Skin_Not_Sun_Exposed_Suprapubic = 'Skin_Not_Sun_Exposed_Suprapubic',
  Skin_Sun_Exposed_Lower_leg = 'Skin_Sun_Exposed_Lower_leg',
  Small_Intestine_Terminal_Ileum = 'Small_Intestine_Terminal_Ileum',
  Spleen = 'Spleen',
  Stomach = 'Stomach',
  Testis = 'Testis',
  Thyroid = 'Thyroid',
  Uterus = 'Uterus',
  Vagina = 'Vagina',
  Whole_Blood = 'Whole_Blood',
}

//Interface that describe the properties that are required to create a new job
interface Loci2PathAttrs {
  job: string;
  useTest: string;
  chr: string;
  start_position: string;
  stop_position: string;
  tissue: TISSUEOptions;
}

// An interface that describes the extra properties that a eqtl model has
//collection level methods
interface Loci2PathModel extends mongoose.Model<Loci2PathDoc> {
  build(attrs: Loci2PathAttrs): Loci2PathDoc;
}

//An interface that describes a properties that a document has
export interface Loci2PathDoc extends mongoose.Document {
  id: string;
  version: number;
  useTest: boolean;
  chr: number;
  start_position: number;
  stop_position: number;
  tissue: TISSUEOptions;
}

const Loci2PathSchema = new mongoose.Schema<Loci2PathDoc, Loci2PathModel>(
  {
    useTest: {
      type: Boolean,
      trim: true,
    },
    chr: {
      type: Number,
      trim: true,
    },
    start_position: {
      type: Number,
      trim: true,
    },
    stop_position: {
      type: Number,
      trim: true,
    },
    tissue: {
      type: String,
      enum: [...Object.values(TISSUEOptions)],
      trim: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loci2PathJob',
      required: true,
    },
    version: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
      },
    },
  },
);

//increments version when document updates
Loci2PathSchema.set('versionKey', 'version');

//collection level methods
Loci2PathSchema.statics.build = (attrs: Loci2PathAttrs) => {
  return new Loci2PathModel(attrs);
};

//create mongoose model
const Loci2PathModel = mongoose.model<Loci2PathDoc, Loci2PathModel>(
  'Loci2Path',
  Loci2PathSchema,
  'loci2path',
);

export { Loci2PathModel };
