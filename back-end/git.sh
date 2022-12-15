#!/bin/bash
cd /home/asplap2005/Desktop/hugo-test
git checkout -b $1
git add .
git commit -m "files uploaded"
git push -u origin $1