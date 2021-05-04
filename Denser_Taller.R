# Denser Taller Data Investigation
#
# Written by: Jay H Arehart
# Written on: Nov 13, 2019
#
#
# Script Description:
#   Exploring results from simulations
#
#
# Output
#   To be determined

# Load libraries
library(ggplot2)
library(tidyverse)
library(reshape2)
library(dplyr)
library(tidyr)
library(rio)
library(RColorBrewer)
library(data.table)
library(scales)
library(ggbiplot)
library(factoextra)
library(grid)
library(akima)
library(RSAGA)

multiplot <- function(..., plotlist=NULL, file, cols=1, layout=NULL) {
  
  
  # Make a list from the ... arguments and plotlist
  plots <- c(list(...), plotlist)
  
  numPlots = length(plots)
  
  # If layout is NULL, then use 'cols' to determine layout
  if (is.null(layout)) {
    # Make the panel
    # ncol: Number of columns of plots
    # nrow: Number of rows needed, calculated from # of cols
    layout <- matrix(seq(1, cols * ceiling(numPlots/cols)),
                     ncol = cols, nrow = ceiling(numPlots/cols))
  }
  
  if (numPlots==1) {
    print(plots[[1]])
    
  } else {
    # Set up the page
    grid.newpage()
    pushViewport(viewport(layout = grid.layout(nrow(layout), ncol(layout))))
    
    # Make each plot, in the correct location
    for (i in 1:numPlots) {
      # Get the i,j matrix positions of the regions that contain this subplot
      matchidx <- as.data.frame(which(layout == i, arr.ind = TRUE))
      
      print(plots[[i]], vp = viewport(layout.pos.row = matchidx$row,
                                      layout.pos.col = matchidx$col))
    }
  }
}



# Set working directory
# setwd("~/Google Drive (CU)/_Research/12_Edinburgh/Denser Taller/Analysis")
setwd("~/Google Drive/_Research/12_Edinburgh/Denser Taller/Analysis")

# Import datasets from excel into dataframes
data_list <- import_list("fixed_pop.xlsx")
df_20k <- data_list$`20K`
df_30k <- data_list$`30K`
df_40k <- data_list$`40K`
df_50k <- data_list$`50K`
rm(data_list)

data_list <- import_list("fixed_area.xlsx")
df_area <- data_list$area
rm(data_list)


# Fixed Area Scenario

fixed_area.pca <- prcomp(df_area[,c(2,3,4,6)], center = TRUE,scale. = TRUE)

summary(fixed_area.pca)
ggbiplot(fixed_area.pca)
ggbiplot(fixed_area.pca,ellipse=TRUE)
fviz_eig(fixed_area.pca)

# ggplot(data=df_area, aes(x=People_Thousands, y=WLC_MtCO2e, color=Density_Factor)) +
#   geom_point() +
#   scale_color_gradientn(colours = rainbow(5))
# 
# ggplot(data=df_area, aes(x=People_Thousands, y=WLC_MtCO2e, color=Height_m)) +
#   geom_point() +
#   scale_color_gradientn(colours = rainbow(5))

Fig5 <- ggplot(df_area, aes(People_Thousands, WLC_MtCO2e, fill = Density_Factor, size = Height_m)) +
  geom_point(shape = 21, stroke = 0.5, alpha=0.6) + # change the thickness of the boarder with stroke
  scale_fill_gradientn(name = 'Density Factor',colours = rainbow(7)) +
  scale_size(name = 'Tallness Factor', range = c(2,6)) +
  theme_bw(base_size = 12) +
  xlab('Thousands of People') +
  ylab(expression("Life Cycle GHG Emissions (MtCO"[2]*"e)"))
plot(Fig5)
# ggsave('Final_Fig_5_WLC_vs_ppl_fixed_area.png', plot = Fig5, dpi = 600, width=8, height=8, units = "in")

# ---- Clustering Analysis:
set.seed(2)

km.out = kmeans(df_area[,c(2,3)],14, nstart=20)
ggplot(df_area, aes(Height_m, Density_Factor)) +
  geom_point(col = km.out$cluster, shape = 21, size = 3, alpha=0.6) +
  theme_bw(base_size = 12) +
  scale_color_brewer(palette='Spectral')

# Resutls of clustering analysis:
# Nothing interesting in separating out density/tallness by the factors.


# Fixed land area (plotting all data!)
F_20k <- ggplot(df_20k, aes(x=Land_Area_km2, y=WLC_MtCO2e, fill = Density_Factor, size = Height_m)) +
  geom_point(shape = 21, stroke = 0.5, alpha=0.6) +
  scale_fill_gradientn(name = 'Density Factor', colours = rainbow(7)) +
  scale_size(name = 'Tallness Factor', range = c(2,6)) +
  theme_bw(base_size = 12) +
  xlab('Land Area (square kms)') +
  ylab(expression("Whole Life Carbon (MtCO"[2]*")")) +
  xlim(c(0,4)) +
  ylim(c(0,50)) +
  ggtitle('20k')
F_30k <- ggplot(df_30k, aes(x=Land_Area_km2, y=WLC_MtCO2e, fill = Density_Factor, size = Height_m)) +
  geom_point(shape = 21, stroke = 0.5, alpha=0.6) +
  scale_fill_gradientn(name = 'Density Factor', colours = rainbow(7)) +
  scale_size(name = 'Tallness Factor', range = c(2,6)) +
  theme_bw(base_size = 12) +
  xlab('Land Area (square kms)') +
  ylab(expression("Whole Life Carbon (MtCO"[2]*")")) +
  xlim(c(0,4)) +
  ylim(c(0,50)) +
  ggtitle('30k')
F_40k <- ggplot(df_40k, aes(x=Land_Area_km2, y=WLC_MtCO2e, fill = Density_Factor, size = Height_m)) +
  geom_point(shape = 21, stroke = 0.5, alpha=0.6) +
  scale_fill_gradientn(name = 'Density Factor', colours = rainbow(7)) +
  scale_size(name = 'Tallness Factor', range = c(2,6)) +
  theme_bw(base_size = 12) +
  xlab('Land Area (square kms)') +
  ylab(expression("Whole Life Carbon (MtCO"[2]*")")) +
  xlim(c(0,4)) +
  ylim(c(0,50)) +
  ggtitle('40k')
F_50k <- ggplot(df_50k, aes(x=Land_Area_km2, y=WLC_MtCO2e, fill = Density_Factor, size = Height_m)) +
  geom_point(shape = 21, stroke = 0.5, alpha=0.6) + # change the thickness of the boarder with stroke
  scale_fill_gradientn(name = 'Density Factor', colours = rainbow(7)) +
  scale_size(name = 'Tallness Factor', range = c(2,6)) +
  theme_bw(base_size = 12) +
  xlab('Land Area (square kms)') +
  ylab(expression("Whole Life Carbon (MtCO"[2]*")")) +
  xlim(c(0,4.1)) +
  ylim(c(0,60)) +
  ggtitle('50k')

multiplot(F_20k, F_30k, F_40k, F_50k, cols=2)
plot(F_20k)
plot(F_30k)
plot(F_40k)
plot(F_50k)

# ggsave('WLC_vs_area_fixed_pop_20k.png', plot=(F_20k), dpi = 600, width=8, height=6, units = "in")
# ggsave('WLC_vs_area_fixed_pop_30k.png', plot=(F_30k), dpi = 600, width=8, height=6, units = "in")
# ggsave('WLC_vs_area_fixed_pop_40k.png', plot=(F_40k), dpi = 600, width=8, height=6, units = "in")
# ggsave('WLC_vs_area_fixed_pop_50k.png', plot=(F_50k), dpi = 600, width=8, height=6, units = "in")


#------ Separate out by quantiles ------

df_all = rbind(df_20k, df_30k, df_40k, df_50k)

# Plot density and tallness factors by their distributions and color by their quantiles

# Density Factor
DF_histogram <- ggplot(df_all, aes(x=Density_Factor)) +
  geom_histogram(binwidth=1,aes(y=..density..), colour="black", fill="white")+
  geom_density(alpha=.2, fill="#FF6666") +
  theme_bw(base_size = 16) +
  xlab('Density Factor') +
  ylab('Density') +
  xlim(c(0,60)) +
  ylim(c(0,0.06))
plot(DF_histogram)
# ggsave('Histogram_density.png', plot=(DF_histogram), dpi = 600, width=4, height=4, units = "in")

dt <- data.frame(x=c(1:nrow(df_all)), y=df_all$Density_Factor)
dens <- density(dt$y)
df <- data.frame(x=dens$x, y=dens$y)
probs <- c(0, 0.25, 0.5, 0.75, 1)
quantiles <- quantile(dt$y, prob=probs)
df$quant <- factor(findInterval(df$x,quantiles))
DF_histogram_quant <-ggplot(df, aes(x,y)) +
  geom_line() +
  geom_ribbon(aes(ymin=0, ymax=y, fill=quant)) +
  # scale_x_continuous(breaks=quantiles) +
  scale_fill_brewer(palette = "Greens", guide="none") +
  theme_bw(base_size = 16) +
  xlab('Density Factor') +
  ylab('Density') +
  xlim(c(0,60)) +
  ylim(c(0,0.06))
# ggsave('Histogram_density_quant.png', plot=(DF_histogram_quant), dpi = 600, width=4, height=4, units = "in")



# Tallness Factor
TF_histogram <- ggplot(df_all, aes(x=Height_m)) +
  geom_histogram(binwidth=1,aes(y=..density..), colour="black", fill="white")+
  geom_density(alpha=.2, fill="darkblue") +
  theme_bw(base_size = 16) +
  xlab('Tallness Factor') +
  ylab('Density') +
  xlim(c(0,80)) +
  ylim(c(0,0.05))
plot(TF_histogram)
# ggsave('Histogram_tallness.png', plot=(TF_histogram), dpi = 600, width=4, height=4, units = "in")


dt <- data.frame(x=c(1:nrow(df_all)), y=df_all$Height_m)
dens <- density(dt$y)
df <- data.frame(x=dens$x, y=dens$y)
probs <- c(0, 0.25, 0.5, 0.75, 1)
quantiles <- quantile(dt$y, prob=probs)
df$quant <- factor(findInterval(df$x,quantiles))
TF_histogram_quant <- ggplot(df, aes(x,y)) +
  geom_line() +
  geom_ribbon(aes(ymin=0, ymax=y, fill=quant)) +
  # scale_x_continuous(breaks=quantiles) +
  scale_fill_brewer(guide="none") +
  theme_bw(base_size = 16) +
  xlab('Tallness Factor') +
  ylab('Density') +
  xlim(c(0,80)) +
  ylim(c(0,0.05))
# ggsave('Histogram_tallness_quant.png', plot=(TF_histogram_quant), dpi = 600, width=4, height=4, units = "in")

# Quantiles of the data are:
quantile(df_all$Height_m)
quantile(df_all$Density_Factor)


# Select out data based upon upper or lower quartile and then plot:
lower_bound = 0.25
upper_bound = 0.75
df_all_LDLR = df_all[df_all$Density_Factor < quantile(df_all$Density_Factor, lower_bound) &
                       df_all$Height_m < quantile(df_all$Height_m, lower_bound), ]
df_all_LDHR = df_all[df_all$Density_Factor < quantile(df_all$Density_Factor, lower_bound) &
                       df_all$Height_m > quantile(df_all$Height_m, upper_bound), ]
df_all_HDLR = df_all[df_all$Density_Factor > quantile(df_all$Density_Factor, upper_bound) &
                       df_all$Height_m < quantile(df_all$Height_m, lower_bound), ]
df_all_HDHR = df_all[df_all$Density_Factor > quantile(df_all$Density_Factor, upper_bound) &
                       df_all$Height_m > quantile(df_all$Height_m, upper_bound), ]

df_all_LDLR = mutate(df_all_LDLR, urban_typ = "LDLR")
df_all_LDHR = mutate(df_all_LDHR, urban_typ = "LDHR")
df_all_HDLR = mutate(df_all_HDLR, urban_typ = "HDLR")
df_all_HDHR = mutate(df_all_HDHR, urban_typ = "HDHR")

df_sub_class = rbind(df_all_LDLR, df_all_LDHR, df_all_HDLR, df_all_HDHR)
df_sub_class$People_class = as.factor(df_sub_class$People_class)

fixed_pop_subset_a <- ggplot(df_sub_class, aes(x=Land_Area_km2, y=WLC_MtCO2e)) +
  geom_point(aes(fill = People_class), shape = 21, stroke = 0.5, alpha=0.6) +
  theme_bw(base_size = 16) +
  scale_fill_brewer(palette="Accent", name='Population') +
  xlab(expression('Land Area (km'^2*")")) +
  ylab(expression("Life Cycle GHG")) +
  xlim(c(0,4.1)) +
  ylim(c(0,50)) +
  facet_wrap( ~urban_typ)
fixed_pop_subset_b <- ggplot(df_sub_class, aes(x=Land_Area_km2, y=WLC_MtCO2e, fill = Density_Factor, size = Height_m)) +
  geom_point(shape = 21, stroke = 0.5, alpha=0.6) +
  scale_fill_gradientn(name = 'Density Factor', colours = rainbow(7)) +
  scale_size(name = 'Tallness Factor', range = c(2,6)) +
  theme_bw(base_size = 16) +
  xlab(expression('Land Area (km'^2*")")) +
  ylab(expression("Life Cycle GHG Emissions (MtCO"[2]*"e)")) +
  xlim(c(0,4.1)) +
  ylim(c(0,50)) +
  facet_wrap( ~People_class)
plot(fixed_pop_subset_a)
plot(fixed_pop_subset_b)
# ggsave('Fig3_fixed_pop_subset_a.png', plot=(fixed_pop_subset_a), dpi = 600, width=10, height=8, units = "in")
# ggsave('Final_Fig2_fixed_pop_subset_b.png', plot=(fixed_pop_subset_b), dpi = 600, width=10, height=8, units = "in")



# Figure 4 - box and whisker plots ----------

df_sub_class_melt = reshape2::melt(df_sub_class,
                         id.vars = c('Model_ID','People_class'),
                         measure.vars=c("NDLR_Count","NDHR_Count","DLR_Count","DHR_Count","HOUSE_Count") )

F4_boxplot <- ggplot(df_sub_class_melt) +
  geom_boxplot(aes(x=variable, y=value)) +
  # geom_violin(aes(x=variable, y=value)) +
  theme_bw(base_size = 16) +
  xlab("") +
  scale_x_discrete(labels = c("NDLR","NDHR","DLR","DHR","House")) +
  ylab("Count") +
  facet_wrap(~People_class, ncol=2)
plot(F4_boxplot)
# ggsave('Fig4_boxplot.png', plot=F4_boxplot, dpi = 600, width=10, height=8, units = "in")

# Heat maps / Carpet Plots -----

n_interpolation <- 100
xo = seq(15,55, length=n_interpolation)
yo = seq(15,80, length=n_interpolation)

my_interp <- function(x,y,z, xo, yo, n_interpolation, my_class) {
  x = x
  y = y
  z = z
  spline_interpolated <- interp(x, y, z,
                                xo=xo,
                                yo=yo,
                                linear = TRUE, extrap = TRUE)
  xy_grid = expand.grid(spline_interpolated$x, spline_interpolated$y)
  result <- cbind(xy_grid, as.vector(spline_interpolated$z))
  colnames(result) <- c("DF","TF","WLC")
  mutate(result, People_class = my_class)
}

xyz_20k <- my_interp(df_20k$Density_Factor, df_20k$Height_m, df_20k$WLC_MtCO2e,
                      xo, yo, n_interpolation, "20k")

xyz_30k <- my_interp(df_30k$Density_Factor, df_30k$Height_m, df_30k$WLC_MtCO2e,
                     xo, yo, n_interpolation, "30k")

xyz_40k <- my_interp(df_40k$Density_Factor, df_40k$Height_m, df_40k$WLC_MtCO2e,
                     xo, yo, n_interpolation, "40k")

xyz_50k <- my_interp(df_50k$Density_Factor, df_50k$Height_m, df_50k$WLC_MtCO2e,
                     xo, yo, n_interpolation, "50k")

xyz = rbind(xyz_20k, xyz_30k, xyz_40k, xyz_50k)

carpet <- ggplot(xyz, aes(DF,TF, fill=WLC)) +
  geom_tile() +
  scale_fill_distiller(palette = "Spectral",
                       limits = c(min(xyz$WLC), max(xyz$WLC)),
                       na.value="transparent",
                       name = expression("LCGE (MtCO"[2]*")")) +
  theme_bw(base_size = 16) +
  # scale_fill_discrete(name = "LCGHG") +
  xlab("Density Factor") +
  ylab("Tallness Factor") +
  xlim(c(15,55)) +
  ylim(c(15,80)) +
  facet_wrap(~People_class, ncol=2)
plot(carpet)

# ggsave('Final_Fig6_carpet.png', plot=carpet, dpi = 600, width=10, height=8, units = "in")
 
# Summary statistics for Table 2


df_area_LDLR = df_area[df_area$Density_Factor < quantile(df_area$Density_Factor, lower_bound) &
                         df_area$Height_m < quantile(df_area$Height_m, lower_bound), ]
df_area_LDHR = df_area[df_area$Density_Factor < quantile(df_area$Density_Factor, lower_bound) &
                         df_area$Height_m > quantile(df_area$Height_m, upper_bound), ]
df_area_HDLR = df_area[df_area$Density_Factor > quantile(df_area$Density_Factor, upper_bound) &
                         df_area$Height_m < quantile(df_area$Height_m, lower_bound), ]
df_area_HDHR = df_area[df_area$Density_Factor > quantile(df_area$Density_Factor, upper_bound) &
                         df_area$Height_m > quantile(df_area$Height_m, upper_bound), ]
# LDLR
mean(df_area_LDLR$WLC_MtCO2e)
sd(df_area_LDLR$WLC_MtCO2e)
mean(df_area_LDLR$People_Thousands)
sd(df_area_LDLR$People_Thousands)

# LDHR
mean(df_area_LDHR$WLC_MtCO2e)
sd(df_area_LDHR$WLC_MtCO2e)
mean(df_area_LDHR$People_Thousands)
sd(df_area_LDHR$People_Thousands)

# HDLR
mean(df_area_HDLR$WLC_MtCO2e)
sd(df_area_HDLR$WLC_MtCO2e)
mean(df_area_HDLR$People_Thousands)
sd(df_area_HDLR$People_Thousands)

# HDHR
mean(df_area_HDHR$WLC_MtCO2e)
sd(df_area_HDHR$WLC_MtCO2e)
mean(df_area_HDHR$People_Thousands)
sd(df_area_HDHR$People_Thousands)

# TABLE 2 Fixed population (just toggle filter line (just below))
data = filter(df_all_HDHR, People_class=="50k" )

mean(data$WLC_MtCO2e)
sd(data$WLC_MtCO2e)
mean(data$Land_Area_km2)
sd(data$Land_Area_km2)

# TABLE 2 Fixed population (just toggle filter line (just below))
data = filter(df_all_HDHR, People_class=="20k" )

mean(data$WLC_MtCO2e)
sd(data$WLC_MtCO2e)
mean(data$Land_Area_km2)
sd(data$Land_Area_km2)


## ----
## NEW FIGURE DURING REVIEWER COMMENTS
# Distribution of domestic or non-domestic.

# Go from Counts to Means
df_20k_perc <- df_20k %>%
  mutate(total_count = NDLR_Count + NDHR_Count + DLR_Count + DHR_Count + HOUSE_Count) %>%
  mutate(NDLR_perc = NDLR_Count / total_count * 100) %>%
  mutate(NDHR_perc = NDHR_Count / total_count * 100) %>%
  mutate(DLR_perc = DLR_Count / total_count * 100) %>%
  mutate(DHR_perc = DHR_Count / total_count * 100) %>%
  mutate(HOUSE_perc = HOUSE_Count / total_count * 100) %>%
  mutate(check = NDLR_perc + NDHR_perc + DLR_perc + DHR_perc + HOUSE_perc)
df_30k_perc <- df_30k %>%
  mutate(total_count = NDLR_Count + NDHR_Count + DLR_Count + DHR_Count + HOUSE_Count) %>%
  mutate(NDLR_perc = NDLR_Count / total_count * 100) %>%
  mutate(NDHR_perc = NDHR_Count / total_count * 100) %>%
  mutate(DLR_perc = DLR_Count / total_count * 100) %>%
  mutate(DHR_perc = DHR_Count / total_count * 100) %>%
  mutate(HOUSE_perc = HOUSE_Count / total_count * 100) %>%
  mutate(check = NDLR_perc + NDHR_perc + DLR_perc + DHR_perc + HOUSE_perc)
df_40k_perc <- df_40k %>%
  mutate(total_count = NDLR_Count + NDHR_Count + DLR_Count + DHR_Count + HOUSE_Count) %>%
  mutate(NDLR_perc = NDLR_Count / total_count * 100) %>%
  mutate(NDHR_perc = NDHR_Count / total_count * 100) %>%
  mutate(DLR_perc = DLR_Count / total_count * 100) %>%
  mutate(DHR_perc = DHR_Count / total_count * 100) %>%
  mutate(HOUSE_perc = HOUSE_Count / total_count * 100) %>%
  mutate(check = NDLR_perc + NDHR_perc + DLR_perc + DHR_perc + HOUSE_perc)
df_50k_perc <- df_50k %>%
  mutate(total_count = NDLR_Count + NDHR_Count + DLR_Count + DHR_Count + HOUSE_Count) %>%
  mutate(NDLR_perc = NDLR_Count / total_count * 100) %>%
  mutate(NDHR_perc = NDHR_Count / total_count * 100) %>%
  mutate(DLR_perc = DLR_Count / total_count * 100) %>%
  mutate(DHR_perc = DHR_Count / total_count * 100) %>%
  mutate(HOUSE_perc = HOUSE_Count / total_count * 100) %>%
  mutate(check = NDLR_perc + NDHR_perc + DLR_perc + DHR_perc + HOUSE_perc)


# calculate mean percentage
mean_20k <- df_20k_perc %>%
  select(NDLR_perc, NDHR_perc, DLR_perc, DHR_perc, HOUSE_perc) %>%
  summarise_each(funs(mean)) %>%
  mutate(Pop = '20k')

mean_30k <- df_30k_perc %>%
  select(NDLR_perc, NDHR_perc, DLR_perc, DHR_perc, HOUSE_perc) %>%
  summarise_each(funs(mean)) %>%
  mutate(Pop = '30k')

mean_40k <- df_40k_perc %>%
  select(NDLR_perc, NDHR_perc, DLR_perc, DHR_perc, HOUSE_perc) %>%
  summarise_each(funs(mean)) %>%
  mutate(Pop = '40k')

mean_50k <- df_50k_perc %>%
  select(NDLR_perc, NDHR_perc, DLR_perc, DHR_perc, HOUSE_perc) %>%
  summarise_each(funs(mean)) %>%
  mutate(Pop = '50k')

df_mean <- as_tibble(bind_rows(mean_20k, mean_30k, mean_40k, mean_50k)) %>%
  rename(NDLR = NDLR_perc, NDHR = NDHR_perc, DLR = DLR_perc, DHR = DHR_perc, HOUSE = HOUSE_perc) %>%
  mutate(DLR = - DLR) %>%
  mutate(DHR = - DHR) %>%
  mutate(HOUSE = - HOUSE)
  

plot_my_mean <- tibble(reshape2::melt(df_mean, id = c("Pop"))) %>%
  mutate_if(is.factor, as.character) %>%
  mutate(state = case_when(
    startsWith(variable, 'ND') ~ 'Non-Domestic',
    startsWith(variable, 'D') ~ 'Domestic',
    startsWith(variable, 'H') ~ 'Domestic',
    TRUE ~ NA_character_))
plot_my_mean <- plot_my_mean %>%
  rename(Population = Pop, Typology = variable, Count = value)


my_plot_rev <- ggplot(plot_my_mean, aes(x = Population, y = Count, fill = Typology)) +
  geom_bar(stat = "identity", color = 'black', alpha = 0.9) +
  coord_flip() +
  ylab('Distribution of Building Typology (%)') +
  scale_y_continuous(breaks = c(-60, -40, -20, 0, 20, 40, 60), labels = c(60, 40, 20, 0, 20, 40, 60)) +
  theme_bw() +
  scale_fill_brewer(palette = "Accent") +
  theme(plot.margin = unit(c(1,1,2,1), "lines"))
my_plot_rev
# ggsave('my_plot_rev.png', plot = my_plot_rev, dpi = 600, width=6, height=3, units = "in")





### standard dev.
std_20k <- df_20k %>%
  select(NDLR_Count, NDHR_Count, DLR_Count, DHR_Count, HOUSE_Count) %>%
  summarise_each(funs(sd)) %>%
  mutate(Pop = '20k')

std_30k <- df_30k %>%
  select(NDLR_Count, NDHR_Count, DLR_Count, DHR_Count, HOUSE_Count) %>%
  summarise_each(funs(sd)) %>%
  mutate(Pop = '30k')

std_40k <- df_40k %>%
  select(NDLR_Count, NDHR_Count, DLR_Count, DHR_Count, HOUSE_Count) %>%
  summarise_each(funs(sd)) %>%
  mutate(Pop = '40k')

std_50k <- df_50k %>%
  select(NDLR_Count, NDHR_Count, DLR_Count, DHR_Count, HOUSE_Count) %>%
  summarise_each(funs(sd)) %>%
  mutate(Pop = '50k')

df_std <- as_tibble(bind_rows(std_20k, std_30k, std_40k, std_50k)) %>%
  rename(NDLR = NDLR_Count, NDHR = NDHR_Count, DLR = DLR_Count, DHR = DHR_Count, HOUSE = HOUSE_Count) %>%
  mutate(DLR = - DLR) %>%
  mutate(DHR = - DHR) %>%
  mutate(HOUSE = - HOUSE)

plot_my_std <- tibble(reshape2::melt(df_std, id = c("Pop")))
plot_my_std <- plot_my_std %>%
  rename(Population = Pop, Typology = variable, SD = value)

plot_w_error <- bind_cols(plot_my_mean, plot_my_std$SD) %>%
  rename(SD = ...5)


my_plot_rev <- ggplot(plot_w_error, aes(x = Population, y = Count, fill = Typology)) + 
  geom_bar(stat = "identity", color = 'black', alpha = 0.9) +
  geom_errorbar(aes(ymin=Count-SD, ymax=Count+SD), width=0.2, position=position_dodge(0.2)) +
  coord_flip() +
  ylab('Count of Building Typology') +
  theme_bw() +
  scale_fill_brewer(palette = "Accent")
my_plot_rev
# ggsave('my_plot_rev_error.png', plot = my_plot_rev, dpi = 600, width=6, height=3, units = "in")





