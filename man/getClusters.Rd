\name{getClusters}
\alias{getClusters}
\title{Clustering determination and visualization}
\author{
David Barrios, Angela Villaverde and Carlos Prieto. Bioinformatics Service of
Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
Object of class \code{looking4clusters}.
}

\usage{
getClusters(data, groups = NULL, components = FALSE,
    distance = "euclidean", agglomeration = "complete", selectedk = NULL,
    perplex = 30, maxIter = 1000, threads = NULL, force_execution = FALSE)
}
\arguments{
\item{data}{input data as a numeric data.frame or matrix where variables are
placed in columns and samples in rows.}
\item{groups}{Factor/Vector which defines an input category for each sample
which will be visualized in the output plot.}
\item{components}{If TRUE, clustering algorithms are applied to main components
obtained with PCA.}
\item{distance}{the distance measure to be used with hierarchical clustering
algorithm. This must be one of "euclidean", "maximum", "manhattan", "canberra",
"binary" or "minkowski". Any unambiguous substring can be given.}
\item{agglomeration}{the agglomeration method to be used with hierarchical
clustering algorithm. This should be (an unambiguous abbreviation of) one of
"ward.D", "ward.D2", "single", "complete", "average" (= UPGMA),
"mcquitty" (= WPGMA), "median" (= WPGMC) or "centroid" (= UPGMC).}
\item{selectedk}{Number of expected clusters given by the user. By default, the
algorithm will run clustering algorithms with a number of clusters between 2
and 10. If selectedk is specified, a range of 5 units around the 'selectedk'
will be used as number of clusters.}
\item{perplex}{The perplexity parameter used for t-SNE algorithm execution
(should not be bigger than 3 * perplexity < nrow(X)-1). This value effectively
controls how many nearest neighbors are taken into account when constructing
the embedding in the low-dimensional space (default: 30)}
\item{maxIter}{The number of iterations used for t-SNE algorithm execution
(default: 1000)}
\item{threads}{The number of CPU threads for calculating a distance matrix.
Default value is the amount of CPU cores available on the system.}
\item{force_execution}{force the execution of some methods that could cause
performance problems with large matrices.}
}
\description{
\code{getClusters} Applies dimension reduction and clustering techniques and
creates interactive clustering visualization plots with 'R'.
}
\examples{
obj <- getClusters(iris[,1:4], groups=iris[,5], threads = 2)
plot(obj)
}
