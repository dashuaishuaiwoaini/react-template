pm2 install pm2-logrotate && pm2 set pm2-logrotate:max_size 1M && pm2 start pm2.json --no-daemon