import pandas as pd
import os


EC_DATA_PATH = os.path.join(os.path.curdir, "BlockGen-M2", "EC_DATA.txt")

NRLR_BUILDING = 1
NRHR_BUILDING = 2
RLR_BUILDING = 3
RHR_BUILDING = 4

print(EC_DATA_PATH)

def get_stats(model_path):
    ec_data = pd.read_csv(EC_DATA_PATH, index_col="type")
    df = pd.read_csv(model_path, index_col="ID")
    df["Plot_Area"] = df["plot_width"] * df["plot_depth"]
    df["Building_Area"] = df["Building_Width"] * df["Building_Depth"]
    df["Lot_Coverage"] = df["Building_Area"] / df["Plot_Area"]
    types = df.groupby(["Type"])

    floor_areas = types.sum()["Floor_Area"]

    #envelop seems wrongly calculated in original, so I will use the facade area and subtract the roof area
    envelopes = types.sum()["Facade_Area"] - types.sum()["Roof_Area"]
    roof_areas = types.sum()["Roof_Area"]
    #formula from line 124 of output.js in BlockGen-M2
    WLC_MtCO2e = (floor_areas * (ec_data["EC_structure"] + ec_data["EC_a4a5c"] + ec_data["OC"]) +
        envelopes * ec_data["EC_envelope"] + roof_areas * ec_data["EC_roof"]) / 1000000
    
    lot_coverage = types.mean()["Lot_Coverage"]
    fsr = floor_areas / types.sum()["Plot_Area"]

    frame = {"Floor_Area": floor_areas, "WLC_MtCO2e": WLC_MtCO2e, "Lot_Coverage": lot_coverage, "FSR": fsr}
    stats = pd.DataFrame(frame)
    print(floor_areas)
    print(WLC_MtCO2e)
    print(ec_data)
    print(stats)
    #stats.to_csv(model_path[:-4] + "_stats.csv")

def combine_stats(file_paths):
    stats = {'NRHR_areas': [], 'RHR_areas': [], 'NRLR_areas': [], 'RLR_areas': [], 
        'NRHR_GHG': [], 'RHR_GHG': [], 'NRLR_GHG': [], 'RLR_GHG': []}

    for file_path in file_paths:
        model_stats = pd.read_csv(file_path, index_col="Type")
        stats.NRLR_areas.append(model_stats["Floor_Area", NRLR_BUILDING])
        stats['NRHR_areas'].append(model_stats["Floor_Area", NRHR_BUILDING])
        stats['RLR_areas'].append(model_stats["Floor_Area", RLR_BUILDING])
        stats['RHR_areas'].append(model_stats["Floor_Area", RHR_BUILDING])
        stats['NRLR_GHG'].append(model_stats["WLC_MtCO2e", NRLR_BUILDING])
        stats['NRHR_GHG'].append(model_stats["WLC_MtCO2e", NRLR_BUILDING])
        stats['RLR_GHG'].append(model_stats["WLC_MtCO2e", NRLR_BUILDING])
        stats['RHR_GHG'].append(model_stats["WLC_MtCO2e", NRLR_BUILDING])
    return pd.DataFrame.from_dict(stats)







def model_path(num):
    return os.path.join(os.path.curdir, "Models", "Model_") + num + ".csv"

get_stats(model_path("1"))

