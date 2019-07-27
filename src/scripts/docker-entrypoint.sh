#!/bin/bash
set -e

if [[ $(which nginx) ]]; then
  nginx &
fi

exec "$@"
