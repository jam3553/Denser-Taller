from ntpath import join
import pandas as pd
import os

dict = {"one": [1, 2, 3, 4], "two": [2, 4, 6, 8]}
df = pd.DataFrame.from_dict(dict)
file_path = os.path.join(os.curdir, "file_testing.csv")
df.to_csv(file_path)
print(df)
print(file_path)
frame = pd.read_csv(file_path)
print(frame)