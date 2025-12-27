LDI r2 247			 // Fonction ajouter lettre
LDI r3 248 			// Fonction afficher lettre

// Afficher H (code 8)
LDI r1 8
STR r2 r1

// Afficher E (code 5)
LDI r1 5
STR r2 r1

// Afficher L (code 12)
LDI r1 12
STR r2 r1

// Afficher L (code 12)
LDI r1 12
STR r2 r1

// Afficher O (code 15)
LDI r1 15
STR r2 r1

// Pousser le buffer vers l'écran
STR r3 r0

HLT