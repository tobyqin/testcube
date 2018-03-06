FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt entrypoint.sh /code/
RUN pip install -r requirements.txt
RUN chmod +x entrypoint.sh
ADD . /code/
RUN chown -R $USER:$USER .

