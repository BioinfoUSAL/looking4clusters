## Input Vars
# selectedk: Number of clusters selected by the user.
# If 'NULL', default values are used (kmin=2,kmax=10), else, a rank of 5 units
# around 'selectedk' is calculated
##

run_kmeans <- function(object,selectedk=NULL){

data <- object$data

if(is.null(selectedk)){
    kmin<-2
    kmax<-10
}else{
    kmin<-(selectedk-5)
    kmax<-(selectedk+5)
}

if(kmin <= 1)
    kmin <- 2
if(kmax >= nrow(data))
    kmax <- nrow(data)-1
if(kmin >= kmax)
    kmin <- kmax-1

iter<-kmax-kmin+1

# kmeans (applied for all selected 'k' values)
all.kmeans<-lapply(kmin:kmax, function(k){
    kmeans(data, k, nstart=1 ,iter.max = 15)
})

if(is.null(selectedk)){
    numberClustersKmeans <- calinski_harabasz_index(iter,
        all.kmeans,nrow(data),kmin)
}else{
    numberClustersKmeans <- selectedk
}

# Clustering table

for(i in seq_len(iter)){
    clusters <- as.factor(paste0("kmeans_",all.kmeans[[i]]$cluster))
    optim_cluster <- FALSE
    if(length(levels(clusters))==numberClustersKmeans){
        optim_cluster <- TRUE
    }
    object <- add_cluster(object,clusters,"kmeans",optim_cluster=optim_cluster)
}

return(object)

# 'numberClustersKmeans' is the default number of clusters values to represent
# in the graphs if automatic mode is select, else, 'selectedk' is used. 
}

calinski_harabasz_index <- function(iter,all.kmeans,N,kmin){
    # Calinski-Harabasz Index
    SSw <- vapply(seq_len(iter), function(x){
        all.kmeans[[x]]$tot.withinss
    },numeric(1))
    SSb <- vapply(seq_len(iter), function(x){
        all.kmeans[[x]]$betweens
    },numeric(1))
    chIndex <- vapply(seq_len(iter), function(x){
        (SSb[x]*(N-(x+kmin-1)))/(SSw[x]*((x+kmin-1)-1))
    },numeric(1))

    # Number of optimum clusters
    return(which(chIndex==max(chIndex))+kmin-1)
}
