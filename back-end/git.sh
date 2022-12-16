#!/bin/bash
cd /home/asplap2005/Desktop/hugo-test
if [ $1 == "Master" ]
then
git checkout main
git add .
git commit -m "files uploaded"
git push origin main
else
git checkout -b $1
git add .
git commit -m "files uploaded"
git push -u origin $1
fi
