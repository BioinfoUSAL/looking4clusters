run_pca <- function(object){

    PCAcomponents <- prcomp(object$data, scale=FALSE)
    pca<-PCAcomponents$x[,seq_len(2)]

    return(add_reduction(object,pca,"pca"))
}
