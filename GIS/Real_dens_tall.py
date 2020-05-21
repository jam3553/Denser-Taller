# Real world density and tallness factors
#
# Script written by: Jay H Arrehart
# Script written on: Feb 18, 2020
# Script last edited:


import pandas as pd
import numpy as np

# data = pd.read_csv('./GIS/Paris_results.csv')
data = pd.read_csv('./GIS/NYC_MAN_results.csv')

# Paris
summary_height_df = data.groupby('id_mean')['h_et_max'].mean()
summary_area_df = data.groupby('id_mean')['m2'].sum()

# NYC - Manhattan
summary_height_df = data.groupby('id_mean')['heightroof'].mean()
summary_area_df = data.groupby('id_mean')['shape_area'].sum()


# maximum tallness factor
max(summary_height_df)

# maximum density factor
max(summary_area_df) / (1000*1000) * 100
temp = summary_area_df / (1000*1000) * 100
temp = summary_area_df / (1000*1000) * 100 * 0.093  # if need to convert from ft2 to m2