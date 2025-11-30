export const addusersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    ad TEXT,  
    soyad TEXT,
    email TEXT UNIQUE, 
    sifre TEXT
);
`;