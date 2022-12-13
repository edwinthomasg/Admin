#!/bin/bash
cd /home/asplap2005/Desktop/hugo-test
git remote set-url origin https://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@github.com/edwinthomasg/hugo-test.git
git add .
git commit -m "changes"
git push origin -u main
rm -f .git/index.lock