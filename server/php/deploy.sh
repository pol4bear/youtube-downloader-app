#!/bin/bash
if [ "$#" -ne 1 ] && [ "$#" -ne 2 ]
then
  echo "Usage: $0 [Document root] [Sub directory]"
  exit 1
fi
echo $1
if [ ! -d "$1" ]
then
  echo "Document root not exists"
  exit 1
fi

cp -r src $1/..
echo "src moved to $1/.."

deploy_path=$1
if [ "$#" -eq 2 ]
then
  deploy_path+="/$2"
  if [ ! -d $deploy_path ]
  then
    mkdir -p $deploy_path
    echo "Sub directory $deploy_path created"
  fi
fi

cp public/* $deploy_path
echo "Files in public directory moved to $deploy_path"

if [ "$#" -eq 2 ]
then
  relative_path=$(realpath --relative-to=$deploy_path $1/../src)
  find public -type f -printf "%f\n" | while read file; do
    sed -i "s~require_once '../src~require_once '$relative_path~g" $deploy_path/$file
    sed -i "s~require '../src~require '$relative_path~g" $deploy_path/$file
  done
  echo "Require paths changed"
fi

echo "Deploy finished"
