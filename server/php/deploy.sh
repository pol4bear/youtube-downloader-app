#!/bin/bash

# Print permission denied message and exit.
function permission_error {
  echo "Check your permission for $1"
  exit 1
}

if [ "$#" -ne 1 ] && [ "$#" -ne 2 ]
then
  # Print error and exit if user didn't execute with valid command.
  echo "Usage: $0 [Document root] [Sub directory]"
  exit 1
elif [ ! -d "$1" ]
then
  # Print error and exit if document root not exists.
  echo "Document root not exists"
  exit 1
fi

# Get directory where script exists.
base_dir=$(dirname `readlink -f "$0"`)

# Get absolute path of document root.
before_dir=$(realpath $1/..)

# Move src to parent directory of document root.
if \cp -r $base_dir/src $before_dir > /dev/null 2>&1;
then
  echo "src moved to $before_dir/src"
else
  permission_error $before_dir
fi

deploy_path=$1

# Create sub directory if sub directory is requested.
if [ "$#" -eq 2 ]
then
  deploy_path+="/$2"
  if [ ! -d $deploy_path ]
  then
    if mkdir -p $deploy_path > /dev/null 2>&1;
    then
      echo "Sub directory $deploy_path created"
    else
      permission_error $deploy_path
    fi
  fi
fi

# Move files to deploy path
if \cp $base_dir/public/* $deploy_path > /dev/null 2>&1;
then
  echo "Files in public directory moved to $deploy_path"
else
  permission_error $deploy_path
fi

# Fix require path of php source if it deployed in sub directory.
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
