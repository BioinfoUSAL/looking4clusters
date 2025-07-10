\name{l4c_SCE}
\alias{l4c_SCE}
\title{Clustering determination and visualization}
\author{
David Barrios, Angela Villaverde and Carlos Prieto. Bioinformatics Service of
Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
Object of class \code{looking4clusters}.
}

\usage{
l4c_SCE(object, groups = NULL, assay = NULL)
}
\arguments{
\item{object}{A \code{SingleCellExperiment} object.}
\item{groups}{Name of the \code{colData} column to define an input category for
each sample which will be visualized in the output plot.}
\item{assay}{Specific assay to get data from or set data for; defaults to the
default assay.}
}
\description{
\code{l4c_SCE} Creates interactive clustering visualization plots
from a \code{SingleCellExperiment} object.
}
\examples{
library(scRNAseq)
sce <- ReprocessedAllenData("tophat_counts")

counts <- assay(sce, "tophat_counts")
libsizes <- colSums(counts)
size.factors <- libsizes/mean(libsizes)
logcounts(sce) <- log2(t(t(counts)/size.factors) + 1)

pca_data <- prcomp(t(logcounts(sce)), rank=50)

library(Rtsne)
tsne_data <- Rtsne(pca_data$x[,1:50], pca = FALSE)

reducedDims(sce) <- list(PCA=pca_data$x, TSNE=tsne_data$Y)

obj <- l4c_SCE(sce, groups="dissection_s")

plot(obj)
}
