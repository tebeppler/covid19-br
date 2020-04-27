import csv
import requests
from contextlib import closing
import csv
import codecs

# This script should be run every time the CSV file changes (probably daily)
# This is going to minify a 2.2mb file into 932kb.
url = "https://brasil.io/dataset/covid19/caso?format=csv"

with closing(requests.get(url, stream=True)) as my_file:
    reader = csv.reader(
        codecs.iterdecode(my_file.iter_lines(), "utf-8"), delimiter=",", quotechar='"'
    )
    with open("public/caso.csv", "w") as result:
        wtr = csv.writer(result)
        for r in reader:
            confirmed_per_100k = r[9] if r[3] in ["state", "place_type"] else ""
            place_type = r[3][0] if r[3] != "place_type" else "place_type"
            wtr.writerow((r[0], r[1], place_type, r[4], r[5], r[8], confirmed_per_100k))
