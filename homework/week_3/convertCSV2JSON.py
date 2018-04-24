#!/usr/bin/env python
# Dewi Mooij
# 10752978

import csv
import json

csvfile = open('ufo_gb.csv', 'r')
jsonfile = open('ufogb.json', 'w')

fieldnames = ("datetime","shape")
reader = csv.DictReader(csvfile, fieldnames)
data = json.dumps( [ row for row in reader ] )
jsonfile.write("{\"data\": " + data + "}")

csvfile.close()
jsonfile.close()
