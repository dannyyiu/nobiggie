#!/usr/bin/env python

dir_list = []
with open('pose_dir.dat', 'r') as r:
    for line in r.readlines():
        if "NeverTooBig" not in line and \
            "Kids" not in line and \
            "f4_" not in line:
            dir_list.append(line)
with open('pose_dir.dat', 'w') as w:
    for line in dir_list:
        w.write(line)