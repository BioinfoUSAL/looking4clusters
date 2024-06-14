\name{display_html}
\alias{display_html}
\title{Clustering determination and visualization}
\description{
\code{display_html} creates an html web from a 'looking4cluster' object.
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
display_html(object, includeData = TRUE, directory = tempfile())
}
\arguments{
\item{object}{A \code{looking4cluster} object.}
\item{includeData}{If FALSE, size will be reduced but some functionalities will
be lost.}
\item{directory}{A "character" string representing the directory where the
graph will be saved.}
}
\examples{
object <- create_l4c(iris[,1:4])
object <- add_cluster(object,iris[,5],"species",myGroups=TRUE)
PCAcomponents <- prcomp(data.matrix(iris[,1:4]), scale=FALSE)
pca<-PCAcomponents$x[,1:2]
object <- add_reduction(object,pca,"pca")
display_html(object)
}
