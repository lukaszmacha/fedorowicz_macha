INSERT INTO api_offer
  (brand, model, generation, production_year, price, condition, body_type, fuel_type, start_time, description, other_info, place, photos)
SELECT
  -- Losowa marka z tablicy 4 elementów
  (ARRAY['Audi','BMW','Volkswagen','Ford'])[floor(random()*4)+1] AS brand,
  
  -- Losowy model
  (ARRAY['A4','X5','Golf','Focus'])[floor(random()*4)+1] AS model,

  -- Generacja w formie "Generacja X"
  'Generacja ' || floor(random() * 10 + 1)::text AS generation,

  -- Rok produkcji z zakresu 1990..2023
  floor(random() * (2023 - 1990 + 1) + 1990)::int AS production_year,

  -- Cena w przedziale 1000..51000
  floor(random() * 50000 + 1000)::int AS price,

  -- Stan losowy: NOWY lub UŻYWANY
  (ARRAY['NOWY','UZYWANY'])[floor(random()*2)+1] AS condition,

  -- Typ nadwozia losowy z 4 wariantów
  (ARRAY['SEDAN','HATCHBACK','SUV','COMBI'])[floor(random()*4)+1] AS body_type,

  -- Rodzaj paliwa losowy z 4 wariantów
  (ARRAY['BENZYNA','DIESEL','HYBRYDA','ELEKTRYCZNY'])[floor(random()*4)+1] AS fuel_type,

  -- start_time: losowy czas w ciągu ostatniego roku
  now() - (random() * interval '365 days') AS start_time,

  -- opis, np. "Opis testowy 1", "Opis testowy 2" itd.
  'Opis testowy ' || generate_series::text AS description,

  -- inne dane
  'Inne dane ' || generate_series::text AS other_info,

  -- losowe miejsce
  (ARRAY['Warszawa','Kraków','Poznań'])[floor(random()*3)+1] AS place,

  -- przykładowa tablica linków do zdjęć (2 linki)
  ARRAY['http://example.com/dummy.jpg','http://example.com/placeholder.jpg'] AS photos

FROM generate_series(1, 100);
