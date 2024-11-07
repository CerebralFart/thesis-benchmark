import os
import sys
import time

from file import TSV

jiffy_duration_ms = 1000 / os.sysconf("SC_CLK_TCK")
repetitions = 10
warmup = 5
results = TSV("results.tsv", ["engine", "dataset", "query", "repetition", "time (ms)", "result length (b)"])

print("== SYSTEM INFORMATION ==")
print(f"Jiffy duration: {jiffy_duration_ms}ms")
print(f"Data file:      {results.path()}")
print(f"Repetitions:    {repetitions}")
print(f"Warmup:         {warmup}")
print()

from docker import Container, get_running_containers

containers = get_running_containers()
if len(containers) > 0:
    print("Please stop all docker containers before running this benchmark")
    sys.exit()

from datasets import datasets
from engines import engines
from os_helpers import stat
from queries import execute_query, get_query_mix

for dataset in datasets:
    print(f'Binding queries for [{dataset}]')
    queries = get_query_mix(dataset, repetitions + warmup)

    for engine_name in engines:
        engine_config = engines[engine_name]
        if 'excluded_datasets' in engine_config and dataset_name in engine_config['excluded_datasets']:
            print(f'Skipping [{dataset_path}] for [{engine_name}]')
            continue

        print(f'Running tests for [{dataset}] on [{engine_name}]')
        engine = Container([f'-v={dataset}:/{engine_config["data_mount_point"]}:ro'] + engine_config['config'])
        engine_pid = engine.pid()
        if 'healthcheck' not in engine_config or engine_config['healthcheck'] is True:
            engine.await_healthy()
        else:
            time.sleep(10)

        if 'post_launch' in engine_config:
            for cmd in engine_config['post_launch']:
                print(cmd, engine.exec(cmd))

        print(f'Engine [{engine_name}] is healthy, starting tests')
        for query in queries:
            print(f'Evaluating [{query["type"]}]')
            stat_pre = stat(engine_pid)
            result = execute_query(f"http://127.0.0.1:8000/{engine_config['endpoint'].lstrip('/')}", query['query']).text
            stat_post = stat(engine_pid)

            if query['repetition'] >= warmup:
                time = (stat_post['utime'] - stat_pre['utime'] +
                        stat_post['stime'] - stat_pre['stime'] +
                        stat_post['cutime'] - stat_pre['cutime'] +
                        stat_post['cstime'] - stat_pre['cstime']) * jiffy_duration_ms
                results.write([engine_name, dataset, query["type"], query["repetition"] - warmup, time, len(result)])

        print(f'Testing done on [{engine_name}], shutting down')
        engine.remove()
