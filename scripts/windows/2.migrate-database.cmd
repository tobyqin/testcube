pushd %~dp0

python ..\..\manage.py makemigrations
python ..\..\manage.py migrate

popd
