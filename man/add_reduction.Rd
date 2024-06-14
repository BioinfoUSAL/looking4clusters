\name{add_reduction}
\alias{add_reduction}
\title{Clustering determination and visualization}
\description{
\code{add_reduction} adds a dimensional reduction to a \code{looking4cluster}
object.
}
\author{
David Barrios, Angela Villaverde and Carlos Prieto. Bioinformatics Service of
Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
Object of class \code{looking4clusters}.
}

\usage{
add_reduction(object,data,name=NULL)
}
\arguments{
\item{object}{A \code{looking4cluster} object.}
\item{data}{a matrix with a row per sample.}
\item{name}{a name for the dimensional reduction.}
}
\examples{
object <- create_l4c(iris[,1:4])
PCAcomponents <- prcomp(data.matrix(iris[,1:4]), scale=FALSE)
pca<-PCAcomponents$x[,1:2]
object <- add_reduction(object,pca,"pca")
}
