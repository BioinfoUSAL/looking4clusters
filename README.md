# looking4clusters
Applies dimension reduction and clustering techniques and creates interactive clustering visualization plots.

# Install

```r
# installing from bioconductor
if (!require("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
BiocManager::install("looking4clusters")

# installing from github
library(devtools)
install_github('BioinfoUSAL/looking4clusters')
```

# Usage

```r
library(looking4clusters)
library(scRNAseq)
sce <- ReprocessedAllenData("tophat_counts")
counts <- t(assays(sce)$tophat_counts)

obj <- looking4clusters(counts, groups=colData(sce)[,'dissection_s'])
l4chtml(obj)
```

