from subprocess import DEVNULL, PIPE, Popen


def build(folder, tag):
    process = Popen(['docker', 'build', f'-t={tag}', folder], stdout=PIPE, stderr=PIPE, text=True)
    process.wait()
    return process.stderr.read()


def get_running_containers():
    process = Popen(['docker', 'ps', '-aq'], stdout=PIPE, text=True)
    process.wait()
    result = process.stdout.read().strip()
    return [] if result == '' else result.split("\n")

class Container:
    def __init__(self, opts):
        if type(opts) == str:
            opts = opts.split(" ")

        self._process = Popen(['docker', 'run', '-d'] + opts,
                              stderr=PIPE,
                              stdout=PIPE,
                              text=True,
                              )
        self._process.wait()
        self._docker_id = self._process.stdout.read().strip()

    def await_healthy(self):
        while True:
            process = Popen(['docker', 'inspect', '-f="{{.State.Health.Status}}"', self._docker_id], stdout=PIPE, text=True)
            process.wait()
            state = process.stdout.read().strip('\n"')
            match state:
                case 'healthy':
                    return
                case 'starting':
                    pass
                case _:
                    raise Exception(f"Unknown health state [{state}]")

    def exec(self, cmd):
        if type(cmd) == str:
            cmd = cmd.split(' ')
        process = Popen(['docker', 'exec', self._docker_id] + cmd, stdout=PIPE, text=True)
        process.wait()
        return process.stdout.read().strip('\n"')

    def log(self):
        process = Popen(['docker', 'logs', self._docker_id], stdout=PIPE, text=True)
        process.wait()
        return process.stdout.read()

    def pid(self):
        process = Popen(['docker', 'inspect', '-f="{{.State.Pid}}"', self._docker_id], stdout=PIPE, text=True)
        process.wait()
        return process.stdout.read().strip('"\n')

    def remove(self):
        process = Popen(['docker', 'rm', '-fv', self._docker_id], stdout=DEVNULL)
        process.wait()


if __name__ == '__main__':
    container = Container('hello-world')
    print(container.log())
    container.remove()
