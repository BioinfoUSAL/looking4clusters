\name{getSeuratClusters}
\alias{getSeuratClusters}
\title{Clustering determination and visualization}
\author{
David Barrios, Angela Villaverde and Carlos Prieto. Bioinformatics Service of
Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
Object of class \code{looking4clusters}.
}

\usage{
getSeuratClusters(object, assay = NULL)
}
\arguments{
\item{object}{A \code{Seurat} object.}
\item{assay}{Specific assay to get data from or set data for; defaults to the
default assay.}
}
\description{
\code{getSeuratClusters} Creates interactive clustering visualization plots
from a \code{Seurat} object.
}
\examples{
library(Seurat)
library(Matrix)

test_mat <- Matrix(as.matrix(iris[,1:4]),sparse=TRUE)

seurat_object <- CreateSeuratObject(counts = test_mat)

seurat_object <- NormalizeData(seurat_object)
seurat_object <- ScaleData(seurat_object, features = rownames(seurat_object))

seurat_object <- FindVariableFeatures(seurat_object)
seurat_object <- RunPCA(seurat_object, npcs = 2,
    features = VariableFeatures(object = seurat_object))

obj <- getSeuratClusters(seurat_object)

plot(obj)
}
