#!/usr/bin/python3

import csv
import requests
import json
import os

# this script is going to fetch data from John Hopkins University,
# split between Brazil and World, and add the date to the World.
# It will also create a history of these informations, which can
# be valuable in the future.

url1 = "https://api.covid19api.com/summary"

download1 = requests.get(url1, stream=True)
decoded1 = download1.content.decode("UTF-8")

jsonFile = json.loads(decoded1)

# Monta dados Brasil
def br():
    # retrieve current fields
    for item in jsonFile["Countries"]:
        if item["Country"] == "Brazil":
            header = item.keys()
            data = item.values()
            time = item["Date"]

    # write the current file
    current_filename = "current_BR.csv"
    if not os.path.isfile(current_filename):
        with open(current_filename, "w") as f:
            csv_writter = csv.writer(f)
            csv_writter.writerow(header)
            csv_writter.writerow(data)

    # take care of the file with history
    history_filename = "history_BR.csv"
    with open(history_filename, "a") as f:
        csv_writter = csv.writer(f)
        # create file if it doesn't exists
        if f.tell() == 0:
            csv_writter.writerow(header)
            csv_writter.writerow(data)
        else:
            # compare TotalConfirmed, TotalDeaths and NewRecovered from the last line
            # with the current, if they match, don't write because that row already exists.
            with open(history_filename, "r") as f1:
                # need to convert to int because they are int when they come from the json
                last_line = f1.readlines()[-1].split(",")
                lastTotalConfirmed = int(last_line[4])
                lastTotalDeaths = int(last_line[6])
                lastTotalRecovred = int(last_line[8])

                current_line = list(data)
                currentTotalConfirmed = current_line[4]
                currentTotalDeaths = current_line[6]
                currentTotalRecovered = current_line[8]

                if (
                    currentTotalConfirmed != lastTotalConfirmed
                    or currentTotalDeaths != lastTotalDeaths
                    or currentTotalRecovered != lastTotalRecovred
                ):
                    csv_writter.writerow(data)


def gl():

    # retrieve fields
    header = jsonFile["Global"].keys()
    data = jsonFile["Global"].values()
    time = jsonFile["Date"]

    # global doesn't include the date, so we manually add it
    def write_global_fields(csv_writter):
        current_header = list(header)
        current_header.append("Date")
        csv_writter.writerow(current_header)

        current_data = list(data)
        current_data.append(time)
        csv_writter.writerow(current_data)

    # write the current file
    current_filename = "current_GL.csv"
    if not os.path.isfile(current_filename):
        with open(current_filename, "w") as f:
            write_global_fields(csv.writer(f))

    # take care of the file with history
    history_filename = "history_GL.csv"
    with open(history_filename, "a") as f:
        csv_writter = csv.writer(f)
        # create file if it doesn't exists
        if f.tell() == 0:
            write_global_fields(csv.writer(f))
        else:
            # compare TotalConfirmed, TotalDeaths and NewRecovered from the last line
            # with the current, if they match, don't write because that row already exists.
            with open(history_filename, "r") as f1:
                # need to convert to int because they are int when they come from the json
                last_line = f1.readlines()[-1].split(",")
                lastTotalConfirmed = int(last_line[1])
                lastTotalDeaths = int(last_line[3])
                lastTotalRecovred = int(last_line[5])

                current_line = list(data)
                currentTotalConfirmed = current_line[1]
                currentTotalDeaths = current_line[3]
                currentTotalRecovered = current_line[5]

                if (
                    currentTotalConfirmed != lastTotalConfirmed
                    or currentTotalDeaths != lastTotalDeaths
                    or currentTotalRecovered != lastTotalRecovred
                ):
                    current_line.append(time)
                    csv_writter.writerow(current_line)


br()
gl()
