pushd %~dp0

python ..\..\manage.py loaddata configuration

popd
