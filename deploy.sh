echo aws s3 cp ~/WORKSPACE/joe/future.hellolennie/frontend/public/
echo s3://lennie-site-test/ --recursive
echo --profile joe
aws s3 cp ~/WORKSPACE/joe/future.hellolennie/frontend/public/ \
s3://lennie-site-test/ --recursive \
--profile joe