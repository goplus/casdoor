# Docker image used by qpass to build the casdoor project

FROM --platform=linux/amd64 node:18.19.0

# Install Go
ENV GO_VERSION=1.20.12
ENV GO_TAR=go$GO_VERSION.linux-amd64.tar.gz
ENV GO_URL=https://golang.org/dl/$GO_TAR
RUN curl -LO $GO_URL \
  && tar -C /usr/local -xzf $GO_TAR \
  && rm $GO_TAR
ENV PATH=$PATH:/usr/local/go/bin
