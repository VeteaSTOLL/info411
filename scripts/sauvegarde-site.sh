sudo docker exec -t c_mariadb mariadb-dump -u vttvcool --password=tvvtcool --all-databases > /home/info411/db_backup/dump_db.sql
bzip2 /home/info411/db_backup/dump_db.sql
