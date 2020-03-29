FROM node:12.16.1-buster-slim

# Adds backports
#RUN awk '$1 ~ "^deb" { $3 = $3 "-backports"; print; exit }' /etc/apt/sources.list > /etc/apt/sources.list.d/backports.list

# Installs git, unoconv and chinese fonts
RUN apt -y update && \
    apt -y install \
    git \
    unoconv \
    ttf-wqy-zenhei \
    fonts-arphic-ukai \
    fonts-arphic-uming \
    fonts-indic \
    ruby \
    ruby-dev \
    joe
#&& rm -rf /var/lib/apt/lists/*
RUN apt install -y \
    ruby-bundler \
    build-essential \
    libz-dev \
    libxslt-dev \
    libxml2-dev
RUN apt install -y \
    graphicsmagick \
    imagemagick \
    libxss1
        
#### Begin setup ####
# Env variables
ENV SERVER_PORT 3000
ENV PAYLOAD_MAX_SIZE 1048576
ENV PAYLOAD_TIMEOUT 120000
ENV TIMEOUT_SERVER 120000
ENV TIMEOUT_SOCKET 140000

ENV APP_DIR /code
# Bundle app source
WORKDIR $APP_DIR

ADD Gemfile $APP_DIR
ADD Gemfile.lock $APP_DIR
ADD package.json $APP_DIR
ADD yarn.lock $APP_DIR
RUN bundle install
RUN yarn install

COPY . ./

# Change working directory

# Install dependencies
#RUN yarn install --production


# Startup
#ENTRYPOINT /usr/bin/unoconv --listener --server=0.0.0.0 --port=2002 & node src/standalone.js
CMD /bin/bash
