#!/bin/bash
echo "<======= git pull =======>"
git pull

if [ $1 = true ]; then
  echo "<======= nginx -s reload =======>"
  nginx -s reload
fi

if [ $2 = true ]; then
  echo "<======= npm install =======>"
  npm install
fi
