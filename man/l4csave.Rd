\name{l4csave}
\alias{l4csave}
\title{Clustering determination and visualization}
\description{
\code{l4csave} creates an html web from a 'looking4cluster' object.
}
\author{
David Barrios, Angela Villaverde and Carlos Prieto. Bioinformatics Service of
Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
The function creates a folder in your computer with an HTML document named
index.html which contains the interactive web page. This file can be directly
opened with your browser.
}

\usage{
l4csave(object, directory, includeData = FALSE)
}
\arguments{
\item{object}{A \code{looking4cluster} object.}
\item{directory}{A "character" string representing the directory where the
graph will be saved.}
\item{includeData}{If FALSE, size will be reduced but some functionalities will
be lost.}
}
\examples{
object <- looking4clusters(iris[,1:4], running_all=FALSE)
object <- addcluster(object,iris[,5],"species",myGroups=TRUE)
PCAcomponents <- prcomp(data.matrix(iris[,1:4]), scale=FALSE)
pca<-PCAcomponents$x[,1:2]
object <- addreduction(object,pca,"pca")
l4csave(object,"l4c_saved")
}
