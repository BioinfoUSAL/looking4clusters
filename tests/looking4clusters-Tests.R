library(looking4clusters)

object <- create_l4c(iris[,1:4])
object <- add_cluster(object,iris[,5],"species",myGroups=TRUE)
PCAcomponents <- prcomp(data.matrix(iris[,1:4]), scale=FALSE)
pca<-PCAcomponents$x[,1:2]
object <- add_reduction(object,pca,"pca")
display_html(object)

# get clusters (auto)
obj <- l4c(iris[,1:4], groups=iris[,5])
print(object)

# single-cell RNAseq
library(scRNAseq)
sce <- ReprocessedAllenData("tophat_counts")
counts <- t(assays(sce)$tophat_counts)

obj <- l4c(counts, groups=colData(sce)[,'dissection_s'],
    components=TRUE)
plot(obj)

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

obj <- l4c_Seurat(seurat_object,assay="all")

# all 0 column
wrongmat <- matrix(c(0,0,0,0,1,3,3,2,1,2,2,1),4)
obj <- l4c(wrongmat)

# all 0 row
wrongmat <- matrix(c(0,1,1,1,0,3,3,2,0,2,2,1),4)
obj <- l4c(wrongmat)

# negative entries
wrongmat <- matrix(c(3,1,1,1,3,-1,-1,2,3,2,2,1),4)
obj <- l4c(wrongmat)

