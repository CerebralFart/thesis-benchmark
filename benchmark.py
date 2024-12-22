import logging
import os
import random
import sys
import time

from file import TSV

repetitions = 20
warmup = 5
results = TSV("results.tsv", ["engine", "dataset", "query", "mode", "repetition", "resolver (ms)", "proxy (ms)", "result length (b)"])

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)

logging.info("== SYSTEM INFORMATION ==")
logging.info(f"Data file:      {results.path()}")
logging.info(f"Repetitions:    {repetitions}")
logging.info(f"Warmup:         {warmup}")

from docker import Container, get_running_containers, build

containers = get_running_containers()
if len(containers) > 0:
    logging.error("Please stop all docker containers before running this benchmark")
    sys.exit()

from datasets import datasets
from engines import engines
from queries import execute_query, get_query_mix

build(f"{os.getcwd()}/proxy", "benchmark/proxy")
proxy = Container(["-p=8080:8080", "--net=host", "benchmark/proxy"])

for dataset_name, dataset_path in datasets.items():
    logging.info(f'Binding queries for [{dataset_name}]')
    queries = get_query_mix(repetitions + warmup)

    for engine_name in engines:
        engine_config = engines[engine_name]
        if 'excluded_datasets' in engine_config and dataset_name in engine_config['excluded_datasets']:
            logging.info(f'Skipping [{dataset_name}] for [{engine_name}]')
            continue

        logging.info(f'Running tests for [{dataset_name}] on [{engine_name}]')
        engine = Container([f'-v={dataset_path}:/{engine_config["data_mount_point"]}:ro'] + engine_config['config'])
        engine_pid = engine.pid()
        if 'healthcheck' not in engine_config or engine_config['healthcheck'] is True:
            engine.await_healthy()
        else:
            time.sleep(10)

        if 'post_launch' in engine_config:
            for cmd in engine_config['post_launch']:
                engine.exec(cmd)

        logging.info(f'Engine [{engine_name}] is healthy, starting tests')
        for mode in ['plain', 'preselection', 'rewriting']:
            logging.info(f"Evaluating mode [{mode}]")
            for query in queries:
                logging.info(f'Evaluating [{query["type"]}]')
                user_id = random.randint(1, 30)
                result = execute_query(f"http://127.0.0.1:8080/{engine_config['endpoint'].lstrip('/')}", query['query'], {'mode': mode, 'user': f'http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/instances/dataFromVendor{user_id}/Vendor{user_id}'})

                if query['repetition'] >= warmup:
                    timings = {name.split(';')[0]: int(name.split('=')[1]) for name in result.headers['server-timing'].split(', ')}
                    results.write([
                        engine_name,
                        dataset_name,
                        query["type"],
                        mode,
                        query["repetition"] - warmup,
                        timings['execution'],
                        timings['preselection'] if 'preselection' in timings else timings['rewriting'] if 'rewriting' in timings else 0,
                        len(result.text)
                    ])

        logging.info(f'Testing done on [{engine_name}], shutting down')
        engine.remove()

proxy.remove()
