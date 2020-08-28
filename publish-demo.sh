rm -rf demo-build
git worktree add demo-build gh-pages
npm run demo
cd demo-build
git add --all
git commit -m "New demo build"
git push origin gh-pages
cd ..
git worktree remove demo-build
