import my_model_stats
import os

def gen_file_paths(dir, num):
    paths = []
    for i in range(num):
        file = "Model_" + str(i + 1) + ".csv"
        paths.append(os.path.join(dir, file))
    return paths


file_paths = gen_file_paths(os.path.join(os.curdir, "Models"), 8)

#for path in file_paths:
    #my_model_stats.get_stats(path)

my_model_stats.combine_stats(file_paths)