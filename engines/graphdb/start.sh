#!/bin/bash

set -e

/opt/graphdb/dist/bin/importrdf load --force --config-file /config.ttl --mode serial /dataset.ttl
/opt/graphdb/dist/bin/graphdb -Dgraphdb.home=/opt/graphdb/dist