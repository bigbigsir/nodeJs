#!/bin/bash
echo "<======= git pull =======>"
git pull
echo "<======= npm install =======>"
npm install
echo "<======= nginx -s reload =======>"
nginx -s reload
echo "<======= pm2 reload all =======>"
pm2 reload all
