import os
import random
import sys
import time

from file import TSV

jiffy_duration_ms = 1000 / os.sysconf("SC_CLK_TCK")
repetitions = 20
warmup = 5
results = TSV("results.tsv", ["engine", "dataset", "query", "mode", "repetition", "resolver (ms)", "proxy (ms)", "result length (b)"])

print("== SYSTEM INFORMATION ==")
print(f"Jiffy duration: {jiffy_duration_ms}ms")
print(f"Data file:      {results.path()}")
print(f"Repetitions:    {repetitions}")
print(f"Warmup:         {warmup}")
print()

from docker import Container, get_running_containers, build

containers = get_running_containers()
if len(containers) > 0:
    print("Please stop all docker containers before running this benchmark")
    sys.exit()

from datasets import datasets
from engines import engines
from os_helpers import stat
from queries import execute_query, get_query_mix

build(f"{os.getcwd()}/proxy", "benchmark/proxy")
proxy = Container(["-p=8080:8080", "--net=host", "benchmark/proxy"])

for dataset_name, dataset_path in datasets.items():
    print(f'Binding queries for [{dataset_name}]')
    queries = get_query_mix(dataset_path, repetitions + warmup)

    for engine_name in engines:
        engine_config = engines[engine_name]
        if 'excluded_datasets' in engine_config and dataset_name in engine_config['excluded_datasets']:
            print(f'Skipping [{dataset_name}] for [{engine_name}]')
            continue

        print(f'Running tests for [{dataset_name}] on [{engine_name}]')
        engine = Container([f'-v={dataset_path}:/{engine_config["data_mount_point"]}:ro'] + engine_config['config'])
        engine_pid = engine.pid()
        if 'healthcheck' not in engine_config or engine_config['healthcheck'] is True:
            engine.await_healthy()
        else:
            time.sleep(10)

        if 'post_launch' in engine_config:
            for cmd in engine_config['post_launch']:
                engine.exec(cmd)

        print(f'Engine [{engine_name}] is healthy, starting tests')
        for mode in ['plain', 'preselection', 'rewriting']:
            print(f"Evaluating mode [{mode}]")
            for query in queries:
                print(f'Evaluating [{query["type"]}]')
                engine_pre = stat(engine_pid)
                proxy_pre = stat(proxy.pid())
                user_id = random.randint(1, 30)
                result = execute_query(f"http://127.0.0.1:8080/{engine_config['endpoint'].lstrip('/')}", query['query'], {'mode': mode, 'user': f'http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/instances/dataFromVendor{user_id}/Vendor{user_id}'}).text
                engine_post = stat(engine_pid)
                proxy_post = stat(proxy.pid())

                if query['repetition'] >= warmup:
                    engine_time = (engine_post['utime'] - engine_pre['utime'] +
                                   engine_post['stime'] - engine_pre['stime'] +
                                   engine_post['cutime'] - engine_pre['cutime'] +
                                   engine_post['cstime'] - engine_pre['cstime']) * jiffy_duration_ms
                    proxy_time = (proxy_post['utime'] - proxy_pre['utime'] +
                                  proxy_post['stime'] - proxy_pre['stime'] +
                                  proxy_post['cutime'] - proxy_pre['cutime'] +
                                  proxy_post['cstime'] - proxy_pre['cstime']) * jiffy_duration_ms
                    results.write([engine_name, dataset_name, query["type"], mode, query["repetition"] - warmup, engine_time, proxy_time, len(result)])

        print(f'Testing done on [{engine_name}], shutting down')
        engine.remove()

proxy.remove()
