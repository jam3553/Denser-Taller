import numpy as np
import os
import pandas as pd
import matplotlib.pyplot as plt

import matplotlib.pyplot as plt

x = np.arange(0, 5, 0.1)
y = np.sin(x)
plt.plot(x, y)

df = pd.DataFrame([[5.1, 3.5, 0], [4.9, 3.0, 0], [7.0, 3.2, 1],
                [6.4, 3.2, 1], [5.9, 3.0, 2]],
                columns=['length', 'width', 'species'])
ax1 = df.plot.scatter(x='length', y='width', c='DarkBlue')




dataFilePath = os.path.join(os.path.curdir, "fixed_pop.csv")


df = pd.read_csv(dataFilePath, index_col="Model_ID")



ndwlc_col = df["NDLR_WLC"] + df["NDHR_WLC"]
dwlc_col = df["DLR_WLC"] + df["DHR_WLC"]


df.insert(16, "ND_WLC",ndwlc_col)
df.insert(17, "D_WLC", dwlc_col)

scpt = df.plot.scatter(x='ND_WLC', y='WLC_MtCO2e')


#scpt.savefig('nd.png')

print(df)
print(df["D_WLC"].agg("mean"))
print(df["D_WLC"].agg("std"))
print(df["ND_WLC"].agg("mean"))
print(df["ND_WLC"].agg("std"))
print(df["WLC_MtCO2e"].agg("mean"))
print(df["WLC_MtCO2e"].agg("std"))

