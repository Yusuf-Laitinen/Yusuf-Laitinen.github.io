import sheetAPI as api

URL = "https://script.google.com/macros/s/AKfycbyAqRBfI5nmQ_iKLsNMzMLbOAB-zP0ExfxBYx7ex2hll_kaeFPQTv0m6HLxmGW19MN1/exec"

print(api.get_sheet_names(URL))