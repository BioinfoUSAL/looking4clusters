installed <- function(pkg){
    return(requireNamespace(pkg, quietly=TRUE))
}

wwwDirectory <- function(){
    path <- system.file("www",package="looking4clusters")
    return(path)
}

createHTML <- function(directory, datadir, show = TRUE){
    if(!file.exists(directory))
        dir.create(directory)

    www <- wwwDirectory()
    file.copy(paste0(www,"/css"), directory, recursive=TRUE)
    file.copy(paste0(www,"/js"), directory, recursive=TRUE)
    file.copy(paste0(www,"/font"), directory, recursive=TRUE)
    file.copy(paste0(www,"/images"), directory, recursive=TRUE)

    html <- scan(file = paste0(www, "/template.html"), what = character(0),
        sep = "\n", quiet = TRUE)
    html <- gsub("<!--name-->", basename(directory), html)

    con <- file(paste0(directory, "/index.html"), "a", encoding = "UTF-8")
    write(html[seq_len(which(html=="<!--data-->")-1)],con,append=TRUE)

    for(f in dir(datadir)){
        dat <- scan(file = paste0(datadir,"/",f), what = character(0),
            sep = "\n", quiet = TRUE)
        write(c(paste0("<pre class=\"",gsub(".","_",f,fixed=TRUE),"\">"),
            dat,"</pre>"),con,append=TRUE)
    }

    write(html[(which(html=="<!--data-->")+1):length(html)],con,append=TRUE)
    close(con)

    unlink(datadir, recursive = TRUE)

    text <- paste0("The graph has been generated in the \"",
        normalizePath(directory),"\" path.")
    message(text)
    if(identical(show,TRUE)){
        if(interactive()){
            browseURL(normalizePath(paste0(directory,"/index.html")))
        }
    }
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
