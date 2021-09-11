echo "aws s3 cp ~/WORKSPACE/joe/future.hellolennie/frontend/public/"
echo "s3://lennie-site-test/ --recursive"
echo "--acl public-read"
echo "--profile joe"
echo ""
echo "------"
echo ""
aws s3 cp ~/WORKSPACE/joe/future.hellolennie/frontend/public/ \
s3://lennie-site-test/ --recursive \
--acl public-read \
--profile joe