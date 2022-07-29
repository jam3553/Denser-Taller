import my_model_stats
import os


def gen_file_paths(dir, start, end):
    paths = []
    for i in range(start, end):
        file = "Model_" + str(i) + "_stats.csv"
        paths.append(os.path.join(dir, file))
    return paths


test_file_paths = gen_file_paths(os.path.join(os.curdir, "Models"), 1, 9)

file_paths = gen_file_paths(os.path.join(os.curdir, "New_models"), 9, 414)

print(file_paths)
#combined_stats = (my_model_stats.combine_stats(file_paths))