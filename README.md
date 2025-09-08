# Maracorp Signature - static site - 
Local:
docker build -t maracorp-signature:dev .
docker run --rm -p 8081:80 maracorp-signature:dev
# http://localhost:8081
