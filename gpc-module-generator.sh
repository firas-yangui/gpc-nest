#!/bin/sh
if [ "$#" -gt 2 ]; then
  shift
  shift
  nest generate module $1 $2 $@
  nest generate controller $1 $2 $@
  nest generate service $1 $2 $@
  exit 0
fi

nest generate module $1 $2
nest generate controller $1 $2
nest generate service $1 $2
exit 0