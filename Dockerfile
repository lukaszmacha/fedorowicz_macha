# Wybieramy bazowy obraz z Pythonem (np. 3.11)
FROM python:3.11-slim

# Ustalamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy plik requirements.txt
COPY requirements.txt ./

# Instalujemy zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy całą zawartość folderu lokalnego (z backend, manage.py itp.) do /app w kontenerze
COPY . .

# Otwieramy port (opcjonalnie; pomaga zrozumieć, który port jest eksponowany)
EXPOSE 8000

# Domyślna komenda (entrypoint) – do uruchamiania serwera w trybie dev
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
