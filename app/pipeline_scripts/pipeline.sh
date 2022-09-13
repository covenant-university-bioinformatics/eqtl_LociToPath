#!/usr/bin/env bash
set -xu

inputFile=$1; #must have chr prefix e.g. chr21.
outdir=$2;
tissue=$3;
db="/local/datasets/loci2path/db_R"; ## mount volume
bindir="/app/pipeline_scripts";

tissue_query="${db}/${tissue}_Analysis.v6p.txt";



 Rscript --vanilla ${bindir}/loci2path.R ${inputFile} \
     ${outdir} \
     ${tissue_query}  \
     ${tissue}  
      



## ./script.sh input_loci2path.txt  /media/yagoubali/bioinfo2/loci2path/scripts/out1 Adipose_Subcutaneous
### Tissues list

# Adipose_Subcutaneous
# Adipose_Visceral_Omentum
# Adrenal_Gland
# Artery_Aorta
# Artery_Coronary
# Artery_Tibial
# Brain_Anterior_cingulate_cortex_BA24
# Brain_Caudate_basal_ganglia
# Brain_Cerebellar_Hemisphere
# Brain_Cerebellum
# Brain_Cortex
# Brain_Frontal_Cortex_BA9
# Brain_Hippocampus
# Brain_Hypothalamus
# Brain_Nucleus_accumbens_basal_ganglia
# Brain_Putamen_basal_ganglia
# Breast_Mammary_Tissue
# Cells_EBV-transformed_lymphocytes
# Cells_Transformed_fibroblasts
# Colon_Sigmoid
# Colon_Transverse
# Esophagus_Gastroesophageal_Junction
# Esophagus_Mucosa
# Esophagus_Muscularis
# Heart_Atrial_Appendage
# Heart_Left_Ventricle
# input_loci2path.txt
# Liver
# Lung
# Muscle_Skeletal
# Nerve_Tibial
# Ovary
# Pancreas
# Pituitary
# Prostate
# Skin_Not_Sun_Exposed_Suprapubic
# Skin_Sun_Exposed_Lower_leg
# Small_Intestine_Terminal_Ileum
# Spleen
# Stomach
# Testis
# Thyroid
# Uterus
# Vagina
# Whole_Blood

