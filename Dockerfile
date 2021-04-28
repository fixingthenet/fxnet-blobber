FROM node:12.16.1-buster-slim

# Adds backports
#RUN awk '$1 ~ "^deb" { $3 = $3 "-backports"; print; exit }' /etc/apt/sources.list > /etc/apt/sources.list.d/backports.list

# Installs git,joe, unoconv deps
RUN apt -y update && \
    apt -y install \
    git \
    curl \
    joe \
    build-essential \
    unoconv \
    ttf-wqy-zenhei \
    fonts-arphic-ukai \
    fonts-arphic-uming \
    fonts-indic 

#installing ruby and nokogiri deps
RUN apt install -y \
    ruby \
    ruby-dev \
    ruby-bundler \
    libz-dev \
    libxslt-dev \
    libxml2-dev
#installing graphicsmagic and deps
RUN apt install -y \
    graphicsmagick \
    imagemagick 

#installing deps for headless chrome    
RUN apt install -y \
    libxss1 

#installing deps for tensorflow and opencv    
# copy from: https://github.com/tensorflow/tensorflow/blob/master/tensorflow/tools/dockerfiles/dockerfiles/cpu.Dockerfile    
# and https://github.com/fbcotter/docker-tensorflow-opencv/blob/master/Dockerfile
RUN apt install -y \
    python3 \
    python3-pip \
    cmake \
    wget \
    unzip \
    yasm \
    pkg-config \
    libswscale-dev \
    libtbb2 \
    libtbb-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavformat-dev \
    libhdf5-dev \
    libpq-dev

ENV TF_PACKAGE=tensorflow
ENV TF_PACKAGE_VERSION=1.15.2
RUN python3 -m pip --no-cache-dir install --upgrade \
    pip \
    setuptools
RUN ln -s $(which python3) /usr/local/bin/python
RUN python3 -m pip install --no-cache-dir \
  ${TF_PACKAGE}${TF_PACKAGE_VERSION:+==${TF_PACKAGE_VERSION}} \
  numpy \
  hdf5storage \
  h5py \
  scipy \
  py3nvml

RUN mkdir /tmp/opencv
WORKDIR /tmp/opencv
WORKDIR /
ENV OPENCV_VERSION="4.1.2"
RUN wget https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.zip \
&& unzip ${OPENCV_VERSION}.zip \
&& mkdir /opencv-${OPENCV_VERSION}/cmake_binary \
&& cd /opencv-${OPENCV_VERSION}/cmake_binary \
&& cmake -DBUILD_TIFF=ON \
  -DBUILD_opencv_java=OFF \
  -DWITH_CUDA=OFF \
  -DENABLE_AVX=ON \
  -DWITH_OPENGL=ON \
  -DWITH_OPENCL=ON \
  -DWITH_IPP=ON \
  -DWITH_TBB=ON \
  -DWITH_EIGEN=ON \
  -DWITH_V4L=ON \
  -DBUILD_TESTS=OFF \
  -DBUILD_PERF_TESTS=OFF \
  -DCMAKE_BUILD_TYPE=RELEASE \
  -DCMAKE_INSTALL_PREFIX=$(python3 -c "import sys; print(sys.prefix)") \
  -DPYTHON_EXECUTABLE=$(which python3) \
  -DPYTHON_INCLUDE_DIR=$(python3 -c "from distutils.sysconfig import get_python_inc; print(get_python_inc())") \
  -DPYTHON_PACKAGES_PATH=$(python3 -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())") .. \
&& make install \
&& rm -rf /tmp/opencv



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
