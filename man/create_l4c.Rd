\name{create_l4c}
\alias{create_l4c}
\title{Clustering determination and visualization}
\description{
\code{create_l4c} Produces a 'looking4clusters' object from a matrix.
}
\author{
David Barrios, Angela Villaverde and Carlos Prieto. Bioinformatics Service of
Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
Object of class \code{looking4clusters}.
}

\usage{
create_l4c(data,components=FALSE)
}
\arguments{
\item{data}{input data as a numeric data.frame or matrix where variables are
placed in columns and samples in rows.}
\item{components}{If TRUE, clustering algorithms are applied to main components
obtained with PCA.}
}
\examples{
object <- create_l4c(iris[,1:4])
}
