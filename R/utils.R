wwwDirectory <- function(){
    path <- system.file("www",package="looking4clusters")
    return(path)
}

adjacency <- function(x){
    if(is.numeric(x)){
        source <- rep(seq_len(nrow(x))-1,ncol(x))
        target <- rep(seq_len(ncol(x))-1,rep(nrow(x),ncol(x)))
        value <- signif(as.vector(x),3)
        return(cbind(source,target,value))
    }
}

clean_names <- function(name){
    return(gsub("[^A-Za-z0-9]","_",name))
}

indexfile <- function(directory){
    return(file.path(directory,"index.html"))
}

create_l4c_directory <- function(directory){
    if(file.exists(directory)){
        stoptext <- paste0("directory: '",directory,"' already exists")
        if(file.exists(indexfile(directory))){
            content <- scan(file = indexfile(directory), what = character(0),
                sep = "\n", quiet = TRUE)
            if(sum(content=="<!-- BioinfoUSAL looking4clusters -->")==1){
                unlink(directory, recursive = TRUE)
            }else{
                stop(stoptext)
            }
        }else{
            stop(stoptext)
        }
    }
    dir.create(directory)
}
