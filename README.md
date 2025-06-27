# looking4clusters
Applies dimension reduction and clustering techniques and creates interactive clustering visualization plots.

# Install

```r
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

obj <- l4c(counts, groups=colData(sce)[,'dissection_s'])
plot(obj)
```

