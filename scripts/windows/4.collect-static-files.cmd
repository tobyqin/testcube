pushd %~dp0

python ..\..\manage.py collectstatic

popd
