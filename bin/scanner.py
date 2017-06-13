"""Scanner script"""
# Import modules
import time
import datetime
import argparse
import subprocess
from shlex import split

TIMESTAMP = datetime.datetime.fromtimestamp(
    time.time()).strftime("%Y-%m-%d_%H-%M-%S")
DESTINATION = "scans/"
# Setup the parser
PARSER = argparse.ArgumentParser()
PARSER.add_argument("-m", "--mode", choices=["gray", "color"], default="color")
PARSER.add_argument("-r", "--resolution", type=int, default=300)
PARSER.add_argument("-c", "--compression",
                    choices=["none", "zip", "jpg", "lzw"], default="zip")
PARSER.add_argument("-o", "--output_file",
                    default="{}scan_{}.pdf".format(DESTINATION, TIMESTAMP))
ARGS = PARSER.parse_args()


def scan():
    """Scanner function: requires sane; returns stdout"""
    temp_args = split("scanimage --progress --format=tiff --mode={} --resolution={}"
                      .format(ARGS.mode, ARGS.resolution))
    pipeline = subprocess.Popen(
        temp_args, stdout=subprocess.PIPE)
    convert(pipeline.stdout)
    pipeline.stdout.close()


def convert(inpipe):
    """This is taking an stdin to convert to PDF"""
    try:

        temp_args = split(
            "convert -monitor -compress {} - {}".format(ARGS.compression, ARGS.output_file))
        subprocess.check_call(temp_args, stdin=inpipe)
    except subprocess.CalledProcessError as e:
        print(e.output)


if __name__ == "__main__":
    try:
        scan()
        print(ARGS.output_file)
    except Exception as ERROR_TEMP:
        print(str(ERROR_TEMP))
