import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import os

stats_path = os.path.join(os.curdir, "New_models", "combined_stats.csv")

stats_df = pd.read_csv(stats_path)
stats_df["WLC_MtCO2e"] = stats_df["NRHR_GHG"] + stats_df["RHR_GHG"] + stats_df["NRLR_GHG"] + stats_df["RLR_GHG"]
stats_df["Residential_WLC"] = stats_df["RHR_GHG"] + + stats_df["RLR_GHG"]

print(stats_df["NRHR_areas"])

plt.figure(figsize=(11,7))
plt.ticklabel_format(style='plain')
plt.suptitle("Floor Areas to total MtCO2e Comparison")

ax1 = plt.subplot(2, 2, 1)
plt.xlabel("Non-residential High Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df["NRHR_areas"] / 1000, stats_df["WLC_MtCO2e"])
plt.subplot(2, 2, 2)
plt.xlabel("Residential High Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df["RHR_areas"] / 1000, stats_df["WLC_MtCO2e"])
plt.subplot(2, 2, 3)
plt.xlabel("Non-residential Low Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df["NRLR_areas"] / 1000, stats_df["WLC_MtCO2e"])
plt.subplot(2, 2, 4)
plt.xlabel("Residential Low Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df["RLR_areas"] / 1000, stats_df["WLC_MtCO2e"])

plt.figure(figsize=(11,7))
plt.ticklabel_format(style='plain')
plt.suptitle("Floor Areas to total MtCO2e Comparison (filtered for simulations with less than 1.5 million sqm of NRHR floor area)")

ax3 = plt.subplot(2, 2, 1)
plt.xlabel("Non-residential High Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["NRHR_areas"] / 1000, stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["WLC_MtCO2e"])
plt.subplot(2, 2, 2)
plt.xlabel("Residential High Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["RHR_areas"] / 1000, stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["WLC_MtCO2e"])
plt.subplot(2, 2, 3)
plt.xlabel("Non-residential Low Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["NRLR_areas"] / 1000, stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["WLC_MtCO2e"])
plt.subplot(2, 2, 4)
plt.xlabel("Residential Low Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")
plt.scatter(stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["RLR_areas"] / 1000, stats_df[stats_df.NRHR_areas + stats_df.NRLR_areas < 1500000]["WLC_MtCO2e"])

plt.figure()
plt.scatter((stats_df["NRHR_areas"] + stats_df["NRLR_areas"] )/ 1000, stats_df["WLC_MtCO2e"])

plt.figure(figsize=(10, 5))
plt.suptitle("Residntial High Rise and Low Rise Floor Area vs Residential GHG Emissions")
ax2 = plt.subplot(1, 2, 1)
plt.scatter(stats_df["RHR_areas"] / 1000, stats_df["Residential_WLC"])
#calculate equation for trendline
z = np.polyfit(stats_df["RHR_areas"] / 1000, stats_df["Residential_WLC"], 1)
print("polyfit:")
print(z)
plt.text(400, 1, "slope: " + str(np.around(z[0], 6)))
p = np.poly1d(z)
#add trendline to plot
x = stats_df["RHR_areas"] / 1000
plt.plot(x, p(x))
plt.xlabel("Residential High Rise Floor Area (thousand sqm)")
plt.ylabel("MtCO2e")

plt.subplot(1, 2, 2)
plt.scatter(stats_df["RLR_areas"] / 1000, stats_df["Residential_WLC"])
#calculate equation for trendline
z = np.polyfit(stats_df["RLR_areas"] / 1000, stats_df["Residential_WLC"], 1)
print("polyfit:")
print(z)
plt.text(400, 1, "slope: " + str(np.around(z[0], 6)))
p = np.poly1d(z)
#add trendline to plot
x = stats_df["RHR_areas"] / 1000
plt.plot(x, p(x))


