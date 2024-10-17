from subprocess import DEVNULL, PIPE, Popen


def build(folder, tag):
    process = Popen(['docker', 'build', f'-t={tag}', folder], stdout=PIPE, stderr=PIPE, text=True)
    process.wait()
    return process.stderr.read()


class Container:
    def __init__(self, opts):
        self._process = Popen(['docker', 'run', '-d'] + opts.split(" "),
                              stderr=PIPE,
                              stdout=PIPE,
                              text=True,
                              )
        self._process.wait()
        self._docker_id = self._process.stdout.read().strip()

    def log(self):
        process = Popen(['docker', 'logs', self._docker_id], stdout=PIPE, text=True)
        process.wait()
        return process.stdout.read()

    def remove(self):
        process = Popen(['docker', 'rm', self._docker_id], stdout=DEVNULL)
        process.wait()


if __name__ == '__main__':
    container = Container('hello-world')
    print(container.log())
    container.remove()
