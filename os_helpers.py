import os

stat_keys = [  # See `man proc` for the meaning of these fields
    'pid',
    'comm',
    'state',
    'ppid',
    'pgrp',
    'session',
    'tty_nr',
    'tpgid',
    'flags',
    'minflt',
    'cminflt',
    'majflt',
    'cmajflt',
    'utime',
    'stime',
    'cutime',
    'cstime',
    'priority',
    'nice',
    'num_threads',
    'itrealvalue',
    'starttime',
    'vsize',
    'rss',
    'rsslim',
    'startcode',
    'endcode',
    'startstack',
    'kstkesp',
    'kstkeip',
    'signal',
    'blocked',
    'sigignore',
    'sigcatch',
    'wchan',
    'nswap',
    'cnswap',
    'exit_signal',
    'processor',
    'rt_priority',
    'policy',
    'delayacct_blkio_ticks',
    'guest_time',
    'cguest_time',
    'start_data',
    'end_data',
    'start_brk',
    'arg_start',
    'arg_end',
    'env_start',
    'env_end',
    'exit_code',
]


def stat(pid):
    with open(f"/proc/{pid}/stat", "r") as file:
        values = file.read().strip().split(" ")  # TODO this breaks if comm(2) contains a space
        return {key: int(value) if value.lstrip('-').isdigit() else value for key, value in zip(stat_keys, values)}

if __name__ == '__main__':
    print(stat(os.getpid()))
