BRANCH=`git rev-parse --abbrev-ref HEAD`

apidoc="./node_modules/.bin/apidoc"

out=$($apidoc -i ./lib/route/v1/ -o apidocout/ 2>&1)
status=$?
if [ "$status" != "0" ]; then
    rm -rf apidocout/
    git checkout $BRANCH
    echo "$out"
    exit $status
fi

# change to gh-pages branch
git checkout gh-pages

git rm -rf apidoc/

cp -r apidocout apidoc

git add apidoc/

git commit -m "api doc update"

git push origin gh-pages

# change to original branch
git checkout $BRANCH

rm -rf apidocout/