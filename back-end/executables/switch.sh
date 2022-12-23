#!/bin/bash
cd $2
git branch | grep -v "main" | xargs git branch -D
if [ $1 == "Master" ]
then
currentBranch=$(git branch --show-current)
if [ $currentBranch != "main" ]
then
git checkout main
fi
else
git checkout -b $1
fi
