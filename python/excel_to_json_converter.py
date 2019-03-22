import pandas as pd
import json


if __name__ == "__main__":
    #config
    filepath = "../data/"
    filename = "weo_data_all.xlsx" 

    table = pd.ExcelFile(filepath + filename).parse()
    table = table.drop(["WEO Country Code", "ISO", "Estimates Start After"], axis=1)
    table = table.fillna("")

    countries = table["Country"]
    weo_codes = table["WEO Subject Code"]
    year_data = table.iloc[:, 7:46]
    
    data = dict([(c, {}) for c in countries.unique()])
    for i in range(len(table.index)):
        data[countries.iloc[i]][weo_codes.iloc[i]] = list(year_data.iloc[i])

    with open(filepath + "weo_data.json", "w") as file:
        json.dump(data, file)
