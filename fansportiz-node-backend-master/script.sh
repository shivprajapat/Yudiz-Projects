#!/bin/bash

code-server --bind-addr 0.0.0.0:8080 $PASSWORD &
pm2-runtime start index.js
