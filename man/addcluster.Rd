\name{addcluster}
\alias{addcluster}
\title{Clustering determination and visualization}
\description{
\code{addcluster} adds a dimensional reduction to a \code{looking4cluster}
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
addcluster(object, data, name=NULL, groupStatsBy=FALSE,
    myGroups=FALSE, optim_cluster=FALSE)
}
\arguments{
\item{object}{A \code{looking4cluster} object.}
\item{data}{a vector with a cluster especified per sample.}
\item{name}{a name for the dimensional reduction.}
\item{groupStatsBy}{If TRUE, this cluster will allow to group statistics.}
\item{myGroups}{If TRUE, this cluster will be initially loaded in user's custom
groups}
\item{optim_cluster}{If TRUE and there are multiple clusterizations for this
method, this will be the default.}
}
\examples{
object <- looking4clusters(iris[,1:4], running_all=FALSE)
object <- addcluster(object,iris[,5],"species",myGroups=TRUE)
}
