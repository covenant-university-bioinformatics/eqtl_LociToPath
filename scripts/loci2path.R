###!/usr/bin/env R

.libPaths(c( .libPaths(), "/usr/local/lib/R/site-library", "/usr/lib/R/site-library", "/usr/lib/R/library"))
library(loci2path)
library(GenomicRanges)
options(warn=-1)
args = commandArgs(trailingOnly=TRUE)
bed_query=args[1]
outdir=args[2]
snpsTissue=args[3]
tissue=args[4]
output=paste0(outdir,"/annotation_path2loci.txt")

## READ INPUT FILE
query.bed <- read.table(bed_query, header=TRUE)
#colnames(query.bed) <- c("chr","start","end")
query.gr <- makeGRangesFromDataFrame(query.bed)

#cat("Step 1: done !!! \n")
## READ TISSUE FILE
snps=read.table(snpsTissue, stringsAsFactors=FALSE, header=TRUE)
snps.gr <- GRanges(seqnames=Rle(snps$snp.chr), 
          ranges=IRanges(start=snps$snp.pos, 
           width=1))

snps.eset <- eqtlSet(tissue= as.character(tissue),
             eqtlId=snps$snp.id,
             eqtlRange=snps.gr,
             gene=as.character(snps$gene.entrez.id))
#cat("Step 2 done !!! \n")

## READ Biocarta genes
biocarta.link.file <- system.file("extdata", "geneSet/biocarta.txt", 
                               package="loci2path")
biocarta.set.file <- system.file("extdata", "geneSet/biocarta.set.txt", 
                              package="loci2path")

biocarta.link <- read.delim(biocarta.link.file, header=FALSE, 
                         stringsAsFactors=FALSE)

set.geneid <- read.table(biocarta.set.file, stringsAsFactors=FALSE)
set.geneid <- strsplit(set.geneid[,1], split=",")

names(set.geneid) <- biocarta.link[,1]

biocarta <- geneSet(
    numGene=31847,
    description=biocarta.link[,2],
    geneSetList=set.geneid)
#cat("Step 3 done !!! \n")

# perform query from one eQTL set

res.one <- query(
  query.gr=query.gr,
  loci=snps.eset, 
  path=biocarta)

##
#cat("Step 4 done !!! \n")

write.table(res.one$result.table, output, row.names=F, sep="\t")





