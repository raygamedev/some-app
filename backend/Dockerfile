# syntax=docker/dockerfile:1

FROM python:slim-buster AS builder
RUN pip install poetry

WORKDIR app

COPY . /app
RUN ls -l /app

#RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi
RUN poetry config virtualenvs.create false && poetry install
RUN poetry build

FROM python:slim-buster
WORKDIR /root
COPY --from=builder /app/dist/*.whl ./
RUN pip install /root/*.whl

CMD python -m nahat_server
