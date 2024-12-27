#!/bin/bash

/app/IndexBuilderMain -f /dataset.ttl -i /data/
/app/ServerMain -p 7001 -i /data/
