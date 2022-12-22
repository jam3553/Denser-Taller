from numpy import NAN, NaN
import pandas as pd
import os


EC_DATA_PATH = os.path.join(os.path.curdir, "BlockGen-M2", "EC_DATA.txt")

NRLR_BUILDING = 1
NRHR_BUILDING = 2
RLR_BUILDING = 3
RHR_BUILDING = 4

print(EC_DATA_PATH)

indexes = [1, 2, 3, 4, 5]
five_types = pd.Series([0, 0, 0, 0, 0], index=indexes)

def calculate_GHG(floor_areas, envelopes, roof_areas, ec_data):
    ghg = ((floor_areas * (ec_data["EC_structure"] + ec_data["EC_a4a5c"] + ec_data["OC"]))
        + envelopes * ec_data["EC_envelope"] + roof_areas * ec_data["EC_roof"]) / 1000000000 #convert from kg to Mt
    #print(f"floor_areas: {floor_areas}\nenvelopes: {envelopes}\nroof_areas{roof_areas}\nghg{ghg}")
    return ghg




def get_stats(model_path):
    print("Path\n " + model_path + "\n")
    ec_data = pd.read_csv(EC_DATA_PATH, index_col="type")
    df = pd.read_csv(model_path, index_col="ID")
    df["Plot_Area"] = df["plot_width"] * df["plot_depth"]
    df["Building_Area"] = df["Building_Width"] * df["Building_Depth"]
    df["Lot_Coverage"] = df["Building_Area"] / df["Plot_Area"]
    types = df.groupby(["Type"])

    floor_areas = types.sum()["Floor_Area"] + five_types

    #envelop seems wrongly calculated in original, so I will use the facade area and subtract the roof area
    envelopes = types.sum()["Facade_Area"] - types.sum()["Roof_Area"]
    roof_areas = types.sum()["Roof_Area"]
    #formula from line 124 of output.js in BlockGen-M2
    WLC_MtCO2e = calculate_GHG(floor_areas, envelopes, roof_areas, ec_data)
    #((floor_areas * (ec_data["EC_structure"] + ec_data["EC_a4a5c"] + ec_data["OC"])) +
     #   envelopes * ec_data["EC_envelope"] + roof_areas * ec_data["EC_roof"]) / 1000000
    
    lot_coverage = types.sum()["Building_Area"] + types.sum()["Plot_Area"]
    fsr = floor_areas / types.sum()["Plot_Area"]

    frame = {"Floor_Area": floor_areas, "WLC_MtCO2e": WLC_MtCO2e, "Lot_Coverage": lot_coverage, "FSR": fsr}
    stats = pd.DataFrame(frame)
    #print("printing floor_areas")
    #print(floor_areas)
    #print("printing WLC")
    #print(WLC_MtCO2e)
    #print("printing EC data")
    #print(ec_data)
    #print("printing stats")
    #print(stats)
    stats.index.name = "Type"
    stats = stats.fillna(0)
    stats.to_csv(model_path[:-4] + "_stats.csv")

def combine_stats(file_paths):
    stats = {'NRHR_areas': [], 'RHR_areas': [], 'NRLR_areas': [], 'RLR_areas': [], 
        'NRHR_GHG': [], 'RHR_GHG': [], 'NRLR_GHG': [], 'RLR_GHG': []}

    for file_path in file_paths:
        print(file_path)
        model_stats = pd.read_csv(file_path, index_col="Type")
        stats["NRLR_areas"].append(model_stats["Floor_Area"][NRLR_BUILDING])
        stats['NRHR_areas'].append(model_stats["Floor_Area"][NRHR_BUILDING])
        stats['RLR_areas'].append(model_stats["Floor_Area"][RLR_BUILDING])
        stats['RHR_areas'].append(model_stats["Floor_Area"][RHR_BUILDING])
        stats['NRLR_GHG'].append(model_stats["WLC_MtCO2e"][NRLR_BUILDING])
        stats['NRHR_GHG'].append(model_stats["WLC_MtCO2e"][NRHR_BUILDING])
        stats['RLR_GHG'].append(model_stats["WLC_MtCO2e"][RLR_BUILDING])
        stats['RHR_GHG'].append(model_stats["WLC_MtCO2e"][RHR_BUILDING])
    return pd.DataFrame.from_dict(stats)



def model_path(dir, num):
    return os.path.join(os.path.curdir, dir, "Model_") + str(num) + ".csv"

for i in range(9, 352):
    dir = "New_models"
    get_stats(model_path(dir, i))
    print("finished " + str(i))

for i in range(355, 414):
    dir = "New_models"
    get_stats(model_path(dir, i))
    print("finished " + str(i))
