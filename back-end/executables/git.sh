#!/bin/bash
cd /home/asplap2005/Desktop/hugo-project
currentBranch=$(git branch --show-current)
if [ $currentBranch != $1 ]
then
git checkout $1
git add .
git commit -m "files uploaded"
git push -u origin $1
else
git add .
git commit -m "files uploaded"
git push -u origin $1
fi
