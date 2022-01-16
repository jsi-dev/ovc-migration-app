-- SELECT * FROM ovc_db.structure_menage WHERE STRUCT = 147;


SELECT * FROM structures WHERE STRUCT NOT
IN (SELECT STRUCT FROM structure_menage);

SELECT * FROM structures 
WHERE libstruct LIKE '%C%';