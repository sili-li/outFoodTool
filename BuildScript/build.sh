#!/bin/bash
set -x
set -e

workDir=$(cd $(dirname $0); pwd)
BuildScriptPath="BuildScript"

cd $workDir/..
rm -rf build
rm -rf $BuildScriptPath/build
# yarn install
yarn install --check-files
# yarn test:coverage
yarn build

mkdir -p $BuildScriptPath/build/
cp -rp build/* $BuildScriptPath/build/
rm -rf build/
