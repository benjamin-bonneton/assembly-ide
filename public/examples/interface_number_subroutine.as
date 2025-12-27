LDI r3 250

LDI r1 10
CAL .afficher_nombre

LDI r1 20
CAL .afficher_nombre

HLT

.afficher_nombre
STR r3 r1
RET