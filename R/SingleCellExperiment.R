l4c_SCE <- function(object, groups = NULL, assay = NULL){
    if(!is.null(assay)){
        data <- t(SummarizedExperiment::assay(object,assay))
    }else{
        data <- t(SummarizedExperiment::assay(object))
    }

    l4cObject <- create_l4c(data)

    rdnames <- SingleCellExperiment::reducedDimNames(object)
    if(length(rdnames)){
        for(n in rdnames){
            rd <- SingleCellExperiment::reducedDim(object,n)
            l4cObject <- addreduction(l4cObject,rd,n)
        }
    }

    coldata <- SummarizedExperiment::colData(object)
    if(ncol(coldata)){
        if(!is.null(groups)){
            l4cObject <- addcluster(l4cObject,coldata[,groups],myGroups=TRUE)
        }
        for(n in colnames(coldata)){
            l4cObject <- addcluster(l4cObject, coldata[,n],
                name=n, groupStatsBy=TRUE)
        }
    }

    return(l4cObject)
}
