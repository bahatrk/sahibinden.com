export const addEmlakTipiColumn = `
ALTER TABLE emlak_ilanlari 
ADD COLUMN emlakTipi TEXT
CHECK (
    (kategori = 'Konut' AND emlakTipi IS NOT NULL)
    OR
    (kategori = 'Bina' AND emlakTİpi IS NULL)
);
`;