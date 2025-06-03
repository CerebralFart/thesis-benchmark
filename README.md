# Thesis Proxy

This repository is part of the replication package of my thesis. Other parts can be found at:

- [Authorization Proxy](https://github.com/CerebralFart/thesis-proxy)
- [Benchmarking Results](https://github.com/CerebralFart/thesis-results)

This repository contains the code for the benchmarking script described in my thesis. Below are instructions on how to build and execute it.

## Configuring the Benchmark

The configuration of the benchmark is defined per engine, and can be found in `engines.py`.

Some engines require a license file, these need to be put in the respective folder of the engine, the filename can be found in `engines.py`

Using the `excluded_datasets` parameter, you can specify which datasets should not be loaded into said engine.

## Installing dependencies

The benchmarking script does not require any python dependencies, but does assume a docker binary is installed and available via the command line.

## Executing the Benchmark

The benchmark is written using python 3, and can be run using

```bash
python3 benchmark.py
```

The results will be written to `results.tsv`

