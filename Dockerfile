FROM ubuntu:18.04 
ENV CI=true
ENV PIP_IGNORE_INSTALLED=0

WORKDIR /app

## install R 
## to stop interactve  input tzdata (timezone)
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Africa/Lagos
RUN  apt-get update && apt-get -y install software-properties-common dirmngr apt-transport-https lsb-release ca-certificates
RUN  apt-get update && apt-get -y install build-essential wget  curl rsync tar make
RUN apt-get -y install libcurl4-openssl-dev ## to resolve the issue this issue ---> installation of package 'RCurl' had non-zero exit status
RUN apt-get -y install libcurl4-openssl-dev ## to resolve the issue this issue ---> installation of package 'RCurl' had non-zero exit status



## Install R >=4.2
#RUN add-apt-repository -r ppa:grass/grass-stable
RUN  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys
RUN echo "deb https://cloud.r-project.org/bin/linux/ubuntu bionic-cran40/" > /etc/apt/sources.list.d/cran.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
RUN  apt-get update && apt-get -y dist-upgrade && apt-get -y install libxml2-dev r-base r-base-dev r-recommended
#RUN apt install r-cran-xml2

RUN  R -e "update.packages(ask = FALSE, checkBuilt = TRUE)"
RUN  R -e  "install.packages('BiocManager')"
RUN  R -e 'BiocManager::install(ask = F)' &&  R -e "BiocManager::install('GenomicRanges')" 
RUN  R -e 'install.packages("devtools")' 
#&&  R -e "library(devtools)" && R -e "install_github("stanleyxu/loci2path")"
RUN  R -e 'BiocManager::install(ask = F)' && R -e "BiocManager::install('loci2path')"



COPY scripts/ ./scripts/

RUN apt-get install -y dos2unix
RUN dos2unix /app/scripts/script.sh
RUN chmod 775 /app/scripts/script.sh
RUN dos2unix /app/scripts/loci2path.R
RUN chmod 775 /app/scripts/loci2path.R

#ENTRYPOINT ["bash", "/app/scripts.sh"]
CMD ["bash", "/app/scripts/script.sh"]