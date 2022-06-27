# -*- coding: utf-8 -*-
"""
Created on Sat May 14 02:50:12 2022

@author: james_gihw5at
"""
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os

# Preparing the data to subplots
x = np.linspace(0, 10, 10)
y1 = x
y2 = x ** 2
y3 = x ** 3
y4 = x ** 4

plt.figure(figsize=(10,4))

dataFilePath = os.path.join(os.path.curdir, "fixed_pop.csv")
areaPath = os.path.join(os.path.curdir, "fixed_area.csv")

areadf = pd.read_csv(areaPath, index_col="Model_ID")
df = pd.read_csv(dataFilePath, index_col="Model_ID")

area_ndwlc_col = (areadf["NDLR_WLC_MtCO2e"] + areadf["NDHR_WLC_MtCO2e"]) / areadf["People"]
area_dwlc_col = (areadf["DLR_WLC_MtCO2e"] + areadf["DLR_WLC_MtCO2e"]) / areadf["People"]
wlc_per_cap = areadf["WLC_MtCO2e"] / areadf["People"]

areadf.insert(16, "ND_WLC", area_ndwlc_col)
areadf.insert(17, "D_WLC", area_dwlc_col)
areadf.insert(18, "WLC_per_cap", wlc_per_cap)


ndwlc_col = df["NDLR_WLC"] + df["NDHR_WLC"]
dwlc_col = df["DLR_WLC"] + df["DHR_WLC"]


df.insert(16, "ND_WLC",ndwlc_col)
df.insert(17, "D_WLC", dwlc_col)



# Plot the subplots
# Plot 1
ax1 = plt.subplot(1, 2, 1)

plt.scatter(df['ND_WLC'], df['WLC_MtCO2e'])
plt.xlabel("Non-domestic Emissions (MtCO2e)")
plt.ylabel("Whole Life Cycle Emissions (MtCO2e)")

# Plot 2
plt.subplot(1, 2, 2, sharey=ax1)
plt.scatter(df['D_WLC'], df['WLC_MtCO2e'])
plt.xlabel("Domestic Emissions (MtCo2e)")

title = "Impact of Domestic and Non-domestic Whole Life Cycle Emissions"
title += (" from Pomponi et al. (2021)")

plt.suptitle(title)

# Plot 3
#plt.subplot(2, 2, 3)
#plt.plot(x, y3, ':y')

# Plot 4
#plt.subplot(2, 2, 4)
#plt.plot(x, y4, '--c')
#plt.xlabel("x marks the spot")

#plt.subplots_adjust(right=1.2)

#plt.show()



