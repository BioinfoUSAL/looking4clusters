library(looking4clusters)

object <- looking4clusters(iris[,1:4],running_all=FALSE)
object <- addcluster(object,iris[,5],"species",myGroups=TRUE)
PCAcomponents <- prcomp(data.matrix(iris[,1:4]),scale=FALSE)
pca<-PCAcomponents$x[,1:2]
object <- addreduction(object,pca,"pca")
l4csave(object,"l4c_saved",includeData=TRUE)

# get clusters (auto)
obj <- looking4clusters(iris[,1:4], groups=iris[,5])
print(object)

# single-cell RNAseq
library(scRNAseq)
sce <- ReprocessedAllenData("tophat_counts")
counts <- assay(sce, "tophat_counts")

obj <- looking4clusters(t(counts), groups=colData(sce)[,'dissection_s'],
    components=TRUE)
plot(obj, includeData=TRUE)

# SingleCellExperiment
libsizes <- colSums(counts)
size.factors <- libsizes/mean(libsizes)
logcounts(sce) <- log2(t(t(counts)/size.factors) + 1)

pca_data <- prcomp(t(logcounts(sce)), rank=50)

reducedDims(sce) <- list(PCA=pca_data$x)

obj <- looking4clusters(sce, groups="dissection_s")
l4csave(obj,"l4c_saved")

# seurat
library(Seurat)
library(Matrix)

test_mat <- Matrix(as.matrix(iris[,1:4]),sparse=T)
rownames(test_mat) <- paste0("sample",seq_len(nrow(test_mat)))

seurat_object <- CreateSeuratObject(counts = test_mat)
seurat_object <- NormalizeData(seurat_object)
seurat_object <- ScaleData(seurat_object, features = rownames(seurat_object))

seurat_object[["CITE"]] <- CreateAssayObject(counts = test_mat[1:6,])
seurat_object <- NormalizeData(seurat_object, assay="CITE")
seurat_object <- ScaleData(seurat_object,
    features = rownames(seurat_object[["CITE"]]), assay="CITE")

seurat_object <- FindVariableFeatures(seurat_object)
seurat_object <- RunPCA(seurat_object, npcs = 2,
    features = VariableFeatures(object = seurat_object))

obj <- looking4clusters(seurat_object,assay="all")

# all 0 column
wrongmat <- matrix(c(0,0,0,0,1,3,3,2,1,2,2,1),4)
obj <- looking4clusters(wrongmat)

# all 0 row
wrongmat <- matrix(c(0,1,1,1,0,3,3,2,0,2,2,1),4)
obj <- looking4clusters(wrongmat)

# negative entries
wrongmat <- matrix(c(3,1,1,1,3,-1,-1,2,3,2,2,1),4)
obj <- looking4clusters(wrongmat)

